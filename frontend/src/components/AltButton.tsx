import { IComponentClassNameProps } from '../types/types';

export interface IAltButtonProps extends IComponentClassNameProps {
    buttonText?: string;
    handleClick?: (...props: any) => any;
}

export default function AltButton(props: IAltButtonProps): JSX.Element {
    const mainDivClassName = props.mainDivClassName || 'primary';

    return (
        <div className={`button button--${mainDivClassName} ${props.additionalClassNames}`} onClick={props.handleClick}>
            {props.buttonText}
        </div>
    );
}
