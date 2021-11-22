import * as nodemailer from 'nodemailer';
import * as path from 'path';
import { Singleton, SingletonFactory } from './Singleton';

interface IEmailOptions {
    from: string;
    to: string;
    subject: string;
    text: string;
}

class Email extends Singleton {
    sendMail = async (options: IEmailOptions) => {
        try {
            const transporter = nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: parseInt(process.env.EMAIL_PORT, 10),
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            } as nodemailer.TransportOptions);

            const mailOptions = {
                from: options.from,
                to: options.to,
                subject: options.subject,
                text: options.text, // FIXME dont need it since we need html template
            };

            await transporter.sendMail(mailOptions);
        } catch (err) {
            throw err;
        }
    };
}

const email = SingletonFactory.produce<Email>(Email);
export const sendMail = email.sendMail;
