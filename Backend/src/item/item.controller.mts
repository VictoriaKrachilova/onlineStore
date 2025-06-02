import { Body, Controller, Post, UseGuards, Get, Param, Req, Delete, Patch } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth, ApiNotFoundResponse, ApiBadRequestResponse } from "@nestjs/swagger";
import { ItemService } from './item.service.mjs';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.mjs';
// import { CommentInfo, IdResponse } from '../Common/newTypesForDoc.mjs';
import { AddCommentDto } from './dto/add-comment.dto.mjs';
import { EditCommentDto } from './dto/edit-comment.dto.mjs';
import { ReplyToCommentDto } from './dto/reply-to-comment.dto.mjs';
import { RequestWithUser } from '../Common/newTypes.mjs';
import { updateActivationDto } from './dto/update-activation.dto.mjs';
import { SearchItemDto } from './dto/search.dto.mjs';
import { AddItemDto } from './dto/add-item.dto.mjs';
import { EditItemDto } from './dto/edit-item.dto.mjs';
import { editItemInCartDto } from './dto/edit-item-in-cart.dto.mjs';

@ApiTags('Item')
@Controller('item')
export class ItemController {
    constructor(private itemService: ItemService) {}

    @ApiOperation({ summary: 'Add item' })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post()
    addItem(@Body() data: AddItemDto) {
        return this.itemService.addItem(data);
    }

    @ApiOperation({ summary: 'Edit user`s item' })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiNotFoundResponse({ description: 'Item not found' })
    @Patch(':itemId')
    editItem(@Param('itemId') itemId: number, @Body() data: EditItemDto) {
        return this.itemService.editItem(data, itemId);
    }

    @ApiOperation({ summary: 'Get item info' })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get(':itemId')
    getItemInfo(@Param('itemId') itemId: number) {
        return this.itemService.getItemInfo(itemId);
    }

    @ApiOperation({ summary: 'Archive or unarchive item' })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Patch('activation')
    updateItemActivation(@Body() data: updateActivationDto) {
        return this.itemService.updateItemActivation(data);
    }

    @ApiOperation({ summary: 'Delete item' })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Delete(':itemId')
    deleteItem(@Param('itemId') itemId: number, @Req() req: RequestWithUser) {
        return this.itemService.deleteItem(itemId, req.userId);
    }

    @ApiOperation({ summary: 'Search items' })
    @Post('search')
    search(@Body() data: SearchItemDto) {
        return this.itemService.search(data);
    }

    @ApiOperation({ summary: 'Add or edit product in cart' })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Patch('cart')
    updateItemInCart(@Body() data: editItemInCartDto) {
        return this.itemService.updateItemInCart(data);
    }

    @ApiOperation({ summary: 'Delete item from cart by ID' })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Delete('cart/:id')
    deleteItemFromCart(@Param('id') id: number, @Req() req: RequestWithUser) {
        return this.itemService.deleteItemFromCart(id, req.userId);
    }

    @ApiOperation({ summary: 'Get user cart' })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get('cart')
    getCart(@Req() req: RequestWithUser) {
        return this.itemService.getCart(req.userId);
    }

    @ApiOperation({ summary: 'Add comment' })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post('comment')
    addComment(@Body() data: AddCommentDto) {
        return this.itemService.addComment(data);
    }

    @ApiOperation({ summary: 'Edit comment' })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiNotFoundResponse({ description: 'Comment not found' })
    @Patch('comment/:id')
    editComment(@Param('id') id: number, @Body() data: EditCommentDto) {
        return this.itemService.editComment(data, id);
    }

    @ApiOperation({ summary: 'Delete comment' })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiNotFoundResponse({ description: 'Comment not found' })
    @Delete('comment/:id')
    deleteComment(@Param('id') id: number, @Req() req: RequestWithUser) {
        return this.itemService.deleteComment(id, req.userId);
    }

    @ApiOperation({ summary: 'Update reply to comment from recipient' })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiNotFoundResponse({ description: 'Comment not found' })
    @Patch('comment/reply')
    updateCommentReply(@Body() data: ReplyToCommentDto) {
        return this.itemService.updateCommentReply(data);
    }

    @ApiOperation({ summary: 'Get all comments by item ID' })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get(':itemId/comments')
    getCommentsByItemId(@Param('itemId') itemId: number) {
        return this.itemService.getCommentsByItemId(itemId);
    }
}