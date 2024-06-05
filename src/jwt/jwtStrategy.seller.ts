import { Injectable, NotFoundException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { DatabaseService } from "src/database/database.service";

@Injectable()
export class JwtStrategySeller extends PassportStrategy(Strategy){
    constructor(
        private readonly databaseSeervice: DatabaseService,
        // private readonly sellerService: SellerService
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET
        })
    }

    async validate(payload: {business_email:string }){
        const seller = await this.databaseSeervice.seller.findUnique({
            where: {
                business_email: payload.business_email
            }
        })

        if(!seller){
            throw new NotFoundException('No valid user found', {
                cause: new Error(),
                description: "User account not found"
            })
        }

        return seller;
    }
}