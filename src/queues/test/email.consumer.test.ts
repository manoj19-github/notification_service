import {QueueConnection} from "../connection"
import amqp from "amqplib"
import { EmailConsumer } from "../email.consumer";

import {Channel,ConsumeMessage} from "amqplib"
import { EnvVariable } from "../../config/envVariable";
import { Logger } from "winston";
import { EMAIL_SENDER_ENUM } from "../../constants";

require("dotenv").config()
jest.mock("../connection");
jest.mock("amqplib");
jest.mock("winston");
jest.mock("../../constants")
jest.mock("../../config/envVariable")
jest.mock("../../utils");


describe("Email Consumer",()=>{
    beforeEach(()=>{
        jest.resetAllMocks();
    });

    afterEach(()=>{
        jest.clearAllMocks();
    });
    describe('consumeAuthEmailMessages method',()=>{
        it('should be called',async()=>{
            const channel={
                assertExchange:jest.fn(),
                publish:jest.fn(),
                assertQueue:jest.fn(),
                bindQueue:jest.fn(),
                consume:jest.fn()
            };
            jest.spyOn(channel,'assertExchange');
            jest.spyOn(channel,'assertQueue').mockReturnValue({queue:'auth-email-queue',messageCount:0,consumerCount:0})
            jest.spyOn(QueueConnection, 'createConnection').mockReturnValue(channel as any);
            const connectionChannel = await QueueConnection.createConnection();
            await EmailConsumer.consumeAuthEmailMessages(connectionChannel);
            expect(connectionChannel?.assertExchange).toHaveBeenCalledWith('email_notification','direct');
            expect(connectionChannel?.assertQueue).toHaveBeenCalledTimes(1);
            expect(connectionChannel?.bindQueue).toHaveBeenCalledWith('auth-email-queue',"email_notification","auth-email-notification");
        })
    });

    describe('consumeOrderEmailMessages method',()=>{
        it('should be called',async()=>{
            const channel={
                assertExchange:jest.fn(),
                publish:jest.fn(),
                assertQueue:jest.fn(),
                bindQueue:jest.fn(),
                consume:jest.fn()
            };
            jest.spyOn(channel,'assertExchange');
            jest.spyOn(channel,'assertQueue').mockReturnValue({queue:'order-email-queue',messageCount:0,consumerCount:0})
            jest.spyOn(QueueConnection, 'createConnection').mockReturnValue(channel as any);
            const connectionChannel = await QueueConnection.createConnection();
            await EmailConsumer.consumeOrderEmailMessages(connectionChannel);
            expect(connectionChannel?.assertExchange).toHaveBeenCalledWith('jobber-order-notification','direct');
            expect(connectionChannel?.assertQueue).toHaveBeenCalledTimes(1);
            expect(connectionChannel?.bindQueue).toHaveBeenCalledWith('order-email-queue',"jobber-order-notification","order-email");
        })
    })
})
