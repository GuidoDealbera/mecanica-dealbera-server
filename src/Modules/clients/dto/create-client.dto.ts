import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class CreateClientDto {
  @ApiProperty()
  @IsString()
  fullname: string;

  @ApiProperty()
  @IsString()
  @IsPhoneNumber()
  phone: string;

  @ApiProperty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsString()
  city: string;

  @ApiProperty()
  @IsOptional()
  @IsEmail()
  email?: string;
}
