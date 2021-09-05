import sha256 from 'crypto-js/sha256';
import { v4 as uuidv4 } from "uuid";
import { RedeemArguments } from '../data/RedeemDTO';
import { InexistentRedeemException, InvalidRedeemException } from '../errors/CustomExceptions';
import { Redeem } from '../models/Redeem';
import { ContentGetter } from '../utils/ContentGetter';

export class RedeemRequestValidator {
    public static validate = async (redeemArgs: RedeemArguments) => {
        const user = await ContentGetter.getUser(redeemArgs.commitment.data.receiver_address);
        const declaration = await ContentGetter.getDeclaration(redeemArgs.commitment.data.payment_intention_id);
        var redeem: Redeem;
        try {
            redeem = await ContentGetter.getRedeem(
                redeemArgs.commitment.data.payer_address,
                redeemArgs.commitment.data.payment_intention_id
            )
        }
        catch (e){
            if (e instanceof InexistentRedeemException) {
                const newRedeem = new Redeem();
            
                newRedeem.id = uuidv4();
                newRedeem.lastHash = redeemArgs.commitment.data.hash_root;
                newRedeem.lastHashIndex = 0;
                newRedeem.redeemer = redeemArgs.commitment.data.receiver_address;
                newRedeem.declarationId = redeemArgs.commitment.data.payment_intention_id;

                await newRedeem.save();
            }
        } finally{
            redeem = await ContentGetter.getRedeem(
                redeemArgs.commitment.data.payer_address,
                redeemArgs.commitment.data.payment_intention_id
            )
            const isValidRedeem = RedeemRequestValidator.verifyPayment(
                redeemArgs.hashLink,
                redeemArgs.hashLinkIndex,
                redeem.lastHash,
                redeem.lastHashIndex)
            
            if (!isValidRedeem){
                throw new InvalidRedeemException();
            }
        }

    }

    public static verifyPayment = (hashLink: string, hashLinkIndex: number, lastHash: string, lastHashIndex: number) => {
        var newHash = lastHash;
        for (let index = 0; index < hashLinkIndex - lastHashIndex; index++) {
            newHash = sha256(newHash).toString();
        }
        if (newHash === hashLink) {
            return true;
        }
        else {
            return false;
        }
    
    }
}

