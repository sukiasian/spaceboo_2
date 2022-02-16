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

export enum ResponseStatus {
    SUCCESS = 'Выполнено',
    FAILURE = 'Не выполнено',
    ERROR = 'Ошибка',
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

export enum AppColors {
    YELLOW_PRIMARY = '#FEC602',
    PURE_WHITE = '#FFF',
}

export enum ReduxSpaceActions {
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
    SET_POST_PROVIDE_SPACE_DATA = 'SET_POST_PROVIDE_SPACE_DATA',
    SET_PUT_EDIT_SPACE_DATA = 'SET_PUT_EDIT_SPACE_DATA',
    ANNUALIZE_PROVIDE_SPACE_DATA = 'ANNUALIZE_PROVIDE_SPACE_DATA',
    ANNUALIZE_PROVIDE_SPACE_RESPONSES = 'ANNUALIZE_PROVIDE_SPACE_RESPONSES',
}

export enum ReduxAuthActions {
    SET_FETCH_USER_IS_LOGGED_IN_SUCCESS_RESPONSE = 'SET_FETCH_USER_IS_LOGGED_IN_SUCCESS_RESPONSE',
    SET_FETCH_USER_IS_LOGGED_IN_FAILURE_RESPONSE = 'SET_FETCH_USER_IS_LOGGED_IN_FAILURE_RESPONSE',
    SET_POST_LOGIN_USER_SUCCESS_RESPONSE = 'POST_LOGIN_USER_SUCCESS_RESPONSE',
    SET_POST_LOGIN_USER_FAILURE_RESPONSE = 'POST_LOGIN_USER_FAILURE_RESPONSE',
    SET_FETCH_LOGOUT_USER_SUCCESS_RESPONSE = 'SET_POST_LOGOUT_USER_SUCCESS_RESPONSE',
    SET_FETCH_LOGOUT_USER_FAILURE_RESPONSE = 'SET_POST_LOGOUT_USER_FAILURE_RESPONSE',
    SET_POST_SIGNUP_USER_SUCCESS_RESPONSE = 'SET_POST_SIGNUP_USER_SUCCESS_RESPONSE',
    SET_POST_SIGNUP_USER_FAILURE_RESPONSE = 'SET_POST_SIGNUP_USER_FAILURE_RESPONSE',
    ANNUALIZE_LOGIN_USER_RESPONSES = 'ANNUALIZE_LOGIN_RESPONSES',
    ANNUALIZE_SIGNUP_USER_RESPONSES = 'ANNUALIZE_SIGNUP_USER_RESPONSES',
    ANNUALIZE_LOGOUT_USER_RESPONSES = 'ANNUALIZE_LOGOUT_USER_RESPONSES',
}

export enum ReduxCitiesActions {
    SET_FETCH_CITIES_BY_SEARCH_PATTERN_SUCCESS_RESPONSE = 'SET_FETCH_CITIES_BY_SEARCH_PATTERN_SUCCESS_RESPONSE',
    SET_FETCH_CITIES_BY_SEARCH_PATTERN_FAILURE_RESPONSE = 'SET_FETCH_CITIES_BY_SEARCH_PATTERN_FAILURE_RESPONSE',
    FETCH_MAJOR_CITIES = 'FETCH_MAJOR_CITIES',
    ANNUALIZE_FOUND_BY_SEARCH_PATTERN_CITIES_RESPONSES = 'ANNUALIZE_FOUND_BY_SEARCH_PATTERN_CITIES_RESPONSES',
}

export enum ReduxModalActions {
    TOGGLE_LOGIN_MODAL = 'TOGGLE_LOGIN_MODAL',
    TOGGLE_SIGNUP_MODAL = 'TOGGLE_SIGNUP_MODAL',
    TOGGLE_EDIT_USER_MODAL = 'TOGGLE_EDIT_USER_MODAL',
}

export enum ReduxEmailVerificationActions {
    SET_POST_SEND_VERIFICATION_CODE_SUCCESS_RESPONSE = 'SET_POST_SEND_VERIFICATION_CODE_SUCCESS_RESPONSE',
    SET_POST_SEND_VERIFICATION_CODE_FAILURE_RESPONSE = 'SET_POST_SEND_VERIFICATION_CODE_FAILURE_RESPONSE',
    SET_POST_CHECK_VERIFICATION_CODE_SUCCESS_RESPONSE = 'SET_POST_CHECK_VERIFICATION_CODE_SUCCESS_RESPONSE',
    SET_POST_CHECK_VERIFICATION_CODE_FAILURE_RESPONSE = 'SET_POST_CHECK_VERIFICATION_CODE_FAILURE_RESPONSE',
    ANNUALIZE_SEND_VERIFICATION_CODE_RESPONSES = 'ANNUALIZE_SEND_VERIFICATION_CODE_RESPONSES',
}

export enum ReduxImageActions {
    SET_UPLOAD_IMAGES_SUCCESS_RESPONSE = 'SET_UPLOAD_IMAGES_SUCCESS_RESPONSE',
    SET_UPLOAD_IMAGES_FAILURE_RESPONSE = 'SET_UPLOAD_IMAGES_FAILURE_RESPONSE',
}

export enum ReduxUserActions {
    SET_FETCH_CURRENT_USER_SUCCESS_RESPONSE = 'SET_FETCH_CURRENT_USER_SUCCESS_RESPONSE',
    SET_FETCH_CURRENT_USER_FAILURE_RESPONSE = 'SET_FETCH_CURRENT_USER_FAILURE_RESPONSE',
}

export enum ReduxCommonActions {
    TOGGLE_TIMER = 'TOGGLE_TIMER',
    SET_DATE_PICKER_DATE = 'SET_DATE_PICKER_DATE',
}

export enum SagaTasks {
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
    POST_LOGOUT_USER = 'FETCH_LOGOUT_USER',
    POST_LOGIN_USER = 'FETCH_LOGIN_USER',
    POST_SIGNUP_USER = 'FETCH_SIGNUP_USER',
    POST_SEND_VERIFICATION_CODE = 'FETCH_SEND_VERIFICATION_CODE',
    POST_CHECK_VERIFICATION_CODE = 'FETCH_CHECK_VERIFICATION_CODE',
    POST_UPLOAD_SPACE_IMAGES = 'POST_UPLOAD_SPACE_IMAGES',
    POST_PROVIDE_SPACE = 'POST_PROVIDE_SPACE',
}

export enum ApiUrls {
    SPACES = 'spaces',
    APPOINTMENTS = 'appointments',
    USERS = 'users',
    AUTH = 'auth',
    CITIES = 'cities',
    EMAIL_VERIFICATION = 'emailVerification',
    IMAGES = 'images',
}

export enum AlertTypes {
    SUCCESS = 'success',
    FAILURE = 'failure',
    WARNING = 'warning',
}

export enum CustomResponseMessages {
    UNKNOWN_ERROR = 'Произошла ошибка. Попробуйте еще раз.',
}

// TODO
export enum LocalStorageItems {
    LAST_VERIFICATION_REQUESTED = 'lastVerificationRequested',
}

export enum UrlPathnames {
    HOME = '/',
    LOGIN = '/login',
    SIGNUP = '/signup',
    PROVIDE_SPACE = '/provide-space',
    HOW_IT_WORKS = '/how-it-works',
    SPACES = '/spaces',
}

export type TActiveTab = {
    defineActiveClassName: (url: string) => string | undefined;
    handleActiveTab: (url: string) => void;
};
