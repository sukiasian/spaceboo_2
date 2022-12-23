import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PairLockerModal from '../modals/PairLockerModal';
import {
    annualizePostPairLockerResponsesAction,
    fetchLockerRequestsByQueryAction,
    setFetchAllLockerRequestsQueryDataAction,
} from '../redux/actions/adminActions';
import { ILockerRequestsQueryString } from '../redux/reducers/adminReducer';
import { IReduxState } from '../redux/reducers/rootReducer';
import { QueryDefaultValue } from '../types/types';
import DisappearingAlert from './DisappearingAlert';
import LockerRequest from './LockerRequest';
import PaginationBar from './PaginationBar';

export default function AdminPanelRequests(): JSX.Element {
    const [spaceIdForRequest, setSpaceIdForRequest] = useState<string>();

    const {
        fetchAllLockerRequestsQueryData,
        fetchUnprocessedRequestsAmountSuccessResponse,
        fetchLockerRequestsByQuerySuccessResponse,
        postPairLockerSuccessResponse,
    } = useSelector((state: IReduxState) => state.adminStorage);

    const dispatch = useDispatch();

    const requestsAmount = fetchUnprocessedRequestsAmountSuccessResponse?.data;
    const requests = fetchLockerRequestsByQuerySuccessResponse?.data;

    const getNumberOfPages = () => {
        const remainder = requestsAmount % QueryDefaultValue.LIMIT;
        const division = requestsAmount / QueryDefaultValue.LIMIT;

        return remainder === 0 ? division : division + 1;
    };

    const getRequestsByQuery = () => {
        dispatch(
            fetchLockerRequestsByQueryAction(fetchAllLockerRequestsQueryData || ({} as ILockerRequestsQueryString))
        );
    };

    const changePage = (i: number): void => {
        let newQueryData: ILockerRequestsQueryString = {
            ...(fetchAllLockerRequestsQueryData || ({} as ILockerRequestsQueryString)),
        };

        newQueryData.page = i;

        dispatch(setFetchAllLockerRequestsQueryDataAction(newQueryData));
    };

    const renderRequests = (): JSX.Element[] | null => {
        return requests
            ? requests.map((request: Record<any, any>, i: number) => (
                  <LockerRequest request={request} setSpaceIdOfRequest={setSpaceIdForRequest} key={i} />
              ))
            : null;
    };

    useEffect(getRequestsByQuery, [fetchAllLockerRequestsQueryData]);

    return (
        <div className="admin-panel__interface admin-panel__requests">
            <section className="locker-requests-section">
                <div className="locker-requests">{renderRequests()}</div>
                <PairLockerModal spaceId={spaceIdForRequest!} />
            </section>
            <section className="pagination-bar-section">
                <PaginationBar
                    numberOfPages={getNumberOfPages()}
                    handleClick={changePage}
                    activePageToCompareWithActualPage={
                        fetchAllLockerRequestsQueryData?.page ? (fetchAllLockerRequestsQueryData.page as number) : 0
                    }
                />
            </section>
            <DisappearingAlert successResponse={postPairLockerSuccessResponse} />
        </div>
    );
}
