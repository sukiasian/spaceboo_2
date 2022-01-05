import { IComponentClassNameProps } from '../types/types';

interface IModalsTitleProps extends IComponentClassNameProps {
    heading: string;
    paragraph?: string;
    children?: JSX.Element;
}

export default function Titles(props: IModalsTitleProps): JSX.Element {
    const renderParagraph = (): JSX.Element | void => {
        if (props.paragraph) {
            return <p className="paragraph paragraph--light">{props.paragraph}</p>;
        }
    };
    return (
        <div className={props.mainDivClassName}>
            <h2 className="heading heading--secondary modals-title">{props.heading}</h2>
            {renderParagraph()}
            {props.children}
        </div>
    );
}
