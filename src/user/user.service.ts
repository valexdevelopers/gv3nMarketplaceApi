import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { EmailVerificationDto } from './dto/emailverification-seller.dto';
import { DatabaseService } from 'src/database/database.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import { MailerService } from '@nestjs-modules/mailer';
import {TwilioService } from 'nestjs-twilio';
import {SendVerificationEmail} from '../emails/verification.mail';


@Injectable()
export class UserService {

	constructor(
		private readonly databaseService: DatabaseService,
		private readonly jwtService: JwtService,
		private readonly sendVerificationEmail: SendVerificationEmail
	){}

	
	// async sendSMS(userPhone) {
	// 	return this.twilioService.client.messages.create({
	// 	  body: 'SMS Body, sent to the phone!',
	// 	  from: process.env.TWILIO_PHONE_NUMBER,
	// 	  to: userPhone,
	// 	});
	// }

	async create(createUserDto: CreateUserDto):Promise<any> {
		const newUser: Prisma.UserCreateInput = {
			name: createUserDto.name,
			age: createUserDto.age,
			email: createUserDto.email,
			password: await bcrypt.hash(createUserDto.password, 10),
			created_at: createUserDto.created_at
		}
		
		//  check if the provided email is a registered email
		const IsEmailNotUnique = await this.databaseService.user.findFirst({
			where: {
				email: newUser.email
			}
		});
		
		// if email is not unique and contains a value, throw error cos user exists already
		if(IsEmailNotUnique){
			console.log("We have an existing user with this email, kindly login to your account")
			throw new ConflictException('This email has been used, kindly login to your account', {
				cause: new Error(),
				description: 'existing user'
			});
			
		}

		// create new user if email does not exist
		const createUser = await this.databaseService.user.create({data:newUser})

		// //  if an error occurs during creation of new user, throw exceoption
		if(!createUser) {
			
			console.log("could not create user")
			throw new InternalServerErrorException('sever error could not create user', { 
				cause: new Error(),
				description: 'user not found' 
				});
		}

		// generate verification code
        const verificationCode = Math.floor(Math.random() * 999999);
        let expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1);
        console.log(expiryDate, createUser.created_at)
        // insert verification into personalAccessToken
        const tokenData: Prisma.PersonalAccessCodesCreateInput = {
            userType: 'User',
            userId: createUser.id,
            accessToken: verificationCode,
            tokenName: 'email verification code',
            expires_at: expiryDate
        };

        const saveToken = await this.databaseService.personalAccessCodes.create({data: tokenData});
        
        if(!saveToken){
            console.log("token was generated but not saved");
        }

        // send verification code 
        const sendVerificationEmail =  await this.sendVerificationEmail.verificationMail(verificationCode, createUser.email);

        if(!sendVerificationEmail){
            throw new InternalServerErrorException("Internal server error, could not send verification mail", {
                cause: new Error(),
                description: "server error: mail error"
            })
        }
        
		const payload = {email: createUser.email};
		const token = this.jwtService.sign(payload);
		return token;
		
	}

	async login(loginUserDto: LoginUserDto){
		const {email, password} = loginUserDto;

		const loginUser = await this.databaseService.user.findUnique({
			where: {
				email: email
			}
		});

		if(!loginUser){
			throw new NotFoundException('we could not find a user with this email', {
				cause: new Error(),
				description: "we could not find a user with this email"
			});
		}

		const validatePassword = await bcrypt.compare(password, loginUser.password );

		if(!validatePassword){
			throw new UnauthorizedException('Authentication error, Incorrected password for this user',
				{
					cause: new Error(),
					description: "incorrect password"
				}
			)
		}

		return [loginUser, this.jwtService.sign({email})];
	}

	async verifyEmail(emailVerificationDto: EmailVerificationDto): Promise<any>{
        const {verificationCode, userId} = emailVerificationDto;

        const DoesCodeExist = await this.databaseService.personalAccessCodes.findFirst({
            where: {
                    userType: 'User',
                    userId: userId,
                    accessToken: verificationCode
                }
            
        })

        if(!DoesCodeExist){
            throw new UnauthorizedException("Invalid email verification token", {
                cause: new Error(),
                description: "invalid token"
            })
        }

        const today = new Date();

        // check if code has expired, if expired delete token from database
        if(today > DoesCodeExist.expires_at){
            const deleteCode = await this.databaseService.personalAccessCodes.deleteMany({
                where: {
                    userType: 'User',
                    userId: userId,
                    accessToken: verificationCode
                }
            })
            throw new UnauthorizedException("This token has expired, kindly request a new token", {
                cause: new Error(),
                description: "expired token"
            })
        }

        const verifySellerEmail = await this.databaseService.user.update({
            where: {
                id: DoesCodeExist.userId  
            },
            data: {
                verified: true
            }
        })

        if(!verifySellerEmail){
            throw new InternalServerErrorException("Internal server error, could not verification your email", {
                cause: new Error(),
                description: "server error: email verification error"
            })
        }

        return "your email has been verified"
    }


    async resendVerificationEmail(userId: string){
        const User = await this.databaseService.user.findUnique({
            where: {
                id: userId
            }
        })
        
        const deleteExistingUserToken = await this.databaseService.personalAccessCodes.deleteMany({
            where: {
               userType: 'User',
               userId:  User.id,
            }
        })
        
		if(!deleteExistingUserToken){
			console.log("error deleting existing token");
             throw new InternalServerErrorException("Internal server error, could not generate a new token for this account", {
                cause: new Error(),
                description: "server error: token deletion error"
            })
		}
        // generate new token

         // generate verification code
         const verificationCode = Math.floor(Math.random() * 999999);
         let expiryDate = new Date();
         expiryDate.setHours(expiryDate.getHours() + 1);
         
         // insert verification into personalAccessToken
         const tokenData: Prisma.PersonalAccessCodesCreateInput = {
             userType: 'User',
             userId: User.id,
             accessToken: verificationCode,
             tokenName: 'email verification code',
             expires_at: expiryDate
         };
 
         const saveToken = await this.databaseService.personalAccessCodes.create({data: tokenData});
         
         if(!saveToken){
             console.log("token was generated but not saved");
             throw new InternalServerErrorException("Internal server error, could not generate a token for this account", {
                cause: new Error(),
                description: "server error: token creation"
            })
         }
         
         const sendVerificationEmail =  await this.sendVerificationEmail.verificationMail(verificationCode, User.email);
         
         if(!sendVerificationEmail){
            throw new InternalServerErrorException("Internal server error, could not send verification mail", {
                cause: new Error(),
                description: "server error: mail error"
            })
         }
         return "We sent you a new verification code";
    }


	findAll() {
		return `This action returns all user`;
	}

	findOne(id: number) {
		return `This action returns a #${id} user`;
	}

	update(id: number, updateUserDto: UpdateUserDto) {
		return `This action updates a #${id} user`;
	}

	remove(id: number) {
		return `This action removes a #${id} user`;
	}
}
