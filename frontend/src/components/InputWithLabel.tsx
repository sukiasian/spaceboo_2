import { ChangeEventHandler } from 'react';
import { IComponentClassNameProps } from '../types/types';

export enum InputType {
    PASSWORD = 'password',
    EMAIL = 'email',
    TEXT = 'text',
    TEL = 'tel',
}
export enum InputAutoCompleteOption {
    ON = 'on',
    OFF = 'off',
    NEW_PASSWORD = 'new-password',
}

export interface IInputWithLableProps extends IComponentClassNameProps {
    inputLabel: string;
    inputName: string;
    inputClassName: string;
    onChange?: ChangeEventHandler<HTMLInputElement>;
    inputPlaceholder?: string;
    inputType?: InputType;
    inputAutoComplete?: InputAutoCompleteOption;
    isRequiredField?: boolean;
    dataTag?: string;
}
export interface IFormInputs {
    [key: string]: {
        mainDivClassName: string;
        inputLabel: string;
        inputName: string;
        inputClassName: string;
        inputPlaceholder?: string;
        value?: string;
        inputAutoComplete?: InputAutoCompleteOption;
        inputType?: InputType;
        isRequiredField?: boolean;
    };
}

export default function InputWithLabel(props: IInputWithLableProps) {
    const inputType = props.inputType || InputType.TEXT;
    const autoComplete = props.inputAutoComplete || InputAutoCompleteOption.OFF;
    const renderRequiredField = (): JSX.Element | void => {
        if (props.isRequiredField) {
            return <span className="required-field">*</span>;
        }
    };
    return (
        <div className={`${props.mainDivClassName}-input-container`}>
            <label>
                {props.inputLabel}
                {renderRequiredField()}
            </label>
            <input
                className={`label label--${props.inputClassName}`}
                type={inputType}
                name={props.inputName}
                placeholder={props.inputPlaceholder}
                autoComplete={autoComplete as string}
                onChange={props.onChange}
                data-tag={props.dataTag}
            />
        </div>
    );
}
