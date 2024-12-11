import { config } from 'dotenv';
import app from './app';
import { dbConnect } from './config/db';
import CandleMessageChannel from './messages/CandleMessageChannel';

const createServer = async () => {
    config();

    const dbConnection = await dbConnect();
    const PORT = process.env.PORT;
    const server = app.listen(PORT, () => {
        console.log(`Server is running on port: ${PORT}`);
    })

    new CandleMessageChannel(server);
    // const candleMsgChannel = 
    // candleMsgChannel.init();

    process.on('SIGINT', async () => {
        await dbConnection.connection.close();
        server.close();
        console.log('Server and Connection is closed!')
    })
}

createServer();