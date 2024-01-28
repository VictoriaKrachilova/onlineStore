import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from "../user/user.service.mjs";
import { JwtService } from "@nestjs/jwt";
import bcrypt from 'bcryptjs'
import { User } from "../user/models/user.model.mjs";
import { RegisterUserDto } from './dto/register-user.dto.mjs';
import { LoginUserDto } from './dto/login-user.dto.mjs';
import { ChangePasswordDto } from './dto/change-password.dto.mjs';
import { SetNewPasswordDto } from './dto/set-new-password.dto.mjs';
import { ConfirmEmailDto } from './dto/confirm-email.dto.mjs';


@Injectable()
export class AuthService {

    constructor(private userService: UserService,
                private jwtService: JwtService) {}


    async registration(userDto: RegisterUserDto) {
        const candidate = await this.userService.getUserByEmail(userDto.email);
        if (candidate) throw new UnauthorizedException({ message: 'User with this email exists' });
        const hashPassword = await bcrypt.hash(userDto.password, 5);
        const args = {
            ...userDto,
            password: hashPassword || "",
            email: userDto.email || "",
            name: userDto.name || ""
        };
        const user = await this.userService.register(args);
        return this.generateUserToken(user);
    }

    async login(userDto: LoginUserDto) {
        const user = await this.validateUser(userDto);
        if (!user.isActivate) throw new HttpException('Account is not activate', HttpStatus.BAD_REQUEST);
        if (user.isBanned) throw new HttpException('Account is banned', HttpStatus.BAD_REQUEST);
        return this.generateUserToken(user);
    }

    async confirmEmail(data: ConfirmEmailDto) {
        const user = await this.userService.confirmEmail(data.token);
        return this.generateUserToken(user);
    }

    private async generateUserToken(user: User) {
        const { country, currency } = await this.userService.getCountryAndCurrencyById(user.countryId);
        const payload = { id: user.id, country, currency };
        return { token: this.jwtService.sign(payload) };
    }

    private async validateUser(userDto: LoginUserDto) {
        let user = await this.userService.getUserByEmail(userDto.email);
        if (user && user.password) {
            const passwordEquals = await bcrypt.compare(userDto.password, user.password);
            if (passwordEquals) return user;
        }
        throw new UnauthorizedException({ message: 'Incorrect email or password' });
    }

    async changePassword(data: ChangePasswordDto) {
        const user = await this.userService.getUserById(data.user.id);
        const passwordEquals = user.password ? await bcrypt.compare(data.oldPassword, user.password) : true;
        if (!passwordEquals) throw new UnauthorizedException({ message: 'Incorrect password' });
        const hashPassword = await bcrypt.hash(data.newPassword, 5);
        await this.userService.changePassword(data.user.id, hashPassword);
        return { status: "ok" };
    }

    async setNewPassword(data: SetNewPasswordDto) {
        const hashPassword = await bcrypt.hash(data.password, 5);
        await this.userService.setNewPasswordByToken(data.token, hashPassword);
        return { status: "ok" };
    }
    
}