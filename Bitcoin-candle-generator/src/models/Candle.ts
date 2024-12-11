import CandleColor from "../enums/CandleColor"
import MessageObject from "./MessageObject"

export default class Candle {
    low: Number
    high: Number
    open: Number
    close: Number
    color: CandleColor
    initialDateTime: Date
    finalDateTime: Date
    values: Number[]
    currency: string

    constructor(currency: string, initialDateTime: Date) {
        this.currency = currency;
        this.initialDateTime = initialDateTime;
        this.low = 0;
        this.high = 0;
        this.close = 0;
        this.open = 0;
        this.values = [];
        this.color = CandleColor.UNDETERMINED;
    }

    addValue(value: Number) {
        this.values.push(value);

        if (this.values.length == 1) {
            this.open = value;
            this.high = value;
            this.low = value;
        }

        if (this.low > value) this.low = value;
        if (this.high < value) this.high = value;
    }

    closeCandle() {
        if (this.values.length > 0) {
            this.close = this.values[this.values.length - 1];
        }

        this.finalDateTime = new Date();

        if (this.open > this.close) this.color = CandleColor.RED;
        else if (this.open < this.close) this.color = CandleColor.GREEN;
        else this.color = CandleColor.UNDETERMINED;
    }

    toMessageObject(): MessageObject {
        const { values, ...obj } = this
        return obj;
    }
}