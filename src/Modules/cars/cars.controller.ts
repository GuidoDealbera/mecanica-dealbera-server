import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  HttpStatus,
  HttpException,
  Delete,
} from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import {
  ApiExtraModels,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Car } from 'src/Database/cars.entity';
import { example } from 'src/utils';
import { isUUID } from 'class-validator';

@ApiTags('Autos')
@ApiExtraModels(Car)
@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Post('/register')
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: Car,
    description: 'Automóvil creado correctamente',
    example: example,
  })
  async create(@Body() createCarDto: CreateCarDto) {
    return await this.carsService.create(createCarDto);
  }

  @Get('/all')
  @ApiResponse({
    status: HttpStatus.OK,
    type: Car,
    description: 'Lista de todos los automóviles registrados',
    example: [example],
  })
  async findAll() {
    return await this.carsService.findAll();
  }

  @Get(':licencePlate')
  @ApiParam({
    name: 'licencePlate',
    required: true,
    description: 'Patente del automóvil (formato AA123BB o ABC123)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: Car,
    description: 'Automóvil según la patente dada',
    example: example,
  })
  findOne(@Param('licencePlate') licence: string) {
    return this.carsService.findByLicensePlate(licence);
  }

  @Patch('update/:id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID del automóvil a actualizar',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: Car,
    description: 'Automóvil actualizado correctamente',
  })
  async update(@Param('id') id: string, @Body() updateCarDto: UpdateCarDto) {
    if (!isUUID(id)) {
      throw new HttpException(
        'El ID es del tipo incorrecto',
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.carsService.update(id, updateCarDto);
  }
  
  @Delete('delete/:licencePlate')
  @ApiParam({
    name: 'licencePlate',
    description: 'Patente del automóvil a eliminar',
    required: true
  })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      example: 'Automóvil eliminado exitosamente'
    },
    description: 'Automóvil eliminado exitosamente'
  })
  async deleteCar(@Param('licencePlate') licence: CreateCarDto['licensePlate']) {
    return await this.carsService.delete(licence)
  }
}
