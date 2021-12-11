import * as nodemailer from 'nodemailer';
import * as path from 'path';
import * as pug from 'pug';
import { Singleton, SingletonFactory } from '../utils/Singleton';
import { IEmailOptions } from './EmailOptions';

export enum RelativePathsToTemplates {
    CONFIRM_EMAIL = 'users/confirm-email.pug',
    RECOVER_PASSWORD = 'users/password-recovery.pug',
}

class Email extends Singleton {
    sendMail = async <TLocals>(
        options: IEmailOptions,
        relativePathToTemplate?: string,
        locals?: TLocals
    ): Promise<void> => {
        try {
            const transporter = nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: parseInt(process.env.EMAIL_PORT, 10),
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            } as nodemailer.TransportOptions);

            let html: string;

            if (relativePathToTemplate) {
                const pugTemplate = pug.compileFile(path.resolve('emails', 'templates', relativePathToTemplate));
                html = pugTemplate(locals);
            }

            const mailOptions = {
                from: options.from,
                to: options.to,
                subject: options.subject,
                html,
                text: options.text, // FIXME dont need it since we need html template
            };

            await transporter.sendMail(mailOptions);
        } catch (err) {
            throw new Error(err.message);
        }
    };
}

const email = SingletonFactory.produce<Email>(Email);
export const sendMail = email.sendMail;
