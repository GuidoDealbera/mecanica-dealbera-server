import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  HttpStatus,
  Delete,
  SetMetadata,
  BadRequestException,
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
import {
  builderResponse,
  example,
  example_job,
  RESPONSE_MESSAGE,
  ResponseApi,
} from 'src/utils';
import { isUUID } from 'class-validator';
import { UpdateJobDto } from './dto/jobs.dto';

@ApiTags('Autos')
@ApiExtraModels(Car)
@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Post('/register')
  @SetMetadata(RESPONSE_MESSAGE, 'Automóvil registrado exitosamente')
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: Car,
    description: 'Automóvil creado correctamente',
    example: example,
  })
  async create(@Body() createCarDto: CreateCarDto) {
    return await this.carsService.create(createCarDto);
  }

  @Get('jobs')
  @SetMetadata(RESPONSE_MESSAGE, 'Listado de los trabajos realizados')
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      example: example_job,
    },
    description: 'Listado de los trabajos realizados',
  })
  async findJobs() {
    return await this.carsService.findJobs();
  }

  @Get('all')
  @SetMetadata(RESPONSE_MESSAGE, 'Listado de automóviles registrados')
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
  @SetMetadata(RESPONSE_MESSAGE, 'Automóvil según la patente dada')
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
    return await this.carsService.findByLicensePlate(licence.toUpperCase());
  }

  @Patch('update/:id')
  @SetMetadata(
    RESPONSE_MESSAGE,
    'Datos del automóvil actualizados correctamente',
  )
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID del automóvil a actualizar',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Automóvil actualizado correctamente',
  })
  async update(@Param('id') id: string, @Body() updateCarDto: UpdateCarDto) {
    const { jobs, kilometers, owner } = updateCarDto;
    if (!isUUID(id)) {
      throw new BadRequestException('El ID es del tipo incorrecto');
    }
    const updatedCar = await this.carsService.update(id, updateCarDto);

    if (jobs && !kilometers && !owner) {
      Reflect.defineMetadata(
        RESPONSE_MESSAGE,
        'Trabajo registrado correctamente',
        updatedCar,
      );
    } else if (!jobs && kilometers && !owner) {
      Reflect.defineMetadata(
        RESPONSE_MESSAGE,
        'Kilometraje del vehículo modificado exitosamente',
        updatedCar,
      );
    } else if (!jobs && !kilometers && owner) {
      Reflect.defineMetadata(
        RESPONSE_MESSAGE,
        'Titular del vehículo actualizado exitosamente',
        updatedCar,
      );
    }

    return updatedCar;
  }

  @Delete('delete/:licencePlate')
  @SetMetadata(RESPONSE_MESSAGE, 'Automóvil eliminado exitosamente')
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
