import bodyParser from "body-parser";
import express, { Request } from "express";
import http from 'http';
import { ConnectionOptions, createConnection } from "typeorm";
import * as dotenv from 'dotenv';
import { GetUserParams, UserHandler } from "./handlers/UserHandler";
import { User } from "./models/User";

dotenv.config();

export const initServer = async () => {
    const connectionOptions: ConnectionOptions = {
        type: 'postgres',
        host: process.env.POSTGRES_HOST || 'localhost',
        port: parseInt(process.env.POSTGRES_PORT || '5432'),
        username: process.env.POSTGRES_USER || 'postgres',
        password: process.env.POSTGRES_PASSWORD || 'postgres',
        database: 'postgres',
        entities: [
            User
        ]
    }

    const connection = await createConnection(connectionOptions);
    
    const app = express();

    const server = http.createServer(app);
    const jsonParser = bodyParser.json();
    app.use(jsonParser);

    const PORT = process.env.PORT;

    if (PORT){
        app.listen(parseInt(PORT) || 9876, '0.0.0.0', 0, () => {
            console.log(`Server started on port: (${process.env.PORT || 9876})`);
        });
        app.post('/user', (req,res) => UserHandler.handleCreateUser(req, res));
        app.get('/user', (req: Request<{}, {}, {}, GetUserParams>,res) => UserHandler.handleGetUser(req, res));
    }
}