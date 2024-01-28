import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserController } from './user.controller.mjs';
import { User } from './models/user.model.mjs';
import { UserService } from './user.service.mjs';
import { Countries } from './models/countries.model.mjs';
import { UserReview } from './models/user-review.model.mjs';
import { AuthModule } from '../auth/auth.module.mjs';
import { ItemModule } from '../item/item.module.mjs';

@Module({
    providers: [ UserService ],
    controllers: [ UserController ],
    imports: [
        forwardRef(() => AuthModule),
        SequelizeModule.forFeature([ User, Countries, UserReview ]),
        ItemModule,
    ],
    exports: [ UserService ]
})
export class UserModule {}
