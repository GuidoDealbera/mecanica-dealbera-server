import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsOptional,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreateClientDto } from 'src/Modules/clients/dto/create-client.dto';
import { JobsDto } from './jobs.dto';
import { Jobs } from 'src/utils';
export class UpdateCarDto {
  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateClientDto)
  owner?: CreateClientDto;

  @ApiPropertyOptional({ type: [JobsDto] })
  @IsArray()
  @IsOptional()
  jobs?: Jobs[];

  @ApiPropertyOptional()
  @IsInt()
  @Min(0, { message: 'Los kilómetros no pueden ser negativos' })
  @IsOptional()
  kilometers?: number;
}
