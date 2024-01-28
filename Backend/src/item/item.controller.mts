import { Body, Controller, Post, UseGuards, Get, Param, Req, Delete } from '@nestjs/common';
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

@ApiTags("Item")
@Controller('item')
export class ItemController {
    constructor(private itemService: ItemService) { }

    @ApiOperation({ summary: 'Add item' })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    // @ApiResponse({ status: 201, type: IdResponse })
    @Post('/addItem')
    addItem(@Body() data: AddItemDto) {
        return this.itemService.addItem(data);
    }

    @ApiOperation({ summary: 'Edit user`s item (if the field has not changed, send the old value)' })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiResponse({ status: 201 })
    @ApiNotFoundResponse({ description: 'Item not found' })
    @Post('/editItem')
    editItem(@Body() data: EditItemDto) {
        return this.itemService.editItem(data);
    }

    @ApiOperation({ summary: 'Get item info' })
    @ApiResponse({ status: 201 })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get('/getItemInfo/:itemId')
    async getItemInfo(@Param('itemId') itemId : number) {
        return this.itemService.getItemInfo(itemId);
    }

    @ApiOperation({ summary: 'archive or unarchive' })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post('/updateItemActivation')
    @ApiResponse({ status: 201})
    updateItemActivation(@Body() data: updateActivationDto) {
        return this.itemService.updateItemActivation(data);
    }

    @ApiOperation({ summary: 'archive or unarchive' })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Delete('/deleteItem/:itemId')
    @ApiResponse({ status: 201})
    deleteItem(@Param('itemId') itemId : number, @Req() req : RequestWithUser) {
        return this.itemService.deleteItem(itemId, req.userId);
    }

    @ApiOperation({ summary: 'Search cargo' })
    @ApiResponse({ status: 201 })
    @Post('/search')
    search(@Body() data: SearchItemDto) {
        return this.itemService.search(data);
    }

    @ApiOperation({ summary: 'Add or edit product in cart' })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiResponse({ status: 201 })
    @ApiBadRequestResponse({ description: 'The amount of itemised product is less than required' })
    @ApiNotFoundResponse({ description: 'Item not found' })
    @Post('/updateItemInCart')
    updateItemInCart(@Body() data: editItemInCartDto) {
        return this.itemService.updateItemInCart(data);
    }

    @ApiOperation({ summary: 'Delete item from cart by ID' })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiResponse({ status: 201 })
    @ApiNotFoundResponse({ description: 'Item in cart is not found' })
    @Delete('/deleteItemFromCart/:id')
    deleteItemFromCart(@Param('id') id : number, @Req() req : RequestWithUser) {
        return this.itemService.deleteItemFromCart(id, req.userId);
    }

    @ApiOperation({ summary: 'Delete item from cart by ID' })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiResponse({ status: 201 })
    @ApiNotFoundResponse({ description: 'Item in cart is not found' })
    @Get('/getCart')
    getCart(@Req() req : RequestWithUser) {
        return this.itemService.getCart(req.userId);
    }

    @ApiOperation({ summary: 'Left a comment' })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    // @ApiResponse({ status: 201, type: IdResponse })
    @Post('/addComment')
    addComment(@Body() data: AddCommentDto) {
        return this.itemService.addComment(data);
    }

    @ApiOperation({ summary: 'Edit comment' })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiNotFoundResponse({ description: 'Comment not found' })
    @Post('/editComment')
    @ApiResponse({ status: 201 })
    editComment(@Body() data: EditCommentDto) {
        return this.itemService.editComment(data);
    }

    @ApiOperation({ summary: 'Delete comment' })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiNotFoundResponse({ description: 'Comment not found' })
    @Delete('/deleteComment/:id')
    @ApiResponse({ status: 201 })
    deleteComment(@Param('id') id : number, @Req() req : RequestWithUser) {
        return this.itemService.deleteComment(id, req.userId);
    }

    @ApiOperation({ summary: 'Update reply to comment from recipient. If you want to delete reply, set reply = null' })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiNotFoundResponse({ description: 'Comment not found' })
    @Post('/updateCommentReply')
    @ApiResponse({ status: 201 })
    updateCommentReply(@Body() data: ReplyToCommentDto) {
        return this.itemService.updateCommentReply(data);
    }

    @ApiOperation({ summary: 'Get all comments by user ID' })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get('/getCommentsByItemId/:itemId')
    // @ApiResponse({ status: 201, type: CommentInfo, isArray: true })
    getCommentsByItemId(@Param('itemId') itemId : number) {
        return this.itemService.getCommentsByItemId(itemId);
    }

}