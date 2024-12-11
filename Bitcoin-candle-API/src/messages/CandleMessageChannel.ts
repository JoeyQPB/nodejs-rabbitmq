import { Channel, connect } from "amqplib";
import { config } from "dotenv";
import { Server } from "socket.io";
import * as htpp from 'http'
import CandleController from "../controllers/CandleController";
import { Candle } from "../models/CandleModel";

config();

export default class CandleMessageChannel {

    private _channel: Channel
    private _candleCtrl: CandleController
    private _io: Server

    constructor(server: htpp.Server) {
        this._candleCtrl = new CandleController();
        this._io = new Server(server, {
            cors: {
                origin: process.env.SOCKET_CLIENT_SERVER,
                methods: ["GET", "POST"]
            }
        })
        this._io.on('connection', () => console.log('[:] Web Socket connection created!'));
        this.init();
    }

    async init () {
        await this.createMessageChannel();
        this.consumeMessages();
    }

    private async createMessageChannel() {
        try {
            const connection = await connect(process.env.AMQP_SERVER);
            this._channel = await connection.createChannel();
            this._channel.assertQueue(process.env.QUEUE_NAME);
        } catch (error) {
            console.log('Connectuon to RabbitMQ failed!')
            console.log({message: error.message, error})
        }
    }

    private consumeMessages() {

        // reciving the message
        // ack consuming msg to rabbitmq
        // saving on BD
        // send to socket io
        this._channel.consume(process.env.QUEUE_NAME, async (msg) => {

            const candleObjMsg = JSON.parse(msg.content.toString());
            console.log('[:] Message received!');
            // console.log({candleObjMsg});

            // ack
            this._channel.ack(msg);

            // save on BD
            const candle: Candle = candleObjMsg;
            const candleDB = await this._candleCtrl.save(candle);
            console.log('[:] Candle saved on DB');
            // console.log({candleDB})

            // send to socket io
            this._io.emit(process.env.SOCKET_EVENT_NAME, candleDB);
            console.log('[:] New candle emited by web socket');
        })

        console.log("[>] Candle Consumer Started!")
    }
}

