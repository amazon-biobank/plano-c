import SHA256 from "crypto-js/sha256";
import { CommitmentMessage } from "../data/RedeemDTO";
import { InvalidCommitmentException } from "../errors/CustomExceptions";
import { ContentGetter } from "../utils/ContentGetter";
import { validateSignature } from "../utils/validateSignature";

export class ValidCommitmentValidator {
    public static validate = async (commitment: CommitmentMessage) => {
        const commitmentContentString = JSON.stringify(commitment.data);
        const user = await ContentGetter.getUser(commitment.data.payer_address);
        if(!validateSignature(commitmentContentString, user.publicKey, commitment.signature)){
            console.log(`[ERROR] Invalid Commitment`)
            throw new InvalidCommitmentException();
        }
    }
}