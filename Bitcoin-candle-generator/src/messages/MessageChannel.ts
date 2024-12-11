import { config } from 'dotenv';
import { Channel, connect } from 'amqplib';

export const createMessageChannel = async(): Promise<Channel> => {
    config();
    
    try {
        const connection = await connect(process.env.AMQP_SERVER);
        const channel = await connection.createChannel();
        console.log('[:] Connected to RabbitMQ!')
        await channel.assertQueue(process.env.QUEUE_NAME);
        console.log(`[:] Created ${process.env.QUEUE_NAME} queue!`);
        return channel;
    } catch (error) {
        console.log('Error while trying to connect to RabbitMQ!');
        console.log({error, message: error.message})
        return null;
    }
}