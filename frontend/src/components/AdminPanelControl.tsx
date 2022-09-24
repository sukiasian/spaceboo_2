import { ChangeEventHandler } from 'react';
import Lockers from './Lockers';
import SearchBar from './SearchBar';
import Titles from './Titles';

export default function AdminPanelControl(): JSX.Element {
    const searchBarPlaceholder = 'Поиск (id, адрес, email пользователя, lockerId)';
    const handleSearch: ChangeEventHandler = (e) => {};

    return (
        <div className="admin-panel__interface admin-panel__control">
            <Titles heading="Управление" />
            <SearchBar placeholder={searchBarPlaceholder} handleChange={handleSearch} />
            <Lockers />
        </div>
    );
}
