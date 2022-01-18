export interface IResIsoDatesReserved {
    beginningDate: string;
    beginningTime: string;
    endingDate: string;
    endingTime: string;
}

export interface IServerSuccessResponse {
    statusCode: HttpStatus;
    message: string;
    data: any;
}

// FIXME all of this is for development environment
export interface IServerFailureResponse {
    status: HttpStatus;
    error: Error;
    message: string;
    stack: any;
}

export interface IServerResponse {
    statusCode: number;
    message?: string;
    data?: unknown;
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

export type TServerResponse = IServerSuccessResponse & IServerFailureResponse;

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

export enum ReduxSpaceActions {
    FETCH_SPACES = 'FETCH_SPACES',
    SET_FETCH_SPACES_SUCCESS_RESPONSE = 'FETCH_SPACES_SUCCESS_RESPONSE',
    SET_FETCH_SPACES_FAILURE_RESPONSE = 'FETCH_SPACES_FAILURE_RESPONSE',
    SET_PROVIDE_SPACE_DATA = 'SET_PROVIDE_SPACE_DATA',
    SET_EDIT_SPACE_DATA = 'SET_EDIT_SPACE_DATA',
}

export enum ReduxAuthActions {
    FETCH_USER_IS_LOGGED_IN = 'REQUIRE_USER_IS_LOGGED_IN',
    LOGIN_USER = 'LOGIN_USER',
    LOGOUT_USER = 'LOGOUT_USER',
    ANNUALIZE_LOGIN_RESPONSE = 'ANNUALIZE_LOGIN_RESPONSE',
    SIGNUP_USER = 'SIGNUP_USER',
    ANNUALIZE_SIGNUP_RESPONSE = 'ANNUALIZE_SIGNUP_RESPONSE',
    ANNUALIZE_LOGOUT_RESPONSE = 'ANNUALIZE_LOGOUT_RESPONSE',
}

export enum ReduxCitiesActions {
    FETCH_CITIES = 'FETCH_CITIES',
    FETCH_CITIES_BY_SEARCH_PATTERN = 'FETCH_CITIES_BY_SEARCH_PATTERN',
    FETCH_MAJOR_CITIES = 'FETCH_MAJOR_CITIES',
    ANNUALIZE_FOUND_BY_SEARCH_PATTERN_CITIES = 'ANNUALIZE_FOUND_BY_SEARCH_PATTERN_CITIES',
}

export enum ReduxModalActions {
    TOGGLE_LOGIN_MODAL = 'TOGGLE_LOGIN_MODAL',
    TOGGLE_SIGNUP_MODAL = 'TOGGLE_SIGNUP_MODAL',
    TOGGLE_EDIT_USER_MODAL = 'TOGGLE_EDIT_USER_MODAL',
}

export enum ReduxUserActions {
    FETCH_USER = 'FETCH_USER',
    // FIXME it should be fetch user response
}

export enum ReduxEmailVerificationActions {
    SEND_VERIFICATION_CODE = 'SEND_VERIFICATION_CODE',
    CHECK_VERIFICATION_CODE = 'CHECK_VERIFICATION_CODE',
    ANNUALIZE_SEND_VERIFICATION_CODE_RESPONSE = 'ANNUALIZE_SEND_VERIFICATION_CODE_RESPONSE',
}

export enum ReduxImageActions {
    SET_UPLOAD_IMAGES_SUCCESS_RESPONSE = 'SET_UPLOAD_IMAGES_SUCCESS_RESPONSE',
    SET_UPLOAD_IMAGES_FAILURE_RESPONSE = 'SET_UPLOAD_IMAGES_FAILURE_RESPONSE',
}

export enum ReduxCommonActions {
    TOGGLE_TIMER = 'TOGGLE_TIMER',
    SET_DATE_PICKER_DATE = 'SET_DATE_PICKER_DATE',
}

export enum SagaTasks {
    REQUEST_SPACES = 'REQUEST_SPACES',
    REQUEST_USER_LOGIN_STATE = 'REQUEST_USER_LOGIN_STATE',
    REQUEST_CITIES = 'REQUEST_CITIES',
    REQUEST_CITIES_BY_SEARCH_PATTERN = 'REQUEST_CITIES_BY_SEARCH_PATTERN',
    REQUEST_MAJOR_CITIES = 'REQUEST_MAJOR_CITIES',
    REQUEST_USER_LOGOUT = 'REQUEST_USER_LOGOUT',
    POST_LOGIN = 'POST_LOGIN',
    POST_SIGNUP = 'POST_SIGNUP',
    POST_SEND_VERIFICATION_CODE = 'POST_SEND_VERIFICATION_CODE',
    POST_CHECK_VERIFICATION_CODE = 'POST_CHECK_VERIFICATION_CODE',
    POST_UPLOAD_SPACE_IMAGES = 'POST_UPLOAD_SPACE_IMAGES',
}

export enum ApiUrls {
    SPACES = 'spaces',
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
}

export type TActiveTab = {
    defineActiveClassName: (url: string) => string | undefined;
    handleActiveTab: (url: string) => void;
};
