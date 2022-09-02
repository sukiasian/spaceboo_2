import { NavLink } from 'react-router-dom';
import { UrlPathname } from '../types/types';

export default function ContactLink(): JSX.Element {
    return <NavLink to={UrlPathname.CONTACT}>Связаться</NavLink>;
}
