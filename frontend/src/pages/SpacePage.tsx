import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchSpaceByIdAction } from '../redux/actions/spaceActions';
import { IReduxState } from '../redux/reducers/rootReducer';

export default function SpacePage(): JSX.Element {
    const { fetchSpaceByIdSuccessResponse, fetchSpaceByIdFailureResponse } = useSelector(
        (state: IReduxState) => state.spaceStorage
    );
    const spaceData = fetchSpaceByIdSuccessResponse?.data;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();
    const requestSpaceById = (): void => {
        const { spaceId } = params;

        dispatch(fetchSpaceByIdAction(spaceId!));
    };
    const applyEffectsOnInit = (): void => {
        requestSpaceById();
    };
    const redirectIfSpaceIsNotFound = (): void => {
        if (fetchSpaceByIdFailureResponse) {
            navigate('/not-found');
        }
    };

    useEffect(applyEffectsOnInit, []);
    useEffect(redirectIfSpaceIsNotFound, [fetchSpaceByIdFailureResponse, navigate]);

    return (
        <section className="space-page-container">
            <div className="space-page__flows">
                <div className="space-page__flows--left">
                    <div className="space-page__image">
                        <img src={`/${spaceData?.imagesUrl[0]}` || '/no-space-image.jpg'} alt="Пространство" />
                    </div>
                </div>
                <div className="space-page__flows--right"></div>
            </div>
        </section>
    );
}
