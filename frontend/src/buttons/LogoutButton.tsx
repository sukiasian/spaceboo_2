import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    annualizeFetchLogoutResponseAction,
    fetchUserLoginStateAction,
    postLogoutUserAction,
} from '../redux/actions/authActions';
import { IReduxState } from '../redux/reducers/rootReducer';
import { IComponentClassNameProps } from '../types/types';

interface ILogoutButton extends IComponentClassNameProps {}

export default function LogoutButton({ mainDivClassName }: ILogoutButton): JSX.Element {
    const { fetchLogoutUserSuccessResponse } = useSelector((state: IReduxState) => state.authStorage);

    const dispatch = useDispatch();

    const handleLogout = (): void => {
        dispatch(postLogoutUserAction());
    };
    const refreshUserLoggedInAfterLogout = (): void => {
        if (fetchLogoutUserSuccessResponse) {
            dispatch(fetchUserLoginStateAction());
            dispatch(annualizeFetchLogoutResponseAction());
        }
    };

    useEffect(refreshUserLoggedInAfterLogout, [fetchLogoutUserSuccessResponse]);

    return (
        <div className={mainDivClassName} onClick={handleLogout}>
            Выйти
        </div>
    );
}
