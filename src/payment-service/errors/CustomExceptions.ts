export class InexistentUserException extends Error {
    public constructor() {
        super("Required user doesn't exist");
    }
}

export class InexistentDeclarationException extends Error {
    public constructor() {
        super("Required declaration doesn't exist");
    }
}

export class InexistentRedeemException extends Error {
    public constructor() {
        super("Required redeem doesn't exist");
    }
}

export class InvalidRequestSignatureException extends Error {
    public constructor() {
        super("Signature in request is invalid");
    }
}

export class InsuficientFundsException extends Error {
    public constructor() {
        super("Insuficient funds for user");
    }
}

export class InvalidCommitmentException extends Error {
    public constructor() {
        super("Commitment is invalid");
    }
}

export class InvalidRedeemException extends Error {
    public constructor() {
        super("Redeem is invalid. Failed on hash assert");
    }
}