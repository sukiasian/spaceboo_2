import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Alert from '../components/Alert';
import SpaceInputFieldsForCreateAndEdit from '../components/SpaceInputFieldsForCreateAndEdit';
import { requestUserLoginState } from '../redux/actions/authActions';
import { postProvideSpaceAction, setProvideSpaceSuccessResponseAction } from '../redux/actions/spaceActions';
import { IReduxState } from '../redux/reducers/rootReducer';
import { AlertTypes } from '../types/types';
import { handleSubmit, updateDocumentTitle } from '../utils/utilFunctions';

export default function ProvideSpacePage(): JSX.Element {
    const { userLoginState } = useSelector((state: IReduxState) => state.authStorage);
    const { provideSpaceData, provideSpaceSuccessResponse, provideSpaceFailureResponse } = useSelector(
        (state: IReduxState) => state.spaceStorage
    );
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleDocumentTitleOnInit = (): void => {
        updateDocumentTitle('Spaceboo | Предоставить пространство');
    };
    const applyEffectsOnInit = (): (() => void) => {
        handleDocumentTitleOnInit();
        dispatch(requestUserLoginState());

        return () => {
            // annualize responses
            // NOTE можно ли использовать reduxAction(undefined as Payload) вместо annualizeReduxAction() ? т.е. просто передать undefined.
            dispatch(setProvideSpaceSuccessResponseAction());
        };
    };
    const redirectByLoginStateCondition = (): void => {
        if (userLoginState.isLoaded) {
            if (!userLoginState.loggedIn && !userLoginState.confirmed) {
                navigate('/login');
            } else if (!userLoginState.confirmed) {
                window.history.back();
            }
        }
    };
    const redirectToMySpacesAfterProvideSpace = (): void => {
        if (provideSpaceSuccessResponse) {
            dispatch(setProvideSpaceSuccessResponseAction());
        }

        // TODO не использовать захардкоженные

        if (provideSpaceSuccessResponse) {
            navigate('/spaces');
        }
    };
    const handleSubmitButton = (): void => {
        dispatch(postProvideSpaceAction(provideSpaceData!));
    };
    const renderProvideForm = (): JSX.Element => {
        return (
            <form className="provide-space__form" onSubmit={handleSubmit} encType="multipart/form-data">
                <SpaceInputFieldsForCreateAndEdit
                    buttonClassName="button button--primary button--submit"
                    buttonText="Предоставить пространство"
                    componentIsFor={'provideSpaceData'}
                    handleSubmitButton={handleSubmitButton}
                />
            </form>
        );
    };
    const renderAlertOnSubmitError = (): JSX.Element | void => {
        if (provideSpaceFailureResponse) {
            return (
                <Alert alertType={AlertTypes.FAILURE} alertMessage={provideSpaceFailureResponse.message as string} />
            );
        }
    };

    useEffect(applyEffectsOnInit, [dispatch]);
    useEffect(redirectByLoginStateCondition, [userLoginState, navigate]);
    // перенаправить на страницу мои пространства при успешном ответе
    useEffect(redirectToMySpacesAfterProvideSpace, [provideSpaceSuccessResponse, navigate]);

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
