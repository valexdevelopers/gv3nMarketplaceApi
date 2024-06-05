import {IsEmail, IsNotEmpty, Length, IsStrongPassword, IsString, IsOptional, IsPostalCode, IsPhoneNumber, IsBooleanString} from "class-validator";
import {confirmFieldDecorator} from "../../validations/confirm_field.decorator";

export class CreateSellerDto {

    @IsNotEmpty()
    @IsString()
    @Length(3, 30)
    business_name: string

    @IsNotEmpty()
    @IsString()
    @Length(3, 30)
    firstname: string

    @IsNotEmpty()
    @IsString()
    @Length(3, 30)
    lastname: string

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

    @IsOptional()
    @IsString()
    business_address?: String

    @IsOptional()
    @IsString()
    business_address_2?: String

    @IsOptional()
    @IsString()
    business_city?: String

    @IsOptional()
    @IsString()
    business_state?: String

    @IsOptional()
    @IsString()
    business_country?: String

    @IsOptional()
    @IsPostalCode()
    postal_code?: String

    @IsOptional()
    @IsPhoneNumber()
    phone?: BigInt

    @IsOptional()
    @IsPhoneNumber()
    phone_2?: BigInt

    @IsOptional()
    @IsBooleanString()
    verified: Boolean

    @IsOptional()
    @IsBooleanString()
    status: Boolean
}




