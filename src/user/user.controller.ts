/* eslint-disable prettier/prettier */
import {Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {Request, Response} from 'express';
import { LoginUserDto } from './dto/login-user.dto';
import {JwtAuthGuard} from '../jwt/jwt-authguard'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

	@Post('signup')
	async create(@Body() createUserDto: CreateUserDto, @Req() request: Request, @Res() response: Response) {

	 	try{
			const newUserToken = await this.userService.create(createUserDto);
			// const sendVerificationMail = this.userService.verificationMail();

			// return newUserToken;
			// if(sendVerificationMail && newUserToken){

			// }
			console.log(newUserToken)
			return response.status(201).json({
			status: 'ok!',
			message: 'Your account has been created',
			token: newUserToken
			});

		}catch(error){
			return response.status(error.status).json({
				status: 'error',
				message: error.message,
				error: error.response.error,
				cause: error.name
			});
		}
		
	}
	@Post('login')
	async login(@Body() loginUserDto: LoginUserDto, @Req() request:Request, @Res() response:Response){
		try{
			const authenticateUser = await this.userService.login(loginUserDto);
			// return logged in user 

			return response.status(201).json({
				status: 'ok!',
				message: 'You are logged in',
				token: authenticateUser[1],
				data: authenticateUser[0]
				});

		}catch(error){
			return response.status(error.status).json({
				status: 'error',
				message: error.message,
				error: error.response.error,
				cause: error.name
			});
		}
	}
	@Get()
	@UseGuards(JwtAuthGuard)
	findAll() {
		return this.userService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.userService.findOne(+id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
		return this.userService.update(+id, updateUserDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.userService.remove(+id);
	}
}
