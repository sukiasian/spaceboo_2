import { MouseEventHandler } from 'react';

interface ITextButtonProps {
    children?: JSX.Element | string;
    handleClick?: MouseEventHandler<HTMLDivElement>;
}

export default function TextButton({ children, handleClick }: ITextButtonProps): JSX.Element {
    return (
        <div className="button button--text" onClick={handleClick}>
            {children}
        </div>
    );
}
