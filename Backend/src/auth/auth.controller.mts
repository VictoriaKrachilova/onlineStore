import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBadRequestResponse, ApiNotFoundResponse } from "@nestjs/swagger";
import { ConfirmEmailDto } from './dto/confirm-email.dto.mjs';
import { AuthService } from "./auth.service.mjs";
import { ChangePasswordDto } from './dto/change-password.dto.mjs';
import { LoginUserDto } from './dto/login-user.dto.mjs';
import { RegisterUserDto } from './dto/register-user.dto.mjs';
import { LoginResponseDto } from './dto/response.dto.mjs';
import { SetNewPasswordDto } from './dto/set-new-password.dto.mjs';
import { JwtAuthGuard } from './jwt-auth.guard.mjs';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @ApiOperation({ summary: 'User login' })
    @ApiResponse({status: 201, type: LoginResponseDto})
    @ApiBadRequestResponse({ description: 'Incorrect email or password' })
    @Post('/login')
    login(@Body() userDto: LoginUserDto) {
        return this.authService.login(userDto);
    }


    @ApiOperation({ summary: 'User registration' })
    @ApiResponse({status: 201, type: LoginResponseDto})
    @ApiBadRequestResponse({ status: 400, description: 'User with this email exists' })
    @ApiNotFoundResponse({ status: 404, description: 'Document not found' })
    @Post('/registration')
    registration(@Body() userDto: RegisterUserDto) {
        return this.authService.registration(userDto);
    }

    @ApiOperation({ summary: 'Confirm email' })
    @Post('/confirmEmail')
    @ApiBadRequestResponse({ status: 400, description: 'User with this email exists' })
    @ApiResponse({status: 201, type: LoginResponseDto})
    confirmEmail(@Body() data: ConfirmEmailDto) {
        return this.authService.confirmEmail(data);
    }

    @ApiOperation({ summary: 'Change user`s password' })
    @ApiResponse({ status: 201 })
    @ApiBadRequestResponse({ status: 401, description: 'Incorrect password' })
    @ApiNotFoundResponse({ description: 'User not found' })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post('/changePassword')
    changePassword(@Body() data: ChangePasswordDto) {
        return this.authService.changePassword(data);
    }
    
    @ApiOperation({ summary: 'Set new password after the user clicked on the link in the email' })
    @ApiResponse({ status: 201 })
    @ApiBadRequestResponse({ status: 401, description: 'Incorrect password' })
    @Post('/setNewPassword')
    setNewPassword(@Body() data: SetNewPasswordDto) {
        return this.authService.setNewPassword(data);
    }

}