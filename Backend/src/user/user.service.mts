import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/sequelize";
import { User } from "./models/user.model.mjs";
import { Countries } from './models/countries.model.mjs';
import { makeToken } from '../Common/commonApi.mjs';
import { redisGet, redisSetEx } from '../Common/redis.mjs';
import { RegisterDto } from './dto/register-user.dto.mjs';
import { sendEmailActivateLink, sendRegisterActivateLink, sendRestorePasswordLink } from '../Common/Notify/mailsToUsers.mjs';
import { EmailDto } from './dto/email.dto.mjs';
import { UpdateProfileDto } from './dto/update-profile.dto.mjs';
import { updateContactPhonesDto } from './dto/update-contact-phones.dto.mjs';
import { EditEmailDto } from './dto/edit-email.dto.mjs';
import { AddReviewDto } from './dto/add-review.dto.mjs';
import { UserReview } from './models/user-review.model.mjs';
import { EditReviewDto } from './dto/edit-review.dto.mjs';
import { ReplyToReviewDto } from './dto/reply-to-review.dto.mjs';

@Injectable()
export class UserService {
    constructor(@InjectModel(User) private userRepository: typeof User,
                @InjectModel(Countries) private countriesRepository: typeof Countries,
                @InjectModel(UserReview) private reviewRepository: typeof UserReview,
                ) {}

    async register(dto: RegisterDto) {
        const country = (await this.countriesRepository.findOne({ where: { alpha2: dto.country }}))?.dataValues;
        if (!country) throw new HttpException('Country not found', HttpStatus.NOT_FOUND);
        const user = (await this.userRepository.create({ ...dto, countryId: country.id, contactPhones: dto.phone ? [ dto.phone ] : [] })).dataValues;
        const token = makeToken();
        await redisSetEx(token, { userId: user.id });
        if (!dto.googleId) await sendRegisterActivateLink({ email: user.email, lang: country.languages[0], token, country: country.alpha2 });
        return user;
    }

    async resendActivateEmail (data: EmailDto) {
        const token = makeToken();
        const user = (await this.userRepository.findOne({
            attributes: [ "id" ],
            include: [ { model: Countries, attributes: [ "languages" ] } ],
            where: { email: data.email, isVisible: true, isBanned: false }
        }))?.dataValues;
        if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

        await redisSetEx(token, { userId: user.id });
        const args = {
            email: data.email,
            lang: user.country.dataValues.languages[0],
            token,
            country: user.country.dataValues.alpha2,
        };
        await sendEmailActivateLink(args);
        return { status: "ok" };
    }

    async resetPassword (data : EmailDto) {
        const token = makeToken();
        const user = (await this.userRepository.findOne({
            attributes: [ "id" ],
            include: [ { model: Countries, attributes: [ "languages", "alpha2" ] } ],
            where: { email: data.email, isVisible: true, isBanned: false }
        }))?.dataValues;
        if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

        await redisSetEx(token, { userId: user.id });
        const args = {
            email: data.email,
            lang: user.country.dataValues.languages[0],
            token,
            country: user.country.dataValues.alpha2,
        };
        await sendRestorePasswordLink(args);
        return { status: "ok" };
    }

    async getUserByEmail(email: string) {
        const user = (await this.userRepository.findOne({ where: { email, isVisible: true }, include: { all: true } }))?.dataValues;
        return user;
    }

    async getCountryAndCurrencyById(id: number) {
        const country = (await this.countriesRepository.findByPk(id))?.dataValues;
        if (!country) throw new HttpException('Country not found', HttpStatus.NOT_FOUND);
        return { country : country.alpha2, currency: country.currency };
    }

    async getUserByGoogleId(googleId: string, email : string | null) {
        let user = (await this.userRepository.findOne({ where: { googleId, isVisible: true }, include: {all: true} }))?.dataValues;
        if (!user) {
            if (!email) throw new HttpException('Incorrect google token', HttpStatus.BAD_REQUEST);
            user = await this.getUserByEmail(email);
            if (user) await this.setGoogleIdToUser(user.id, googleId);
        }
        return user;
    }

    async setGoogleIdToUser(id : number, googleId : string) {
        const [ updatedRows ] = await this.userRepository.update({ googleId }, { where: { id, isVisible: true } });
        if (!updatedRows) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        return null;
    }

    async getUserById(userId: number) {
        const user = (await this.userRepository.findByPk(userId))?.dataValues;
        if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        return user;
    }

    async confirmEmail (token : string) {
        const tokenData = await redisGet(token);
        if (!tokenData) throw new HttpException('Token expired', HttpStatus.BAD_REQUEST);
        const user = (await this.userRepository.findOne({ where: { id: tokenData.userId, isVisible: true }, include: { all: true } }))?.dataValues;
        if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        await this.userRepository.update({ isActivate: true }, { where: { id: user.id } });
        return user;
    }

    async changePassword(userId : number, password : string) {
        return this.userRepository.update({ password }, { where: { id: userId } });
    }

    async setNewPasswordByToken (token : string, password : string) {
        const data = await redisGet(token);
        if (!data) throw new HttpException('Token expired', HttpStatus.BAD_REQUEST);
        const [ updatedRows ] = await this.userRepository.update({ password }, { where: { id: data.userId } });
        if (!updatedRows) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        return { status: "ok" };
    }

    async updateProfile(data : UpdateProfileDto) {
        const countryId = (await this.countriesRepository.findOne({ where: { alpha2: data.country }, include: { all: true } }))?.dataValues?.id;
        if (!countryId) throw new HttpException('Country not found', HttpStatus.NOT_FOUND); 
        const [ updatedRows ] = await this.userRepository.update({
            name: data.name,
            storeName: data.storeName,
            countryId,
            defaultPaymentType: data.defaultPaymentType,
            defaultDeliveryWays: data.defaultDeliveryWays,
        }, { where: { id: data.user.id } });
        if (!updatedRows) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        return { status: "ok" };
    }

    async getProfile(userId : number) {
        const user : any = (await this.userRepository.findOne({ 
            where: { id: userId, isVisible: true }, 
            attributes: [ "id", "email", "name", "contactPhones", "storeName" ],
            include: [
                {
                    model: Countries,
                    attributes: [ "alpha2", "currency" ]
                }
            ],
        }))?.dataValues;
        if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        user.currency = user.country.dataValues.currency;
        user.country = user.country.dataValues.alpha2;
        return user;
    }

    async updateContactPhones(data : updateContactPhonesDto) {
        if (data.contactPhones.length === 0) throw new HttpException('Must have at least one phone', HttpStatus.NOT_FOUND);
        const [ updatedRows ] = await this.userRepository.update({ contactPhones: data.contactPhones.map(v => v.replace(/[^0-9]/g, '')) }, { where: { id: data.user.id } });
        if (!updatedRows) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        return { status: "ok" };
    }

    async editEmail(data: EditEmailDto) {
        const user = (await this.userRepository.findOne({ where: { id: data.user.id, isVisible: true }, include: { all: true } }))?.dataValues;
        if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        await this.userRepository.update({ email: data.email, isActivate: false }, { where: { id: data.user.id } });
        const token = makeToken();
        await redisSetEx(token, { userId: user.id });
        await sendEmailActivateLink({ email: user.email, lang: user.country.dataValues.languages[0], token, country: user.country.dataValues.alpha2 });
        return { status: "ok" };
    }

    async addReview(data: AddReviewDto) {
        if (data.recipientId === data.user.id) throw new HttpException('Author is a recipient', HttpStatus.BAD_REQUEST);
        const comment = await this.reviewRepository.create({ authorId: data.user.id, ...data });
        await this.recalculateUserRating(comment.id);
        return { id: comment.id };
    }

    async getReviews(userId : number, authUser : number) {
        const result = (await this.reviewRepository.findAll({
            attributes: [ "id", "rating", "comment", "created", "reply", "modifiedReplyTimestamp" ],
            include: [
                {
                    model: User,
                    as: 'author',
                    attributes: [ "id", "name", "storeName" ]
                },
            ],
            where: { recipientId: userId || authUser, isVisible: true },
            order: [ ['created', 'DESC'] ]
        })).map(v => {
            let result : any = v.dataValues;
            result.user = result.author.dataValues;
            delete result.author;
            return result;
        });
        return result;
    }

    async editReview(data: EditReviewDto) {
        if (data.rating < 1 || data.rating > 5) throw new HttpException('Invalid rating', HttpStatus.BAD_REQUEST);
        const [ updatedRows ] = await this.reviewRepository.update({ comment: data.comment, rating: data.rating }, { where: { id: data.commentId, authorId: data.user.id } });
        if (!updatedRows) throw new HttpException('Review not found', HttpStatus.NOT_FOUND);
        await this.recalculateUserRating(data.commentId);
        return { status: "ok" };
    }

    async deleteReview(commentId : number, userId : number) {
        const [ updatedRows ] = await this.reviewRepository.update({ isVisible: false }, { where: { id: commentId, authorId: userId } });
        if (!updatedRows) throw new HttpException('Review not found', HttpStatus.NOT_FOUND);
        await this.recalculateUserRating(commentId);
        return { status: "ok" };
    }

    async updateReviewReply(data: ReplyToReviewDto) {
        const [ updatedRows ] = await this.reviewRepository.update({ 
            reply: data.reply,
            modifiedReplyTimestamp: data.reply ? Date.now() : 0,
        }, { where: { id: data.commentId, recipientId: data.user.id } });
        if (!updatedRows) throw new HttpException('Review not found', HttpStatus.NOT_FOUND);
        return { status: "ok" };
    }

    private async recalculateUserRating(commentId: number) {
        const userId = (await this.reviewRepository.findByPk(commentId))?.dataValues.recipientId;
        if (!userId) return null;
        const comments = (await this.reviewRepository.findAll({
            attributes: [ "rating" ],
            where: { recipientId: userId, isVisible: true }
        }));
        const initialValue = 0;
        const ratingSum = comments.reduce(
            (accumulator, currentValue) => accumulator + currentValue.dataValues.rating,
            initialValue
        );
        const rating : number = Math.round(ratingSum / comments.length) || 4;
        await this.userRepository.update({ rating }, { where: { id: userId } });
        return { status: "ok" };
    }

}