import { MouseEventHandler } from 'react';

interface HTMLIdentityAttributes {
    className?: string;
    id?: string;
}

export interface IResIsoDatesReserved {
    beginningDate: string;
    beginningTime: string;
    endingDate: string;
    endingTime: string;
}

export interface IServerResponse<T = any> {
    statusCode: HttpStatus;
    status: ResponseStatus;
    message?: string;
    data?: T;
}

export interface IComponentClassNameProps {
    index?: number;
    mainDivClassName?: string;
    additionalClassNames?: string;
}

export interface ITimeUnits {
    year?: number;
    month?: number | string;
    days?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
}

export interface ITab extends HTMLIdentityAttributes {
    tabName: string;
    linkTo?: string;
    onClick?: (...props: any) => MouseEventHandler | void;
}

export enum ResponseStatus {
    SUCCESS = 'Выполнено',
    FAILURE = 'Не выполнено',
    ERROR = 'Ошибка',
}

export enum EventKey {
    ENTER = 'Enter',
    ESCAPE = 'Escape',
    TAB = 'Tab',
}

export enum HttpStatus {
    CONTINUE = 100,
    SWITCHING_PROTOCOLS = 101,
    PROCESSING = 102,
    EARLYHINTS = 103,
    OK = 200,
    CREATED = 201,
    ACCEPTED = 202,
    NON_AUTHORITATIVE_INFORMATION = 203,
    NO_CONTENT = 204,
    RESET_CONTENT = 205,
    PARTIAL_CONTENT = 206,
    AMBIGUOUS = 300,
    MOVED_PERMANENTLY = 301,
    FOUND = 302,
    SEE_OTHER = 303,
    NOT_MODIFIED = 304,
    TEMPORARY_REDIRECT = 307,
    PERMANENT_REDIRECT = 308,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    PAYMENT_REQUIRED = 402,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    METHOD_NOT_ALLOWED = 405,
    NOT_ACCEPTABLE = 406,
    PROXY_AUTHENTICATION_REQUIRED = 407,
    REQUEST_TIMEOUT = 408,
    CONFLICT = 409,
    GONE = 410,
    LENGTH_REQUIRED = 411,
    PRECONDITION_FAILED = 412,
    PAYLOAD_TOO_LARGE = 413,
    URI_TOO_LONG = 414,
    UNSUPPORTED_MEDIA_TYPE = 415,
    REQUESTED_RANGE_NOT_SATISFIABLE = 416,
    EXPECTATION_FAILED = 417,
    I_AM_A_TEAPOT = 418,
    MISDIRECTED = 421,
    UNPROCESSABLE_ENTITY = 422,
    FAILED_DEPENDENCY = 424,
    PRECONDITION_REQUIRED = 428,
    TOO_MANY_REQUESTS = 429,
    INTERNAL_SERVER_ERROR = 500,
    NOT_IMPLEMENTED = 501,
    BAD_GATEWAY = 502,
    SERVICE_UNAVAILABLE = 503,
    GATEWAY_TIMEOUT = 504,
    HTTP_VERSION_NOT_SUPPORTED = 505,
}

export enum AppColor {
    YELLOW_PRIMARY = '#FEC602',
    PURE_WHITE = '#FFF',
}

export enum ReduxSpaceAction {
    SET_POST_PROVIDE_SPACE_SUCCESS_RESPONSE = 'SET_POST_PROVIDE_SPACE_SUCCESS_RESPONSE',
    SET_POST_PROVIDE_SPACE_FAILURE_RESPONSE = 'SET_POST_PROVIDE_SPACE_FAILURE_RESPONSE',
    SET_FETCH_SPACES_SUCCESS_RESPONSE = 'FETCH_SPACES_SUCCESS_RESPONSE',
    SET_FETCH_SPACES_FAILURE_RESPONSE = 'FETCH_SPACES_FAILURE_RESPONSE',
    SET_FETCH_SPACE_BY_ID_SUCCESS_RESPONSE = 'SET_FETCH_SPACE_BY_ID_SUCCESS_RESPONSE',
    SET_FETCH_SPACE_BY_ID_FAILURE_RESPONSE = 'SET_FETCH_SPACE_BY_ID_FAILURE_RESPONSE',
    SET_FETCH_USER_SPACES_SUCCESS_RESPONSE = 'SET_FETCH_USER_SPACES_SUCCESS_RESPONSE',
    SET_FETCH_USER_SPACES_FAILURE_RESPONSE = 'SET_FETCH_USER_SPACES_FAILURE_RESPONSE',
    SET_FETCH_SPACES_QUERY_DATA = 'SET_FETCH_SPACES_QUERY_DATA',
    SET_FETCH_SPACES_BY_USER_OUTDATED_APPOINTMENTS_SUCCESS_RESPONSE = 'SET_FETCH_SPACES_BY_USER_OUTDATED_APPOINTMENTS_SUCCESS_RESPONSE',
    SET_FETCH_SPACES_BY_USER_OUTDATED_APPOINTMENTS_FAILURE_RESPONSE = 'SET_FETCH_SPACES_BY_USER_OUTDATED_APPOINTMENTS_FAILURE_RESPONSE',
    SET_FETCH_SPACES_BY_USER_ACTIVE_APPOINTMENTS_SUCCESS_RESPONSE = 'SET_FETCH_SPACES_BY_USER_ACTIVE_APPOINTMENTS_SUCCESS_RESPONSE',
    SET_FETCH_SPACES_BY_USER_ACTIVE_APPOINTMENTS_FAILURE_RESPONSE = 'SET_FETCH_SPACES_BY_USER_ACTIVE_APPOINTMENTS_FAILURE_RESPONSE',
    SET_FETCH_SPACES_BY_USER_UPCOMING_APPOINTMENTS_SUCCESS_RESPONSE = 'SET_FETCH_SPACES_BY_USER_UPCOMING_APPOINTMENTS_SUCCESS_RESPONSE',
    SET_FETCH_SPACES_BY_USER_UPCOMING_APPOINTMENTS_FAILURE_RESPONSE = 'SET_FETCH_SPACES_BY_USER_UPCOMING_APPOINTMENTS_FAILURE_RESPONSE',
    SET_FETCH_SPACES_FOR_KEY_CONTROL_SUCCESS_RESPONSE = 'SET_FETCH_SPACES_FOR_KEY_CONTROL_SUCCESS_RESPONSE',
    SET_FETCH_SPACES_FOR_KEY_CONTROL_FAILURE_RESPONSE = 'SET_FETCH_SPACES_FOR_KEY_CONTROL_FAILURE_RESPONSE',
    SET_PUT_EDIT_SPACE_SUCCESS_RESPONSE = 'SET_PUT_EDIT_SPACE_SUCCESS_RESPONSE',
    SET_PUT_EDIT_SPACE_FAILURE_RESPONSE = 'SET_PUT_EDIT_SPACE_FAILURE_RESPONSE',
    SET_POST_PROVIDE_SPACE_DATA = 'SET_POST_PROVIDE_SPACE_DATA',
    SET_PUT_EDIT_SPACE_DATA = 'SET_PUT_EDIT_SPACE_DATA',
    SET_DELETE_SPACE_SUCCESS_RESPONSE = 'SET_DELETE_SPACE_SUCCESS_RESPONSE',
    SET_DELETE_SPACE_FAILURE_RESPONSE = 'SET_DELETE_SPACE_FAILURE_RESPONSE',
    ANNUALIZE_PROVIDE_SPACE_DATA = 'ANNUALIZE_PROVIDE_SPACE_DATA',
    ANNUALIZE_PROVIDE_SPACE_RESPONSES = 'ANNUALIZE_PROVIDE_SPACE_RESPONSES',
    ANNUALIZE_FETCH_SPACES_BY_USER_OUTDATED_APPOINTMENTS_RESPONSES = 'ANNUALIZE_FETCH_SPACES_BY_USER_OUTDATED_APPOINTMENTS_RESPONSES',
    ANNUALIZE_FETCH_SPACES_BY_USER_ACTIVE_APPOINTMENTS_RESPONSES = 'ANNUALIZE_FETCH_SPACES_BY_USER_ACTIVE_APPOINTMENTS_RESPONSES',
    ANNUALIZE_FETCH_SPACES_BY_USER_UPCOMING_APPOINTMENTS_RESPONSES = 'ANNUALIZE_FETCH_SPACES_BY_USER_UPCOMING_APPOINTMENTS_RESPONSES',
    ANNUALIZE_FETCH_SPACES_RESPONSES = 'ANNUALIZE_FETCH_SPACES_RESPONSES',
    ANNUALIZE_FETCH_SPACES_QUERY_DATA = 'ANNUALIZE_FETCH_SPACES_QUERY_DATA',
    ANNUALIZE_DELETE_SPACE_RESPONSES = 'ANNUALIZE_DELETE_SPACE_RESPONSES',
}

export enum ReduxLockerAction {
    SET_PUT_TOGGLE_LOCKER_SUCCESS_RESPONSE = 'SET_PUT_TOGGLE_LOCKER_SUCCESS_RESPONSE',
    SET_PUT_TOGGLE_LOCKER_FAILURE_RESPONSE = 'SET_PUT_TOGGLE_LOCKER_FAILURE_RESPONSE',
}

export enum ReduxAuthAction {
    SET_POST_LOGIN_USER_SUCCESS_RESPONSE = 'POST_LOGIN_USER_SUCCESS_RESPONSE',
    SET_POST_LOGIN_USER_FAILURE_RESPONSE = 'POST_LOGIN_USER_FAILURE_RESPONSE',
    SET_POST_SIGNUP_USER_SUCCESS_RESPONSE = 'SET_POST_SIGNUP_USER_SUCCESS_RESPONSE',
    SET_POST_SIGNUP_USER_FAILURE_RESPONSE = 'SET_POST_SIGNUP_USER_FAILURE_RESPONSE',
    SET_POST_PASSWORD_CHANGE_SUCCESS_RESPONSE = 'SET_POST_PASSWORD_CHANGE_SUCCESS_RESPONSE',
    SET_POST_PASSWORD_CHANGE_FAILURE_RESPONSE = 'SET_POST_PASSWORD_CHANGE_FAILURE_RFAILURE',
    SET_FETCH_USER_IS_LOGGED_IN_SUCCESS_RESPONSE = 'SET_FETCH_USER_IS_LOGGED_IN_SUCCESS_RESPONSE',
    SET_FETCH_USER_IS_LOGGED_IN_FAILURE_RESPONSE = 'SET_FETCH_USER_IS_LOGGED_IN_FAILURE_RESPONSE',
    SET_FETCH_LOGOUT_USER_SUCCESS_RESPONSE = 'SET_POST_LOGOUT_USER_SUCCESS_RESPONSE',
    SET_FETCH_LOGOUT_USER_FAILURE_RESPONSE = 'SET_POST_LOGOUT_USER_FAILURE_RESPONSE',
    ANNUALIZE_POST_LOGIN_USER_RESPONSES = 'ANNUALIZE_POST_LOGIN_USER_RESPONSES',
    ANNUALIZE_POST_SIGNUP_USER_RESPONSES = 'ANNUALIZE_POST_SIGNUP_USER_RESPONSES',
    ANNUALIZE_POST_PASSWORD_CHANGE_RESPONSES = 'ANNUALIZE_POST_PASSWORD_CHANGE_RESPONSES',
    ANNUALIZE_FETCH_LOGOUT_USER_RESPONSES = 'ANNUALIZE_FETCH_LOGOUT_USER_RESPONSES',
    SET_PASSWORD_CHANGE_FORM_DATA = 'SET_PASSWORD_CHANGE_FORM_DATA',
}

export enum ReduxCitiesAction {
    SET_FETCH_CITIES_BY_SEARCH_PATTERN_SUCCESS_RESPONSE = 'SET_FETCH_CITIES_BY_SEARCH_PATTERN_SUCCESS_RESPONSE',
    SET_FETCH_CITIES_BY_SEARCH_PATTERN_FAILURE_RESPONSE = 'SET_FETCH_CITIES_BY_SEARCH_PATTERN_FAILURE_RESPONSE',
    FETCH_MAJOR_CITIES = 'FETCH_MAJOR_CITIES',
    ANNUALIZE_FOUND_BY_SEARCH_PATTERN_CITIES_RESPONSES = 'ANNUALIZE_FOUND_BY_SEARCH_PATTERN_CITIES_RESPONSES',
}

export enum ReduxModalAction {
    TOGGLE_LOGIN_MODAL = 'TOGGLE_LOGIN_MODAL',
    TOGGLE_SIGNUP_MODAL = 'TOGGLE_SIGNUP_MODAL',
    TOGGLE_EDIT_USER_MODAL = 'TOGGLE_EDIT_USER_MODAL',
    TOGGLE_EDIT_SPACE_MODAL = 'TOGGLE_EDIT_SPACE_MODAL',
}

export enum ReduxEmailVerificationAction {
    SET_POST_SEND_VERIFICATION_CODE_SUCCESS_RESPONSE = 'SET_POST_SEND_VERIFICATION_CODE_SUCCESS_RESPONSE',
    SET_POST_SEND_VERIFICATION_CODE_FAILURE_RESPONSE = 'SET_POST_SEND_VERIFICATION_CODE_FAILURE_RESPONSE',
    SET_POST_CHECK_VERIFICATION_CODE_SUCCESS_RESPONSE = 'SET_POST_CHECK_VERIFICATION_CODE_SUCCESS_RESPONSE',
    SET_POST_CHECK_VERIFICATION_CODE_FAILURE_RESPONSE = 'SET_POST_CHECK_VERIFICATION_CODE_FAILURE_RESPONSE',
    ANNUALIZE_SEND_VERIFICATION_CODE_RESPONSES = 'ANNUALIZE_SEND_VERIFICATION_CODE_RESPONSES',
}

export enum ReduxImageAction {
    SET_POST_UPLOAD_USER_AVATAR_SUCCESS_RESPONSE = 'SET_UPLOAD_USER_AVATAR_SUCCESS_RESPONSE',
    SET_POST_UPLOAD_USER_AVATAR_FAILURE_RESPONSE = 'SET_UPLOAD_USER_AVATAR_FAILURE_RESPONSE',
    SET_DELETE_USER_AVATAR_SUCCESS_RESPONSE = 'SET_DELETE_USER_AVATAR_SUCCESS_RESPONSE',
    SET_DELETE_USER_AVATAR_FAILURE_RESPONSE = 'SET_DELETE_USER_AVATAR_FAILURE_RESPONSE',
    ANNUALIZE_POST_UPLOAD_USER_AVATAR_RESPONSES = 'ANNUALIZE_POST_UPLOAD_USER_AVATAR_RESPONSES',
    ANNUALIZE_DELETE_USER_AVATAR_RESPONSES = 'ANNUALIZE_DELETE_USER_AVATAR_RESPONSES',
}

export enum ReduxUserAction {
    SET_FETCH_CURRENT_USER_SUCCESS_RESPONSE = 'SET_FETCH_CURRENT_USER_SUCCESS_RESPONSE',
    SET_FETCH_CURRENT_USER_FAILURE_RESPONSE = 'SET_FETCH_CURRENT_USER_FAILURE_RESPONSE',
    SET_PUT_EDIT_USER_SUCCESS_RESPONSE = 'SET_PUT_EDIT_USER_SUCCESS_RESPONSE',
    SET_PUT_EDIT_USER_FAILURE_RESPONSE = 'SET_PUT_EDIT_USER_FAILURE_RESPONSE',
    SET_EDIT_USER_DATA = 'SET_EDIT_USER_DATA',
    ANNUALIZE_EDIT_USER_RESPONSES = 'ANNUALIZE_EDIT_USER_RESPONSES',
}

export enum ReduxAppointmentAction {
    SET_POST_CREATE_APPOINTMENT_SUCCESS_RESPONSE = 'SET_POST_CREATE_APPOINTMENT_SUCCESS_RESPONSE',
    SET_POST_CREATE_APPOINTMENT_FAILURE_RESPONSE = 'SET_POST_CREATE_APPOINTMENT_FAILURE_RESPONSE',
    SET_FETCH_APPOINTMENTS_FOR_MONTH_SUCCESS_RESPONSE = 'SET_FETCH_APPOINTMENTS_FOR_MONTH_SUCCESS_RESPONSE',
    SET_FETCH_APPOINTMENTS_FOR_MONTH_FAILURE_RESPONSE = 'SET_FETCH_APPOINTMENTS_FOR_MONTH_FAILURE_RESPONSE',
    SET_DELETE_CANCEL_APPOINTMENT_SUCCESS_RESPONSE = 'SET_DELETE_CANCEL_APPOINTMENT_SUCCESS_RESPONSE',
    SET_DELETE_CANCEL_APPOINTMENT_FAILURE_RESPONSE = 'SET_DELETE_CANCEL_APPOINTMENT_FAILURE_RESPONSE',
}

export enum ReduxCommonAction {
    TOGGLE_TIMER = 'TOGGLE_TIMER',
    SET_DATE_PICKER_DATE = 'SET_DATE_PICKER_DATE',
    SET_MY_APPOINTMENTS_FINAL_DESTINATION_IS_DEFINED = 'SET_MY_APPOINTMENTS_FINAL_DESTINATION_IS_DEFINED',
    SET_HOW_IT_WORKS_STEPS_USER_CHOSEN = 'SET_HOW_IT_WORKS_STEPS_USER_CHOSEN',
}

export enum SagaTask {
    POST_LOGOUT_USER = 'FETCH_LOGOUT_USER',
    POST_LOGIN_USER = 'FETCH_LOGIN_USER',
    POST_SIGNUP_USER = 'FETCH_SIGNUP_USER',
    POST_SEND_VERIFICATION_CODE = 'FETCH_SEND_VERIFICATION_CODE',
    POST_CHECK_VERIFICATION_CODE = 'FETCH_CHECK_VERIFICATION_CODE',
    POST_UPLOAD_USER_AVATAR = 'POST_UPLOAD_USER_AVATAR',
    POST_PROVIDE_SPACE = 'POST_PROVIDE_SPACE',
    POST_PASSWORD_CHANGE = 'POST_PASSWORD_CHANGE',
    POST_CREATE_APPOINTMENT = 'POST_CREATE_APPOINTMENT',
    FETCH_SPACES = 'FETCH_SPACES',
    FETCH_SPACE_BY_ID = 'FETCH_SPACE_BY_ID',
    FETCH_USER_SPACES = 'FETCH_USER_SPACES',
    FETCH_USER_LOGIN_STATE = 'FETCH_USER_LOGIN_STATE',
    FETCH_CITIES = 'FETCH_CITIES',
    FETCH_CITIES_BY_SEARCH_PATTERN = 'FETCH_CITIES_BY_SEARCH_PATTERN',
    FETCH_MAJOR_CITIES = 'FETCH_MAJOR_CITIES',
    FETCH_CURRENT_USER = 'FETCH_CURRENT_USER',
    FETCH_SPACES_BY_USER_OUTDATED_APPOINTMENTS = 'FETCH_SPACES_BY_USER_OUTDATED_APPOINTMENTS',
    FETCH_SPACES_BY_USER_ACTIVE_APPOINTMENTS = 'FETCH_SPACES_BY_USER_ACTIVE_APPOINTMENTS',
    FETCH_SPACES_BY_USER_UPCOMING_APPOINTMENTS = 'FETCH_SPACES_BY_USER_UPCOMING_APPOINTMENTS',
    FETCH_SPACES_FOR_KEY_CONTROL = 'FETCH_SPACES_FOR_KEY_CONTROL',
    FETCH_APPOINTMENTS_FOR_MONTH = 'FETCH_APPOINTMENTS_FOR_MONTH',
    PUT_EDIT_USER = 'PUT_EDIT_USER',
    PUT_EDIT_SPACE = 'PUT_EDIT_SPACE',
    PUT_TOGGLE_LOCKER = 'PUT_TOGGLE_LOCKER',
    DELETE_USER_AVATAR = 'DELETE_USER_AVATAR',
    DELETE_CANCEL_APPOINTMENT = 'DELETE_CANCEL_APPOINTMENT',
    DELETE_SPACE = 'DELETE_SPACE',
}

export enum ApiUrl {
    SPACES = 'spaces',
    APPOINTMENTS = 'appointments',
    LOCKER = 'locker',
    USERS = 'users',
    AUTH = 'auth',
    CITIES = 'cities',
    EMAIL_VERIFICATION = 'emailVerification',
    IMAGES = 'images',
}

export enum AlertType {
    SUCCESS = 'success',
    FAILURE = 'failure',
    WARNING = 'warning',
}

export enum EventListenerType {
    CLICK = 'click',
}

export enum CustomResponseMessage {
    UNKNOWN_ERROR = 'Произошла ошибка. Попробуйте еще раз.',
}

// TODO
export enum LocalStorageItem {
    LAST_VERIFICATION_REQUESTED = 'lastVerificationRequested',
}

export enum UrlPathname {
    HOME = '/',
    LOGIN = '/login',
    SIGNUP = '/signup',
    PROVIDE_SPACE = '/provide-space',
    HOW_IT_WORKS = '/how-it-works',
    SPACES = '/spaces',
}

export enum QueryDefaultValue {
    PAGE = 1,
    LIMIT = 12,
    OFFSET = 12,
}

export type TActiveTab = {
    defineActiveClassName: (url: string) => string | undefined;
    handleActiveTab: (url: string) => void;
};

export interface IArrowIconProps {
    combinedClassNames?: string;
    handleClick?: (...props: any) => any;
}

export interface IHOC {
    children: JSX.Element;
}
