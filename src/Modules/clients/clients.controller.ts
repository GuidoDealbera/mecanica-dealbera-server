import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { UpdateClientDto } from './dto/update-client.dto';
import { ApiTags } from '@nestjs/swagger';
import { builderResponse, ResponseApi } from 'src/utils';

@ApiTags('Clientes')
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get('/all')
  async findAll() {
    const allClients = await this.clientsService.findAll();
    const response: ResponseApi = {
      statusCode: HttpStatus.OK,
      message: 'Listado de clientes',
      result: allClients,
    };
    return response;
  }

  @Get(':fullname')
  async findOne(@Param('fullname') fullname: string) {
    const client = await this.clientsService.findOne(fullname);
    let response: ResponseApi;
    if (!client) {
      response = {
        statusCode: HttpStatus.NOT_FOUND,
        message: `No existe ningún cliente llamado ${fullname}`,
        result: null,
      };
    } else {
      response = {
        statusCode: HttpStatus.OK,
        message: 'Cliente encontrado exitosamente',
        result: client,
      };
    }

    return response;
  }

  @Patch()
  async update(@Body() updateClientDto: UpdateClientDto) {
    const updateClient = await this.clientsService.update(updateClientDto);
    return builderResponse(
      updateClient,
      'Datos del cliente actualizados exitosamente',
    );
  }
}
