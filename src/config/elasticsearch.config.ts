import {Client} from "@elastic/elasticsearch"
import { EnvVariable } from "./envVariable"
import { Logger } from "winston";
import { ClusterHealthResponse } from "@elastic/elasticsearch/lib/api/types";
import { winstonLogger } from '@manoj19-github/microservice_shared_lib';


const logger:Logger = winstonLogger(`${EnvVariable.ELASTIC_SEARCH_URL}`, 'notificationElasticSearchServer', 'debug');
console.log("EnvVariable.ELASTIC_SEARCH_URL : ",EnvVariable.ELASTIC_SEARCH_URL);
const ElasticSearchClient = new Client({
    node:`${EnvVariable.ELASTIC_SEARCH_URL}`
})

export async function checkElasticSearchConnection():Promise<void>{
    let isConnected = false;
    while(!isConnected){
        try{
            const health:ClusterHealthResponse = await ElasticSearchClient.cluster.health({})
            logger.info(`NotificationService Elasticsearch health status  - ${health.status}`)
            isConnected = true;

        }catch(error){
            logger.error(`Connection to Elasticsearch is failed. Retrying ...............`)
            logger.log(`error`,`Notification Server checkElasticSearchConnection method :`,error);
        }
    }

}