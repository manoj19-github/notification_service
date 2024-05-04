import { NotAuthorizedError } from "../../config/errorHandler.config"
import { NextFunction,Request,Response } from "express"
import JWT from "jsonwebtoken"
const token:string[] = ["auth","seller","gig","search","buyer","message","order","review"]

export function verifyGatewayRequest(req:Request,res:Response,next:NextFunction):void{
    if(!req.headers?.gatewayToken) 
        throw new NotAuthorizedError("Invalid request","verifygateway method : Request not coming from api gatewaytoken");
    const token:string = req.headers.gatewayToken as string;
    try{
        const payload:{id:string,iat:number} = JWT.verify(token,'') as {id:string,iat:number};
        if(!token.includes(payload.id)) 
            throw new NotAuthorizedError("Invalid request","verifygateway method : Request not coming from api gatewaytoken");

    }catch(error){
        throw new NotAuthorizedError("Invalid request","verifygateway method : Request not coming from api gatewaytoken");

    }
}