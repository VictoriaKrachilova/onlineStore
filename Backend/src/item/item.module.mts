import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ItemController } from './item.controller.mjs';
import { ItemService } from './item.service.mjs';
import { Item } from './models/item.model.mjs';
import { Cart } from './models/cart.model.mjs';
import { AuthModule } from '../auth/auth.module.mjs';
import { ItemComment } from './models/item-comment.model.mjs';


@Module({
    providers: [ ItemService ],
    controllers: [ ItemController ],
    imports: [
        forwardRef(() => AuthModule),
        SequelizeModule.forFeature([ Item, Cart, ItemComment ]),
    ],
    exports: [ ItemService ]
})
export class ItemModule {}
