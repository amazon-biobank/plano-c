import bodyParser from "body-parser";
import express from "express";
import http from 'http';
import { ConnectionOptions, createConnection } from "typeorm";
import * as dotenv from 'dotenv';

dotenv.config();

export const initServer = async () => {
    const connectionOptions: ConnectionOptions = {
        type: 'postgres',
        host: process.env.POSTGRES_HOST || 'localhost',
        port: parseInt(process.env.POSTGRES_PORT || '5438'),
        username: process.env.POSTGRES_USER || 'postgres',
        password: process.env.POSTGRES_PASSWORD || 'postgres',
        database: 'postgres',
        entities: []
    }

    const connection = await createConnection(connectionOptions);
    
    const app = express();

    const server = http.createServer(app);
    const jsonParser = bodyParser.json();
    app.use(jsonParser);

    server.listen(process.env.PORT || 9876, () => {
        console.log(`Server started on port: (${process.env.PORT || 9876})`);
    });

    
}