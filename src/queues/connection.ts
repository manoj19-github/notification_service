
import client, { Channel, Connection } from 'amqplib';
import { EnvVariable } from '../config/envVariable';
import { Logger } from 'winston';
import { winstonLogger } from '@manoj19-github/microservice_shared_lib';

export class QueueConnection {
	private static logger: Logger = winstonLogger(`${EnvVariable.ELASTIC_SEARCH_URL}`, 'notificationQueueConnection', 'debug');
	public static async createConnection(): Promise<Channel | undefined> {
		try {
			const connection: Connection = await client.connect(`${EnvVariable.RABBITMQ_ENDPOINT}`);
			const channel: Channel = await connection.createChannel();
			QueueConnection.logger.info('Notification Server connected to queue successfully ..........');
            QueueConnection.closeConnection(channel,connection);
			return channel;
		} catch (error) {
			console.log('error: ', error);
			QueueConnection.logger.log(`error`, 'Notification Service createConnection method', error);
			return undefined;
		}
	}
	public static closeConnection(channel: Channel, connection: Connection): void {
		process.once('SIGINT', async () => {
			await channel.close();
			await connection.close();
		});
	}
}
