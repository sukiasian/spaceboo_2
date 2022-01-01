import { MutableRefObject, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Alert from '../components/Alert';
import SixDigitVerification from '../components/SixDigitVerification';
import Timer from '../components/Timer';
import { postSendVerificationCodeAction } from '../redux/actions/emailVerificationActions';
import { EmailPurpose, IPostSendVerificationEmailPayload } from '../redux/reducers/emailVerificationReducer';
import { IReduxState } from '../redux/reducers/rootReducer';
import { AlertTypes, CustomResponseMessages, HttpStatus, LocalStorageItems } from '../types/types';
import { updateDocumentTitle } from '../utils/utilFunctions';

export default function ConfirmAccountPage(): JSX.Element {
    const { checkVerificationCodeResponse, sendVerificationCodeResponse } = useSelector(
        (state: IReduxState) => state.emailVerificationStorage
    );
    const timerRef = useRef<NodeJS.Timeout>();
    const dispatch = useDispatch();
    const handleDocumentTitle = (): void => {
        const documentTitle = 'Spaceboo | Последний шаг!';

        updateDocumentTitle(documentTitle);
    };
    const applyEffectsOnInit = (): void => {
        handleDocumentTitle();
    };
    const handleGetNewCodeToConfirmAccount = (): void => {
        const payload: IPostSendVerificationEmailPayload = {
            purpose: EmailPurpose[10],
        };

        // dispatch(annualizePostSendVerification()); // если при изменении (когда придет новый ответ от сервера) происходит ререндер , стоит ли аннулировать? думаю, нет
        dispatch(postSendVerificationCodeAction(payload));
    };
    const renderSendCodeAgainAlert = (): JSX.Element | void => {
        if (sendVerificationCodeResponse) {
            return sendVerificationCodeResponse.statusCode === HttpStatus.OK ? (
                <Alert alertType={AlertTypes.SUCCESS} alertMessage={sendVerificationCodeResponse.message} />
            ) : (
                <Alert alertType={AlertTypes.FAILURE} alertMessage={CustomResponseMessages.UNKNOWN_ERROR} />
            );
        }
    };
    const renderSendCodeOptions = (): JSX.Element | void => {
        /* 
        Реализация: делать расчеты здесь, передавать их туда. тем самым решив должно отображаться или же нет 
        
        */

        let lastVerificationRequested: string | number | undefined = localStorage.getItem(
            LocalStorageItems.LAST_VERIFICATION_REQUESTED
        ) as string;

        if (lastVerificationRequested) {
            lastVerificationRequested = parseInt(lastVerificationRequested, 10);

            const interval = 0.1 * 60 * 1000;
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
                    {renderSendCodeAgainAlert()}
                </div>
            );
        }
    };
    const renderCheckCodeResultAlert = (): JSX.Element | void => {
        if (checkVerificationCodeResponse) {
            switch (checkVerificationCodeResponse.statusCode) {
                case HttpStatus.OK:
                    return (
                        <Alert alertType={AlertTypes.SUCCESS} alertMessage={checkVerificationCodeResponse.message} />
                    );

                case HttpStatus.BAD_REQUEST:
                    return (
                        <Alert alertType={AlertTypes.FAILURE} alertMessage={checkVerificationCodeResponse.message} />
                    );

                default:
                    return <Alert alertType={AlertTypes.FAILURE} alertMessage={CustomResponseMessages.UNKNOWN_ERROR} />;
            }
        }
    };

    useEffect(applyEffectsOnInit, []);
    useEffect(() => {
        const timer = timerRef.current!;

        return () => {
            clearTimeout(timer);
        };
    });

    return (
        <div className="account-confirmation">
            <section className="account-confirmation__titles">
                <div className="heading">
                    <h2 className="heading heading--secondary"> Последний шаг - подтвердите аккаунт. </h2>
                    <h3 className="heading heading--tertiary">На вашу электронную почту отправлено письмо с кодом.</h3>
                    <p className="paragraph"> Введите полученный 6-значный код. </p>
                </div>

                <SixDigitVerification />
                <div className="send-code-options"> {renderSendCodeOptions()} </div>
                {renderCheckCodeResultAlert()}
                {/* нужна переменная в саге которая будет отражать можно ли получить код или нет. Если можно, то условный рендеринг {Получить код}. Если нет, 
                        то "повторно код можно будет получить через". Так же, нужно решить, при логине неподтв польз отправлять или нет имейл автоматически,
                        или же ждать когда он нажмет на кнопку
                    */}
            </section>
        </div>
    );
}
function annualizePostSendVerification(): any {
    throw new Error('Function not implemented.');
}
