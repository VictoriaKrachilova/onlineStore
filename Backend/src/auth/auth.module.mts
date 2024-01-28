import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller.mjs';
import { AuthService } from './auth.service.mjs';
import { UserModule } from "../user/user.module.mjs";
import { JwtModule } from "@nestjs/jwt";
import { conf } from '../conf.mjs';
@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
      forwardRef(() => UserModule),
      JwtModule.register({
        secret: conf.Api.secret,
        signOptions: {
          expiresIn: '24h'
        }
      })
  ],
    exports: [
        AuthService,
        JwtModule
    ]
})
export class AuthModule {}