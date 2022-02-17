import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Alert from '../components/Alert';
import Titles from '../components/Titles';
import { PasswordChangeForm } from '../forms/PasswordChangeForm';
import { annualizePostPasswordChangeResponses } from '../redux/actions/authActions';
import { IReduxState } from '../redux/reducers/rootReducer';
import { AlertTypes } from '../types/types';

export default function SecuritySettingsPage(): JSX.Element {
    const { postPasswordChangeSuccessResponse, postPasswordChangeFailureResponse } = useSelector(
        (state: IReduxState) => state.authStorage
    );
    const dispatch = useDispatch();
    const applyEffectsOnInit = (): (() => void) => {
        return () => {
            dispatch(annualizePostPasswordChangeResponses());
        };
    };
    const renderChangePasswordStatusAlert = (): JSX.Element | void => {
        if (postPasswordChangeSuccessResponse) {
            return <Alert alertType={AlertTypes.SUCCESS} alertMessage={postPasswordChangeSuccessResponse.message!} />;
        } else if (postPasswordChangeFailureResponse) {
            return <Alert alertType={AlertTypes.SUCCESS} alertMessage={postPasswordChangeFailureResponse.message!} />;
        }
    };

    useEffect(applyEffectsOnInit, []);

    return (
        <div className="security-settings">
            <Titles heading="Безопасность" />
            <section className="password-change">
                <div className="password-change__title">
                    <h2 className="heading heading--secondary password-change__title">Смена пароля</h2>
                </div>
                <PasswordChangeForm />
                {renderChangePasswordStatusAlert()}
            </section>
        </div>
    );
}
