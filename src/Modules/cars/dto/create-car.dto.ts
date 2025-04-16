import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Matches,
  Min,
  ValidateNested,
} from 'class-validator';
import { CarsBrands } from 'src/utils';
import { JobsDto } from './jobs.dto';
import { CreateClientDto } from 'src/Modules/clients/dto/create-client.dto';
import { Transform, Type } from 'class-transformer';

export class CreateCarDto {
  @ApiProperty()
  @IsString()
  @Length(6, 7, { message: 'La patente debe tener 6 o 7 caracteres' })
  @Transform(({ value }) => value.toUpperCase().replace(/\s+/g, ''))
  @Matches(/^([A-Z]{2}\d{3}[A-Z]{2}|[A-Z]{3}\d{3})$/, {
    message: 'La patente debe tener el formato AA123BB o ABC123',
  })
  licensePlate: string;

  @ApiProperty()
  @IsString()
  model: string;

  @ApiProperty()
  @IsEnum(CarsBrands)
  brand: string;

  @ApiProperty()
  @IsInt()
  year: number;

  @ApiProperty({ type: CreateClientDto })
  @ValidateNested()
  @Type(() => CreateClientDto)
  owner: CreateClientDto; 

  @ApiPropertyOptional({type: [JobsDto]})
  @IsArray()
  @IsOptional()
  jobs: JobsDto[]

  @ApiProperty()
  @IsInt()
  @Min(0, {message: 'Los kilómetros no pueden ser negativos'})
  kilometers: number;
}
