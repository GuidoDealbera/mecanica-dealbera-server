import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataBaseConfigModule } from './Config/Database/config.module';
import { CarsModule } from './Modules/cars/cars.module';
import { ClientsModule } from './Modules/clients/clients.module';
import GlobalConfig from './Database/global-config.entity';
import { ResponseInterceptor } from './Interceptors/response.interceptor';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 500,
        limit: 5,
      },
      {
        name: 'medium',
        ttl: 5000,
        limit: 15
      },
      {
        name: 'long',
        ttl: 30000,
        limit: 30
      }
    ]),
    TypeOrmModule.forFeature([GlobalConfig]),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    DataBaseConfigModule,
    CarsModule,
    ClientsModule,
  ],
  controllers: [],
  providers: [ResponseInterceptor],
})
export class AppModule {}
