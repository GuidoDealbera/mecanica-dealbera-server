import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  SetMetadata,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { UpdateClientDto } from './dto/update-client.dto';
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RESPONSE_MESSAGE } from 'src/utils';

@ApiTags('Clientes')
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get('/all')
  @SetMetadata(RESPONSE_MESSAGE, 'Listado de clientes')
  async findAll() {
    return await this.clientsService.findAll();
  }

  @Get(':fullname')
  @ApiOkResponse({
    description: 'Cliente por nombre completo',
    example: {
      statusCode: 200,
      message: 'Cliente encontrado',
      result: {
        id: 'f33fdc9a-40cf-4a34-bec8-95d38c7e1cd5',
        fullname: 'Example Fullname',
        phone: '+543116489578',
        address: 'Example Address',
        city: 'Example City',
        email: 'example@email.com',
        cars: []
      }
    }
  })
  @ApiNotFoundResponse({
    description: 'Cliente por nombre completo',
    example: {
      statusCode: 404,
      message: 'Cliente no encontrado',
      result: null
    }
  })
  async findOne(@Param('fullname') fullname: string) {
    return await this.clientsService.findByName(fullname);
  }

  @Patch('update')
  @SetMetadata(RESPONSE_MESSAGE, 'Datos del cliente actualizados exitosamente')
  async update(@Body() updateClientDto: UpdateClientDto) {
    return await this.clientsService.update(updateClientDto);
  }
}
