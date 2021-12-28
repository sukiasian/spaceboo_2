import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { IReduxState } from '../redux/reducers/rootReducer';
import { updateDocumentTitle } from '../utils/utilFunctions';

export default function CreateSpacePage(): JSX.Element {
    const { userIsLoggedIn } = useSelector((state: IReduxState) => state.authStorage);
    const handleDocumentTitle = (): void => {
        updateDocumentTitle('Spaceboo | Предоставить пространство');
    };

    useEffect(handleDocumentTitle);

    if (!userIsLoggedIn) {
        return <Navigate to="/login" />;
    }
    return <> Предоставить пространство </>;
}
