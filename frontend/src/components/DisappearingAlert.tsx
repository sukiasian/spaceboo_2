import { useEffect, useRef, useState } from 'react';
import Alert, { IAlertProps } from './Alert';

interface IDisappearingAlertProps extends Omit<IAlertProps, 'innerRef'> {}

export default function DisappearingAlert(props: IDisappearingAlertProps): JSX.Element | null {
    const { successResponse, failureResponse } = props;
    const [isRendered, setIsRendered] = useState(true);
    const alertRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setTimeout(() => {
            if (successResponse || failureResponse) {
                setIsRendered(false);
            }
        }, 2000);
    }, []);

    return successResponse || failureResponse ? (
        <>
            {isRendered ? (
                <Alert
                    combinedClassNames="alert--disappearing"
                    successResponse={successResponse}
                    failureResponse={failureResponse}
                    innerRef={alertRef}
                />
            ) : null}
        </>
    ) : null;
}
