import { ChangeEventHandler } from 'react';
import { IComponentDivProps } from '../types/types';

interface IInputWithLableProps extends IComponentDivProps {
    inputLabel: string;
    inputName: string;
    inputPlaceholder: string;
    inputClassName: string;
    onChange: ChangeEventHandler<HTMLInputElement>;
}

export interface IFormInputs {
    [key: string]: {
        mainDivClassName: string;
        inputLabel: string;
        inputName: string;
        inputPlaceholder: string;
        inputClassName: string;
        value?: string;
    };
}

export default function InputWithLabel(props: IInputWithLableProps) {
    return (
        <div className={`${props.mainDivClassName}-input-container`}>
            <label>{props.inputLabel} </label>
            <input
                className={`label label-${props.inputClassName}`}
                name={props.inputName}
                placeholder={props.inputPlaceholder}
                onChange={props.onChange}
            />
        </div>
    );
}
