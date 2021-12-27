import { IComponentDivProps } from '../types/types';

interface IModalsTitleProps extends IComponentDivProps {
    modalsHeading: string;
    modalsParagraph: string;
}

export default function ModalsTitle(props: IModalsTitleProps): JSX.Element {
    return (
        <div className={props.mainDivClassName}>
            <h2 className="heading heading--secondary modals-title">{props.modalsHeading}</h2>
            <p className="paragraph paragraph--light"> {props.modalsParagraph}</p>
        </div>
    );
}
