import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsISO8601, IsOptional, IsString } from 'class-validator';

export class JobsDto {
  @ApiProperty()
  @IsInt()
  price: number;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsBoolean()
  isThirdParty: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsISO8601()
  createdAt?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsISO8601()
  updatedAt?: Date;
}
