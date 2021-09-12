import sha256 from 'crypto-js/sha256';
import { v4 as uuidv4 } from "uuid";
import { RedeemArguments } from '../data/RedeemDTO';
import { InexistentRedeemException, InvalidRedeemException } from '../errors/CustomExceptions';
import { Redeem } from '../models/Redeem';
import { ContentGetter } from '../utils/ContentGetter';

export class RedeemRequestValidator {
    public static validate = async (redeemArgs: RedeemArguments) => {
        var redeem: Redeem;
        try {
            redeem = await ContentGetter.getRedeem(
                redeemArgs.commitment.data.payer_address,
                redeemArgs.commitment.data.payment_intention_id
            )
        }
        catch (e){
            const newRedeem = new Redeem();
        
            newRedeem.id = uuidv4();
            newRedeem.lastHash = redeemArgs.commitment.data.hash_root;
            newRedeem.lastHashIndex = 0;
            newRedeem.redeemer = redeemArgs.commitment.data.receiver_address;
            newRedeem.declarationId = redeemArgs.commitment.data.payment_intention_id;

            await newRedeem.save();
        } finally{
            redeem = await ContentGetter.getRedeem(
                redeemArgs.commitment.data.receiver_address,
                redeemArgs.commitment.data.payment_intention_id
            )
            const isValidRedeem = RedeemRequestValidator.verifyPayment(
                redeemArgs.hashLink,
                redeemArgs.hashLinkIndex,
                redeem.lastHash,
                redeem.lastHashIndex)
            
            if (!isValidRedeem){
                console.log(`[ERROR] Invalid Redeem Request`)
                throw new InvalidRedeemException();
            }
        }

    }

    public static verifyPayment = (hashLink: string, hashLinkIndex: number, lastHash: string, lastHashIndex: number) => {
        var newHash = hashLink;
        for (let index = 0; index < hashLinkIndex - lastHashIndex; index++) {
            newHash = sha256(newHash).toString();
        }
        if (newHash === lastHash) {
            return true;
        }
        else {
            return false;
        }
    
    }
}

