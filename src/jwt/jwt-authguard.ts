import { ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";


export class JwtAuthGuard extends AuthGuard('jwt'){
    canActivate(context: ExecutionContext){
        return super.canActivate(context)
    }

    handleRequest<TUser = any>(err: any, user: any, info: any, context: ExecutionContext, status?: any): TUser {
        if(err || !user){
            throw err || new UnauthorizedException('Restricted area! you must login first', {
                cause: new Error(),
                description: 'Unauthorized user'
            })
        }

        return user;
    }
}