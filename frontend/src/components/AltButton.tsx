import { IComponentDivProps } from '../types/types';

interface IAllButtonProps extends IComponentDivProps {
    buttonText: string;
}

export default function AllButton(props: IAllButtonProps): JSX.Element {
    return <div className={`button ${props.mainDivClassName}`}>{props.buttonText}</div>;
}
