import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import Titles from '../components/Titles';
import { IReduxState } from '../redux/reducers/rootReducer';
import { ReactNode, useEffect, useState } from 'react';
import { requestUserSpaces } from '../redux/actions/spaceActions';
import LoadingSpin from '../components/LoadingSpin';
import Space from '../components/Space';
import { UrlPathnames } from '../types/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function MySpacesPage(): JSX.Element {
    const [spaceActionsDropdownIsOpen, setSpaceActionsDropdownIsOpen] = useState(false);
    const { fetchUserSpacesSuccessResponse } = useSelector((state: IReduxState) => state.spaceStorage);
    const dispatch = useDispatch();
    const applyEffectsOnInit = (): void => {
        dispatch(requestUserSpaces());
    };
    const renderLoadingSpin = (): ReactNode => {
        if (!fetchUserSpacesSuccessResponse) {
            return <LoadingSpin />;
        }
    };
    const renderUserSpaces = (): JSX.Element => {
        return fetchUserSpacesSuccessResponse?.data?.map((space: any, i: number) => {
            return (
                <div className="user-space" key={i}>
                    <Space
                        spaceId={space.id}
                        mainImageUrl={space.imagesUrl[0]}
                        price={space.price}
                        roomsNumber={space.roomsNumber}
                        city={space.city}
                        address={space.address}
                    />
                </div>
            );
        });
    };
    const renderAddSpaceButton = (): JSX.Element | void => {
        if (fetchUserSpacesSuccessResponse) {
            return (
                <NavLink to={UrlPathnames.PROVIDE_SPACE}>
                    <div
                        className="add-button-icon"
                        style={{
                            display: 'block',
                            width: '45px',
                            height: '45px',
                            background: 'url(/images/icons/icon-add.png)',
                            backgroundSize: 'cover',
                        }}
                    ></div>
                </NavLink>
            );
        }
    };
    const renderSpaceActionsDropdown = (): JSX.Element | void => {
        if (spaceActionsDropdownIsOpen) {
            return (
                <div className="space-actions-dropdown-menu">
                    <div className="">
                        <FontAwesomeIcon icon={faCalendar} />
                    </div>
                    <div className=""></div>
                </div>
            );
        }
    };
    useEffect(applyEffectsOnInit, [dispatch]);

    return (
        <section className="my-spaces-page">
            <Titles heading="Мои пространства" />
            <section className="spaces">
                {renderLoadingSpin()}
                {/* below should be grid or flex */}
                <div className="spaces">
                    {renderUserSpaces()}
                    {renderAddSpaceButton()}
                </div>
            </section>
        </section>
    );
}
