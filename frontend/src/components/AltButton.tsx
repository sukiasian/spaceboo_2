import { IComponentClassNameProps } from '../types/types';

export interface IAltButtonProps extends IComponentClassNameProps {
    buttonText?: string;
    handleClick?: (...props: any) => any;
    children?: JSX.Element;
}

export default function AltButton(props: IAltButtonProps): JSX.Element {
    const mainDivClassName = props.mainDivClassName || 'primary';
    const { children } = props;

    return (
        <div className={`button ${mainDivClassName}`} onClick={props.handleClick}>
            {children}
            {props.buttonText}
        </div>
    );
}
