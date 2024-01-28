import { Module } from "@nestjs/common";
import { SequelizeModule } from '@nestjs/sequelize';
import { conf } from "./conf.mjs";
import { UserModule } from "./user/user.module.mjs";
import { ItemModule } from "./item/item.module.mjs";
import { User } from "./user/models/user.model.mjs";
import { Item } from "./item/models/item.model.mjs";
import { Countries } from "./user/models/countries.model.mjs";
import { Cart } from "./item/models/cart.model.mjs";
import { UserReview } from "./user/models/user-review.model.mjs";
import { AuthModule } from "./auth/auth.module.mjs";
import { ItemComment } from "./item/models/item-comment.model.mjs";

@Module({
  controllers: [],
  providers: [],
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: conf.Postgres.host,
      port: conf.Postgres.port,
      username: conf.Postgres.username,
      password: conf.Postgres.password,
      database: conf.Postgres.database,
      autoLoadModels: true,
      models: [ 
        User,
        Countries,
        Item,
        Cart,
        ItemComment,
        UserReview
      ]
    }),
    AuthModule,
    UserModule,
    ItemModule

  ]
})

export class AppModule {}