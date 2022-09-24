import { useState } from 'react';
import { useSelector } from 'react-redux';
import TripleDotButton from '../buttons/TripleDotButton';
import { IReduxState } from '../redux/reducers/rootReducer';
import Space from './Space';
import SpaceOwnerMenu from './SpaceOwnerMenu';

export default function SpaceForOwner(): JSX.Element {
    const [ownerMenuDropDownIsOpen, setOwnerMenuDropDownIsOpen] = useState(false);

    const { fetchUserSpacesSuccessResponse } = useSelector((state: IReduxState) => state.spaceStorage);

    const userSpaces = fetchUserSpacesSuccessResponse?.data;

    const toggleOwnerMenuDropDown = (): void => {
        setOwnerMenuDropDownIsOpen(!ownerMenuDropDownIsOpen);
    };

    const renderUserSpaces = userSpaces?.map((space: any, i: number) => (
        <Space space={space} index={i} key={i}>
            <>
                <TripleDotButton handleClick={toggleOwnerMenuDropDown} />
                {ownerMenuDropDownIsOpen ? <SpaceOwnerMenu spaceId={''} /> : null}
            </>
        </Space>
    ));

    return <> {renderUserSpaces} </>;
}
