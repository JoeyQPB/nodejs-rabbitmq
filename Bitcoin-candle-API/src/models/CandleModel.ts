import {model, Document, Schema} from 'mongoose';

export interface Candle extends Document {
    currency: string
    color: String
    low: Number
    high: Number
    open: Number
    close: Number
    initialDateTime: Date
    finalDateTime: Date
};

const schema = new Schema<Candle> ({
    currency: {type: String, require: true},
    color: {type: String, require: true},
    low: {type: Number, require: true},
    high: {type: Number, require: true},
    open: {type: Number, require: true},
    close: {type: Number, require: true},
    initialDateTime: {type: Date, require: true},
    finalDateTime: {type: Date, require: true}
});

export const CandleModel = model<Candle>('Candle', schema);