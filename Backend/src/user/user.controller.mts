import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service.mjs';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth, ApiNotFoundResponse, ApiBadRequestResponse } from "@nestjs/swagger";
import { EmailDto } from './dto/email.dto.mjs';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.mjs';
// import { ReviewInfo, GetProfileInfo, IdResponse } from '../Common/newTypesForDoc.mjs';
import { UpdateProfileDto } from './dto/update-profile.dto.mjs';
import { updateContactPhonesDto } from './dto/update-contact-phones.dto.mjs';
import { EditEmailDto } from './dto/edit-email.dto.mjs';
import { AddReviewDto } from './dto/add-review.dto.mjs';
import { EditReviewDto } from './dto/edit-review.dto.mjs';
import { ReplyToReviewDto } from './dto/reply-to-review.dto.mjs';
import { RequestWithUser } from 'src/Common/newTypes.mjs';

@ApiTags("User")
@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @ApiOperation({ summary: 'resent activate mail' })
    @Post('/resendActivateEmail')
    resendActivateEmail(@Body() data: EmailDto) {
        return this.userService.resendActivateEmail(data);
    }
    
    @ApiOperation({ summary: 'Reset password' })
    @Post('/resetPassword')
    resetPassword(@Body() data: EmailDto) {
        return this.userService.resetPassword(data);
    }

    @ApiOperation({ summary: 'Get user`s profile' })
    // @ApiResponse({ status: 201, type: GetProfileInfo })
    @ApiNotFoundResponse({ description: 'User not found' })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get('/getProfile/:userId')
    getProfile(@Param('userId') userId : number) {
        return this.userService.getProfile(userId);
    }


    @ApiOperation({ summary: 'Change user`s profile (if the field has not changed, send the old value)' })
    @ApiNotFoundResponse({ description: 'User not found' })
    @ApiResponse({ status: 201 })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post('/updateProfile')
    updateProfile(@Body() data: UpdateProfileDto) {
        return this.userService.updateProfile(data);
    }

    @ApiOperation({ summary: 'Add contact phone' })
    @ApiNotFoundResponse({ description: 'User not found' })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post('/updateContactPhones')
    updateContactPhones(@Body() data: updateContactPhonesDto) {
        return this.userService.updateContactPhones(data);
    }

    @ApiOperation({ summary: 'Change user`s e-mail' })
    @ApiNotFoundResponse({ description: 'User not found' })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post('/editEmail')
    editEmail(@Body() data: EditEmailDto) {
        return this.userService.editEmail(data);
    }

    @ApiOperation({ summary: 'Left a comment' })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    // @ApiResponse({ status: 201, type: IdResponse })
    @Post('/addReview')
    addReview(@Body() data: AddReviewDto) {
        return this.userService.addReview(data);
    }

    @ApiOperation({ summary: 'Edit comment' })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiNotFoundResponse({ description: 'Review not found' })
    @Post('/editReview')
    @ApiResponse({ status: 201 })
    editReview(@Body() data: EditReviewDto) {
        return this.userService.editReview(data);
    }

    @ApiOperation({ summary: 'Delete comment' })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiNotFoundResponse({ description: 'Review not found' })
    @Delete('/deleteReview/:id')
    @ApiResponse({ status: 201 })
    deleteReview(@Param('id') id : number, @Req() req : RequestWithUser) {
        return this.userService.deleteReview(id, req.userId);
    }

    @ApiOperation({ summary: 'Update reply to comment from recipient. If you want to delete reply, set reply = null' })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiNotFoundResponse({ description: 'Review not found' })
    @Post('/updateReviewReply')
    @ApiResponse({ status: 201 })
    updateReviewReply(@Body() data: ReplyToReviewDto) {
        return this.userService.updateReviewReply(data);
    }

    @ApiOperation({ summary: 'Get all comments by user ID' })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get('/getReviews/:userId')
    // @ApiResponse({ status: 201, type: ReviewInfo, isArray: true })
    getReviews(@Param('userId') userId : number, @Req() req : RequestWithUser) {
        return this.userService.getReviews(userId, req.userId);
    }

    
}