import { AlertTypes, CustomResponseMessages, HttpStatus, IServerResponse } from '../types/types';
import Alert from './Alert';

interface IAlertFirstDbValidationError {
    response: IServerResponse;
}

export default function AlertFirstDbValidationError(props: IAlertFirstDbValidationError): JSX.Element {
    const response = props.response;

    if (response && response.message) {
        return <Alert alertType={AlertTypes.FAILURE} alertMessage={response.message} />;
    } else {
        return <> </>;
    }
}
