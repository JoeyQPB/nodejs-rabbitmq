import { config } from 'dotenv';
import axios from 'axios';
import Period from './enums/Period';
import Candle from './models/Candle';
import { createMessageChannel } from './messages/MessageChannel';

config();

const readMarketPrice = async(): Promise<Number> => {
    const data = await axios.get(process.env.PRICES_API)
                            .then((result) => {return result.data})
                            .catch((error) => {
                                console.log({error: error.message})
                                return {bitcoin: {usd: 100000}};
                            });

    const price = data.bitcoin.usd;
    return price;
};

const generateCandles = async () => {

    const messageChannel = await createMessageChannel();

    if (messageChannel) {
        while (true ) {
            const loopTimes = Period.ONE_MINUTE / Period.TEN_SECONDS;
            const candle = new Candle('BTC', new Date());

            console.log("\n\n");
            console.log("======== GENERATING NEW CANDLE ========");

            for (let i = 0; i < loopTimes; i++) {
                const price = await readMarketPrice();
                candle.addValue(price);
                console.log(`Market Price #${i+1} of ${loopTimes}`);

                await new Promise(r => setTimeout(r, Period.TEN_SECONDS));
            }

            candle.closeCandle();
            const candleObj = candle.toMessageObject();
            const candleObjJSON = JSON.stringify(candleObj);
            messageChannel.sendToQueue(process.env.QUEUE_NAME, Buffer.from(candleObjJSON));
            console.log('[>] Candle Enqueued!')
        }
    } 
}

generateCandles();