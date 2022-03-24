import { NavLink } from 'react-router-dom';
import { IComponentClassNameProps, UrlPathname } from '../types/types';

interface ISwitchAuthForPage extends IComponentClassNameProps {
    question: string;
    action: string;
    navigateTo: UrlPathname;
}

export default function SwitchAuthForPage(props: ISwitchAuthForPage): JSX.Element {
    return (
        <div className={`${props.mainDivClassName}-page__switch-type-of-auth`}>
            <p className="paragraph paragraph--dark login-page__switch-type-of-auth--paragraph">
                Еще не зарегистированы?{' '}
                <span className="auth-action">
                    <NavLink to={props.navigateTo}>Зарегистрироваться</NavLink>
                </span>
            </p>
        </div>
    );
}
