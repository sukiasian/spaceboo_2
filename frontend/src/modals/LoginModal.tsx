import { IComponentDivProps } from '../utils/types';

interface ILoginModal extends IComponentDivProps {}

export default function LoginModal(props: ILoginModal) {
    // использовать const { loginPopupIsOpen } = useSelector((state: IReduxState) => state.someStorage)
    // if

    return (
        <div className={props.mainDivClassName}>
            <div className="heading heading--tertiary"> Войти </div>
        </div>
    );
}
