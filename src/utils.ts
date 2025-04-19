import { HttpStatus } from "@nestjs/common";

export enum CarsBrands {
  Coradir = 'CORADIR',
  SeroElectric = 'SERO ELECTRIC',
  VoltMotors = 'VOLT MOTORS',
  Chevrolet = 'CHEVROLET',
  Fiat = 'FIAT',
  Ford = 'FORD',
  Honda = 'HONDA',
  Hyundai = 'HYUNDAI',
  Jeep = 'JEEP',
  Kia = 'KIA',
  Nissan = 'NISSAN',
  Peugeot = 'PEUGEOT',
  Renault = 'RENAULT',
  Toyota = 'TOYOTA',
  Volkswagen = 'VOLKSWAGEN',
  Citroen = 'CITROËN',
  DS = 'DS AUTOMOBILES',
  BMW = 'BMW',
  MercedesBenz = 'MERCEDES-BENZ',
  Audi = 'AUDI',
  Mitsubishi = 'MITSUBISHI',
  Suzuki = 'SUZUKI',
  Chery = 'CHERY',
  Geely = 'GEELY',
  JAC = 'JAC MOTORS',
  Baic = 'BAIC',
  BYD = 'BYD',
  GreatWall = 'GREAT WALL',
  Lifan = 'LIFAN',
  MG = 'MG',
  Foton = 'FOTON',
  RAM = 'RAM',
  LandRover = 'LAND ROVER',
  Subaru = 'SUBARU',
  AlfaRomeo = 'ALFA ROMEO',
  Mini = 'MINI',
  Porsche = 'PORSCHE',
  Lexus = 'LEXUS',
  Volvo = 'VOLVO',
  Dongfeng = 'DONGFENG',
  FAW = 'FAW',
  Haval = 'HAVAL',
  Changan = 'CHANGAN',
  Tata = 'TATA',
  Mahindra = 'MAHINDRA',
  Isuzu = 'ISUZU',
  Iveco = 'IVECO',
  Scania = 'SCANIA',
  MAN = 'MAN',
  DAF = 'DAF',
  Kamaz = 'KAMAZ',
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

export const RESPONSE_MESSAGE = 'response_message'