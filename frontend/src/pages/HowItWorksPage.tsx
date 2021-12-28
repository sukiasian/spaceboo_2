import { useEffect } from 'react';
import { updateDocumentTitle } from '../utils/utilFunctions';

export default function HowItWorksPage(): JSX.Element {
    const handleDocumentTitle = (): void => {
        updateDocumentTitle('Spaceboo | Как это работает?');
    };

    useEffect(handleDocumentTitle, []);

    return <> </>;
}
