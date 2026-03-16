import {
  IsNotEmpty,
  IsString,
  IsArray,
  IsOptional,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { MidtransStatus } from '@/prisma/generated/prisma/enums';

class VaNumber {
  @IsString()
  @IsNotEmpty()
  va_number: string;

  @IsString()
  @IsNotEmpty()
  bank: string;
}

export class NotificationDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VaNumber)
  @IsOptional()
  va_numbers?: VaNumber[];

  @IsString()
  @IsNotEmpty()
  transaction_time: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.toUpperCase() : value))
  @IsEnum(MidtransStatus)
  @IsNotEmpty()
  transaction_status: MidtransStatus;

  @IsString()
  @IsNotEmpty()
  transaction_id: string;

  @IsString()
  @IsNotEmpty()
  status_message: string;

  @IsString()
  @IsNotEmpty()
  status_code: string;

  @IsString()
  @IsNotEmpty()
  signature_key: string;

  @IsString()
  @IsNotEmpty()
  payment_type: string;

  @IsArray()
  @IsOptional()
  payment_amounts?: any[];

  @IsString()
  @IsNotEmpty()
  order_id: string;

  @IsString()
  @IsNotEmpty()
  merchant_id: string;

  @IsString()
  @IsNotEmpty()
  gross_amount: string;

  @IsString()
  @IsNotEmpty()
  fraud_status: string;

  @IsString()
  @IsNotEmpty()
  expiry_time: string;

  @IsObject()
  @IsOptional()
  customer_details?: any;

  @IsString()
  @IsNotEmpty()
  currency: string;
}
