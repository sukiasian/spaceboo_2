import { useSelector } from 'react-redux';
import { IReduxState } from '../redux/reducers/rootReducer';

interface IUserAvatarOrInitialsProps {
    children?: JSX.Element;
}

export default function UserAvatarOrInitials(props: IUserAvatarOrInitialsProps): JSX.Element {
    const { children } = props;
    const { fetchCurrentUserSuccessResponse } = useSelector((state: IReduxState) => state.userStorage);
    const userData = fetchCurrentUserSuccessResponse?.data;

    return (
        <>
            <div className="user-avatar-or-initials">
                {userData?.avatarUrl ? (
                    <div className="user-avatar">
                        <img className="avatar" src={`/${userData.avatarUrl}`} alt="Пользователь" />
                        {children}
                    </div>
                ) : (
                    <div className="user-no-avatar">
                        <div className="user-initials">
                            <p className="paragraph user-initials__letters">
                                {userData?.name?.[0]}
                                {userData?.surname?.[0] as string}
                            </p>
                        </div>
                        {children}
                    </div>
                )}
            </div>
        </>
    );
}
