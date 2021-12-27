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

export interface IResIsoDatesReserved {
    beginningDate: string;
    beginningTime: string;
    endingDate: string;
    endingTime: string;
}

export interface IServerRes {
    status: HttpStatus;
    message: string;
    data: any;
}

// TODO
export interface IServerErr {}

export interface IComponentDivProps {
    mainDivClassName: string;
}

export enum ReduxSpaceActions {
    FETCH_SPACES = 'FETCH_SPACES',
}

export enum ReduxAuthActions {
    FETCH_USER_IS_LOGGED_IN = 'REQUIRE_USER_IS_LOGGED_IN',
    LOGIN_USER = 'LOGIN_USER',
    ANNUALIZE_LOGIN_RESPONSE = 'ANNUALIZE_LOGIN_RESPONSE',
    SIGNUP_USER = 'SIGNUP_USER',
    ANNUALIZE_SIGNUP_RESPONSE = 'ANNUALIZE_SIGNUP_RESPONSE',
}

export enum ReduxCitiesActions {
    FETCH_CITIES = 'FETCH_CITIES',
    FETCH_CITIES_BY_SEARCH_PATTERN = 'FETCH_CITIES_BY_SEARCH_PATTERN',
    ANNUALIZE_FOUND_BY_SEARCH_PATTERN_CITIES = 'ANNUALIZE_FOUND_BY_SEARCH_PATTERN_CITIES',
}

export enum ReduxModalActions {
    TOGGLE_LOGIN_MODAL = 'TOGGLE_LOGIN_MODAL',
    TOGGLE_SIGNUP_MODAL = 'TOGGLE_SIGNUP_MODAL',
}

export enum ReduxUserActions {
    FETCH_USER = 'FETCH_USER',
}

export enum SagaTasks {
    REQUEST_SPACES = 'REQUEST_SPACES',
    REQUEST_USER_IS_LOGGED_IN = 'REQUEST_LOGGED_IN',
    REQUEST_CITIES = 'REQUEST_CITIES',
    REQUEST_CITIES_BY_SEARCH_PATTERN = 'REQUEST_CITIES_BY_SEARCH_PATTERN',
    POST_LOGIN = 'POST_LOGIN',
    POST_SIGNUP = 'POST_SIGNUP',
}

export enum ApiUrls {
    SPACES = 'spaces',
    USERS = 'users',
    AUTH = 'auth',
    CITIES = 'cities',
}

export enum AlertType {
    SUCCESS = 'success',
    FAILURE = 'failure',
    WARNING = 'warning',
}

export enum CustomResponseMessages {
    UNKNOWN_ERROR = 'Произошла ошибка. Попробуйте еще раз.',
}
