import { config } from "dotenv";

config();
export class EnvVariable {
	public static ENABLE_APM = process.env.ENABLE_APM;
	public static NODE_ENV = process.env.NODE_ENV;
	public static CLIENT_URL = process.env.CLIENT_URL;
	public static RABBITMQ_ENDPOINT = process.env.RABBITMQ_ENDPOINT;
	public static SENDER_EMAIL = process.env.SENDER_EMAIL;
	public static SENDER_EMAIL_PASSWORD = process.env.SENDER_EMAIL_PASSWORD;
	public static ELASTIC_SEARCH_URL = process.env.ELASTIC_SEARCH_URL;
	public static ELASTIC_APM_SERVER_URL = process.env.ELASTIC_APM_SERVER_URL;
	public static ELASTIC_APM_SECRET_TOKEN = process.env.ELASTIC_APM_SECRET_TOKEN;
	public static EMAIL_QUEUE_EXCHANGE_NAME = process.env.EMAIL_QUEUE_EXCHANGE_NAME;
}
