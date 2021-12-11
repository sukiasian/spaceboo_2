interface IEmailVerificationLocals {
    name: string;
    code: number;
}
export interface IConfirmEmailLocals extends IEmailVerificationLocals {}
export interface IRecoverPasswordLocals extends IEmailVerificationLocals {}
