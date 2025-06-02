import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/sequelize";
import { Item } from './models/item.model.mjs';
import { AddItemDto } from './dto/add-item.dto.mjs';
import { EditItemDto } from './dto/edit-item.dto.mjs';
import { editItemInCartDto } from './dto/edit-item-in-cart.dto.mjs';
import { Cart } from './models/cart.model.mjs';
import { archiveItem } from '../Common/mongo/api.mjs';
import { ItemComment } from './models/item-comment.model.mjs';
import { AddCommentDto } from './dto/add-comment.dto.mjs';
import { User } from '../user/models/user.model.mjs';
import { IdDto } from './dto/id.dto.mjs';
import { EditCommentDto } from './dto/edit-comment.dto.mjs';
import { ReplyToCommentDto } from './dto/reply-to-comment.dto.mjs';
import { updateActivationDto } from './dto/update-activation.dto.mjs';
// import { ElasticsearchService } from '../elasticsearch/elasticsearch.service.mjs';
import { SearchItemDto } from './dto/search.dto.mjs';


@Injectable()
export class ItemService {
    constructor(@InjectModel(Item) private itemRepository: typeof Item,
            @InjectModel(Cart) private cartRepository: typeof Cart,
            @InjectModel(ItemComment) private commentRepository: typeof ItemComment,
            // private elastic: ElasticsearchService,
    ) {}

    async addItem(data : AddItemDto) {
        const item : any = (await this.itemRepository.create({ ...data, userId: data.user.id })).toJSON();
        // await this.elastic.updateItem(item.id, item);
        return { id: item.id };
    }

    async editItem(data : EditItemDto, itemId : number) {
        const item = (await this.itemRepository.findOne({ where: { id: itemId, isActive: true, userId: data.user.id } }))?.toJSON();
        if (!item) throw new HttpException('Item not found', HttpStatus.NOT_FOUND);
        Object.assign(item, data);
        await this.itemRepository.update(item, { where: { id: itemId } });
        // await this.elastic.updateItem(itemId, data);
        return { status: "ok" };
    }

    async getItemsByUserId(userId : number, isActive : boolean) {
        return (await this.itemRepository.findAll({ where: { userId, isActive }, order: [ ['created', 'DESC'] ] })).map(v => v.toJSON());
    }

    async getItemInfo(itemId : number) {
        const item = (await this.itemRepository.findOne({ where: { id: itemId } }))?.toJSON();
        if (!item) throw new HttpException('Item not found', HttpStatus.NOT_FOUND); 
        return item;
    }

    async updateItemActivation(data : updateActivationDto) {
        const [ updatedRows ] = await this.itemRepository.update({ 
            isActive: data.isActive
        }, { where: { id: data.id, userId: data.user.id } });
        if (!updatedRows) throw new HttpException('Item not found', HttpStatus.NOT_FOUND);
        // await this.elastic.updateItem(data.id, data);
        return { status: "ok" };
    }

    async deleteItem (itemId : number, userId : number) {
        const item : any = (await this.itemRepository.findByPk(itemId))?.toJSON();
        if (!item) throw new HttpException('Item not found', HttpStatus.NOT_FOUND);
        if (item.userId !== userId) throw new HttpException('Access denied', HttpStatus.BAD_REQUEST);
        item.comments = JSON.stringify(await this.getCommentsByItemId(item.id));
        await archiveItem(item);
        item.destroy();
        // await this.elastic.deleteItem(itemId);
        return { status: "ok" };
    }

    async search(data: SearchItemDto) {
        // const idArr = await this.elastic.searchItems(data);
        // const count = await this.elastic.countItems(data);
        let list : any = [];
        // for (let id of idArr) {
        //     const cargo : any = (await this.itemRepository.findOne({
        //         attributes: {
        //             include: [ "id", "userId", "amount", "price", "currency", "location", "filenames", "filter" ],
        //         },
        //         where: { id, isActive: true },
        //     }))?.toJSON();
        //     list.push(cargo);
        // }
        let count = 0;
        return { count, list };
    }

    async countItemsByUserId(userId : number) {
        return this.itemRepository.count({ where: { userId, isActive: true }});
    }

    async updateItemInCart(data : editItemInCartDto) {
        const item = (await this.itemRepository.findByPk(data.itemId))?.toJSON();
        if (!item) throw new HttpException('Item not found', HttpStatus.NOT_FOUND); 
        if (item.amount < (data.amount || 1)) throw new HttpException('The amount of itemised product is less than required', HttpStatus.BAD_REQUEST); 
        let cartItem = (await this.cartRepository.findOne({ where : { userId: data.user.id, itemId: data.itemId }}))?.toJSON();
        if (!cartItem) cartItem = (await this.cartRepository.create({ ...data, userId: data.user.id })).toJSON();
        else await this.cartRepository.update({ amount: data.amount }, { where: { userId: data.user.id, itemId: data.itemId } });
        return { id: cartItem.id };
    }

    async deleteItemFromCart (id : number, userId : number) {
        const res = (await this.cartRepository.findByPk(id))?.toJSON();
        if (!res) throw new HttpException('Item in cart is not found', HttpStatus.NOT_FOUND);
        if (res.userId != userId) throw new HttpException('Access denied', HttpStatus.BAD_REQUEST);
        res.destroy();
        return { status: "ok" };
    }

    async getCart (userId : number) {
        const res = (await this.cartRepository.findAll({
            attributes: [ "id", "itemId", "amount" ],
            include: [
                {
                    model: Item,
                    as: 'item',
                    attributes: [ "id", "name", "price", "currency", "filenames" ]
                },
                {
                    model: User,
                    as: 'user',
                    attributes: [ "id", "name", "storeName", "rating" ]
                },
                
            ],
            where: { userId }, order: [ ['created', 'DESC'] ] 
        })).map(v => v.toJSON());
        return res;
    }

    async updateItemFilenames(userId : number, itemId : number, filenames : Array<string>) {
        const [ updatedRows ] = await this.itemRepository.update({ filenames }, { where: { userId, id: itemId } });
        if (!updatedRows) throw new HttpException('Item not found', HttpStatus.NOT_FOUND); 
        return null;
    }

    async getUserIdByItemId(itemId : number) {
        const item = (await this.itemRepository.findByPk(itemId))?.toJSON();
        if (!item) throw new HttpException('Item not found', HttpStatus.NOT_FOUND);
        return item.userId;
    }

    async addComment(data: AddCommentDto) {
        const item = (await this.itemRepository.findByPk(data.itemId))?.toJSON();
        if (!item) throw new HttpException('Item not found', HttpStatus.NOT_FOUND);
        let recipientId = item.userId;
        if (+recipientId === data.user.id) throw new HttpException('Author is a recipient', HttpStatus.BAD_REQUEST);
        const comment = await this.commentRepository.create({ authorId: data.user.id, ...data });
        return { id: comment.id };
    }

    async getCommentsByItemId(itemId : number) {
        const result = (await this.commentRepository.findAll({
            attributes: [ "id", "comment", "created", "reply", "modifiedReplyTimestamp" ],
            include: [
                {
                    model: User,
                    as: 'author',
                    attributes: [ "id", "name", "storeName" ]
                },
                
            ],
            where: { itemId, isVisible: true },
            order: [ ['created', 'DESC'] ]
        })).map(v => {
            let result : any = v.toJSON();
            result.user = result.author;
            delete result.author;
            return result;
        });
        return result;
    }

    async editComment(data : EditCommentDto, commentId : number) {
        const [ updatedRows ] = await this.commentRepository.update({ comment: data.comment }, { where: { id: commentId, authorId: data.user.id } });
        if (!updatedRows) throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
        return { status: "ok" };
    }

    async deleteComment(id : number, userId : number) {
        const [ updatedRows ] = await this.commentRepository.update({ isVisible: false }, { where: { id, authorId: userId } });
        if (!updatedRows) throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
        return { status: "ok" };
    }

    async updateCommentReply(data: ReplyToCommentDto) {
        const [ updatedRows ] = await this.commentRepository.update({ 
            reply: data.reply,
            modifiedReplyTimestamp: data.reply ? Date.now() : 0,
        }, { where: { id: data.commentId } });
        if (!updatedRows) throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
        return { status: "ok" };
    }

    async getAllItems () {
        return (await this.itemRepository.findAll()).map(v => v.toJSON());
    }


}
