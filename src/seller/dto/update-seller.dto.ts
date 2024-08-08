/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { SellerAccountDto } from './seller-account.dto';

export class UpdateSellerDto extends PartialType(SellerAccountDto) {}
