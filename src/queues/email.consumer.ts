
import {Channel,ConsumeMessage} from "amqplib"
// import { EnvVariable } from "src/config/envVariable";
import { Logger } from "winston";
import { QueueConnection } from "./connection";
import { UtilsMain } from "../utils";
import { EMAIL_SENDER_ENUM } from "../constants";
import { IEmailLocals, winstonLogger } from "@manoj19-github/microservice_shared";
import { EnvVariable } from "../config/envVariable";
// import { IEmailLocals, winstonLogger } from "@manoj19-github/microservice_shared";


export class EmailConsumer{
    private static logger: Logger = winstonLogger(`${EnvVariable.ELASTIC_SEARCH_URL}`, 'emailConsumer', 'debug');
    public static async consumeAuthEmailMessages(channel:Channel | undefined):Promise<void>{
        try{
            if(!channel)
                channel = await QueueConnection.createConnection() as Channel;
            const exchangeName = 'email_notification';
            const routingKey = 'auth-email-notification';
            const queueName = 'auth-email-queue';
            await channel.assertExchange(exchangeName,'direct');
            const EmailQueue = await channel.assertQueue(queueName,{durable:true,autoDelete:false});
            await channel.bindQueue(EmailQueue.queue,exchangeName,routingKey);
            channel.consume(EmailQueue.queue,async(message:ConsumeMessage | null)=>{
                console.log("Message consumed by RabbitMQ : ",JSON.parse(String(message?.content)));
                if(!!channel && !!message)
                    channel.ack(message)
                // send email 
                // acknowledge
            })


        }catch(error:any){
            console.log('error: ', error);
            EmailConsumer.logger.log("error",`Notification Service EmailConsumer class error`,error)
        }
    }
    public static async consumeOrderEmailMessages(channel:Channel | undefined):Promise<void>{
        try{
            if(!channel)
                channel = await QueueConnection.createConnection() as Channel;
            const exchangeName = 'jobber-order-notification';
            const routingKey = 'order-email';
            const queueName = 'order-email-queue';
            await channel.assertExchange(exchangeName,'direct');
            const EmailQueue = await channel.assertQueue(queueName,{durable:true,autoDelete:false});
            await channel.bindQueue(EmailQueue.queue,exchangeName,routingKey);
            channel.consume(EmailQueue.queue,async(message:ConsumeMessage | null)=>{
                console.log("Message consumed by RabbitMQ : ",JSON.parse(String(message?.content)));                if(!!channel && !!message)
                    channel.ack(message)
                const {receiverEmail,username,verifyLink,template,resetLink,subject,
                    sender,
                    offerLink,
                    amount,
                    buyerUsername,
                    sellerUsername,
                    title,
                    description,
                    deliveryDays,
                    orderId,
                    orderDue,
                    requirements,
                    orderUrl,
                    originalDate,
                    newDate,
                    reason,
                    header,
                    type,
                    serviceFee,
                    total
                } = JSON.parse(String(message?.content));
                const locals:IEmailLocals = {
                    appLink:`http://localhost:3000`,
                    appIcon:`https://wonderfulengineering.com/wp-content/uploads/2014/10/image-wallpaper-15-1024x768.jpg`,
                    username,
                    verifyLink,
                    resetLink,
                    sender,
                    offerLink,
                    amount,
                    buyerUsername,
                    sellerUsername,
                    title,
                    description,
                    deliveryDays,
                    orderId,
                    orderDue,
                    requirements,
                    orderUrl,
                    originalDate,
                    newDate,
                    reason,
                    header,
                    type,
                    serviceFee,
                    total
                };
                switch(template){
                    case EMAIL_SENDER_ENUM.ORDER_PLACED:
                        await UtilsMain.sendEmail(template,receiverEmail,subject,locals);
                        await UtilsMain.sendEmail("orderReceipt/html.ejs",receiverEmail,subject,locals);
                    default:
                        await UtilsMain.sendEmail(template,receiverEmail,subject,locals);





                }

                
                // send email 
                // acknowledge
            })


        }catch(error:any){
            EmailConsumer.logger.log("error",`Notification Service EmailConsumer consumer order email message class error`,error)
        }
    }

}