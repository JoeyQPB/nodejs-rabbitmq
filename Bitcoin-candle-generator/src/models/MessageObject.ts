import CandleColor from "../enums/CandleColor"

export default interface MessageObject {
    low: Number
    high: Number
    open: Number
    close: Number
    color: CandleColor
    initialDateTime: Date
    finalDateTime: Date
    currency: string
}