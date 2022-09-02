import { ChangeEventHandler, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { IReduxState } from '../redux/reducers/rootReducer';
import InputWithLabel, { InputAutoCompleteOption, IFormInputs, InputType } from '../components/InputWithLabel';
import Alert from '../components/Alert';
import { handleFormSubmit } from '../utils/utilFunctions';
import { postLoginUserAction } from '../redux/actions/authActions';
import AltButton from '../components/AltButton';

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
            inputType: InputType.EMAIL,
            inputAutoComplete: InputAutoCompleteOption.ON,
            isRequiredField: true,
        },
        password: {
            mainDivClassName: 'password',
            inputLabel: 'Пароль',
            inputName: 'password',
            inputPlaceholder: 'Пароль...',
            inputClassName: 'password',
            inputType: InputType.PASSWORD,
            inputAutoComplete: InputAutoCompleteOption.ON,
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
    const renderLoginResponseAlert = (): JSX.Element => {
        return <Alert successResponse={postLoginUserSuccessResponse} failureResponse={postLoginUserSuccessResponse} />;
    };

    useEffect(handleAfterLogin, [postLoginUserSuccessResponse, props, navigate]);

    // TODO validators!
    return (
        <div className="form-container auth-form-container login-form-container">
            <form className="auth-form login-form" onSubmit={handleFormSubmit}>
                {renderInputs()}
                <AltButton buttonText="Войти" mainDivClassName="button--primary" handleClick={handleLoginButton} />
            </form>
            {renderLoginResponseAlert()}
        </div>
    );
}
