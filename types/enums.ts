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

export enum LoggerLevels {
    ERROR = 'error',
    INFO = 'info',
}

export enum ModelNames {
    USER = 'User',
    CITY = 'City',
}

export enum SequelizeModelProps {
    DATA_VALUES = 'dataValues',
}

// NOTE do not use v1 hardcoded
export enum ApiRoutes {
    AUTH = '/api/v1/auth',
    USERS = '/api/v1/users',
    SPACES = '/api/v1/spaces',
    APPOINTMENTS = '/api/v1/appointments',
}

export enum PassportStrategies {
    LOCAL = 'local',
    FACEBOOK = 'facebook',
    GOOGLE = 'google',
    VKONTAKTE = 'vkontakte',
    ODNOKLASSNIKI = 'odnoklassniki',
    JWT = 'jwt',
}

export enum ResponseMessages {
    USER_CREATED = 'Пользователь создан.',
    SPACE_CREATED = 'Потрясающе! Пространство создано.',
    APPOINTMENT_CREATED = 'Поздравляем! Вы забронировали.',
}

export enum ErrorMessages {
    PASSWORDS_DO_NOT_MATCH_VALIDATE = 'Пароли должны совпадать.',
    PASSWORD_LENGTH_VALIDATE = 'Пароль должен состоять от 8 до 25 символов.',
    PASSPORT_IS_NOT_VALID = 'Пожалуйста, введите действительный пароль',
    NAME_LENGTH_VALIDATE = 'Имя должно состоять от 2 до 25 символов.',
    MIDDLE_NAME_LENGTH_VALIDATE = 'Отчество должно состоять от 2 до 25 символов.',
    IS_EMAIL_VALIDATE = 'Пожалуйста, введите действительный эл. адрес.',
    EMAIL_UNIQUE_VALIDATE = 'Пользователь с таким эл. адресом уже существует.',
    REQUIRED_FIELDS_VALIDATE = 'Пожалуйста, заполните все обязательные поля.',
    SPACE_IS_UNAVAILABLE = 'К сожалению, пространство занято. Вы можете посмотреть другие даты.',
    // TODO while images are optional we dont need to use "minimal amount". If they aren't then we do
    SPACE_IMAGES_VALIDATE = 'Максимальное количество изображений для пространства — 10.',
    APPLICATION_ERROR = 'Application Error',
    UNKNOWN_ERROR = 'Произошла серьезная ошибка',
    NO_IMAGE_FOUND_TO_DELETE = 'Не найдено изображений для удаления.',
}

export enum Environment {
    DEVELOPMENT = 'development',
    PRODUCTION = 'production',
    TEST = 'test',
}

export enum Facilities {
    TV = 'TV',
    AC = 'Кондиционер',
    ANIMALS = 'Питомцы',
}

export enum QuerySortDirection {
    ASC = 'ASC',
    DESC = 'DESC',
}

// NOTE guees we need that for everything
export enum SpaceFields {
    PRICE_PER_NIGHT = 'pricePerNight',
}
