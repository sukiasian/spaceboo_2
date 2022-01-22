import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import SpaceInputFieldsForCreateAndEdit from '../components/SpaceInputFieldsForCreateAndEdit';
import { requestUserLoginState } from '../redux/actions/authActions';
import { postUploadSpaceImagesAction } from '../redux/actions/imageActions';
import { postProvideSpaceAction } from '../redux/actions/spaceActions';
import { IReduxState } from '../redux/reducers/rootReducer';
import { SagaTasks } from '../types/types';
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
    const applyEffectsOnInit = (): void => {
        handleDocumentTitleOnInit();
        dispatch(requestUserLoginState());
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
    const handleSubmitButton = (): void => {
        dispatch(postProvideSpaceAction(provideSpaceData!));
    };
    const uploadPhotosAfterSpaceIsCreated = (): void => {
        if (provideSpaceSuccessResponse) {
            dispatch(
                postUploadSpaceImagesAction({
                    spaceId: provideSpaceSuccessResponse.data.id,
                    images: provideSpaceData!.spaceImages!,
                })
            );
        } else if (provideSpaceFailureResponse) {
            // dispatch remove space
        }
    };
    const renderProvideForm = (): JSX.Element => {
        return (
            <form className="provide-space__form" onSubmit={handleSubmit}>
                <SpaceInputFieldsForCreateAndEdit
                    buttonClassName="button button--primary button--submit"
                    buttonText="Предоставить пространство"
                    componentIsFor={'provideSpaceData'}
                    handleSubmitButton={handleSubmitButton}
                />
            </form>
        );
    };

    useEffect(applyEffectsOnInit, [dispatch]);
    useEffect(redirectByLoginStateCondition, [userLoginState, navigate]);
    useEffect(uploadPhotosAfterSpaceIsCreated, [provideSpaceSuccessResponse]);

    return (
        <section className="provide-space-section">
            <div className="provide-space__title">
                <h2 className="heading heading--secondary heading--provide-space__title">Предоставить пространство</h2>
            </div>
            <div className="provide-space__form-container">{renderProvideForm()}</div>
            <div onClick={() => dispatch({ type: SagaTasks.POST_UPLOAD_SPACE_IMAGES })}> click here </div>
        </section>
    );
}
