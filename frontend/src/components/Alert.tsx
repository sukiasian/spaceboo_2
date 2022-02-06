import { AlertTypes } from '../types/types';

interface IAlertProps {
    alertType: AlertTypes;
    alertMessage: string;
}

export default function Alert(props: IAlertProps): JSX.Element {
    const { alertType, alertMessage } = props;

    return <div className={`alert alert--${alertType}`}> {alertMessage} </div>;
}
