import 'express-async-errors';
import cors from 'cors';
import { config } from 'dotenv';
import express, { Application, Request, Response, json, urlencoded } from 'express';
import helmet from 'helmet';
import http from 'http';
import morgan from 'morgan';
import { errorHandler, notFound } from './http/middlewares/errorHandler.middleware';
import RoutesMain from './routes';
import { Logger } from 'winston';
import { EnvVariable } from './config/envVariable';
import { StatusCodes } from 'http-status-codes';
import { checkElasticSearchConnection } from './config/elasticsearch.config';
import { QueueConnection } from './queues/connection';
import { Channel } from 'amqplib';
import { EmailConsumer } from './queues/email.consumer';
import { winstonLogger } from '@manoj19-github/microservice_shared';
config();
class NotificationServer {
	private app: Application;
	private PORT: unknown;
	// private routesMain = new RoutesMain();
	private logger: Logger;
	constructor() {

		this.logger = winstonLogger(`${EnvVariable.ELASTIC_SEARCH_URL}`, 'notificationServer', 'debug');
		this.app = express();
		this.PORT = process.env.PORT ?? 5000;
		this.middleware();
		this.routes();

	}
	private middleware(): void {
		this.app.use(cors({ credentials: true, origin: '*', methods: 'GET,POST,PUT,DELETE' }));
		this.app.use(urlencoded({ extended: true, limit: '50mb' }));
		this.app.use(json({ limit: '50mb' }));
		this.app.use(helmet());
		this.app.use(morgan('dev'));
	}
	private routes(): void {
		this.app.get('/notification-health', (req: Request, res: Response) => {
			return res.status(StatusCodes.OK).send('<h2>Notification Server is running .....</h2>');
		});
		// this.routesMain.initializeAllRoutes(this.app);

		// put this at the last of all routes
		this.app.use(notFound);
		this.app.use(errorHandler);
	}
	public listen(): void {
		this.startServer();
		this.startQueue();
		this.startElasticSearch();
	}
	private async startQueue(): Promise<void> {
		const emailChannel:Channel = await QueueConnection.createConnection() as Channel;
		await EmailConsumer.consumeAuthEmailMessages(emailChannel);
		await EmailConsumer.consumeOrderEmailMessages(emailChannel);
		await emailChannel.assertExchange(String(EnvVariable.EMAIL_QUEUE_EXCHANGE_NAME),'direct');
		const routingKey = 'auth-email-notification';
        const queueName = 'auth-email-queue';
		const messages1 = JSON.stringify({name:"Auth Email",service:"Auth Notification service"})
		emailChannel.publish(String(EnvVariable.EMAIL_QUEUE_EXCHANGE_NAME),routingKey,Buffer.from(messages1));
		
		
		// const messages2:any = {
		// 	verifyLink:`${EnvVariable.CLIENT_URL}/confirm_email?v_token=4343edferfde4343`,
		// 	receiverEmail:`${EnvVariable.SENDER_EMAIL}`,
		// 	template:'verifyEmail/html.ejs',
		// 	subject:"test email"



		// }
		// await emailChannel.assertExchange('jobber-order-notification','direct');
		// emailChannel.publish('jobber-order-notification','order-email',Buffer.from(JSON.stringify(messages2)));
		

	}
	private async startElasticSearch(): Promise<void> {
		await checkElasticSearchConnection()
	}
	private startServer(): void {
		try {
			const httpServer: http.Server = new http.Server(this.app);
			this.logger.info(`worker with process id of ${process.pid} of notification server has started`);
			httpServer.listen(this.PORT, () => {
				this.logger.info(`Notification Server running on port ${this.PORT}`);
			});
		} catch (error) {
			this.logger.log('error', 'NotificationService start Server error : ', error);
		}
	}
}

const server = new NotificationServer();
server.listen();
