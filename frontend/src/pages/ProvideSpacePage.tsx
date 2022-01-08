import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { requestUserLoginState } from '../redux/actions/authActions';
import { IReduxState } from '../redux/reducers/rootReducer';
import { updateDocumentTitle } from '../utils/utilFunctions';

export default function ProvideSpacePage(): JSX.Element {
    const { userLoginState } = useSelector((state: IReduxState) => state.authStorage);
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

    useEffect(applyEffectsOnInit, [dispatch]);
    useEffect(redirectByLoginStateCondition, [userLoginState, navigate]);

    return <> Предоставить пространство </>;
}
