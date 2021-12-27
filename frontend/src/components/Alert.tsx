import { AlertType } from '../types/types';

interface IAlertProps {
    alertType: AlertType;
    alertMessage: string;
}

export default function Alert(props: IAlertProps): JSX.Element {
    return <div className={`alert alert--${props.alertType}`}> {props.alertMessage} </div>;
}
