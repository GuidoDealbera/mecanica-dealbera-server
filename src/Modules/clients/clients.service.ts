import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { CreateCarDto } from '../cars/dto/create-car.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from 'src/Database/clients.entity';

@Injectable()
export class ClientsService {
  @InjectRepository(Client)
  private readonly clientRepository: Repository<Client>;

  async create(createClientDto: CreateClientDto) {
    const owner = await this.findOne(createClientDto.fullname);
    if (owner) {
      throw new HttpException('El cliente ya está registrado', HttpStatus.BAD_REQUEST)
    }
    const newOwner = this.clientRepository.create(createClientDto)
    return await this.clientRepository.save(newOwner)
  }

  findAll() {
    return `This action returns all clients`;
  }

  async findOne(fullname: CreateClientDto['fullname']) {
    const owner = await this.clientRepository.findOne({
      where: { fullname },
      relations: ['cars'],
    });
    if (!owner) return null;
    return owner;
  }

  update(id: number, updateClientDto: UpdateClientDto) {
    return `This action updates a #${id} client`;
  }

  remove(id: number) {
    return `This action removes a #${id} client`;
  }
}
