import { IsInt, IsString } from "class-validator";

export class EmailVerificationDto {
    @IsInt()
    verificationCode: number


    @IsString()
    userId: string
}