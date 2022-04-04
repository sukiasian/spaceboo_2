import { useDispatch } from 'react-redux';
import { fetchSpacesForKeyControlAction } from '../redux/actions/spaceActions';

interface ISpaceKeyProps {
    space: any;
}

// TODO: once we connected locker
export default function SpaceKey(props: ISpaceKeyProps): JSX.Element {
    const { space } = props;
    const { address, roomsNumber } = space;
    const dispatch = useDispatch();
    const toggleLock = (): void => {
        // dispatch(toggleLockAction) -- should modify spaces
        dispatch(fetchSpacesForKeyControlAction());
    };
    const defineSpaceKeyClassNameByLockStatus = (): string => {
        // NOTE: остальное дело за CSS - выбор цвета (красный для space-key--to-close и зеленый для space-key--to-open)
        return space.lockerOpened ? 'space-key--to-close' : 'space-key--to-open';
    };

    return (
        <div className={`space-key ${defineSpaceKeyClassNameByLockStatus()}`} onClick={toggleLock}>
            <div className="space-secondary-data">
                <div className="space-secondary-data__rooms-number">{roomsNumber} комн.</div>
                <div className="space-secondary-data__locker-status">TODO: LOCKER STATUS</div>
            </div>
            <div className="space-primary-data">
                <div className="space-data__address">
                    <h3 className="heading heading--tertiary">{address}</h3>
                </div>
            </div>
        </div>
    );
}
