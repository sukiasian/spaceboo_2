export interface IModalState {
    loginPopupIsOpen: boolean;
    signupPopupIsOpen: boolean;
}

const initialState: IModalState = {
    loginPopupIsOpen: false,
    signupPopupIsOpen: false,
};

export const modalReducer = (state = initialState) => {};
