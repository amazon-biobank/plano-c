import crypto from 'crypto'
import { Response } from 'express';
import { DeclarationCreationArgs } from '../data/DeclarationDTO';
import { ErrorMessage } from '../data/ErrorMessage';
import { RedeemArguments } from '../data/RedeemDTO';
import { SignedRequest } from '../data/SignedDTO';
import { User } from '../models/User';

const ALGORITHM = "SHA256";
const SIGNATURE_ALGORITHM = "ECDSA";
const HASHING_ALG_NAME = "SHA-256";
const SIGNATURE_FORMAT = "hex";

export const validateSignature = (json: string, certificate: string, signature: string): boolean => {
    const verify = crypto.createVerify(ALGORITHM);
    const buffer = Buffer.from(json);
    
    verify.update(buffer)
    
    const verification = verify.verify(certificate, signature, SIGNATURE_FORMAT);

    return verification;
}

export const validateInRequest = async (signedRequest: SignedRequest<RedeemArguments | DeclarationCreationArgs>, res: Response) => {
    const user = await User.findOne(signedRequest.fingerprint);
    if (user){
        if (!validateSignature(JSON.stringify(signedRequest.content), user?.publicKey, signedRequest.signature)){
            const errorMessage: ErrorMessage = {
                message: "Invalid request"
            }
            res.status(400).send(errorMessage)
            return false
        }
        else{
            return true;
        }
    }
    else {
        const errorMessage: ErrorMessage = {
            message: "Inexistent user"
        }
        res.status(400).send(errorMessage)
        return false
    }
}