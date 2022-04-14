import { IComponentClassNameProps } from '../types/types';

interface IModalsTitleProps extends IComponentClassNameProps {
    heading: string;
    paragraph?: string;
    children?: JSX.Element;
}

export default function Titles(props: IModalsTitleProps): JSX.Element {
    const renderParagraph = (): JSX.Element | void => {
        if (props.paragraph) {
            return (
                <div className="titles__paragraph-container">
                    <p className="paragraph paragraph--light titles__paragraph">{props.paragraph}</p>{' '}
                </div>
            );
        }
    };

    return (
        <div className={`titles ${props.mainDivClassName ?? ''}`}>
            <div className="titles__heading-container">
                <h1 className="heading heading--primary titles__heading">{props.heading}</h1>
            </div>
            {renderParagraph()}
            {props.children}
        </div>
    );
}
