"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpaceFields = exports.QuerySortDirection = exports.Facilities = exports.Environment = exports.ErrorMessages = exports.ResponseMessages = exports.PassportStrategies = exports.ApiRoutes = exports.SequelizeModelProps = exports.ModelNames = exports.LoggerLevels = exports.ResponseStatus = exports.HttpStatus = void 0;
var HttpStatus;
(function (HttpStatus) {
    HttpStatus[HttpStatus["CONTINUE"] = 100] = "CONTINUE";
    HttpStatus[HttpStatus["SWITCHING_PROTOCOLS"] = 101] = "SWITCHING_PROTOCOLS";
    HttpStatus[HttpStatus["PROCESSING"] = 102] = "PROCESSING";
    HttpStatus[HttpStatus["EARLYHINTS"] = 103] = "EARLYHINTS";
    HttpStatus[HttpStatus["OK"] = 200] = "OK";
    HttpStatus[HttpStatus["CREATED"] = 201] = "CREATED";
    HttpStatus[HttpStatus["ACCEPTED"] = 202] = "ACCEPTED";
    HttpStatus[HttpStatus["NON_AUTHORITATIVE_INFORMATION"] = 203] = "NON_AUTHORITATIVE_INFORMATION";
    HttpStatus[HttpStatus["NO_CONTENT"] = 204] = "NO_CONTENT";
    HttpStatus[HttpStatus["RESET_CONTENT"] = 205] = "RESET_CONTENT";
    HttpStatus[HttpStatus["PARTIAL_CONTENT"] = 206] = "PARTIAL_CONTENT";
    HttpStatus[HttpStatus["AMBIGUOUS"] = 300] = "AMBIGUOUS";
    HttpStatus[HttpStatus["MOVED_PERMANENTLY"] = 301] = "MOVED_PERMANENTLY";
    HttpStatus[HttpStatus["FOUND"] = 302] = "FOUND";
    HttpStatus[HttpStatus["SEE_OTHER"] = 303] = "SEE_OTHER";
    HttpStatus[HttpStatus["NOT_MODIFIED"] = 304] = "NOT_MODIFIED";
    HttpStatus[HttpStatus["TEMPORARY_REDIRECT"] = 307] = "TEMPORARY_REDIRECT";
    HttpStatus[HttpStatus["PERMANENT_REDIRECT"] = 308] = "PERMANENT_REDIRECT";
    HttpStatus[HttpStatus["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    HttpStatus[HttpStatus["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    HttpStatus[HttpStatus["PAYMENT_REQUIRED"] = 402] = "PAYMENT_REQUIRED";
    HttpStatus[HttpStatus["FORBIDDEN"] = 403] = "FORBIDDEN";
    HttpStatus[HttpStatus["NOT_FOUND"] = 404] = "NOT_FOUND";
    HttpStatus[HttpStatus["METHOD_NOT_ALLOWED"] = 405] = "METHOD_NOT_ALLOWED";
    HttpStatus[HttpStatus["NOT_ACCEPTABLE"] = 406] = "NOT_ACCEPTABLE";
    HttpStatus[HttpStatus["PROXY_AUTHENTICATION_REQUIRED"] = 407] = "PROXY_AUTHENTICATION_REQUIRED";
    HttpStatus[HttpStatus["REQUEST_TIMEOUT"] = 408] = "REQUEST_TIMEOUT";
    HttpStatus[HttpStatus["CONFLICT"] = 409] = "CONFLICT";
    HttpStatus[HttpStatus["GONE"] = 410] = "GONE";
    HttpStatus[HttpStatus["LENGTH_REQUIRED"] = 411] = "LENGTH_REQUIRED";
    HttpStatus[HttpStatus["PRECONDITION_FAILED"] = 412] = "PRECONDITION_FAILED";
    HttpStatus[HttpStatus["PAYLOAD_TOO_LARGE"] = 413] = "PAYLOAD_TOO_LARGE";
    HttpStatus[HttpStatus["URI_TOO_LONG"] = 414] = "URI_TOO_LONG";
    HttpStatus[HttpStatus["UNSUPPORTED_MEDIA_TYPE"] = 415] = "UNSUPPORTED_MEDIA_TYPE";
    HttpStatus[HttpStatus["REQUESTED_RANGE_NOT_SATISFIABLE"] = 416] = "REQUESTED_RANGE_NOT_SATISFIABLE";
    HttpStatus[HttpStatus["EXPECTATION_FAILED"] = 417] = "EXPECTATION_FAILED";
    HttpStatus[HttpStatus["I_AM_A_TEAPOT"] = 418] = "I_AM_A_TEAPOT";
    HttpStatus[HttpStatus["MISDIRECTED"] = 421] = "MISDIRECTED";
    HttpStatus[HttpStatus["UNPROCESSABLE_ENTITY"] = 422] = "UNPROCESSABLE_ENTITY";
    HttpStatus[HttpStatus["FAILED_DEPENDENCY"] = 424] = "FAILED_DEPENDENCY";
    HttpStatus[HttpStatus["PRECONDITION_REQUIRED"] = 428] = "PRECONDITION_REQUIRED";
    HttpStatus[HttpStatus["TOO_MANY_REQUESTS"] = 429] = "TOO_MANY_REQUESTS";
    HttpStatus[HttpStatus["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
    HttpStatus[HttpStatus["NOT_IMPLEMENTED"] = 501] = "NOT_IMPLEMENTED";
    HttpStatus[HttpStatus["BAD_GATEWAY"] = 502] = "BAD_GATEWAY";
    HttpStatus[HttpStatus["SERVICE_UNAVAILABLE"] = 503] = "SERVICE_UNAVAILABLE";
    HttpStatus[HttpStatus["GATEWAY_TIMEOUT"] = 504] = "GATEWAY_TIMEOUT";
    HttpStatus[HttpStatus["HTTP_VERSION_NOT_SUPPORTED"] = 505] = "HTTP_VERSION_NOT_SUPPORTED";
})(HttpStatus = exports.HttpStatus || (exports.HttpStatus = {}));
var ResponseStatus;
(function (ResponseStatus) {
    ResponseStatus["SUCCESS"] = "\u0412\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u043E";
    ResponseStatus["FAILURE"] = "\u041D\u0435 \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u043E";
    ResponseStatus["ERROR"] = "\u041E\u0448\u0438\u0431\u043A\u0430";
})(ResponseStatus = exports.ResponseStatus || (exports.ResponseStatus = {}));
var LoggerLevels;
(function (LoggerLevels) {
    LoggerLevels["ERROR"] = "error";
    LoggerLevels["INFO"] = "info";
})(LoggerLevels = exports.LoggerLevels || (exports.LoggerLevels = {}));
var ModelNames;
(function (ModelNames) {
    ModelNames["USER"] = "User";
    ModelNames["CITY"] = "City";
})(ModelNames = exports.ModelNames || (exports.ModelNames = {}));
var SequelizeModelProps;
(function (SequelizeModelProps) {
    SequelizeModelProps["DATA_VALUES"] = "dataValues";
})(SequelizeModelProps = exports.SequelizeModelProps || (exports.SequelizeModelProps = {}));
// NOTE do not use v1 hardcoded
var ApiRoutes;
(function (ApiRoutes) {
    ApiRoutes["AUTH"] = "/api/v1/auth";
    ApiRoutes["EMAIL_VERIFICATION"] = "/api/v1/emailVerification";
    ApiRoutes["USERS"] = "/api/v1/users";
    ApiRoutes["SPACES"] = "/api/v1/spaces";
    ApiRoutes["APPOINTMENTS"] = "/api/v1/appointments";
    ApiRoutes["IMAGES"] = "/api/v1/images";
    ApiRoutes["CITIES"] = "/api/v1/cities";
})(ApiRoutes = exports.ApiRoutes || (exports.ApiRoutes = {}));
var PassportStrategies;
(function (PassportStrategies) {
    PassportStrategies["LOCAL"] = "local";
    PassportStrategies["FACEBOOK"] = "facebook";
    PassportStrategies["GOOGLE"] = "google";
    PassportStrategies["VKONTAKTE"] = "vkontakte";
    PassportStrategies["ODNOKLASSNIKI"] = "odnoklassniki";
    PassportStrategies["JWT"] = "jwt";
})(PassportStrategies = exports.PassportStrategies || (exports.PassportStrategies = {}));
var ResponseMessages;
(function (ResponseMessages) {
    // FIXME USER_IS_CREATED AND IMAGE_IS_DELETED or USER_CREATED AND IMAGE_DELETED -- keep same style
    ResponseMessages["USER_CREATED"] = "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u0441\u043E\u0437\u0434\u0430\u043D.";
    ResponseMessages["DATA_UPDATED"] = "\u0414\u0430\u043D\u043D\u044B\u0435 \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u044B!";
    ResponseMessages["SPACE_PROVIDED"] = "\u041F\u043E\u0442\u0440\u044F\u0441\u0430\u044E\u0449\u0435! \u041F\u0440\u043E\u0441\u0442\u0440\u0430\u043D\u0441\u0442\u0432\u043E \u0441\u043E\u0437\u0434\u0430\u043D\u043E.";
    ResponseMessages["SPACE_DELETED"] = "\u041F\u0440\u043E\u0441\u0442\u0440\u0430\u043D\u0441\u0442\u0432\u043E \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0443\u0434\u0430\u043B\u0435\u043D\u043E.";
    ResponseMessages["APPOINTMENT_CREATED"] = "\u041F\u043E\u0437\u0434\u0440\u0430\u0432\u043B\u044F\u0435\u043C! \u0412\u044B \u0437\u0430\u0431\u0440\u043E\u043D\u0438\u0440\u043E\u0432\u0430\u043B\u0438.";
    ResponseMessages["IMAGE_DELETED"] = "\u0418\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435 \u0443\u0434\u0430\u043B\u0435\u043D\u043E.";
    ResponseMessages["IMAGES_DELETED"] = "\u0412\u0441\u0435 \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u044F \u0443\u0434\u0430\u043B\u0435\u043D\u044B";
    ResponseMessages["EMAIL_SENT"] = "\u041F\u0438\u0441\u044C\u043C\u043E \u0441 \u043A\u043E\u0434\u043E\u043C \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u043E \u043D\u0430 \u0432\u0430\u0448\u0443 \u044D\u043B. \u043F\u043E\u0447\u0442\u0443.";
    ResponseMessages["VERIFICATION_CODE_VALID"] = "\u0412\u0432\u0435\u0434\u0435\u043D\u043D\u044B\u0439 \u043A\u043E\u0434 \u0432\u0435\u0440\u0435\u043D.";
    ResponseMessages["PASSWORD_EDITED"] = "\u041F\u0430\u0440\u043E\u043B\u044C \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D!";
    ResponseMessages["PASSWORD_RECOVERED"] = "\u041F\u0430\u0440\u043E\u043B\u044C \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0441\u0431\u0440\u043E\u0448\u0435\u043D.";
    ResponseMessages["USER_IS_LOGGED_IN"] = "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u0430\u0432\u0442\u043E\u0440\u0438\u0437\u043E\u0432\u0430\u043D.";
    ResponseMessages["USER_IS_NOT_LOGGED_IN"] = "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u043D\u0435 \u0430\u0432\u0442\u043E\u0440\u0438\u0437\u043E\u0432\u0430\u043D.";
    ResponseMessages["LOGGED_OUT"] = "\u0411\u0443\u0434\u0435\u043C \u0441\u043A\u0443\u0447\u0430\u0442\u044C!";
    ResponseMessages["USER_NOT_FOUND"] = "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D";
    ResponseMessages["USER_IS_CONFIRMED"] = "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D.";
})(ResponseMessages = exports.ResponseMessages || (exports.ResponseMessages = {}));
var ErrorMessages;
(function (ErrorMessages) {
    ErrorMessages["USER_NOT_FOUND"] = "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D";
    ErrorMessages["PASSWORDS_DO_NOT_MATCH"] = "\u041F\u0430\u0440\u043E\u043B\u0438 \u0434\u043E\u043B\u0436\u043D\u044B \u0441\u043E\u0432\u043F\u0430\u0434\u0430\u0442\u044C.";
    ErrorMessages["PASSWORD_LENGTH_VALIDATE"] = "\u041F\u0430\u0440\u043E\u043B\u044C \u0434\u043E\u043B\u0436\u0435\u043D \u0441\u043E\u0441\u0442\u043E\u044F\u0442\u044C \u043E\u0442 8 \u0434\u043E 25 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432.";
    ErrorMessages["PASSWORD_IS_NOT_VALID"] = "\u041F\u043E\u0436\u0430\u043B\u0443\u0439\u0441\u0442\u0430, \u0432\u0432\u0435\u0434\u0438\u0442\u0435 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0439 \u043F\u0430\u0440\u043E\u043B\u044C";
    ErrorMessages["PASSWORD_INCORRECT"] = "\u0421\u0442\u0430\u0440\u044B\u0439 \u043F\u0430\u0440\u043E\u043B\u044C \u043D\u0435\u0432\u0435\u0440\u043D\u044B\u0439. \u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u0435\u0449\u0435 \u0440\u0430\u0437.";
    ErrorMessages["USERNAME_OR_PASSWORD_INCORRECT"] = "\u041D\u0435\u0432\u0435\u0440\u043D\u043E\u0435 \u0438\u043C\u044F \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F \u0438\u043B\u0438 \u043F\u0430\u0440\u043E\u043B\u044C.";
    ErrorMessages["NAME_LENGTH_VALIDATE"] = "\u0418\u043C\u044F \u0434\u043E\u043B\u0436\u043D\u043E \u0441\u043E\u0441\u0442\u043E\u044F\u0442\u044C \u043E\u0442 2 \u0434\u043E 25 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432.";
    ErrorMessages["SURNAME_LENGTH_VALIDATE"] = "\u0424\u0430\u043C\u0438\u043B\u0438\u044F \u0434\u043E\u043B\u0436\u043D\u0430 \u0441\u043E\u0441\u0442\u043E\u044F\u0442\u044C \u043E\u0442 2 \u0434\u043E 25 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432.";
    ErrorMessages["MIDDLE_NAME_LENGTH_VALIDATE"] = "\u041E\u0442\u0447\u0435\u0441\u0442\u0432\u043E \u0434\u043E\u043B\u0436\u043D\u043E \u0441\u043E\u0441\u0442\u043E\u044F\u0442\u044C \u043E\u0442 5 \u0434\u043E 25 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432.";
    ErrorMessages["IS_EMAIL_VALIDATE"] = "\u041F\u043E\u0436\u0430\u043B\u0443\u0439\u0441\u0442\u0430, \u0432\u0432\u0435\u0434\u0438\u0442\u0435 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0439 \u044D\u043B. \u0430\u0434\u0440\u0435\u0441.";
    ErrorMessages["EMAIL_UNIQUE_VALIDATE"] = "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u0441 \u0442\u0430\u043A\u0438\u043C \u044D\u043B. \u0430\u0434\u0440\u0435\u0441\u043E\u043C \u0443\u0436\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442.";
    ErrorMessages["REQUIRED_FIELDS_VALIDATE"] = "\u041F\u043E\u0436\u0430\u043B\u0443\u0439\u0441\u0442\u0430, \u0437\u0430\u043F\u043E\u043B\u043D\u0438\u0442\u0435 \u0432\u0441\u0435 \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u044B\u0435 \u043F\u043E\u043B\u044F.";
    ErrorMessages["SPACE_IS_UNAVAILABLE"] = "\u041A \u0441\u043E\u0436\u0430\u043B\u0435\u043D\u0438\u044E, \u043F\u0440\u043E\u0441\u0442\u0440\u0430\u043D\u0441\u0442\u0432\u043E \u0437\u0430\u043D\u044F\u0442\u043E. \u0412\u044B \u043C\u043E\u0436\u0435\u0442\u0435 \u043F\u043E\u0441\u043C\u043E\u0442\u0440\u0435\u0442\u044C \u043D\u0430 \u0434\u0440\u0443\u0433\u0438\u0435 \u0434\u0430\u0442\u044B.";
    // TODO while images are optional we dont need to use "minimal amount". If they aren't then we do
    ErrorMessages["SPACE_IMAGES_VALIDATE"] = "\u041C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u043E\u0435 \u043A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u043E \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0439 \u0434\u043B\u044F \u043F\u0440\u043E\u0441\u0442\u0440\u0430\u043D\u0441\u0442\u0432\u0430 \u2014 10.";
    ErrorMessages["SPACE_IMAGES_AMOUNT_EXCEEDED"] = "\u041F\u0440\u0435\u0432\u044B\u0448\u0435\u043D\u043E \u0434\u043E\u043F\u0443\u0441\u0442\u0438\u043C\u043E\u0435 \u043A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u043E \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0439 \u0434\u043B\u044F \u043F\u0440\u043E\u0441\u0442\u0440\u0430\u043D\u0441\u0442\u0432\u0430. \u041C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u043E\u0435 \u043A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u043E \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0439 - 10.";
    ErrorMessages["APPLICATION_ERROR"] = "Application Error";
    ErrorMessages["UNKNOWN_ERROR"] = "\u041F\u0440\u043E\u0438\u0437\u043E\u0448\u043B\u0430 \u0441\u0435\u0440\u044C\u0435\u0437\u043D\u0430\u044F \u043E\u0448\u0438\u0431\u043A\u0430";
    ErrorMessages["NO_IMAGE_FOUND"] = "\u0418\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E.";
    ErrorMessages["DIR_NOT_FOUND"] = "\u0414\u0438\u0440\u0435\u043A\u0442\u043E\u0440\u0438\u044F \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u0430.";
    ErrorMessages["SPACE_NOT_FOUND"] = "\u041F\u0440\u043E\u0441\u0442\u0440\u0430\u043D\u0441\u0442\u0432\u043E \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E.";
    ErrorMessages["MULTER_ERROR"] = "\u041F\u0440\u043E\u0438\u0437\u043E\u0448\u043B\u0430 \u043E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0435 \u0444\u0430\u0439\u043B\u0430.";
    ErrorMessages["NOT_ENOUGH_RIGHTS"] = "\u041D\u0435\u0434\u043E\u0441\u0442\u0430\u0442\u043E\u0447\u043D\u043E \u043F\u0440\u0430\u0432.";
    ErrorMessages["VERIFICATION_CODE_NOT_VALID"] = "\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u043A\u043E\u0434.";
    ErrorMessages["EMAIL_IS_EMPTY"] = "\u041F\u043E\u0436\u0430\u043B\u0443\u0439\u0441\u0442\u0430, \u0443\u043A\u0430\u0436\u0438\u0442\u0435 \u0412\u0430\u0448\u0443 \u044D\u043B. \u043F\u043E\u0447\u0442\u0443.";
    ErrorMessages["NAME_SHOULD_BE_LITERAL_AND_CYRILLIC_ONLY"] = "\u0418\u043C\u044F \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F \u043C\u043E\u0436\u0435\u0442 \u0441\u043E\u0441\u0442\u043E\u044F\u0442\u044C \u0442\u043E\u043B\u044C\u043A\u043E \u0438\u0437 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432 \u0410-\u042F, \u0430 \u0442\u0430\u043A\u0436\u0435 '-'.";
    ErrorMessages["USER_ALREADY_CONFIRMED"] = "\u0410\u043A\u043A\u0430\u0443\u043D\u0442 \u0443\u0436\u0435 \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D.";
    ErrorMessages["USER_NOT_CONFIRMED"] = "\u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u0435 \u0430\u043A\u043A\u0430\u0443\u043D\u0442.";
    ErrorMessages["NOT_AUTHORIZED"] = "\u0410\u0432\u0442\u043E\u0440\u0438\u0437\u0443\u0439\u0442\u0435\u0441\u044C.";
    ErrorMessages["WAIT_BEFORE_GETTING_EMAIL"] = "\u041F\u043E\u043B\u0443\u0447\u0438\u0442\u044C \u043A\u043E\u0434 \u043F\u043E\u0432\u0442\u043E\u0440\u043D\u043E \u043C\u043E\u0436\u043D\u043E \u0442\u043E\u043B\u044C\u043A\u043E \u043F\u043E \u0438\u0441\u0442\u0435\u0447\u0435\u043D\u0438\u0438 2 \u043C\u0438\u043D\u0443\u0442.";
    ErrorMessages["EXPIRED_REQUEST"] = "\u0421\u0440\u043E\u043A \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F \u043A\u043E\u0434\u0430 \u0438\u0441\u0442\u0435\u043A. \u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u0435 \u043F\u043E\u043F\u044B\u0442\u043A\u0443.";
})(ErrorMessages = exports.ErrorMessages || (exports.ErrorMessages = {}));
var Environment;
(function (Environment) {
    Environment["PRODUCTION"] = "production";
    Environment["DEVELOPMENT"] = "development";
    Environment["TEST"] = "test";
})(Environment = exports.Environment || (exports.Environment = {}));
var Facilities;
(function (Facilities) {
    Facilities["TV"] = "TV";
    Facilities["AC"] = "\u041A\u043E\u043D\u0434\u0438\u0446\u0438\u043E\u043D\u0435\u0440";
    Facilities["ANIMALS"] = "\u041F\u0438\u0442\u043E\u043C\u0446\u044B";
})(Facilities = exports.Facilities || (exports.Facilities = {}));
var QuerySortDirection;
(function (QuerySortDirection) {
    QuerySortDirection["ASC"] = "ASC";
    QuerySortDirection["DESC"] = "DESC";
})(QuerySortDirection = exports.QuerySortDirection || (exports.QuerySortDirection = {}));
// NOTE guees we need that for everything
var SpaceFields;
(function (SpaceFields) {
    SpaceFields["PRICE_PER_NIGHT"] = "pricePerNight";
})(SpaceFields = exports.SpaceFields || (exports.SpaceFields = {}));
//# sourceMappingURL=enums.js.map