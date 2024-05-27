import { fetchAds } from "../services/ads.service";
import { Request, Response } from "express";

export const getAds = async ( req: Request, res: Response) => {
    try{
        const { query } = req.query || "electronics";
        //@ts-ignore
        const ads = await fetchAds(query);
        return res.status(ads.statusCode).json({
            message: ads.message,
            data: ads.data
        });
    }catch(err: any){
        return res.status(500).json({
            message: err.message
        })
    }
}
