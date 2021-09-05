import { InsuficientFundsException } from "../errors/CustomExceptions";
import { ContentGetter } from "../utils/ContentGetter";

export class UserHaveFundsValidator {
    public static validate = async (userFingerprint: string, fundsToCheck: number) => {
        const user = await ContentGetter.getUser(userFingerprint);
        if (user.balance < fundsToCheck)
            throw new InsuficientFundsException();
    }
}