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
import {
    annualizeLockerRequestResponsesAction,
    annualizeLockerReturnRequestResponsesAction,
} from '../redux/actions/lockerRequestsActions';

export default function MySpacesPage(): JSX.Element {
    const { fetchUserSpacesSuccessResponse } = useSelector((state: IReduxState) => state.spaceStorage);
    const {
        postRequestLockerSuccessResponse,
        postRequestLockerFailureResponse,
        postRequestLockerReturnSuccessResponse,
        postRequestLockerReturnFailureResponse,
    } = useSelector((state: IReduxState) => state.lockerRequestsStorage);

    const spaces = fetchUserSpacesSuccessResponse?.data;

    const dispatch = useDispatch();

    const annualizeLockerRequestsResponses = (): void => {
        dispatch(annualizeLockerRequestResponsesAction());
        dispatch(annualizeLockerReturnRequestResponsesAction());
    };

    const applyEffectsOnInit = (): (() => void) => {
        dispatch(fetchUserSpacesAction());

        return () => {
            annualizeLockerRequestsResponses();
        };
    };

    const renderLoadingSpin = (): ReactNode => {
        if (!fetchUserSpacesSuccessResponse) {
            return <LoadingSpin />;
        }
    };

    useEffect(applyEffectsOnInit, []);

    return (
        <section className="page my-spaces-page">
            <Titles heading="Мои пространства" />
            <div className="page-box">
                <section className="spaces-section">
                    {renderLoadingSpin()}
                    <div className="spaces">
                        <SpacesWithMenus
                            spaces={spaces}
                            children={(
                                spaceId: string,
                                handleOnDemounting: (...props: any) => any,
                                lockerId: string
                            ) => (
                                <SpaceOwnerMenu
                                    spaceId={spaceId}
                                    handleOnDemounting={handleOnDemounting}
                                    lockerId={lockerId}
                                />
                            )}
                            childrenRequiredArgument={'id'}
                            childrenRequiredDemountingHandler={true}
                        />
                        <div className="provide-space-link-container">
                            <NavLink to={UrlPathname.PROVIDE_SPACE}>
                                <AddButton />
                            </NavLink>
                        </div>
                    </div>
                </section>
            </div>
        </section>
    );
}
