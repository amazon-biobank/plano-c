import { Request, Response } from "express";
import { SignedRequest } from "../data/SignedDTO";
import { UserCreationArgs, UserDTO } from "../data/UserDTO";
import { User } from "../models/User";
import { ContentGetter } from "../utils/ContentGetter";
import { getAddress } from "../utils/userAddress";
import { UnauthorizedRequestValidator } from "../validators/UnauthorizedRequestValidator";
import { UserAlreadyExistsValidator } from "../validators/UserAlreadyExistsValidator";


export type GetUserParams = {
    id: string
}

export class UserHandler {
    public static handleCreateUser = async (
            req: Request,
            res: Response
        ) => {
        const signedRequest: SignedRequest<UserCreationArgs> = req.body
        const userCreationArgs: UserCreationArgs = signedRequest.content;
        // await UnauthorizedRequestValidator.validate(signedRequest);
        await UserAlreadyExistsValidator.validate(userCreationArgs)

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
    
    public static handleGetUser = async (
            req: Request<{}, {}, {}, GetUserParams>,
            res: Response
        ) => {
        const params = req.query;
        const user = await ContentGetter.getUser(params.id);
        const responseJson = JSON.stringify(UserDTO.userToJson(user));
        res.status(200).send(responseJson);
    }
}