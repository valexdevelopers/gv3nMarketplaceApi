import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { DatabaseService } from "src/database/database.service";
import {UserService } from "../user/user.service";

@Injectable()
export class JwtStrategyUser extends PassportStrategy(Strategy){
    constructor(private readonly databaseService: DatabaseService,
        private readonly userService: UserService
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET
        })
    }

    async validate(payload: {email:string}){
        const user = await this.databaseService.user.findUnique({
            where: {
                email: payload.email
            }
        })
        // const user = await this.userService.validateUser(payload);
        if(!user){
            throw new UnauthorizedException('user is unauthorized', { cause: new Error(), description: 'user not found' })
        }

        return user;
    }
}