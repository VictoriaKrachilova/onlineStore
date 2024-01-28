import { readFile } from 'fs';
import nodemailer from 'nodemailer';
import { conf } from "../../conf.mjs";
import path from "path";
import { fileURLToPath } from 'url';
import { HttpException, HttpStatus } from '@nestjs/common';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const gmail = nodemailer.createTransport({
    pool: true,
    service: 'gmail',
    auth: conf.Notify.gmailCredentials,
});

const preparedTemplates = new Map();

async function prepareTemplate (template : string) {
    return new Promise((resolve, reject) => {
        readFile(`${__dirname}/../../../assets/Locales/${template}`, 'utf8', (err, data)=>{
            preparedTemplates.set(template, data.toString());
            resolve(null);
        });
    });
}


export async function sendMail(data : any) {
    if (!conf.Notify.isNotificationsEnabled) return null;
    if (!data.template) throw new HttpException('File path missing', HttpStatus.NOT_FOUND);
    if (!preparedTemplates.has(data.template)) await prepareTemplate(data.template);
    let sendData = preparedTemplates.get(data.template);
    sendData = eval('`' + sendData + '`');
    const emailConfig = {
        from: '"test" <test@gmail.com>',
        to: data.email,
        subject: data.subject,
        html: sendData,
    };
    try {
        await gmail.sendMail(emailConfig);
    } catch (err) {
        console.log(err)
        throw new HttpException('Mail not send', HttpStatus.BAD_REQUEST);
    }
    return null;
}