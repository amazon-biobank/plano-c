import { Request, Response } from "express";
import { ErrorMessage } from "../data/ErrorMessage";
import { v4 as uuidv4 } from "uuid";
import { RedeemArguments } from "../data/RedeemDTO";
import sha256 from 'crypto-js/sha256'
import { Redeem } from "../models/Redeem";
import { User } from "../models/User";
import { BLOCK_PRICE } from "../../config";
import { Declaration } from "../models/Declaration";
import { SignedRequest } from "../data/SignedDTO";
import { validateCommitment, validateInRequest, validateSignature } from "../utils/validateSignature";


export type GetRedeemParams = {
    id: string
}

export class RedeemHandler {
    public static handleRedeem = async (
            req: Request,
            res: Response
        ) => {
        const signedRequest: SignedRequest<RedeemArguments> = req.body
        if (validateInRequest(signedRequest, res)){
            try{
                const redeemArgs: RedeemArguments = signedRequest.content;
                const hashLink = redeemArgs.hashLink;
                const hashLinkIndex = redeemArgs.hashLinkIndex;
                const existentRedeem = await Redeem.findOne({
                    where: {
                        redeemer: redeemArgs.commitment.data.receiver_address,
                        declarationId: redeemArgs.commitment.data.payment_intention_id
                    }
                })
                if (existentRedeem){
                    if (RedeemHandler.verifyPayment(hashLink, hashLinkIndex, existentRedeem.lastHash, existentRedeem.lastHashIndex)){
                        existentRedeem.lastHash = hashLink;
                        existentRedeem.lastHashIndex = hashLinkIndex;
    
                        const redeemer = await User.findOne(redeemArgs.commitment.data.receiver_address);
                        const downloadIntention = await Declaration.findOne(redeemArgs.commitment.data.payment_intention_id);
                        const payer = await User.findOne(redeemArgs.commitment.data.payer_address)
                        if (payer){
                            if (!validateCommitment(redeemArgs.commitment, payer?.publicKey)){
                                const errorMessage: ErrorMessage = {
                                    message: "Invalid Commitment"
                                }
                                res.status(400).send(errorMessage)
                                return
                            }
                        }
                        else{
                            const errorMessage: ErrorMessage = {
                                message: "Payer doesn't exist"
                            }
                            res.status(400).send(errorMessage)
                            return
                        }
                        
                        if (redeemer && downloadIntention){
                            existentRedeem.save();
                            redeemer.balance += BLOCK_PRICE * (hashLinkIndex - existentRedeem.lastHashIndex);
                            redeemer.save();
                            downloadIntention.availableFunds -= BLOCK_PRICE * (hashLinkIndex - existentRedeem.lastHashIndex);
                            await downloadIntention.save();
                            res.status(200).send();
                        }
                        else {
                            const errorMessage: ErrorMessage = {
                                message: "Error in creating Redeem"
                            }
                            res.status(400).send(errorMessage)
                        }
                    }
                    else {
                        const errorMessage: ErrorMessage = {
                            message: "Invalid payment"
                        }
                        res.status(400).send(errorMessage)
                    }
                }
                else {
                    if (RedeemHandler.verifyPayment(
                        hashLink,
                        hashLinkIndex,
                        redeemArgs.commitment.data.hash_root,
                        0)){
                            const newRedeem = new Redeem();
            
                            newRedeem.id = uuidv4();
                            newRedeem.lastHash = hashLink;
                            newRedeem.lastHashIndex = hashLinkIndex;
                            newRedeem.redeemer = redeemArgs.commitment.data.receiver_address;
                            newRedeem.declarationId = redeemArgs.commitment.data.payment_intention_id;
    
                            const redeemer = await User.findOne(redeemArgs.commitment.data.receiver_address);
                            const downloadIntention = await Declaration.findOne(redeemArgs.commitment.data.payment_intention_id);
                            if (redeemer && downloadIntention){
                                newRedeem.save();
                                redeemer.balance += BLOCK_PRICE * hashLinkIndex;
                                redeemer.save();
                                downloadIntention.availableFunds -= BLOCK_PRICE * hashLinkIndex;
                                await downloadIntention.save();
                                res.status(200).send();
                            }
                        }
                    else {
                        const errorMessage: ErrorMessage = {
                            message: "Invalid payment"
                        }
                        res.status(400).send(errorMessage)
                    }
                }
            }
            catch (e){
                console.log(e)
                const errorMessage: ErrorMessage = {
                    message: "Error in creating Redeem"
                }
                res.status(500).send(errorMessage)
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