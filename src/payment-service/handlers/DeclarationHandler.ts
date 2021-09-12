import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { DeclarationCreationArgs, DeclarationDTO } from "../data/DeclarationDTO";
import { SignedRequest } from "../data/SignedDTO";
import { Declaration } from "../models/Declaration";
import { ContentGetter } from "../utils/ContentGetter";
import { SignedRequestValidator } from "../validators/SignedRequestValidator";
import { UserHaveFundsValidator } from "../validators/UserHaveFundsValidator";


export type GetDeclarationParams = {
    id: string
}

export class DeclarationHandler {
    public static handleCreateDeclaration = async (
            req: Request,
            res: Response
        ) => {
        const signedRequest: SignedRequest<DeclarationCreationArgs> = req.body
        const declarationCreationArgs = signedRequest.content
        SignedRequestValidator.validate(signedRequest);
        UserHaveFundsValidator.validate(signedRequest.fingerprint, signedRequest.content.value_to_freeze)
    
        const user = await ContentGetter.getUser(signedRequest.fingerprint);
                
        const declaration = new Declaration();
                
        declaration.availableFunds = declarationCreationArgs.value_to_freeze;
        declaration.valueFrozen = declarationCreationArgs.value_to_freeze;
        declaration.id = uuidv4();
        declaration.magneticLink = declarationCreationArgs.magnetic_link;
        declaration.payerFingerprint = signedRequest.fingerprint;

        const now = new Date();
        const expirationDate = new Date();
        expirationDate.setDate(now.getDate() + 7);

        declaration.expirationDate = expirationDate
        
        user.balance -= declarationCreationArgs.value_to_freeze;
        
        await declaration.save();

        const responseJson = JSON.stringify(DeclarationDTO.declarationToJson(declaration));
        
        await user.save();

        res.status(200).send(responseJson);
    }
    
    public static handleGetDeclaration = async (
            req: Request<{}, {}, {}, GetDeclarationParams>,
            res: Response
        ) => {
        const params = req.query;
        const declaration = await ContentGetter.getDeclaration(params.id);
        const responseJson = JSON.stringify(DeclarationDTO.declarationToJson(declaration));
        res.status(200).send(responseJson);
    }
}