import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { JwtService } from "@nestjs/jwt";
import { RequestWithUser } from "../Common/newTypes.mjs";
@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req : RequestWithUser = context.switchToHttp().getRequest();
        try {
            const authHeader = req.headers.authorization;
            const bearer = authHeader?.split(' ')[0];
            const token = authHeader?.split(' ')[1];

            if (bearer !== 'Bearer' || !token) {
                throw new UnauthorizedException({ message: 'User not authorized' });
            }
            req.body.user = this.jwtService.verify(token);
            req.userId = req.body.user.id;
            return true;
        } catch (e) {
            throw new UnauthorizedException({ message: 'User not authorized' });
        }
    }
}
