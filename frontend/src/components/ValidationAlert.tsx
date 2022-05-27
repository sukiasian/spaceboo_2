import { AlertType } from '../types/types';

interface IValidationAlertProps {
    alertType: AlertType;
    message: string;
}

export default function ValidationAlert(props: IValidationAlertProps): JSX.Element {
    const { alertType, message } = props;

    return (
        <div
            className={`verification-alert ${
                alertType === AlertType.SUCCESS ? 'verification-alert--success' : 'verification-alert--failure'
            }`}
        >
            {message}
        </div>
    );
}
