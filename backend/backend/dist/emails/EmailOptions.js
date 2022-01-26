"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfirmEmailOptions = exports.PasswordRecoveryEmailOptions = exports.EmailOptions = void 0;
class EmailOptions {
    constructor(to, text) {
        this.from = 'Команда Spaceboo';
        this.to = to;
        if (text) {
            this.text = text;
        }
    }
}
exports.EmailOptions = EmailOptions;
class PasswordRecoveryEmailOptions extends EmailOptions {
    constructor(to, text) {
        super(to, text);
        this.subject = 'Восстановление пароля';
    }
}
exports.PasswordRecoveryEmailOptions = PasswordRecoveryEmailOptions;
class ConfirmEmailOptions extends EmailOptions {
    constructor(to, text) {
        super(to, text);
        this.subject = 'Подтверждение эл. почты';
    }
}
exports.ConfirmEmailOptions = ConfirmEmailOptions;
//# sourceMappingURL=EmailOptions.js.map