import { Request, Response } from "express";
import { BLOCK_PRICE } from "../../config";
import { CommitmentContent, RedeemArguments } from "../data/RedeemDTO";
import { SignedRequest } from "../data/SignedDTO";
import { ContentGetter } from '../utils/ContentGetter';
import { RedeemRequestValidator } from '../validators/RedeemRequestValidator';
import { SignedRequestValidator } from '../validators/SignedRequestValidator';
import { ValidCommitmentValidator } from '../validators/ValidCommitmentValidator';


export type GetRedeemParams = {
    id: string
}

export class RedeemHandler {
    public static handleRedeem = async (
            req: Request,
            res: Response
        ) => {
        const signedRequest: SignedRequest<RedeemArguments> = req.body
        try{
            SignedRequestValidator.validate(signedRequest);
            ValidCommitmentValidator.validate(signedRequest.content.commitment)
            RedeemRequestValidator.validate(signedRequest.content)
            
            const commitmentData: CommitmentContent = signedRequest.content.commitment.data;
            const redeem = await ContentGetter.getRedeem(commitmentData.receiver_address, commitmentData.payment_intention_id);
            const redeemingValue = BLOCK_PRICE * (signedRequest.content.hashLinkIndex - redeem.lastHashIndex);

            redeem.lastHash = signedRequest.content.hashLink;
            redeem.lastHashIndex = signedRequest.content.hashLinkIndex;
            

            const redeemer = await ContentGetter.getUser(commitmentData.receiver_address);
            redeemer.balance += redeemingValue;
            

            const declaration = await ContentGetter.getDeclaration(commitmentData.payment_intention_id)
            declaration.availableFunds -= redeemingValue;
            await redeemer.save();
            await redeem.save();
            await declaration.save();
            res.status(200).send();
        }
        catch (e) {
            res.status(400).send(e.message);
        }
    }
}