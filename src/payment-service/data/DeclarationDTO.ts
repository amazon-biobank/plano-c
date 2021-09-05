import { Declaration } from "../models/Declaration";

export type DeclarationType = {
    id: string;
    payer_address: string;
    magnetic_link: string;
    expiration_date: string;
    value_to_freeze: number;
    available_funds: number;
    created_at: Date;
}

export type DeclarationCreationArgs = {
    magnetic_link: string;
    value_to_freeze: number;
    fingerprint: string;
}

export class DeclarationDTO {
    public static declarationToJson = (declaration: Declaration): DeclarationType => {
        const declarationJson: DeclarationType = {
            id: declaration.id,
            payer_address: declaration.payerFingerprint,
            expiration_date: declaration.expirationDate.toString(),
            magnetic_link: declaration.magneticLink,
            value_to_freeze: declaration.valueFrozen,
            available_funds: declaration.availableFunds,
            created_at: declaration.createdAt
        }
        return declarationJson
    }
}