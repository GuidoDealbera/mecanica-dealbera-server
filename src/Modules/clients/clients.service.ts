import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from 'src/Database/clients.entity';
import { isUUID } from 'class-validator';

@Injectable()
export class ClientsService {
  @InjectRepository(Client)
  private readonly clientRepository: Repository<Client>;

  async create(createClientDto: CreateClientDto) {
    const owner = await this.findOne(createClientDto.fullname);
    if (owner) {
      throw new BadRequestException('El cliente ya está registrado');
    }
    const newOwner = this.clientRepository.create(createClientDto);
    return await this.clientRepository.save(newOwner);
  }

  async findAll() {
    const allClients = await this.clientRepository.find({
      relations: ['cars'],
    });
    if (allClients.length === 0)
      throw new NotFoundException('No hay clientes registrados');
    return allClients;
  }

  async findOne(fullname: CreateClientDto['fullname']) {
    const owner = await this.clientRepository.findOne({
      where: { fullname },
      relations: ['cars'],
    });
    if (!owner) return null;
    return owner;
  }

  async findByName(fullname: CreateClientDto['fullname']) {
    const owner = await this.clientRepository.findOne({
      where: {
        fullname,
      },
    });
    if (!owner) throw new NotFoundException('Cliente no registrado');
    return owner;
  }

  async findByPhone(phone: CreateClientDto['phone']) {
    const owner = await this.clientRepository.findOne({
      where: {
        phone,
      },
      relations: ['cars'],
    });
    if (!owner) return null;
    return owner;
  }

  async update(updateClientDto: UpdateClientDto) {
    const { fullname, address, city, email, phone } = updateClientDto;
    const updatedClient = await this.clientRepository.findOne({
      where: {
        fullname,
      },
    });
    if (!updatedClient) {
      throw new NotFoundException(
        'El cliente que intenta modificar no está registrado',
      );
    }
    if (address) updatedClient.address = address;
    if (city) updatedClient.city = city;
    if (email) updatedClient.email = email;
    if (phone) updatedClient.phone = phone;

    return await this.clientRepository.save(updatedClient);
  }

  async remove(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('ID de tipo incorrecto');
    }
    const clientToDelete = await this.clientRepository.findOne({
      where: {
        id: id,
      },
      relations: ['cars'],
    });

    if (!clientToDelete) {
      throw new NotFoundException('Cliente no registrado');
    }

    if (clientToDelete.cars.length > 1) {
      throw new ConflictException(
        'No se puede eliminar un cliente con más de un vehículo registrado',
      );
    }

    await this.clientRepository.remove(clientToDelete);

    return { message: 'Cliente eliminado exitosamente' };
  }
}
