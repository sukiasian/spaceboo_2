import { ChangeEventHandler } from 'react';

interface ISearchBarProps {
    placeholder: string;
    handleChange: ChangeEventHandler<HTMLInputElement>;
}

export default function SearchBar(props: ISearchBarProps): JSX.Element {
    const { placeholder, handleChange } = props;

    return (
        <div className="search-bar">
            <input className="search-bar__input" placeholder={placeholder} onChange={handleChange} />
        </div>
    );
}
