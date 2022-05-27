import { ChangeEventHandler } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RequiredField from '../components/RequiredField';
import { postPasswordChange, setPasswordChangeFormDataAction } from '../redux/actions/authActions';
import { IReduxState } from '../redux/reducers/rootReducer';
import { handleFormSubmit } from '../utils/utilFunctions';

export interface IPasswordChangeFormData {
    oldPassword?: string;
    password?: string;
    passwordConfirmation?: string;
}
interface IInput {
    label: string;
    handleChange: ChangeEventHandler<HTMLInputElement>;
    className?: string;
}

export function PasswordChangeForm(): JSX.Element {
    const { passwordChangeFormData } = useSelector((state: IReduxState) => state.authStorage);
    const definePasswordByInputName = (
        inputName: keyof IPasswordChangeFormData
    ): ChangeEventHandler<HTMLInputElement> => {
        return (e) => {
            const newPasswordChangeFormData: IPasswordChangeFormData = { ...passwordChangeFormData };
            newPasswordChangeFormData[inputName] = e.target.value;

            dispatch(setPasswordChangeFormDataAction(newPasswordChangeFormData));
        };
    };
    const passwordsInputs: IInput[] = [
        {
            label: 'Старый пароль',
            handleChange: definePasswordByInputName('oldPassword'),
            className: 'old-password',
        },
        {
            label: 'Новый пароль',
            handleChange: definePasswordByInputName('password'),
            className: 'new-password',
        },
        {
            label: 'Подтверждение пароля',
            handleChange: definePasswordByInputName('passwordConfirmation'),
            className: 'password-confirmation',
        },
    ];
    const dispatch = useDispatch();
    const changePassword = (): void => {
        dispatch(postPasswordChange(passwordChangeFormData!));
    };
    const renderInputs = (): JSX.Element[] => {
        return passwordsInputs.map((input, i: number) => {
            return (
                <div
                    className={`password-change-form__field password-change-form__fields__${input.className}-field`}
                    key={i}
                >
                    <div className="type-of-space__label-container">
                        <label
                            className={`password-change-form__field__label password-change-form__field__label--${input.className}`}
                        >
                            {input.label}
                        </label>
                        <RequiredField />
                    </div>
                    <div className="inputs-container password-change__input-container">
                        <input
                            className="input password-change__input"
                            placeholder={`${input.label}...`}
                            type="password"
                            autoComplete="true"
                            onChange={input.handleChange}
                        />
                    </div>
                </div>
            );
        });
    };

    return (
        <form className="password-change-form" onSubmit={handleFormSubmit}>
            <div className="password-change-form__fields form-fields">{renderInputs()}</div>
            <div className="password-change-form__button-container">
                <button className="button button--primary password-change-form__button" onClick={changePassword}>
                    Сменить пароль
                </button>
            </div>
        </form>
    );
}
