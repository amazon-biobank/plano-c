import { SHA256 } from 'crypto-js';
import { SignedRequest } from "../data/SignedDTO";
import { InvalidRequestSignatureException } from '../errors/CustomExceptions';
import { ContentGetter } from '../utils/ContentGetter';
import { validateSignature } from "../utils/validateSignature";

export class SignedRequestValidator {
    public static validate = async (signedRequest: SignedRequest<any>) => {
        const user = await ContentGetter.getUser(signedRequest.fingerprint);
        const requestString = JSON.stringify(signedRequest.content);
        const requestHash = SHA256(requestString).toString();
        if (!validateSignature(requestHash, user.publicKey, signedRequest.signature))
            throw new InvalidRequestSignatureException();
    }
}