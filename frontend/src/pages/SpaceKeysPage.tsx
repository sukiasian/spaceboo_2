import { useSelector } from 'react-redux';
import SpaceKey from '../components/SpaceKey';
import Titles from '../components/Titles';
import { IReduxState } from '../redux/reducers/rootReducer';

// NOTE: при cancel appointment мы должны аннулировать fetchSpacesForKeyControlSuccessResponse
export default function SpaceKeysPage(): JSX.Element {
    const { fetchSpacesForKeyControlSuccessResponse } = useSelector((state: IReduxState) => state.spaceStorage);
    const spacesForKeyControl = fetchSpacesForKeyControlSuccessResponse?.data;
    const renderSpaceKeys = (): JSX.Element | void => {
        if (spacesForKeyControl) {
            const spaceKeys = spacesForKeyControl.map((space: any, i: number) => {
                return <SpaceKey space={space} key={i} />;
            });

            return <div className="space-keys">{spaceKeys}</div>;
        }
    };
    const renderDescriptionWhenNoKeys = (): JSX.Element => {
        return (
            <div className="description">
                <h2 className="heading heading--secondary">Пока нет бронирований пространств с умными замками.</h2>
            </div>
        );
    };

    return (
        <section className="keys-page-section">
            <Titles heading={'Ключи'} />
            {renderSpaceKeys()}
            {renderDescriptionWhenNoKeys()}
        </section>
    );
}
