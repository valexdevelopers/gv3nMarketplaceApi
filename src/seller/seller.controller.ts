import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, UseGuards } from '@nestjs/common';
import { SellerService } from './seller.service';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { LoginSellerDto } from './dto/login-seller.dto';
import {Request, Response} from 'express'; 
import { EmailVerificationDto } from './dto/emailverification-seller.dto';
import { JwtAuthGuard } from '../jwt/jwt-authguard'

@Controller('seller')
export class SellerController {
  constructor(private readonly sellerService: SellerService
	
  ) {}

	@Post('register')
		async create(@Body() createSellerDto: CreateSellerDto, @Req() request: Request, @Res() response: Response) {
			try{
				const newSellerToken = await this.sellerService.create(createSellerDto);
				// const sendVerificationMail = this.sellerService.verificationMail();
				return response.status(201).json({
				status: 'ok!',
				message: 'Your seller account has been created',
				token: newSellerToken
				});

			}catch(error){
				return response.status(500).json({
					status: 'error',
					message: error.message,
					error: error
					// cause: error.name
				});
				// console.log(error)
			}
	}


	@Post('login')
	async login(@Body() loginSellerDto: LoginSellerDto, @Req() request:Request, @Res() response:Response){
		try{
			const authenticateUser = await this.sellerService.login(loginSellerDto);
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

	@UseGuards(JwtAuthGuard)
	@Post('verify')
	async verifyEmail(@Body() emailVerificationDto: EmailVerificationDto, @Req() request:Request, @Res() response:Response){
		try {
			const feedback = await this.sellerService.verifyEmail(emailVerificationDto);
			// const sendVerificationMail = this.sellerService.verificationMail();
			return response.status(201).json({
			status: 'ok!',
			message: feedback,

			});
		} catch (error) {
			return response.status(error.status).json({
				status: 'error',
				message: error.message,
				error: error.response.error,
				cause: error.name
			});
		} 
	}

	@Post('resendVerification')
	async resendVerificationEmail(@Body() postData: {userId: string}, @Req() request:Request, @Res() response:Response){
		try {
			const feedback = await this.sellerService.resendVerificationEmail(postData.userId);
			// const sendVerificationMail = this.sellerService.verificationMail();
			return response.status(201).json({
			status: 'ok!',
			message: feedback,

			});
		} catch (error) {
			return response.status(error.status).json({
				status: 'error',
				message: error.message,
				error: error.response.error,
				cause: error.name
			});
		} 
	}

  @Get()
  findAll() {
    return this.sellerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sellerService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSellerDto: UpdateSellerDto) {
    return this.sellerService.update(+id, updateSellerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sellerService.remove(+id);
  }
}
