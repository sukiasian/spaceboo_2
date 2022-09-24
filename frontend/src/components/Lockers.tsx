import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLockersByQueryAction } from '../redux/actions/adminActions';
import { IReduxState } from '../redux/reducers/rootReducer';
import Locker from './Locker';

export default function Lockers(): JSX.Element {
    const { fetchLockersQueryData, fetchLockersByQuerySuccessResponse } = useSelector(
        (state: IReduxState) => state.adminStorage
    );

    const dispatch = useDispatch();

    const lockers = fetchLockersByQuerySuccessResponse?.data;

    const getLockersByQuery = (): void => {
        dispatch(fetchLockersByQueryAction(fetchLockersQueryData || {}));
    };

    const renderLockers = lockers?.map((locker: Record<any, any>) => <Locker locker={locker} />);

    useEffect(getLockersByQuery, [fetchLockersQueryData]);

    return (
        <section className="lockers-section">
            <div className="lockers">{renderLockers}</div>
        </section>
    );
}
