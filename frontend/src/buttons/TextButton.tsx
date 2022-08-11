import { MouseEventHandler } from 'react';

interface ITextButtonProps {
    text: string;
    handleClick?: MouseEventHandler<HTMLDivElement>;
}

export default function TextButton({ text, handleClick }: ITextButtonProps): JSX.Element {
    return (
        <div className="button button--text" onClick={handleClick}>
            {text}
        </div>
    );
}
