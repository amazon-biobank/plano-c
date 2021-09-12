import bodyParser from "body-parser";
import express, { Request } from "express";
import http from 'http';
import { ConnectionOptions, createConnection } from "typeorm";
import * as dotenv from 'dotenv';
import { GetUserParams, UserHandler } from "./handlers/UserHandler";
import { User } from "./models/User";
import { DeclarationHandler } from "./handlers/DeclarationHandler";
import { Declaration } from "./models/Declaration";
import { BlockPriceHandler } from "./handlers/BlockPriceHandler";
import { RedeemHandler } from "./handlers/RedeemHandler";
import { Redeem } from "./models/Redeem";

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
            User,
            Declaration,
            Redeem
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
        app.post('/user', (req,res) => UserHandler.handleCreateUser(req, res).catch(
            err => res.status(500).send(err.message)
        ));
        app.get('/user', (req: Request<{}, {}, {}, GetUserParams>,res) => UserHandler.handleGetUser(req, res).catch(
            err => res.status(404).send(err.message)
        ));

        app.post('/declaration', (req,res) => DeclarationHandler.handleCreateDeclaration(req, res).catch(
            err => res.status(400).send(err.message)
        ));
        app.get('/declaration', (req: Request<{}, {}, {}, GetUserParams>,res) => DeclarationHandler.handleGetDeclaration(req, res).catch(
            err => res.status(404).send(err.message)
        ));
    
        app.get('/block-price', (req,res) => BlockPriceHandler.handleGetBlockPrice(res));

        app.post('/redeem', (req,res) => RedeemHandler.handleRedeem(req, res).catch(
            err => res.status(400).send(err.message)
        ))
    }
}