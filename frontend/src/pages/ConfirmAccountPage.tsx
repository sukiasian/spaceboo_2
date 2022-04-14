import { MutableRefObject, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Alert from '../components/Alert';
import SixDigitVerification from '../components/SixDigitVerification';
import Timer from '../components/Timer';
import { postSendVerificationCodeAction } from '../redux/actions/emailVerificationActions';
import { EmailPurpose, IPostSendVerificationEmailPayload } from '../redux/reducers/emailVerificationReducer';
import { IReduxState } from '../redux/reducers/rootReducer';
import { LocalStorageItem } from '../types/types';
import { updateDocumentTitle } from '../utils/utilFunctions';

export default function ConfirmAccountPage(): JSX.Element {
    const timerRef = useRef<NodeJS.Timeout>();
    const {
        postSendVerificationCodeSuccessResponse,
        postSendVerificationCodeFailureResponse,
        postCheckVerificationCodeSuccessResponse,
        postCheckVerificationCodeFailureResponse,
    } = useSelector((state: IReduxState) => state.emailVerificationStorage);
    const dispatch = useDispatch();
    const handleDocumentTitle = (): void => {
        const documentTitle = 'Spaceboo | Последний шаг!';

        updateDocumentTitle(documentTitle);
    };
    const applyEffectsOnInit = (): void => {
        handleDocumentTitle();
    };
    const clearTimerOnUnmount = (): (() => void) => {
        const timer = timerRef.current!;

        return (): void => {
            clearTimeout(timer);
        };
    };
    const handleGetNewCodeToConfirmAccount = (): void => {
        const payload: IPostSendVerificationEmailPayload = {
            purpose: EmailPurpose[10],
        };

        dispatch(postSendVerificationCodeAction(payload));
    };
    const renderSendCodeAgainResponseAlert = (): JSX.Element => {
        return (
            <Alert
                successResponse={postSendVerificationCodeSuccessResponse}
                failureResponse={postSendVerificationCodeFailureResponse}
            />
        );
    };
    const renderSendCodeOptions = (): JSX.Element | void => {
        let lastVerificationRequested: string | number | undefined = localStorage.getItem(
            LocalStorageItem.LAST_VERIFICATION_REQUESTED
        ) as string;

        if (lastVerificationRequested) {
            lastVerificationRequested = parseInt(lastVerificationRequested, 10);

            const interval = 2 * 60 * 1000;
            const timeLeft = (lastVerificationRequested as number) + interval - Date.now();

            return timeLeft > 0 ? (
                <div className="send-code-options__wait">
                    <p className="paragraph"> Повторно код можно получить в течение </p>
                    <Timer timerRef={timerRef as MutableRefObject<NodeJS.Timeout>} timeLeft={timeLeft} />
                </div>
            ) : (
                <div className="send-code-options__get-new-code">
                    <p className="paragraph" onClick={handleGetNewCodeToConfirmAccount}>
                        Получить новый код
                    </p>
                    {renderSendCodeAgainResponseAlert()}
                </div>
            );
        }
    };
    const renderCheckCodeResponseAlert = (): JSX.Element | void => {
        if (postCheckVerificationCodeSuccessResponse) {
            return (
                <Alert
                    successResponse={postCheckVerificationCodeSuccessResponse}
                    failureResponse={postCheckVerificationCodeFailureResponse}
                />
            );
        }
    };

    useEffect(applyEffectsOnInit, []);
    useEffect(clearTimerOnUnmount, []);

    return (
        <div className="page account-confirmation-page">
            <section className="account-confirmation__titles">
                <div className="heading">
                    <h2 className="heading heading--secondary"> Последний шаг - подтвердите аккаунт. </h2>
                    <h3 className="heading heading--tertiary">На вашу электронную почту отправлено письмо с кодом.</h3>
                    <p className="paragraph"> Введите полученный 6-значный код. </p>
                </div>

                <SixDigitVerification />
                <div className="send-code-options"> {renderSendCodeOptions()} </div>
                {renderSendCodeAgainResponseAlert()}
                {renderCheckCodeResponseAlert()}
            </section>
        </div>
    );
}
