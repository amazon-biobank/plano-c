import crypto from 'crypto';
import { SHA256 } from 'crypto-js';
import { CommitmentMessage } from '../data/RedeemDTO';

const ALGORITHM = "SHA256";
const SIGNATURE_ALGORITHM = "ECDSA";
const HASHING_ALG_NAME = "SHA-256";
const SIGNATURE_FORMAT = "hex";

export const validateSignature = (jsonHash: string, certificate: string, signature: string): boolean => {
    const verify = crypto.createVerify(ALGORITHM);
    const buffer = Buffer.from(jsonHash);
    
    verify.update(buffer)
    
    const verification = verify.verify(certificate, signature, SIGNATURE_FORMAT);

    return verification;
}
