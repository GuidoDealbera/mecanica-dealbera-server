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
    if (!owner) {
      owner = await this.clientService.create(createCarDto.owner);
    }

    const newCar = this.carsRepository.create({
      ...createCarDto,
      owner,
    });

    return await this.carsRepository.save(newCar);
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
      const newOwner = await this.clientService.create(owner);
      car.owner = newOwner;
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
}
