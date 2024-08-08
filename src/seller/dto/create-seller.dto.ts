/* eslint-disable prettier/prettier */
import {IsEmail, IsNotEmpty, Length, IsStrongPassword, IsString} from "class-validator";
import {confirmFieldDecorator} from "../../validations/confirm_field.decorator";

export class CreateSellerDto {

    @IsNotEmpty()
    @IsString()
    @Length(3, 30)
    business_name: string

    @IsNotEmpty()
    @IsEmail()
    @Length(6, 50)
    business_email: string

    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        minUppercase: 1
    })
    @IsNotEmpty()
    @Length(8, 16)
    password: string

    @confirmFieldDecorator('password')
    password_confirmation: string

    @IsNotEmpty()
    @IsString()
    @Length(6, 500)
    residential_address: string
}




