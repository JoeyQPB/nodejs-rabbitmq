import { Candle, CandleModel } from "../models/CandleModel";

export default class CandleController {

    async save(candle: Candle): Promise<Candle> {
        return await CandleModel.create(candle);
    }

    async findLastCandles(quantity: number): Promise<Candle[]> {
        return await CandleModel
                            .find()
                            .sort({_id: -1})
                            .limit(quantity > 0 ? quantity : 10);
    }
}