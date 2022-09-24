import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import Titles from '../components/Titles';
import { IReduxState } from '../redux/reducers/rootReducer';
import { ReactNode, useEffect } from 'react';
import { fetchUserSpacesAction } from '../redux/actions/spaceActions';
import LoadingSpin from '../components/LoadingSpin';
import { UrlPathname } from '../types/types';
import AddButton from '../buttons/AddButton';
import SpacesWithMenus from '../components/SpacesWithMenus';
import SpaceOwnerMenu from '../components/SpaceOwnerMenu';

export default function MySpacesPage(): JSX.Element {
    const { fetchUserSpacesSuccessResponse } = useSelector((state: IReduxState) => state.spaceStorage);

    const spaces = fetchUserSpacesSuccessResponse?.data;

    const dispatch = useDispatch();

    const applyEffectsOnInit = (): void => {
        dispatch(fetchUserSpacesAction());
    };

    const renderLoadingSpin = (): ReactNode => {
        if (!fetchUserSpacesSuccessResponse) {
            return <LoadingSpin />;
        }
    };

    const renderAddSpaceButton = (): JSX.Element | void => {
        if (fetchUserSpacesSuccessResponse) {
            return (
                <NavLink to={UrlPathname.PROVIDE_SPACE}>
                    <AddButton /> abcdefg
                </NavLink>
            );
        }
    };

    useEffect(applyEffectsOnInit, [dispatch]);

    return (
        <section className="my-spaces-page">
            <Titles heading="Мои пространства" />
            <section className="spaces-section">
                {renderLoadingSpin()}
                {/* below should be grid or flex */}
                <div className="spaces">
                    <SpacesWithMenus
                        spaces={spaces}
                        children={(spaceId: string, handleOnDemounting: (...props: any) => any) => (
                            <SpaceOwnerMenu spaceId={spaceId} handleOnDemounting={handleOnDemounting} />
                        )}
                        childrenRequiredArgument={'id'}
                        childrenRequiredDemountingHandler={true}
                    />
                    {renderAddSpaceButton()}
                </div>
            </section>
        </section>
    );
}
