import { useEffect } from 'react';
import SixDigitVerification from '../components/SixDigitVerification';
import { updateDocumentTitle } from '../utils/utilFunctions';

export default function ConfirmAccountPage(): JSX.Element {
    const handleDocumentTitle = (): void => {
        const documentTitle = 'Spaceboo | Последний шаг!';

        updateDocumentTitle(documentTitle);
    };

    useEffect(handleDocumentTitle, []);

    return (
        <div className="account-confirmation">
            <section className="account-confirmation__titles">
                <div className="heading">
                    <h2 className="heading heading--secondary"> Последний шаг - подтвердите аккаунт. </h2>
                    <h3 className="heading heading--tertiary">На вашу электронную почту отправлено письмо с кодом.</h3>
                    <p className="paragraph"> Введите полученный 6-значный код. </p>
                    <SixDigitVerification />
                    <p> Повторно код можно будет получить через {'{ время сейчас - время тогда }}'}</p>
                </div>
            </section>
        </div>
    );
}
