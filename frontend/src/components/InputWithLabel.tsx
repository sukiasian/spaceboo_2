import { ChangeEventHandler } from 'react';
import { IComponentDivProps } from '../types/types';

interface IInputWithLableProps extends IComponentDivProps {
    inputLabel: string;
    inputName: string;
    inputPlaceholder: string;
    inputClassName: string;
    onChange: ChangeEventHandler<HTMLInputElement>;
    inputType?: string;
}

export interface IFormInputs {
    [key: string]: {
        mainDivClassName: string;
        inputLabel: string;
        inputName: string;
        inputPlaceholder: string;
        inputClassName: string;
        value?: string;
        inputType?: string;
    };
}

export default function InputWithLabel(props: IInputWithLableProps) {
    const inputType = props.inputType || 'text';

    return (
        <div className={`${props.mainDivClassName}-input-container`}>
            <label>{props.inputLabel} </label>
            <input
                className={`label label-${props.inputClassName}`}
                type={inputType}
                name={props.inputName}
                placeholder={props.inputPlaceholder}
                onChange={props.onChange}
            />
        </div>
    );
}
