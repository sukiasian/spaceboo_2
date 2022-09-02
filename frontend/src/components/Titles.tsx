import { IComponentClassNameProps } from '../types/types';

interface ITitleProps extends IComponentClassNameProps {
    heading: string;
    paragraph?: string;
    children?: JSX.Element;
}

export default function Titles(props: ITitleProps): JSX.Element {
    const renderParagraph = (): JSX.Element | void => {
        if (props.paragraph) {
            return <p className="paragraph paragraph--light titles__paragraph">{props.paragraph}</p>;
        }
    };

    return (
        <div className={`titles ${props.mainDivClassName ?? ''}`}>
            <h1 className="heading heading--primary titles__heading">{props.heading}</h1>
            {renderParagraph()}
            {props.children}
        </div>
    );
}
