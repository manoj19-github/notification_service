
import { EnvVariable } from "../config/envVariable";
import { Logger } from "winston";
import nodemailer,{ SendMailOptions,Transporter } from 'nodemailer';
import Email from "email-templates";
import path from "node:path"
import ejs from "ejs"
import { IEmailLocals, winstonLogger } from "@manoj19-github/microservice_shared";
export class UtilsMain {
    private static logger: Logger = winstonLogger(`${EnvVariable.ELASTIC_SEARCH_URL}`, 'mailTransport', 'debug');
    public static async sendEmail(templates:string,receiverEmail:string,subject:string,locals:IEmailLocals):Promise<void>{
        try{
            await UtilsMain.emailTemplates(templates,receiverEmail,subject,locals)
            UtilsMain.logger.info(`Email send successfully`);
        }catch(error:any){
            UtilsMain.logger.log(`error`,`Notification service mail transport send Email method error : `,error);
        }
    }
    public static async emailTemplates(templates:string,receiver:string,subject:string,locals:IEmailLocals):Promise<void>{
        try{
            const smtpTransport =  nodemailer.createTransport({
                host: 'smtp.gmail.com',
                secureConnection: false, // TLS requires secureConnection to be false
                port: 465,
                secure: true,
                auth: {
                  user: String(EnvVariable.SENDER_EMAIL),
                  pass: String(EnvVariable.SENDER_EMAIL_PASSWORD)
                },
                tls: {
                  rejectUnAuthorized: true,
                },
              } as any);

              ejs.renderFile(path.join(__dirname,"..",'emailTemplates/',templates),{...locals},(error,data)=>{
                if(error){
                    UtilsMain.logger.error(error);
                }else{
                    const mailOptions = {
                        from:`Jobber App <${EnvVariable.SENDER_EMAIL}>`,
                        to:receiver,
                        subject,
                        html:data
                    }
                    smtpTransport.sendMail(mailOptions,(error,info)=>{
                        if(error){
                            UtilsMain.logger.error(error);
                        }else{
                            UtilsMain.logger.info(`Email send with ejs template`);

                        }
                    })
                }
              })
        }catch(error:any){
            console.log('error: ', error);
            UtilsMain.logger.error(error);
        }
    }
}

