import { AlertTypes, CustomResponseMessages, HttpStatus } from '../types/types';
import Alert from './Alert';

export type TPostDbResponse = {
    [key: string]: any;
    error: {
        errors: Array<any>;
    };
    statusCode: HttpStatus;
    message: string;
};

interface IAlertFirstDbValidationError {
    response: TPostDbResponse;
}

export default function AlertFirstDbValidationError(props: IAlertFirstDbValidationError): JSX.Element {
    const response = props.response;

    if (response && response.error) {
        if (response.error.errors) {
            return <Alert alertType={AlertTypes.FAILURE} alertMessage={response.error.errors[0].message} />;
        } else {
            switch (response.statusCode) {
                case HttpStatus.INTERNAL_SERVER_ERROR:
                    return <Alert alertType={AlertTypes.FAILURE} alertMessage={CustomResponseMessages.UNKNOWN_ERROR} />;

                default:
                    return <Alert alertType={AlertTypes.FAILURE} alertMessage={response.message} />;
            }
        }
    } else {
        return <> </>;
    }
}
