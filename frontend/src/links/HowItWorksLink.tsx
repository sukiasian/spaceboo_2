import { NavLink } from 'react-router-dom';
import { IComponentClassNameProps, UrlPathname } from '../types/types';

interface IHowItWorksLinkProps extends IComponentClassNameProps {
    handleActiveTab?: (...props: any) => any;
}

export default function HowItWorksLink({ mainDivClassName, handleActiveTab }: IHowItWorksLinkProps): JSX.Element {
    return (
        <NavLink to={UrlPathname.HOW_IT_WORKS} className={mainDivClassName || ''} onClick={handleActiveTab}>
            Как это работает?
        </NavLink>
    );
}
