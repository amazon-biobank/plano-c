import { Request, Response } from "express";
import { ErrorMessage } from "../data/ErrorMessage";
import { UserCreationArgs, UserDTO } from "../data/UserDTO";
import { User } from "../models/User";
import { ContentGetter } from "../utils/ContentGetter";
import { getAddress } from "../utils/userAddress";


export type GetUserParams = {
    id: string
}

export class UserHandler {
    public static handleCreateUser = async (
            req: Request,
            res: Response
        ) => {
        try{
            const userCreationArgs: UserCreationArgs = req.body;
            const fingerprint = getAddress(userCreationArgs.public_key);
            const user = new User();
            
            user.balance = 500;
            user.id = fingerprint;
            user.publicKey = userCreationArgs.public_key;
            user.username = userCreationArgs.name;
    
            await user.save();

            const responseJson = JSON.stringify(UserDTO.userToJson(user));
            res.status(200).send(responseJson);
        }
        catch (e){
            console.log(e)
            const errorMessage: ErrorMessage = {
                message: "Error in creating account"
            }
            res.status(500).send(errorMessage)
        }
    }
    
    public static handleGetUser = async (
            req: Request<{}, {}, {}, GetUserParams>,
            res: Response
        ) => {
        const params = req.query;
        try{
            const user = await ContentGetter.getUser(params.id);
            const responseJson = JSON.stringify(UserDTO.userToJson(user));
            res.status(200).send(responseJson);
        }
        catch(e){
            res.status(404).send(e.message)
        }
    }
}