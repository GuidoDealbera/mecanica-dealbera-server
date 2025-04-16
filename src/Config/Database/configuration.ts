import { registerAs } from "@nestjs/config";
import { Car } from "src/Database/cars.entity";
import { Client } from "src/Database/clients.entity";
const { DB_TYPE, DB_HOST, DB_SCHEMA, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env

export default registerAs('database', () => ({
    type: DB_TYPE,
    host: DB_HOST,
    schema: DB_SCHEMA,
    port: DB_PORT,
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    entities: [Car, Client],
    synchronize: true,
    logging: false,
    dropSchema: true
}))