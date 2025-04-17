import { IsInt, Matches, Min } from 'class-validator';
import { CarsBrands, Jobs } from 'src/utils';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Client } from './clients.entity';
import { JobsDto } from 'src/Modules/cars/dto/jobs.dto';

@Entity({ name: 'car', schema: 'public' })
export class Car {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 7, unique: true })
  @Matches(/^([A-Z]{2}\d{3}[A-Z]{2}|[A-Z]{3}\d{3})$/, {
    message: 'La patente debe tener el formato AA123BB o ABC123',
  })
  licensePlate: string;

  @BeforeInsert()
  @BeforeUpdate()
  normalizeLicensePlate() {
    if (this.licensePlate) {
      this.licensePlate = this.licensePlate.toUpperCase().replace(/\s+/g, '');
    }
  }

  @Column('varchar', { unique: true, nullable: false })
  model: string;

  @BeforeInsert()
  @BeforeUpdate()
  normalizeModel() {
    if (this.model) {
      this.model = this.model.toUpperCase().trim();
    }
  }

  @Column('enum', { enum: CarsBrands })
  brand: string;

  @Column('integer', { nullable: false })
  year: number;

  @Column('jsonb', { nullable: true })
  jobs: Jobs[];

  @IsInt({ message: 'Los kilómetros deben ser un número entero' })
  @Min(0, { message: 'Los kilómetros no pueden ser negativos' })
  @Column('integer', { nullable: false })
  kilometers: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => Client, (client) => client.cars, { nullable: false })
  owner: Client;

  constructor(partial: Partial<Car>) {
    Object.assign(this, partial);
  }
}
