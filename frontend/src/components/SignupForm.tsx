import { ChangeEventHandler, FormEventHandler, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { postSignupAction } from '../redux/actions/authActions';
import { IReduxState } from '../redux/reducers/rootReducer';
import InputWithLabel, { IFormInputs } from './InputWithLabel';

import Alert from './Alert';
import { AlertType, CustomResponseMessages, HttpStatus } from '../types/types';

export interface ISignupData {
    [key: keyof IFormInputs]: string | undefined;
}

interface ISignupFormProps {
    handleAfterSignup: (...params: any) => any;
}

export default function SignupForm(props: ISignupFormProps): JSX.Element {
    const [formInputs, setFormInputs] = useState<IFormInputs>({
        name: {
            mainDivClassName: 'name',
            inputLabel: 'Имя',
            inputName: 'name',
            inputPlaceholder: 'Ваше имя...',
            inputClassName: 'name',
        },
        surname: {
            mainDivClassName: 'surname',
            inputLabel: 'Фамилия...',
            inputName: 'surname',
            inputPlaceholder: 'Ваша фамилия...',
            inputClassName: 'surname',
        },
        middleName: {
            mainDivClassName: 'middle-name',
            inputLabel: 'Отчество',
            inputName: 'middleName',
            inputPlaceholder: 'Ваше отчество...',
            inputClassName: 'middle-name',
        },
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
        passwordConfirmation: {
            mainDivClassName: 'password-confirmation',
            inputLabel: 'Подтверждение пароля',
            inputName: 'passwordConfirmation',
            inputPlaceholder: 'Подтверждение пароля...',
            inputClassName: 'password',
        },
    });
    const { signupResponse } = useSelector((state: IReduxState) => state.authStorage);
    useEffect(() => {
        if (signupResponse && !signupResponse.error) {
            props.handleAfterSignup();
        }
    }, [signupResponse, props]);
    const dispatch = useDispatch();
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
    const handleSignupButton = (): void => {
        const signupData: ISignupData = {};

        Object.keys(formInputs).forEach((inputName: string) => {
            signupData[inputName] = formInputs[inputName].value;
        });
        dispatch(postSignupAction(signupData));
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
    const renderSignupAlerts = (): JSX.Element | void => {
        if (signupResponse) {
            switch (signupResponse.error.statusCode) {
                case HttpStatus.UNAUTHORIZED:
                    return <Alert alertType={AlertType.FAILURE} alertMessage={signupResponse.message} />;

                default:
                    return <Alert alertType={AlertType.FAILURE} alertMessage={CustomResponseMessages.UNKNOWN_ERROR} />;
            }
        }
    };

    // TODO validators!
    return (
        <div className="signup-form-container">
            <form className="signup-form" onSubmit={handleSubmit}>
                {renderInputs()}
                <button className="button--primary" onClick={handleSignupButton}>
                    Зарегистрироваться
                </button>
            </form>
            {renderSignupAlerts()}
        </div>
    );
}
