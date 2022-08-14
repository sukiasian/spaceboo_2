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
    errorMessage,
}

export enum ResponseStatus {
    SUCCESS = 'Выполнено',
    FAILURE = 'Не выполнено',
    ERROR = 'Ошибка',
}

export enum ModelNames {
    USER = 'User',
    CITY = 'City',
    REGION = 'Region',
    DISTRICT = 'District',
}

export enum SequelizeModelProps {
    DATA_VALUES = 'dataValues',
}

// NOTE do not use v1 hardcoded
export enum ApiRoutes {
    AUTH = '/api/v1/auth',
    EMAIL_VERIFICATION = '/api/v1/emailVerification',
    USERS = '/api/v1/users',
    SPACES = '/api/v1/spaces',
    APPOINTMENTS = '/api/v1/appointments',
    IMAGES = '/api/v1/images',
    CITIES = '/api/v1/cities',
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
    // FIXME USER_IS_CREATED AND IMAGE_IS_DELETED or USER_CREATED AND IMAGE_DELETED -- keep same style
    USER_CREATED = 'Пользователь создан.',
    DATA_UPDATED = 'Данные успешно обновлены!',
    SPACE_PROVIDED = 'Потрясающе! Пространство создано.',
    SPACE_DELETED = 'Пространство успешно удалено.',
    APPOINTMENT_CREATED = 'Поздравляем! Вы забронировали.',
    IMAGE_DELETED = 'Изображение удалено.',
    IMAGES_DELETED = 'Все изображения удалены',
    USER_IMAGE_UPDATED = 'Изображение обновлено.',
    EMAIL_SENT = 'Письмо с кодом отправлено на вашу эл. почту.',
    VERIFICATION_CODE_VALID = 'Введенный код верен.',
    PASSWORD_EDITED = 'Пароль успешно обновлен!',
    PASSWORD_RECOVERED = 'Пароль успешно сброшен.',
    USER_IS_LOGGED_IN = 'Пользователь авторизован.',
    USER_IS_NOT_LOGGED_IN = 'Пользователь не авторизован.',
    LOGGED_OUT = 'Будем скучать!',
    USER_NOT_FOUND = 'Пользователь не найден',
    USER_IS_CONFIRMED = 'Пользователь подтвержден.',
}

export enum ErrorMessages {
    USER_NOT_FOUND = 'Пользователь не найден',
    PASSWORDS_DO_NOT_MATCH = 'Пароли должны совпадать.',
    PASSWORD_LENGTH_VALIDATE = 'Пароль должен состоять от 8 до 25 символов.',
    PASSWORD_IS_NOT_VALID = 'Пожалуйста, введите действительный пароль',
    PASSWORD_INCORRECT = 'Старый пароль неверный. Попробуйте еще раз.',
    USERNAME_OR_PASSWORD_INCORRECT = 'Неверное имя пользователя или пароль.',
    NAME_LENGTH_VALIDATE = 'Имя должно состоять от 2 до 25 символов.',
    SURNAME_LENGTH_VALIDATE = 'Фамилия должна состоять от 2 до 25 символов.',
    MIDDLE_NAME_LENGTH_VALIDATE = 'Отчество должно состоять от 5 до 25 символов.',
    IS_EMAIL_VALIDATE = 'Пожалуйста, введите действительный эл. адрес.',
    EMAIL_UNIQUE_VALIDATE = 'Пользователь с таким эл. адресом уже существует.',
    REQUIRED_FIELDS_VALIDATE = 'Пожалуйста, заполните все обязательные поля.',
    SPACE_IS_UNAVAILABLE = 'К сожалению, пространство занято. Вы можете посмотреть на другие даты.',
    SPACE_IMAGES_ARE_NOT_PROVIDED = 'Пожалуйста, добавьте изображения. Максимальное количество изображений - 5',
    SPACE_IMAGES_VALIDATE = 'Максимальное количество изображений для пространства — 5.',
    SPACE_IMAGES_AMOUNT_EXCEEDED = 'Превышено допустимое количество изображений для пространства. Максимальное количество изображений - 5.',
    APPLICATION_ERROR = 'Application Error',
    UNKNOWN_ERROR = 'Произошла серьезная ошибка',
    NO_IMAGE_FOUND = 'Изображение не найдено.',
    NO_IMAGES_FOUND = 'Не найдено изображений.',
    DIR_NOT_FOUND = 'Директория не найдена.',
    SPACE_NOT_FOUND = 'Пространство не найдено.',
    MULTER_ERROR = 'Произошла ошибка при загрузке файла.',
    NOT_ENOUGH_RIGHTS = 'Недостаточно прав.',
    VERIFICATION_CODE_NOT_VALID = 'Неверный код.',
    EMAIL_IS_EMPTY = 'Пожалуйста, укажите Вашу эл. почту.',
    NAME_SHOULD_BE_LITERAL_AND_CYRILLIC_ONLY = "Инициалы пользователя могут состоять только из символов А-Я, а также '-'.",
    USER_ALREADY_CONFIRMED = 'Аккаунт уже подтвержден.',
    USER_NOT_CONFIRMED = 'Подтвердите аккаунт.',
    NOT_AUTHORIZED = 'Авторизуйтесь.',
    WAIT_BEFORE_GETTING_EMAIL = 'Получить код повторно можно только по истечении 2 минут.',
    EXPIRED_REQUEST = 'Срок действия кода истек. Повторите попытку.',
    VERIFY_ACCOUNT = 'Пожалуйста, подтвердите ваш аккаунт.',
    INVALID_TYPE_OF_SPACE = 'Введите действительный тип жилья.',
    PICK_CITY_FROM_THE_LIST = 'Выберите город из списка.',
    DATES_SHOULD_BE_PRESENT = 'Даты должны быть в настоящем.',
    REQUIRED_DATES_ARE_MISSING = 'Пожалуйста, укажите интересующие даты',
    SPACE_ID_IS_MISSING = 'Укажите ID пространства.',
}

export enum Environment {
    PRODUCTION = 'production',
    DEVELOPMENT = 'development',
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
