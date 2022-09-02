import { ChangeEventHandler, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { IReduxState } from '../redux/reducers/rootReducer';
import InputWithLabel, { IFormInputs, InputAutoCompleteOption, InputType } from '../components/InputWithLabel';
import { postSendVerificationCodeAction } from '../redux/actions/emailVerificationActions';
import { EmailPurpose, IPostSendVerificationEmailPayload } from '../redux/reducers/emailVerificationReducer';
import { LocalStorageItem } from '../types/types';
import { handleFormSubmit } from '../utils/utilFunctions';
import { postSignupUserAction } from '../redux/actions/authActions';
import Alert from '../components/Alert';
import AltButton from '../components/AltButton';

export interface ISignupData {
    [key: keyof IFormInputs]: string | undefined;
}

interface ISignupFormProps {
    handleAfterSignup: (...params: any) => any;
}

export default function SignupForm(props: ISignupFormProps): JSX.Element {
    const [formInputs, setFormInputs] = useState<IFormInputs>({
        surname: {
            mainDivClassName: 'surname',
            inputLabel: 'Фамилия',
            inputName: 'surname',
            inputPlaceholder: 'Ваша фамилия...',
            inputClassName: 'surname',
            isRequiredField: true,
        },
        name: {
            mainDivClassName: 'name',
            inputLabel: 'Имя',
            inputName: 'name',
            inputPlaceholder: 'Ваше имя...',
            inputClassName: 'name',
            isRequiredField: true,
        },
        middleName: {
            mainDivClassName: 'middle-name',
            inputLabel: 'Отчество',
            inputName: 'middleName',
            inputPlaceholder: 'Ваше отчество...',
            inputClassName: 'middle-name',
            isRequiredField: true,
        },
        email: {
            mainDivClassName: 'email',
            inputLabel: 'Имя пользователя/Эл. почта',
            inputName: 'email',
            inputPlaceholder: 'Имя пользователя/Эл. почта...',
            inputClassName: 'email',
            inputType: InputType.EMAIL,
            isRequiredField: true,
        },
        password: {
            mainDivClassName: 'password',
            inputLabel: 'Пароль',
            inputName: 'password',
            inputPlaceholder: 'Пароль...',
            inputClassName: 'password',
            inputType: InputType.PASSWORD,
            inputAutoComplete: InputAutoCompleteOption.NEW_PASSWORD,
            isRequiredField: true,
        },
        passwordConfirmation: {
            mainDivClassName: 'password-confirmation',
            inputLabel: 'Подтверждение пароля',
            inputName: 'passwordConfirmation',
            inputPlaceholder: 'Подтверждение пароля...',
            inputClassName: 'password',
            inputType: InputType.PASSWORD,
            isRequiredField: true,
        },
    });
    const [loading, setLoading] = useState<boolean>();
    const { postSignupUserSuccessResponse, postSignupUserFailureResponse } = useSelector(
        (state: IReduxState) => state.authStorage
    );
    const { postSendVerificationCodeSuccessResponse, postCheckVerificationCodeSuccessResponse } = useSelector(
        (state: IReduxState) => state.emailVerificationStorage
    );
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const sendVerificationCodeOnSuccess = (): void => {
        if (postSignupUserSuccessResponse) {
            const payload: IPostSendVerificationEmailPayload = {
                purpose: EmailPurpose[10],
            };

            dispatch(postSendVerificationCodeAction(payload));
            setLoading(true);
        }
    };
    const storeLastVerificationRequestedAtLocalStorage = (): void => {
        localStorage.setItem(
            LocalStorageItem.LAST_VERIFICATION_REQUESTED,
            postCheckVerificationCodeSuccessResponse!.data.lastVerificationRequested
        );
    };
    const handleAfterSignup = (): void => {
        setLoading(false);

        if (postSendVerificationCodeSuccessResponse) {
            storeLastVerificationRequestedAtLocalStorage();
            props.handleAfterSignup();

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
    const handleSignupButton = (): void => {
        const signupData: ISignupData = {};

        Object.keys(formInputs).forEach((inputName: string) => {
            signupData[inputName] = formInputs[inputName].value;
        });

        dispatch(postSignupUserAction(signupData));
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
                    inputType={field.inputType}
                    isRequiredField={field.isRequiredField}
                    inputAutoComplete={field.inputAutoComplete}
                    onChange={handleInputChange(inputName)}
                    key={i}
                />
            );
        });
    };
    const renderFirstDbErrorAlert = (): JSX.Element => {
        return (
            <Alert successResponse={postSignupUserSuccessResponse} failureResponse={postSignupUserFailureResponse} />
        );
    };

    useEffect(sendVerificationCodeOnSuccess, [postSignupUserSuccessResponse, dispatch]);
    useEffect(handleAfterSignup, [postSendVerificationCodeSuccessResponse, handleAfterSignup]);

    // TODO validators!
    return (
        <div className="form-container auth-form-container signup-form-container">
            <form className="form auth-form signup-form" onSubmit={handleFormSubmit}>
                {renderInputs()}

                <AltButton
                    buttonText="Зарегистрироваться"
                    mainDivClassName="button--primary"
                    handleClick={handleSignupButton}
                />

                {renderFirstDbErrorAlert()}
                <div>{loading ? 'loading...' : 'loaded!'}</div>
            </form>
        </div>
    );
}
