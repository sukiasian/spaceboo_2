import { AlertTypes } from '../types/types';

interface IAlertProps {
    alertType: AlertTypes;
    alertMessage: string;
}

export default function Alert(props: IAlertProps): JSX.Element {
    return <div className={`alert alert--${props.alertType}`}> {props.alertMessage} </div>;
}
