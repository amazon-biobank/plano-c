import { Response } from "express";
import { BLOCK_PRICE } from "../../config";


export class BlockPriceHandler {    
    public static handleGetBlockPrice = async (
            res: Response
        ) => {
        const blockPrice = {
            "block_price": BLOCK_PRICE
        }
        res.status(200).send(JSON.stringify(blockPrice));
    }
}