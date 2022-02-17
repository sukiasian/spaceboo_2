import { useSelector } from 'react-redux';
import Titles from '../components/Titles';
import { IReduxState } from '../redux/reducers/rootReducer';

// NOTE: how to handle mobile version? through styles or through here?
export default function GeneralSettingsPage(): JSX.Element {
    const { fetchCurrentUserSuccessResponse } = useSelector((state: IReduxState) => state.userStorage);
    const userData = fetchCurrentUserSuccessResponse?.data;

    return (
        <div className="general-settings">
            <Titles heading={'Основное'} />
            <div className="general-settings__left-column">
                <div className="general-settings__left-column__user-image">
                    <img src={userData?.avatarUrl} alt="Пользователь" />
                </div>
            </div>
            <div className="general-settings__right-column">
                <div className=""></div>
            </div>
        </div>
    );
}
