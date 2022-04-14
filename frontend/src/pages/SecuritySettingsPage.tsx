import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Alert from '../components/Alert';
import Titles from '../components/Titles';
import { PasswordChangeForm } from '../forms/PasswordChangeForm';
import { annualizePostPasswordChangeResponsesAction } from '../redux/actions/authActions';
import { IReduxState } from '../redux/reducers/rootReducer';

export default function SecuritySettingsPage(): JSX.Element {
    const { postPasswordChangeSuccessResponse, postPasswordChangeFailureResponse } = useSelector(
        (state: IReduxState) => state.authStorage
    );
    const dispatch = useDispatch();
    const applyEffectsOnInit = (): (() => void) => {
        return () => {
            dispatch(annualizePostPasswordChangeResponsesAction());
        };
    };
    const renderChangePasswordResponseAlert = (): JSX.Element => {
        return (
            <Alert
                successResponse={postPasswordChangeSuccessResponse}
                failureResponse={postPasswordChangeFailureResponse}
            />
        );
    };

    useEffect(applyEffectsOnInit, []);

    return (
        <div className="settings-panel security-settings">
            <Titles heading="Безопасность" />
            <section className="password-change">
                <div className="password-change__title">
                    <h2 className="heading heading--secondary password-change__title">Смена пароля</h2>
                </div>
                <PasswordChangeForm />
                {renderChangePasswordResponseAlert()}
            </section>
        </div>
    );
}
