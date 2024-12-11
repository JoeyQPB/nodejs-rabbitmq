import { Router } from "express";
import CandleController from "../controllers/CandleController";

export const candleRouter = Router();
const candleCtrl = new CandleController();

candleRouter.get('/:quantaty', async (req, res) => {
    const quantaty = parseInt(req.params.quantaty);
    const candles = await candleCtrl.findLastCandles(quantaty);
    res.json(candles);
})