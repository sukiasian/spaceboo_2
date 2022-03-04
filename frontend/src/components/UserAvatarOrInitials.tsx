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
            <div className="user-image-or-initials">
                {userData?.avatarUrl ? (
                    <div className="user-image">
                        <img
                            src={`/${userData.avatarUrl}`}
                            alt="Пользователь"
                            style={{ width: '50px', height: '50px', borderRadius: '100px' }}
                        />
                        {children}
                    </div>
                ) : (
                    <div className="user-no-image">
                        <div
                            className="user-initials"
                            style={{ width: '50px', height: '50px', borderRadius: '100px', border: '1px solid blue' }}
                        >
                            <p className="user-initials__last-name">
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
