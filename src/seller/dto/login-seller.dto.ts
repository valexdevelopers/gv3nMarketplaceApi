/* eslint-disable prettier/prettier */
import {IsEmail, IsNotEmpty} from "class-validator";

export class LoginSellerDto {
    @IsNotEmpty()
    @IsEmail()
    business_email: string

    @IsNotEmpty()
    password: string
}