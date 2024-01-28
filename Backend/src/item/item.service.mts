import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/sequelize";
import { Item } from './models/item.model.mjs';
import { AddItemDto } from './dto/add-item.dto.mjs';
import { EditItemDto } from './dto/edit-item.dto.mjs';
import { editItemInCartDto } from './dto/edit-item-in-cart.dto.mjs';
import { Cart } from './models/cart.model.mjs';
import { archiveItem, archiveItemInCart } from '../Common/mongo/api.mjs';
import { ItemComment } from './models/item-comment.model.mjs';
import { AddCommentDto } from './dto/add-comment.dto.mjs';
import { User } from '../user/models/user.model.mjs';
import { IdDto } from './dto/id.dto.mjs';
import { EditCommentDto } from './dto/edit-comment.dto.mjs';
import { ReplyToCommentDto } from './dto/reply-to-comment.dto.mjs';
import { MakeOrderDto } from './dto/make-order.dto.mjs';
import { Order } from './models/order.model.mjs';
import { ItemOrder } from './models/item_order.model.mjs';
import { ItemInfoForOrder, OrderStatus } from '../Common/newTypes.mjs';
import { updateActivationDto } from './dto/update-activation.dto.mjs';
import { OrderItemStatus } from './models/order_status.model.mjs';
import { ElasticsearchService } from '../elasticsearch/elasticsearch.service.mjs';
import { SearchItemDto } from './dto/search.dto.mjs';


@Injectable()
export class ItemService {
    constructor(@InjectModel(Item) private itemRepository: typeof Item,
            @InjectModel(Cart) private cartRepository: typeof Cart,
            @InjectModel(ItemComment) private commentRepository: typeof ItemComment,
            @InjectModel(Order) private orderRepository: typeof Order,
            @InjectModel(ItemOrder) private orderItemRepository: typeof ItemOrder,
            @InjectModel(OrderItemStatus) private orderStatusRepository: typeof OrderItemStatus,
            private elastic: ElasticsearchService,
    ) {}

    async addItem(data : AddItemDto) {
        const item : any = (await this.itemRepository.create({ ...data, userId: data.user.id })).dataValues;
        await this.elastic.updateItem(item.id, item);
        return { id: item.id };
    }

    async editItem(data : EditItemDto) {
        const [ updatedRows ] = await this.itemRepository.update({
            title: data.title,
            content: data.content,
            currency: data.currency,
            amount: data.amount,
            price: data.price,
            location: data.location,
            paymentType: data.paymentType,
            deliveryWays: data.deliveryWays,
            modifiedTimestamp: Date.now(),
            filter: data.filter
        }, { where: { id: data.id, userId: data.user.id, isActive: true } });
        if (!updatedRows) throw new HttpException('Item not found', HttpStatus.NOT_FOUND);
        await this.elastic.updateItem(data.id, data);
        return { status: "ok" };
    }

    async getItemsByUserId(userId : number, isActive : boolean) {
        return (await this.itemRepository.findAll({ where: { userId, isActive }, order: [ ['created', 'DESC'] ] })).map(v => v.dataValues);
    }

    async getItemInfo(itemId : number) {
        const item = (await this.itemRepository.findOne({
            where: { id: itemId }, order: [ ['created', 'DESC'] ] 
        }))?.dataValues;
        if (!item) throw new HttpException('Item not found', HttpStatus.NOT_FOUND); 
        return item;
    }

    async updateItemActivation(data : updateActivationDto) {
        const [ updatedRows ] = await this.itemRepository.update({ 
            isActive: data.isActive
        }, { where: { id: data.id, userId: data.user.id } });
        if (!updatedRows) throw new HttpException('Item not found', HttpStatus.NOT_FOUND);
        await this.elastic.updateItem(data.id, data);
        return { status: "ok" };
    }

    async deleteItem (itemId : number, userId : number) {
        const item : any = (await this.itemRepository.findByPk(itemId));
        if (!item) throw new HttpException('Item not found', HttpStatus.NOT_FOUND);
        let itemInfo = item.dataValues;
        if (itemInfo.userId !== userId) throw new HttpException('Access denied', HttpStatus.BAD_REQUEST);
        item.comments = JSON.stringify(await this.getCommentsByItemId(itemInfo.id));
        await archiveItem(itemInfo);
        // ?? что делать с корзиной и заказами?
        item.destroy();
        await this.elastic.deleteItem(itemId);
        return { status: "ok" };
    }

    async search(data: SearchItemDto) {
        const idArr = await this.elastic.searchItems(data);
        const count = await this.elastic.countItems(data);
        let list = [];
        for (let id of idArr) {
            const cargo : any = (await this.itemRepository.findOne({
                attributes: {
                    include: [ "id", "userId", "amount", "price", "currency", "location", "filenames", "filter" ],
                },
                where: { id, isActive: true },
            }))?.dataValues;
            list.push(cargo);
        }
        return { count, list };
    }

    async countItemsByUserId(userId : number) {
        return this.itemRepository.count({ where: { userId, isActive: true }});
    }

    async updateItemInCart(data : editItemInCartDto) {
        const item = (await this.itemRepository.findByPk(data.itemId))?.dataValues;
        if (!item) throw new HttpException('Item not found', HttpStatus.NOT_FOUND); 
        if (item.amount < (data.amount || 1)) throw new HttpException('The amount of itemised product is less than required', HttpStatus.BAD_REQUEST); 
        let cartItem = (await this.cartRepository.findOne({ where : { userId: data.user.id, itemId: data.itemId }}))?.dataValues;
        if (!cartItem) cartItem = (await this.cartRepository.create({ ...data, userId: data.user.id })).dataValues;
        else await this.cartRepository.update({ amount: data.amount }, { where: { userId: data.user.id, itemId: data.itemId } });
        await archiveItemInCart(cartItem, item);
        return { id: cartItem.id };
    }

    async deleteItemFromCart (id : number, userId : number) {
        const res = await this.cartRepository.findByPk(id);
        if (!res) throw new HttpException('Item in cart is not found', HttpStatus.NOT_FOUND);
        if (res.dataValues.userId != userId) throw new HttpException('Access denied', HttpStatus.BAD_REQUEST);
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
        })).map(v => {
            let product = v.dataValues;
            product.user = v.dataValues.user.dataValues;
            product.item = v.dataValues.item.dataValues;
            return product;
        });
        return res;
    }

    async updateItemFilenames(userId : number, itemId : number, filenames : Array<string>) {
        const [ updatedRows ] = await this.itemRepository.update({ filenames }, { where: { userId, id: itemId } });
        if (!updatedRows) throw new HttpException('Item not found', HttpStatus.NOT_FOUND); 
        return null;
    }

    async getUserIdByItemId(itemId : number) {
        const item = (await this.itemRepository.findByPk(itemId))?.dataValues;
        if (!item) throw new HttpException('Item not found', HttpStatus.NOT_FOUND);
        return item.userId;
    }

    async addComment(data: AddCommentDto) {
        const item = (await this.itemRepository.findByPk(data.itemId))?.dataValues;
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
            let result : any = v.dataValues;
            result.user = result.author.dataValues;
            delete result.author;
            return result;
        });
        return result;
    }

    async editComment(data : EditCommentDto) {
        const [ updatedRows ] = await this.commentRepository.update({ comment: data.comment }, { where: { id: data.commentId, authorId: data.user.id } });
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

    async getOrderCost(data: Array<ItemInfoForOrder>, sellerId : number) {
        let cost = 0;
        for (let v of data) {
            let item = (await this.itemRepository.findByPk(v.id))?.dataValues;
            if (!item) throw new HttpException('Item not found', HttpStatus.NOT_FOUND);
            if (item.userId != sellerId) throw new HttpException(`UserId of item ${item.id} does not match the seller's ID `, HttpStatus.BAD_REQUEST);
            if (v.amount > item.amount) throw new HttpException('The amount of itemised product is less than required', HttpStatus.BAD_REQUEST);
            cost += (item.price || 0) * v.amount;
        }
        return cost;
    }

    async makeOrder(data : MakeOrderDto) {
        const cost = await this.getOrderCost(data.itemInfoArr, data.sellerId);
        const order = await this.orderRepository.create({ ...data, cost });
        for (let v of data.itemInfoArr) {
            await this.orderItemRepository.create({ itemId: v.id, amount: v.amount, orderId:  order.id });
        }
        return { id: order.id };
    }

    async getOrders(userId : number, isActive : boolean, status : string | null,) {
        let filter : any = { customerId: userId, isActive };
        if (status) filter.status = status;
        const result : any = (await this.orderRepository.findAll({
            attributes: [ "id", "created", "status", "cost" ],
            include: [
                {
                    model: User,
                    as: 'seller',
                    attributes: [ "id", "name", "storeName" ]
                },
            ],
            where: filter, 
            order: [ ['created', 'DESC'] ]
        }));
        for (let order of result) {
            order = order.dataValues;
            order.seller = order.seller.dataValues;
            order.itemArr = (await this.orderItemRepository.findAll({
                attributes: [ "itemId", "amount" ],
                include: [
                    {
                        model: Item,
                        attributes: [ "id", "name", "description", "filenames", "price", "currency" ]
                    },
                ],
                where: { orderId: order.id },
            })).map(item => { return {...item.dataValues.item.dataValues, amount: item.dataValues.amount } });
        }
        return result;
    }

    async updateOrderActivation(data : updateActivationDto) {
        const [ updatedRows ] = await this.orderRepository.update({ 
            isActive: data.isActive
        }, { where: { id: data.id, customerId: data.user.id } });
        if (!updatedRows) throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
        return { status: "ok" };
    }

    async getOrderById(id : number, userId : number) {
        let order : any = (await this.orderRepository.findOne({
            attributes: [ "id", "created", "status", "cost" ],
            include: [{
                model: User,
                as: 'seller',
                attributes: [ "id", "name", "storeName" ]
            }],
            where: { id }
        }))?.dataValues;
        if (!order) throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
        if (order.sellerId !== userId && order.customerId !== userId) throw new HttpException('Access denied', HttpStatus.BAD_REQUEST);
        order.seller = order.seller.dataValues;
        order.itemArr = (await this.orderItemRepository.findAll({
            attributes: [ "itemId", "amount" ],
            include: [{
                model: Item,
                attributes: [ "id", "name", "description", "filenames", "price", "currency" ]
            }],
            where: { orderId: order.id },
        })).map(item => { return {...item.dataValues.item.dataValues, amount: item.dataValues.amount } });

        order.statusHistory = (await this.orderStatusRepository.findAll({
            attributes: [ "status", "time" ],
            where: { orderId: order.id },
        })).map(v => v.dataValues);

        return order;
    }

    async cancelOrder(data : IdDto) {
        let order = (await this.orderRepository.findByPk(data.id))?.dataValues;
        if (!order) throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
        if (order.sellerId !== data.user.id && order.customerId !== data.user.id) throw new HttpException('Access denied', HttpStatus.BAD_REQUEST);
        await this.orderRepository.update({ 
            status: OrderStatus.cancelled
        }, { where: { id: data.id } });
        return { status: "ok" };
    }

    async getAllItems () {
        return (await this.itemRepository.findAll()).map(v => v.dataValues);
    }


}
