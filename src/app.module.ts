import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { SellerModule } from './seller/seller.module';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [UserModule,
            SellerModule,
            ThrottlerModule.forRoot([
				{
				name: "short",
				ttl: 1000,
				limit: 3
				},

				{
				name: "medium",
				ttl: 9000,
				limit: 4
				},

				{
				name: "long",
				ttl: 12000,
				limit: 5
				},
            ])
          ],
  controllers: [AppController],
  providers: [AppService,
				{
					provide: APP_GUARD,
					useClass: ThrottlerGuard
				}
  ],
})
export class AppModule {}
