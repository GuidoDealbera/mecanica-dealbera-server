import { Module } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CarsController } from './cars.controller';
import { ClientsModule } from '../clients/clients.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car } from 'src/Database/cars.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Car]), ClientsModule],
  controllers: [CarsController],
  providers: [CarsService],
})
export class CarsModule {}
