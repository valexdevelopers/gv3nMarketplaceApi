import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import  {DatabaseService} from '../database/database.service';
import { JwtModule } from '@nestjs/jwt';
import {JwtStrategyUser } from "../jwt/jwtStrategy.user"; 
import { MailerModule } from '@nestjs-modules/mailer';
import { SendVerificationEmail } from '../emails/verification.mail';

@Module({
  imports: [
    // PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
		secret: process.env.JWT_SECRET, // Ensure this matches your configuration
		signOptions: { expiresIn: 
			process.env.JWT_EXPIRES_IN
		},
    }),
    MailerModule.forRoot({
		transport: {
			host: process.env.SMTP_HOST,
			port: process.env.SMTP_PORT,
			// secure: process.env.SMTP_SECURITY,
			auth: {
				user:process.env.SMTP_USER,
				pass: process.env.SMTP_PASS
			},
			// connectionTimeout: 10000, // 10 seconds
		}
    }),
    
  ],
    
  controllers: [UserController],
	providers: [UserService, DatabaseService, JwtStrategyUser, SendVerificationEmail],
  
})
export class UserModule {}
