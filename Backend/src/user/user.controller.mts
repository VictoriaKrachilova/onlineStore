import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service.mjs';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth, ApiNotFoundResponse, ApiBadRequestResponse } from "@nestjs/swagger";
import { EmailDto } from './dto/email.dto.mjs';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.mjs';
import { UpdateProfileDto } from './dto/update-profile.dto.mjs';
import { UpdateContactPhonesDto } from './dto/update-contact-phones.dto.mjs';
import { EditEmailDto } from './dto/edit-email.dto.mjs';
import { AddReviewDto } from './dto/add-review.dto.mjs';
import { EditReviewDto } from './dto/edit-review.dto.mjs';
import { ReplyToReviewDto } from './dto/reply-to-review.dto.mjs';
import { RequestWithUser } from '../Common/newTypes.mjs';
import { RolesGuard } from '../auth/roles.guard.mjs';
import { Roles } from '../auth/roles.decorator.mjs';

@ApiTags("User")
@Controller("user")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post("resend-activate-email")
    @ApiOperation({ summary: "Resend activation email" })
    resendActivateEmail(@Body() dto: EmailDto) {
        return this.userService.resendActivateEmail(dto);
    }

    @Post("reset-password")
    @ApiOperation({ summary: "Reset password" })
    resetPassword(@Body() dto: EmailDto) {
        return this.userService.resetPassword(dto);
    }

    @Get("profile")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('user')
    @ApiBearerAuth()
    @ApiOperation({ summary: "Get user's profile" })
    @ApiNotFoundResponse({ description: "User not found" })
    getProfile(@Req() req: RequestWithUser) {
        return this.userService.getProfile(req.userId);
    }

    @Patch("profile")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('user')
    @ApiBearerAuth()
    @ApiOperation({ summary: "Update user's profile" })
    @ApiNotFoundResponse({ description: "User not found" })
    @ApiResponse({ status: 200 })
    updateProfile(@Body() dto: UpdateProfileDto) {
        return this.userService.updateProfile(dto);
    }

    @Patch("contact-phones")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('user')
    @ApiBearerAuth()
    @ApiOperation({ summary: "Update contact phones" })
    @ApiNotFoundResponse({ description: "User not found" })
    updateContactPhones(@Body() dto: UpdateContactPhonesDto) {
        return this.userService.updateContactPhones(dto);
    }

    @Patch("email")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('user')
    @ApiBearerAuth()
    @ApiOperation({ summary: "Change email" })
    @ApiNotFoundResponse({ description: "User not found" })
    editEmail(@Body() dto: EditEmailDto) {
        return this.userService.editEmail(dto);
    }

    @Post("reviews")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('user')
    @ApiBearerAuth()
    @ApiOperation({ summary: "Add a review" })
    addReview(@Body() dto: AddReviewDto) {
        return this.userService.addReview(dto);
    }

    @Patch("reviews/:id")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('user')
    @ApiBearerAuth()
    @ApiOperation({ summary: "Edit a review" })
    @ApiNotFoundResponse({ description: "Review not found" })
    editReview(@Param("id") id: number, @Body() dto: EditReviewDto) {
        return this.userService.editReview(dto, id);
    }

    @Delete("reviews/:id")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('user')
    @ApiBearerAuth()
    @ApiOperation({ summary: "Delete a review" })
    @ApiNotFoundResponse({ description: "Review not found" })
    deleteReview(@Param("id") id: number, @Req() req: RequestWithUser) {
        return this.userService.deleteReview(id, req.userId);
    }

    @Patch("reviews/:id/reply")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('user')
    @ApiBearerAuth()
    @ApiOperation({ summary: "Update reply to a review" })
    @ApiNotFoundResponse({ description: "Review not found" })
    updateReviewReply(@Param("id") id: number, @Body() dto: ReplyToReviewDto) {
        return this.userService.updateReviewReply(dto, id);
    }

    @Get("reviews/:userId")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('user')
    @ApiBearerAuth()
    @ApiOperation({ summary: "Get all reviews by user ID" })
    getReviews(@Param("userId") userId: number, @Req() req: RequestWithUser) {
        return this.userService.getReviews(userId, req.userId);
    }
}
