import { useEffect } from 'react';
import { defineActiveClassName } from '../utils/utilFunctions';

interface IPaginationBarProps {
    numberOfPages: number;
    handleClick: (i: number) => void;
    activePageToCompareWithActualPage: number;
}

export default function PaginationBar(props: IPaginationBarProps): JSX.Element | null {
    const { numberOfPages, handleClick, activePageToCompareWithActualPage } = props;

    const renderPages = (): JSX.Element[] => {
        const pages: JSX.Element[] = [];

        for (let i = 1; i < numberOfPages; i++) {
            pages.push(
                <div
                    className={`pagination-bar__page ${defineActiveClassName(activePageToCompareWithActualPage, i)}`}
                    onClick={() => {
                        handleClick(i);
                    }}
                    key={i}
                >
                    {i}
                </div>
            );
        }

        return pages;
    };

    useEffect(() => {}, [activePageToCompareWithActualPage]);

    return numberOfPages > 0 ? <div className="pagination-bar">{renderPages()} </div> : null;
}
