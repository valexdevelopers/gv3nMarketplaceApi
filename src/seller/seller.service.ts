import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { LoginSellerDto } from './dto/login-seller.dto';
import { EmailVerificationDto } from './dto/emailverification-seller.dto';
import { DatabaseService } from 'src/database/database.service';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import * as bcrypt from "bcrypt";
import {SendVerificationEmail} from '../emails/verification.mail';

@Injectable()
export class SellerService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly jwtService: JwtService,
        private readonly sendVerificationEmail: SendVerificationEmail
    ){}

    async create(createSellerDto: CreateSellerDto):Promise<any> {
        const newSeller: Prisma.SellerCreateInput = {
            firstname: createSellerDto.firstname,
            lastname: createSellerDto.lastname,
            business_name: createSellerDto.business_name,
            business_email: createSellerDto.business_email,
            password: await bcrypt.hash(createSellerDto.password, 10)
            
        }

        const IsSellerRegistered = await this.databaseService.seller.findFirst({
            where: {
                business_email: createSellerDto.business_email
            }
        })

        if(IsSellerRegistered){
            throw new ConflictException("We have an existing seller registered with this email", {
                cause: new Error(),
                description: "email not unique"
            })
        }

        const registerSeller = await this.databaseService.seller.create({data:newSeller});

        if(!registerSeller){
            throw new InternalServerErrorException("Internal server error! Seller registration failed", {
                cause: new Error(),
                description: "server error"
            })
        }


        // generate verification code
        const verificationCode = Math.floor(Math.random() * 999999);
        let expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1);
        console.log(expiryDate, registerSeller.created_at)
        // insert verification into personalAccessToken
        const tokenData: Prisma.PersonalAccessCodesCreateInput = {
            userType: 'Seller',
            userId: registerSeller.id,
            accessToken: verificationCode,
            tokenName: 'email verification code',
            expires_at: expiryDate
        };

        const saveToken = await this.databaseService.personalAccessCodes.create({data: tokenData});
        
        if(!saveToken){
            console.log("token was generated but not saved");
        }

        // send verification code 
        const sendVerificationEmail =  await this.sendVerificationEmail.verificationMail(verificationCode, registerSeller.business_email);

        if(!sendVerificationEmail){
            throw new InternalServerErrorException("Internal server error, could not send verification mail", {
                cause: new Error(),
                description: "server error: mail error"
            })
        }
        
        const payload = {business_email: registerSeller.business_name}
        const token = this.jwtService.sign(payload)
        return token;
    }

    async login(loginSellerDto: LoginSellerDto): Promise<any>{
        const {business_email, password} = loginSellerDto;

        const findSeller = await this.databaseService.seller.findUnique({
            where: {
                business_email: business_email
            }
        })

        if(!findSeller){
            throw new NotFoundException("Incorrect business email, We could not find a valid acccount with this email", {
                 cause: new Error(),
                 description: "incorrect email"
            });
        }

        const validatePassword = await bcrypt.compare(password, findSeller.password)

        if(!validatePassword){
            throw new UnauthorizedException("Authentication error, incorrect password for this seller", {
                cause: new Error(),
                description: "incorrect password"
            })
        }

    //    if(!findSeller.verified){
    //         throw new UnauthorizedException("Kindly Verify your email with the email verification code you recieved", {
    //             cause: new Error(),
    //             description: "email verification"
    //         })
    //    }
        const payload = {business_email: findSeller.business_email}
        return [findSeller, this.jwtService.sign(payload)]
    }


    async verifyEmail(emailVerificationDto: EmailVerificationDto): Promise<any>{
        const {verificationCode, userId} = emailVerificationDto;

        const DoesCodeExist = await this.databaseService.personalAccessCodes.findFirst({
            where: {
                    userType: 'Seller',
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
                    userType: 'Seller',
                    userId: userId,
                    accessToken: verificationCode
                }
            })
            throw new UnauthorizedException("This token has expired, kindly request a new token", {
                cause: new Error(),
                description: "expired token"
            })
        }

        const verifySellerEmail = await this.databaseService.seller.update({
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
        const Seller = await this.databaseService.seller.findUnique({
            where: {
                id: userId
            }
        })
        
        const deleteExistingSellerToken = await this.databaseService.personalAccessCodes.deleteMany({
            where: {
               userType: 'Seller',
               userId:  Seller.id,
            }
        })
        
        if(!deleteExistingSellerToken){
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
             userType: 'Seller',
             userId: Seller.id,
             accessToken: verificationCode,
             tokenName: 'email verification code',
             expires_at: expiryDate
         };
 
         const saveToken = await this.databaseService.personalAccessCodes.create({data: tokenData});
         
         if(!saveToken){
             console.log("token was generated but not saved");
             throw new InternalServerErrorException("T  Internal server error, could not generate a token for this account", {
                cause: new Error(),
                description: "server error: token creation"
            })
         }
         
         const sendVerificationEmail =  await this.sendVerificationEmail.verificationMail(verificationCode, Seller.business_email);
         
         if(!sendVerificationEmail){
            throw new InternalServerErrorException("Internal server error, could not send verification mail", {
                cause: new Error(),
                description: "server error: mail error"
            })
         }
         return "We sent you a new verification code";
    }

    findAll() {
        return `This action returns all seller`;
    }

    findOne(id: number) {
        return `This action returns a #${id} seller`;
    }

    update(id: number, updateSellerDto: UpdateSellerDto) {
        return `This action updates a #${id} seller`;
    }

    remove(id: number) {
        return `This action removes a #${id} seller`;
    }
}
