import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Car } from 'src/Database/cars.entity';
import { Repository } from 'typeorm';
import { ClientsService } from '../clients/clients.service';
import { v4 } from 'uuid';
import { UpdateJobDto } from './dto/jobs.dto';
import { builderResponse } from 'src/utils';

@Injectable()
export class CarsService {
  constructor(private readonly clientService: ClientsService) {}
  @InjectRepository(Car)
  private readonly carsRepository: Repository<Car>;

  async create(createCarDto: CreateCarDto) {
    const car = await this.carsRepository.findOne({
      where: { licensePlate: createCarDto.licensePlate },
    });
    let owner = await this.clientService.findOne(createCarDto.owner.fullname);

    if (car) {
      throw new HttpException('Patente ya registrada', HttpStatus.BAD_REQUEST);
    }
    const existingPhone = await this.clientService.findByPhone(
      createCarDto.owner.phone,
    );
    if (existingPhone) {
      throw new HttpException('Teléfono ya registrado', HttpStatus.BAD_REQUEST);
    }
    if (!owner) {
      owner = await this.clientService.create(createCarDto.owner);
    }

    const jobsWithTimestamps =
      createCarDto.jobs?.map((job) => ({
        ...job,
        id: v4(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })) || [];

    const newCar = this.carsRepository.create({
      ...createCarDto,
      jobs: jobsWithTimestamps,
      owner,
    });

    const savedCar = await this.carsRepository.save(newCar);
    const { owner: carOwner, ...carData } = savedCar;
    const { cars, ...cleanOwner } = carOwner;
    return {
      ...carData,
      owner: cleanOwner,
    };
  }

  async findAll() {
    return await this.carsRepository.find({
      relations: ['owner'],
    });
  }

  async findByLicensePlate(licensePlate: CreateCarDto['licensePlate']) {
    const car = await this.carsRepository.findOne({
      where: {
        licensePlate: licensePlate,
      },
      relations: ['owner'],
    });
    if (!car) {
      throw new HttpException('Auto no registrado', HttpStatus.NOT_FOUND);
    }

    return car;
  }

  async update(id: string, updateCarDto: UpdateCarDto) {
    const { jobs, owner, kilometers } = updateCarDto;
    const car = await this.carsRepository.findOne({
      where: {
        id: id,
      },
      relations: ['owner'],
    });

    if (!car) {
      throw new NotFoundException('Automóvil no encontrado');
    }

    if (owner && (owner !== car.owner || !car.owner)) {
      const findOwner = await this.clientService.findOne(owner.fullname);
      if (!findOwner) {
        const newOwner = await this.clientService.create(owner);
        car.owner = newOwner;
      }
    }

    if (owner && owner.fullname === car.owner.fullname) {
      const updatedOwner = await this.clientService.update(owner);
      car.owner = updatedOwner;
    }

    if (typeof kilometers === 'number') {
      if (kilometers < car.kilometers) {
        throw new HttpException(
          'No se pueden bajar los kilómetros originales al automóvil',
          HttpStatus.BAD_REQUEST,
        );
      }
      car.kilometers = kilometers;
    }

    if (jobs) {
      const jobsWithTimestamps = jobs.map((job) => ({
        ...job,
        id: v4(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
      if (car.jobs) {
        car.jobs = [...car.jobs, ...jobsWithTimestamps];
      } else {
        car.jobs = jobsWithTimestamps;
      }
    }
    return await this.carsRepository.save(car);
  }

  async delete(licence: CreateCarDto['licensePlate']) {
    const carToDelete = await this.carsRepository.findOne({
      where: {
        licensePlate: licence,
      },
      relations: ['owner'],
    });

    if (!carToDelete) {
      throw new NotFoundException('Patente no registrada');
    }

    const owner = carToDelete.owner;

    await this.carsRepository.remove(carToDelete);

    const remainingCars = await this.carsRepository.find({
      where: { owner: { id: owner.id } },
    });

    if (remainingCars.length === 0) {
      await this.clientService.remove(owner.id);
    }

    return { message: 'Automóvil eliminado exitosamente' };
  }

  async findJobs() {
    const cars = await this.carsRepository.find();
    const response = cars
      .filter((car) => Array.isArray(car.jobs) && car.jobs.length > 0)
      .map((car) => {
        return {
          licencePlate: car.licensePlate,
          jobs: car.jobs,
        };
      });
    return response;
  }

  async updateJobInCar(
    licence: CreateCarDto['licensePlate'],
    jobId: string,
    updateJobDto: UpdateJobDto,
  ) {
    const car = await this.carsRepository.findOne({
      where: {
        licensePlate: licence,
      },
    });
    if (!car) {
      throw new NotFoundException('Automóvil no registrado');
    }
    console.log('Antes de modificar: ', car);
    if (car.jobs) {
      const jobIndex = car.jobs.findIndex((job) => job.id === jobId);
      console.log('Indice: ', jobIndex);
      if (jobIndex === undefined || jobIndex === -1) {
        throw new NotFoundException(
          `El automóvil registrado con patente ${licence} no tiene registrado el trabajo que intenta modificar`,
        );
      }
      car.jobs[jobIndex] = {
        ...car.jobs[jobIndex],
        ...updateJobDto,
        updatedAt: new Date(),
      };
    }

    const savedCar = await this.carsRepository.save(car);
    const { owner, ...rest } = savedCar;
    console.log('Después de modificar: ', car);
    return builderResponse(rest, 'Trabajo actualizado exitosamente');
  }
}
