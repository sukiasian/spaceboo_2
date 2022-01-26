"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = exports.RelativePathsToTemplates = void 0;
const nodemailer = require("nodemailer");
const path = require("path");
const pug = require("pug");
const Singleton_1 = require("../utils/Singleton");
var RelativePathsToTemplates;
(function (RelativePathsToTemplates) {
    RelativePathsToTemplates["CONFIRM_EMAIL"] = "users/confirm-email.pug";
    RelativePathsToTemplates["RECOVER_PASSWORD"] = "users/password-recovery.pug";
})(RelativePathsToTemplates = exports.RelativePathsToTemplates || (exports.RelativePathsToTemplates = {}));
class Email extends Singleton_1.Singleton {
    constructor() {
        super(...arguments);
        this.sendMail = async (options, relativePathToTemplate, locals) => {
            try {
                const transporter = nodemailer.createTransport({
                    host: process.env.EMAIL_HOST,
                    port: parseInt(process.env.EMAIL_PORT, 10),
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS,
                    },
                });
                let html;
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
            }
            catch (err) {
                throw new Error(err.message);
            }
        };
    }
}
const email = Singleton_1.SingletonFactory.produce(Email);
exports.sendMail = email.sendMail;
//# sourceMappingURL=Email.js.map