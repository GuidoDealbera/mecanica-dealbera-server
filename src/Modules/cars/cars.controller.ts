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
import { builderResponse, example, example_job, ResponseApi } from 'src/utils';
import { isUUID } from 'class-validator';
import { UpdateJobDto } from './dto/jobs.dto';

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
    const createdCar = await this.carsService.create(createCarDto);
    return builderResponse(createdCar, 'Automóvil registrado exitosamente');
  }

  @Get('jobs')
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      example: example_job,
    },
    description: 'Listado de los trabajos realizados',
  })
  async findJobs() {
    let response: ResponseApi;
    const result = await this.carsService.findJobs();
    if (result.length > 0) {
      response = {
        statusCode: HttpStatus.OK,
        message: 'Listado de los trabajos realizados',
        result: result,
      };
    } else {
      response = {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'No se encontraron trabajos realizados en ningún vehículo',
        result: null,
      };
    }

    return response;
  }

  @Get('all')
  @ApiResponse({
    status: HttpStatus.OK,
    type: Car,
    description: 'Lista de todos los automóviles registrados',
    example: [example],
  })
  async findAll() {
    const allCars = await this.carsService.findAll();
    let response: ResponseApi;
    if (allCars.length > 0) {
      response = {
        statusCode: HttpStatus.OK,
        message: 'Listado de automóviles registrados',
        result: allCars,
      };
    } else {
      response = {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'No hay automóviles registrados',
        result: null,
      };
    }

    return response;
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
  async findOne(@Param('licencePlate') licence: string) {
    const foundedCar = await this.carsService.findByLicensePlate(
      licence.toUpperCase(),
    );
    return builderResponse(
      foundedCar,
      `Automóvil con patente ${licence.toUpperCase()} encontrado`,
    );
  }

  @Patch('update/:id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID del automóvil a actualizar'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Automóvil actualizado correctamente',
  })
  async update(@Param('id') id: string, @Body() updateCarDto: UpdateCarDto) {
    const { jobs, kilometers, owner } = updateCarDto;
    if (!isUUID(id)) {
      throw new HttpException(
        'El ID es del tipo incorrecto',
        HttpStatus.BAD_REQUEST,
      );
    }
    const updatedCar = await this.carsService.update(id, updateCarDto);
    let message = 'Datos del automóvil actualizados correctamente';
    if (jobs && !kilometers && !owner) {
      message = 'Trabajo registrado correctamente';
    } else if (!jobs && kilometers && !owner) {
      message = 'Kilometraje del vehículo modificado exitosamente';
    } else if (!jobs && !kilometers && owner) {
      message = 'Titular del vehículo actualizado exitosamente';
    }

    return builderResponse(updatedCar, message);
  }

  @Delete('delete/:licencePlate')
  @ApiParam({
    name: 'licencePlate',
    description: 'Patente del automóvil a eliminar',
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      example: 'Automóvil eliminado exitosamente',
    },
    description: 'Automóvil eliminado exitosamente',
  })
  async deleteCar(
    @Param('licencePlate') licence: CreateCarDto['licensePlate'],
  ) {
    return await this.carsService.delete(licence);
  }

  @Patch('jobs/:licence/:jobId')
  @ApiParam({
    name: 'licence',
    description: 'Patente del automóvil a modificar su trabajo',
    required: true,
  })
  @ApiParam({
    name: 'jobId',
    description: 'Id del trabajo a modificar',
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      example: {
        statusCode: 200,
        message: 'Trabajo modificado exitosamente',
        result: { Car },
      },
    },
  })
  async updateJobInCar(
    @Param('licence') licence: string,
    @Param('jobId') jobId: string,
    @Body() updateJobDto: UpdateJobDto,
  ) {
    return await this.carsService.updateJobInCar(
      licence.toUpperCase(),
      jobId,
      updateJobDto,
    );
  }
}
