import { Module } from '@nestjs/common';
import { SellerService } from './seller.service';
import { SellerController } from './seller.controller';
import { DatabaseService } from 'src/database/database.service';
import { JwtStrategySeller } from 'src/jwt/jwtStrategy.seller';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import {SendVerificationEmail} from '../emails/verification.mail';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN
      }
    }),
    MailerModule.forRoot({
        transport: {
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: process.env.SMTP_SECURITY,
            auth: {
                user:process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            },
            connectionTimeout: 10000 //10 seconds
        }
    }),
    
  ],
  controllers: [SellerController],
  providers: [SellerService, DatabaseService, JwtStrategySeller, SendVerificationEmail],
})
export class SellerModule {}
