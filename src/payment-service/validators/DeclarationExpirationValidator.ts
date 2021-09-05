import { ExpiredDeclarationException, NotExpiredDeclarationException } from '../errors/CustomExceptions';
import { ContentGetter } from '../utils/ContentGetter';

export class DeclarationExpirationValidator {
    public static validate = async (declarationId: string) => {
        const declaration = await ContentGetter.getDeclaration(declarationId);
        if (new Date() > new Date(declaration.expirationDate))
            throw new ExpiredDeclarationException();
    }
}

export class DeclarationNotExpiredValidator {
    public static validate = async (declarationId: string) => {
        const declaration = await ContentGetter.getDeclaration(declarationId);
        if (new Date() <= new Date(declaration.expirationDate))
            throw new NotExpiredDeclarationException();
    }
}