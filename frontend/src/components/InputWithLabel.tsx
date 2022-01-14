import { ChangeEventHandler } from 'react';
import { IComponentClassNameProps } from '../types/types';

export enum InputTypes {
    PASSWORD = 'password',
    EMAIL = 'email',
    TEXT = 'text',
    TEL = 'tel',
}
export enum InputAutoCompleteOptions {
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
    inputType?: InputTypes;
    inputAutoComplete?: InputAutoCompleteOptions;
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
        inputAutoComplete?: InputAutoCompleteOptions;
        inputType?: InputTypes;
        isRequiredField?: true;
    };
}

export default function InputWithLabel(props: IInputWithLableProps) {
    const inputType = props.inputType || InputTypes.TEXT;
    const autoComplete = props.inputAutoComplete || InputAutoCompleteOptions.OFF;
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
