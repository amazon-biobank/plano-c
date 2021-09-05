import { InexistentDeclarationException, InexistentRedeemException, InexistentUserException } from "../errors/CustomExceptions";
import { Declaration } from "../models/Declaration";
import { Redeem } from "../models/Redeem";
import { User } from "../models/User";

export class ContentGetter {
    public static getUser = async (fingerprint: string): Promise<User> => {
        const user = await User.findOne(fingerprint);
        if (user)
            return user;
        else
            throw new InexistentUserException();
    }

    public static getDeclaration = async (id: string): Promise<Declaration> => {
        const declaration = await Declaration.findOne(id);
        if (declaration)
            return declaration;
        else
            throw new InexistentDeclarationException();
    }

    public static getRedeem = async (redeemer: string, declarationId: string): Promise<Redeem> => {
        const redeem = await Redeem.findOne({
            where: {
                redeemer: redeemer,
                declarationId: declarationId
            }
        });
        if (redeem)
            return redeem;
        else
            throw new InexistentRedeemException();
    }
}