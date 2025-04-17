import { HttpStatus } from "@nestjs/common";

export enum CarsBrands {
  Coradir = 'Coradir',
  SeroElectric = 'Sero Electric',
  VoltMotors = 'Volt Motors',
  Chevrolet = 'Chevrolet',
  Fiat = 'Fiat',
  Ford = 'Ford',
  Honda = 'Honda',
  Hyundai = 'Hyundai',
  Jeep = 'Jeep',
  Kia = 'Kia',
  Nissan = 'Nissan',
  Peugeot = 'Peugeot',
  Renault = 'Renault',
  Toyota = 'Toyota',
  Volkswagen = 'Volkswagen',
  Citroen = 'Citroën',
  DS = 'DS Automobiles',
  BMW = 'BMW',
  MercedesBenz = 'Mercedes-Benz',
  Audi = 'Audi',
  Mitsubishi = 'Mitsubishi',
  Suzuki = 'Suzuki',
  Chery = 'Chery',
  Geely = 'Geely',
  JAC = 'JAC Motors',
  Baic = 'BAIC',
  BYD = 'BYD',
  GreatWall = 'Great Wall',
  Lifan = 'Lifan',
  MG = 'MG',
  Foton = 'Foton',
  RAM = 'RAM',
  LandRover = 'Land Rover',
  Subaru = 'Subaru',
  AlfaRomeo = 'Alfa Romeo',
  Mini = 'MINI',
  Porsche = 'Porsche',
  Lexus = 'Lexus',
  Volvo = 'Volvo',
  Dongfeng = 'Dongfeng',
  FAW = 'FAW',
  Haval = 'Haval',
  Changan = 'Changan',
  Tata = 'Tata',
  Mahindra = 'Mahindra',
  Isuzu = 'Isuzu',
  Iveco = 'Iveco',
  Scania = 'Scania',
  MAN = 'MAN',
  DAF = 'DAF',
  Kamaz = 'Kamaz',
}

export enum JobStatus {
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
  DELIVERED = 'delivered'
}

export interface Jobs {
  id: string;
  price: number;
  status: JobStatus;
  description: string;
  isThirdParty: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export const example_job: Jobs[] = [{
  id: "f33fdc9a-40cf-4a34-bec8-95d38c7e1cd5",
  price: 15000,
  status: JobStatus.DELIVERED,
  description: "Service Completo",
  isThirdParty: false,
  createdAt: new Date(2025,4,10),
  updatedAt: new Date()
}]

export const example = {
  id: "f33fdc9a-40cf-4a34-bec8-95d38c7e1cd5",
  licensePlate: "ABC123",
  model: "POLO 1.6 MSI",
  brand: "VOLKSWAGEN",
  year: 2020,
  jobs: [],
  kilometers: 150000,
  createdAt: "2024-04-15T14:32:10.000Z",
  updatedAt: "2024-04-15T14:32:10.000Z",
  owner: {
    id: "c8e2f7e6-4ec0-4b56-a6fa-222f3e2551ff",
    fullname: "Juan Pérez",
    phone: "+5493511234567",
    address: "Calle Falsa 123",
    city: "Villa María",
    email: "juan@example.com"
  }
};

export interface ResponseApi {
  statusCode: HttpStatus,
  message: string;
  result: any;
}

export const builderResponse = (result: any, message: string, statusCode = HttpStatus.OK): ResponseApi => ({
  statusCode,
  message,
  result
}) 