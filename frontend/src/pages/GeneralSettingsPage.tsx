import { ChangeEventHandler, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Titles from '../components/Titles';
import UserAvatarOrInitials from '../components/UserAvatarOrInitials';
import {
    annualizeDeleteUserAvatarResponsesAction,
    annualizePostUploadUserAvatarResponsesAction,
    deleteUserAvatarAction,
    postUploadUserAvatarAction,
} from '../redux/actions/imageActions';
import { fetchCurrentUserAction } from '../redux/actions/userActions';
import { IReduxState } from '../redux/reducers/rootReducer';
import RemoveIcon from '../icons/RemoveIcon';
import Alert from '../components/Alert';
import EditUserInputs from '../components/EditUserInputs';

// NOTE: how to handle mobile version? through styles or through here? probably through here.
export default function GeneralSettingsPage(): JSX.Element {
    const { fetchCurrentUserSuccessResponse } = useSelector((state: IReduxState) => state.userStorage);
    const {
        postUploadUserAvatarSuccessResponse,
        postUploadUserAvatarFailureResponse,
        deleteUserAvatarSuccessResponse,
        deleteUserAvatarFailureResponse,
    } = useSelector((state: IReduxState) => state.imageStorage);
    const userData = fetchCurrentUserSuccessResponse?.data;
    const dispatch = useDispatch();
    const annualizeComponentResponses = (): void => {
        dispatch(annualizePostUploadUserAvatarResponsesAction());
        dispatch(annualizeDeleteUserAvatarResponsesAction());
    };
    const applyEffectsOnInit = (): (() => void) => {
        return () => {
            annualizeComponentResponses();
        };
    };
    const defineUploadLabel = (): string => {
        return userData?.avatarUrl ? 'Редактировать' : 'Добавить';
    };
    const refreshCurrentUserData = (): void => {
        dispatch(fetchCurrentUserAction());
    };
    const handleUploadUserAvatar: ChangeEventHandler<HTMLInputElement> = (e) => {
        annualizeComponentResponses();
        dispatch(postUploadUserAvatarAction(e.target.files![0]));
    };
    const handleDeleteUserAvatar = (): void => {
        annualizeComponentResponses();
        dispatch(deleteUserAvatarAction());
    };
    const handleEditUser = (): void => {
        annualizeComponentResponses();
        // dispatch(putEditUserAction())

        // NOTE: это должно происходить так: нажал на имя - открылся инпут - поменял имя - нажал на другое место либо интер инпут исчез
        // появилось значение инпута и сразу же задиспатчилось - теперь имя пользователя изменено. и кнопка submut не нужна, можно просто
        // поменять и все.
    };
    const handleAfterSuccessfulAvatarUpload = (): void => {
        if (postUploadUserAvatarSuccessResponse) {
            refreshCurrentUserData();
        }
    };
    const handleAfterSuccessfulAvatarRemove = (): void => {
        if (deleteUserAvatarSuccessResponse) {
            refreshCurrentUserData();
        }
    };
    // NOTE: should only be rendered 1 alert at a time - so if we upload a photo and then change user data then we need to have only  user data change alert
    const defineUserAvatarOrInitialsChildren = (): JSX.Element | undefined => {
        if (userData?.avatarUrl) {
            return (
                <div className="remove-avatar-container" onClick={handleDeleteUserAvatar}>
                    <RemoveIcon />
                </div>
            );
        }
    };
    const renderUploadAvatarAlert = (): JSX.Element | void => {
        return (
            <Alert
                successResponse={postUploadUserAvatarSuccessResponse}
                failureResponse={postUploadUserAvatarFailureResponse}
            />
        );
    };
    const renderDeleteAvatarAlert = (): JSX.Element | void => {
        return (
            <Alert
                successResponse={deleteUserAvatarSuccessResponse}
                failureResponse={deleteUserAvatarFailureResponse}
            />
        );
    };

    useEffect(applyEffectsOnInit, []);
    useEffect(handleAfterSuccessfulAvatarUpload, [postUploadUserAvatarSuccessResponse]);
    useEffect(handleAfterSuccessfulAvatarRemove, [deleteUserAvatarSuccessResponse]);

    // TODO: переделать в грид
    return (
        <div className="settings-panel general-settings">
            <Titles heading="Основное" />
            <div className="general-settings__fields">
                <div className="general-settings__fields__avatar">
                    <UserAvatarOrInitials children={defineUserAvatarOrInitialsChildren()} />
                    <div className="add-user-avatar">
                        <label className="avatar-label add-user-avatar__label">
                            {defineUploadLabel()}
                            <input
                                name="userAvatar"
                                className="add-user-avatar__input"
                                type="file"
                                accept="image/*"
                                onChange={handleUploadUserAvatar}
                            />
                        </label>
                    </div>
                </div>
                <EditUserInputs />
            </div>
            {renderUploadAvatarAlert()}
            {renderDeleteAvatarAlert()}
        </div>
    );
}
