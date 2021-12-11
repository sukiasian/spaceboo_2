export interface IEmailOptions {
    from: string;
    to: string;
    subject: string;
    text?: string;
}

export class EmailOptions implements IEmailOptions {
    from = 'Команда Spaceboo';
    to: string;
    subject: string;
    text?: string;

    constructor(to: string, text?: string) {
        this.to = to;

        if (text) {
            this.text = text;
        }
    }
}

export class PasswordRecoveryEmailOptions extends EmailOptions {
    subject = 'Восстановление пароля';

    constructor(to: string, text?: string) {
        super(to, text);
    }
}

export class ConfirmEmailOptions extends EmailOptions {
    subject = 'Подтверждение эл. почты';

    constructor(to: string, text?: string) {
        super(to, text);
    }
}
