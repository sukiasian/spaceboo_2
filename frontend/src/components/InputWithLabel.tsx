import { ChangeEventHandler } from 'react';
import { IComponentDivProps } from '../types/types';

export enum InputTypes {
    PASSWORD = 'password',
    EMAIL = 'email',
    TEXT = 'text',
}
export enum InputAutoCompleteOptions {
    ON = 'on',
    OFF = 'off',
    NEW_PASSWORD = 'new-password',
}

interface IInputWithLableProps extends IComponentDivProps {
    inputLabel: string;
    inputName: string;
    inputPlaceholder: string;
    inputClassName: string;
    onChange: ChangeEventHandler<HTMLInputElement>;
    inputType?: InputTypes;
    inputAutoComplete?: InputAutoCompleteOptions;
    isRequiredField?: boolean;
}

export interface IFormInputs {
    [key: string]: {
        mainDivClassName: string;
        inputLabel: string;
        inputName: string;
        inputPlaceholder: string;
        inputClassName: string;
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
                className={`label label-${props.inputClassName}`}
                type={inputType}
                name={props.inputName}
                placeholder={props.inputPlaceholder}
                autoComplete={autoComplete as string}
                onChange={props.onChange}
            />
        </div>
    );
}
