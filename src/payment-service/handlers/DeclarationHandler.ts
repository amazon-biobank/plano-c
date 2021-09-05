import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { DeclarationCreationArgs, DeclarationDTO } from "../data/DeclarationDTO";
import { ErrorMessage } from "../data/ErrorMessage";
import { SignedRequest } from "../data/SignedDTO";
import { Declaration } from "../models/Declaration";
import { User } from "../models/User";
import { validateInRequest } from "../utils/validateSignature";


export type GetDeclarationParams = {
    id: string
}

export class DeclarationHandler {
    public static handleCreateDeclaration = async (
            req: Request,
            res: Response
        ) => {
        const signedRequest: SignedRequest<DeclarationCreationArgs> = req.body
        if (validateInRequest(signedRequest, res)){
            try{
                const declarationCreationArgs: DeclarationCreationArgs = req.body;
                const fingerprint = declarationCreationArgs.fingerprint;
                
                const user = await User.findOne(fingerprint);
    
                if (user && user?.balance < declarationCreationArgs.value_to_freeze)
                    throw Error()
                
                const declaration = new Declaration();
                
                declaration.availableFunds = declarationCreationArgs.value_to_freeze;
                declaration.valueFrozen = declarationCreationArgs.value_to_freeze;
                declaration.id = uuidv4();
                declaration.magneticLink = declarationCreationArgs.magnetic_link;
                declaration.payerFingerprint = fingerprint;
    
                const now = new Date();
                const expirationDate = new Date();
                expirationDate.setDate(now.getDate() + 7);
    
                declaration.expirationDate = expirationDate
        
                await declaration.save();
    
                const responseJson = JSON.stringify(DeclarationDTO.declarationToJson(declaration));
                res.status(200).send(responseJson);
    
                if (user){
                    user.balance -= declarationCreationArgs.value_to_freeze;
                    user.save();
                }
            }
            catch (e){
                console.log(e)
                const errorMessage: ErrorMessage = {
                    message: "Error in creating declaration"
                }
                res.status(500).send(errorMessage)
            }
        }
    }
    
    public static handleGetDeclaration = async (
            req: Request<{}, {}, {}, GetDeclarationParams>,
            res: Response
        ) => {
        const params = req.query;
        const declaration = await Declaration.findOne(params.id);
        if (declaration){
            const responseJson = JSON.stringify(DeclarationDTO.declarationToJson(declaration));
            res.status(200).send(responseJson);
        }
        else{
            const errorMessage: ErrorMessage = {
                message: "No declaration found"
            }
            res.status(404).send(errorMessage)
        }
    }
}