import sha256 from 'crypto-js/sha256';
import { SignedRequest } from "../data/SignedDTO";
import { InexistentUserException, UnauthorizedRequestException } from "../errors/CustomExceptions";
import { User } from "../models/User";
import { validateSignature } from "../utils/validateSignature";

export class UnauthorizedRequestValidator {
    public static validate = async (signedRequest: SignedRequest<any>) => {
        const admin = await User.findOne({
            where: {
                name: 'admin'
            }
        });
        if (admin){
            const requestString = JSON.stringify(signedRequest.content);
            const requestHash = sha256(requestString).toString();
            if (!validateSignature(requestHash, admin.publicKey, signedRequest.signature))
                throw new UnauthorizedRequestException();
        }
        else {
            throw new InexistentUserException();
        }
    }
}