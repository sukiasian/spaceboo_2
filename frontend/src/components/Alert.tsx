import { useEffect, useState } from 'react';
import { AlertType, CustomResponseMessage, HttpStatus, IServerResponse } from '../types/types';

interface IAlertProps {
    successResponse?: IServerResponse;
    failureResponse?: IServerResponse;
}
interface IResponseDataForAlert {
    alertType: AlertType;
    message?: string;
}

export default function Alert(props: IAlertProps): JSX.Element {
    const { successResponse, failureResponse } = props;
    const [responseData, setResponseData] = useState<IResponseDataForAlert>();
    const defineErrorMessageOnInternalServerError = () => {
        if (failureResponse) {
            if (failureResponse.statusCode === HttpStatus.INTERNAL_SERVER_ERROR) {
                const newResponseData: IResponseDataForAlert = { ...responseData! };

                newResponseData.message = CustomResponseMessage.UNKNOWN_ERROR;
            }
        }
    };
    const defineResponseDataForAlert = () => {
        if (successResponse) {
            setResponseData({ alertType: AlertType.SUCCESS, message: successResponse.message });
        } else if (failureResponse) {
            setResponseData({ alertType: AlertType.FAILURE, message: failureResponse.message });
        }
    };

    useEffect(defineResponseDataForAlert, [successResponse, failureResponse]);
    useEffect(defineErrorMessageOnInternalServerError, [failureResponse, responseData]);

    return (successResponse || failureResponse) && responseData ? (
        <div className={`alert alert--${responseData?.alertType?.toLowerCase()}`}>{responseData.message}</div>
    ) : (
        <>{responseData?.message}</>
    );
}
