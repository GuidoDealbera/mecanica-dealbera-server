import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class CreateClientDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({message: 'El nombre completo es requerido'})
  fullname: string;

  @ApiProperty()
  @IsString()
  @IsPhoneNumber('AR', {message: 'Inserte un número de teléfono válido'})
  @IsNotEmpty({message: 'El número de teléfono es requerido'})
  phone: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({message: 'La dirección es requerida'})
  address: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({message: 'La localidad es requerido'})
  city: string;

  @ApiProperty()
  @IsOptional()
  @IsEmail()
  email?: string;
}
