import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Alert from '../components/Alert';
import SpaceInputFieldsForCreateAndEdit from '../components/SpaceInputFieldsForCreateAndEdit';
import { fetchUserLoginStateAction } from '../redux/actions/authActions';
import {
    annualizeProvideSpaceData,
    annualizeProvideSpaceResponses,
    postProvideSpaceAction,
} from '../redux/actions/spaceActions';
import { IReduxState } from '../redux/reducers/rootReducer';
import { UrlPathnames } from '../types/types';
import { handleFormSubmit, updateDocumentTitle } from '../utils/utilFunctions';

export default function ProvideSpacePage(): JSX.Element {
    const { fetchUserLoginStateSuccessResponse } = useSelector((state: IReduxState) => state.authStorage);
    const { provideSpaceData, postProvideSpaceSuccessResponse, postProvideSpaceFailureResponse } = useSelector(
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
            dispatch(annualizeProvideSpaceResponses());
            dispatch(annualizeProvideSpaceData());
        };
    };
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
            navigate(UrlPathnames.SPACES);
        }
    };
    const handleSubmitButton = (): void => {
        dispatch(postProvideSpaceAction(provideSpaceData!));
    };
    const renderProvideForm = (): JSX.Element => {
        return (
            <form className="provide-space__form" onSubmit={handleFormSubmit} encType="multipart/form-data">
                <SpaceInputFieldsForCreateAndEdit
                    buttonClassName="button button--primary button--submit"
                    buttonText="Предоставить пространство"
                    componentIsFor={'provideSpaceData'}
                    handleSubmitButton={handleSubmitButton}
                />
            </form>
        );
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
