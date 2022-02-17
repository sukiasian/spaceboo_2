import { ChangeEventHandler, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { IReduxState } from '../redux/reducers/rootReducer';
import InputWithLabel, { InputAutoCompleteOptions, IFormInputs, InputTypes } from '../components/InputWithLabel';
import Alert from '../components/Alert';
import { AlertTypes, CustomResponseMessages, HttpStatus } from '../types/types';
import { handleFormSubmit } from '../utils/utilFunctions';
import { postLoginUserAction } from '../redux/actions/authActions';

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
            inputType: InputTypes.EMAIL,
            inputAutoComplete: InputAutoCompleteOptions.ON,
            isRequiredField: true,
        },
        password: {
            mainDivClassName: 'password',
            inputLabel: 'Пароль',
            inputName: 'password',
            inputPlaceholder: 'Пароль...',
            inputClassName: 'password',
            inputType: InputTypes.PASSWORD,
            inputAutoComplete: InputAutoCompleteOptions.ON,
            isRequiredField: true,
        },
    });
    const { postLoginUserSuccessResponse, postLoginUserFailureResponse } = useSelector(
        (state: IReduxState) => state.authStorage
    );
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleAfterLogin = (): void => {
        if (postLoginUserSuccessResponse) {
            props.handleAfterLogin();
            navigate('/');
        }
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

        dispatch(postLoginUserAction(loginData));
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
                    inputAutoComplete={field.inputAutoComplete}
                    inputType={field.inputType}
                    isRequiredField={field.isRequiredField}
                    onChange={handleInputChange(inputName)}
                    key={i}
                />
            );
        });
    };
    const renderLoginErrorAlerts = (): JSX.Element | void => {
        if (postLoginUserFailureResponse) {
            switch (postLoginUserFailureResponse.statusCode) {
                case HttpStatus.UNAUTHORIZED:
                    return (
                        <Alert alertType={AlertTypes.FAILURE} alertMessage={postLoginUserFailureResponse.message!} />
                    );

                default:
                    return <Alert alertType={AlertTypes.FAILURE} alertMessage={CustomResponseMessages.UNKNOWN_ERROR} />;
            }
        }
    };

    useEffect(handleAfterLogin, [postLoginUserSuccessResponse, props, navigate]);

    // TODO validators!
    return (
        <div className="login-form-container">
            <form className="login-form" onSubmit={handleFormSubmit}>
                {renderInputs()}
                <button className="button--primary" onClick={handleLoginButton}>
                    Войти
                </button>
            </form>
            {renderLoginErrorAlerts()}
        </div>
    );
}
