import {IsEmail, IsInt, IsNotEmpty, Length, IsDate} from 'class-validator';

export class CreateUserDto {

    @IsEmail()
    @Length(6, 100)
    email: string

    @Length(2, 50)
    @IsNotEmpty()
    name:string


    @Length(10, 20)
    @IsNotEmpty()
    password: string

    @IsInt()
    age: number

    @IsDate()
    created_at: Date

    @IsDate()
    deleted_at: Date

}
