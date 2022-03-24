import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Alert from '../components/Alert';
import ProvideSpaceForm from '../forms/ProvideSpaceForm';
import { fetchUserLoginStateAction } from '../redux/actions/authActions';
import { annualizeProvideSpaceDataAction, annualizeProvideSpaceResponsesAction } from '../redux/actions/spaceActions';
import { IReduxState } from '../redux/reducers/rootReducer';
import { UrlPathname } from '../types/types';
import { updateDocumentTitle } from '../utils/utilFunctions';

export default function ProvideSpacePage(): JSX.Element {
    const { fetchUserLoginStateSuccessResponse } = useSelector((state: IReduxState) => state.authStorage);
    const { postProvideSpaceSuccessResponse, postProvideSpaceFailureResponse } = useSelector(
        (state: IReduxState) => state.spaceStorage
    );
    const userLoginState = fetchUserLoginStateSuccessResponse?.data;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleDocumentTitleOnInit = (): void => {
        updateDocumentTitle('Spaceboo | Предоставить пространство');
    };
    const applyEffectsOnInit = (): (() => void) => {
        handleDocumentTitleOnInit();
        dispatch(fetchUserLoginStateAction());

        return () => {
            dispatch(annualizeProvideSpaceResponsesAction());
            dispatch(annualizeProvideSpaceDataAction());
        };
    };
    console.log(postProvideSpaceFailureResponse);

    const redirectByLoginStateCondition = (): void => {
        if (userLoginState?.isLoaded) {
            if (!userLoginState?.loggedIn && !userLoginState?.confirmed) {
                navigate('/login');
            } else if (!userLoginState?.confirmed) {
                window.history.back();
            }
        }
    };
    const redirectToMySpacesAfterProvideSpace = (): void => {
        if (postProvideSpaceSuccessResponse) {
            navigate(UrlPathname.SPACES);
        }
    };
    const renderProvideForm = (): JSX.Element => {
        return <ProvideSpaceForm />;
    };
    const renderAlertOnSubmitError = (): JSX.Element => {
        return <Alert failureResponse={postProvideSpaceFailureResponse} />;
    };

    useEffect(applyEffectsOnInit, [dispatch]);
    useEffect(redirectByLoginStateCondition, [userLoginState, navigate]);
    useEffect(redirectToMySpacesAfterProvideSpace, [postProvideSpaceSuccessResponse, dispatch, navigate]);

    return (
        <section className="provide-space-section">
            <div className="provide-space__title">
                <h2 className="heading heading--secondary heading--provide-space__title">Предоставить пространство</h2>
            </div>
            <div className="provide-space__form-container">{renderProvideForm()}</div>
            {renderAlertOnSubmitError()}
        </section>
    );
}
