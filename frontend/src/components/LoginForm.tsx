import { ChangeEventHandler, FormEventHandler, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { postLoginAction } from '../redux/actions/authActions';
import { IReduxState } from '../redux/reducers/rootReducer';
import InputWithLabel, { IFormInputs } from './InputWithLabel';

import Alert from './Alert';
import { AlertType, CustomResponseMessages, HttpStatus } from '../types/types';

export interface ILoginData {
    [key: keyof IFormInputs]: string | undefined;
}

interface ILoginFormProps {
    handleAfterLogin: (...params: any) => any;
}

export default function LoginForm(props: ILoginFormProps): JSX.Element {
    const [formInputs, setFormInputs] = useState<IFormInputs>({
        email: {
            mainDivClassName: 'email',
            inputLabel: 'Имя пользователя/Эл. почта',
            inputName: 'email',
            inputPlaceholder: 'Имя пользователя/Эл. почта...',
            inputClassName: 'email',
        },
        password: {
            mainDivClassName: 'password',
            inputLabel: 'Пароль',
            inputName: 'password',
            inputPlaceholder: 'Пароль...',
            inputClassName: 'password',
        },
    });
    const { loginResponse } = useSelector((state: IReduxState) => state.authStorage);
    const dispatch = useDispatch();
    const handleAfterLogin = (): void => {
        if (loginResponse && !loginResponse.error) {
            props.handleAfterLogin();
        }
    };
    const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
    };
    const handleInputChange = (fieldName: string): ChangeEventHandler<HTMLInputElement> => {
        return (e) => {
            const inputs = { ...formInputs };

            inputs[fieldName].value = e.target.value;
            setFormInputs(inputs);
        };
    };
    const handleLoginButton = (): void => {
        const loginData: ILoginData = {};

        Object.keys(formInputs).forEach((inputName: string) => {
            loginData[inputName] = formInputs[inputName].value;
        });
        dispatch(postLoginAction(loginData));
    };
    const renderInputs = (): JSX.Element[] => {
        return Object.keys(formInputs).map((inputName: string, i: number) => {
            const field = formInputs[inputName];
            return (
                <InputWithLabel
                    mainDivClassName={field.mainDivClassName}
                    inputLabel={field.inputLabel}
                    inputName={field.inputName}
                    inputPlaceholder={field.inputPlaceholder}
                    inputClassName={field.inputClassName}
                    onChange={handleInputChange(inputName)}
                    key={i}
                />
            );
        });
    };
    const renderLoginAlerts = (): JSX.Element | void => {
        if (loginResponse) {
            switch (loginResponse.error.statusCode) {
                case HttpStatus.UNAUTHORIZED:
                    return <Alert alertType={AlertType.FAILURE} alertMessage={loginResponse.message} />;

                default:
                    return <Alert alertType={AlertType.FAILURE} alertMessage={CustomResponseMessages.UNKNOWN_ERROR} />;
            }
        }
    };

    useEffect(handleAfterLogin, [loginResponse, props]);

    // TODO validators!
    return (
        <div className="login-form-container">
            <form className="login-form" onSubmit={handleSubmit}>
                {renderInputs()}
                <button className="button--primary" onClick={handleLoginButton}>
                    Войти
                </button>
            </form>
            {renderLoginAlerts()}
        </div>
    );
}
