import { Action } from 'redux';
import { SagaTasks } from '../../types/types';

export const requestSpacesAction = (): Action<SagaTasks> => {
    return {
        type: SagaTasks.REQUEST_SPACES,
    };
};
