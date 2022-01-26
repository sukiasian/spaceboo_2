"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlPathnames = exports.LocalStorageItems = exports.CustomResponseMessages = exports.AlertTypes = exports.ApiUrls = exports.SagaTasks = exports.ReduxCommonActions = exports.ReduxImageActions = exports.ReduxEmailVerificationActions = exports.ReduxUserActions = exports.ReduxModalActions = exports.ReduxCitiesActions = exports.ReduxAuthActions = exports.ReduxSpaceActions = exports.HttpStatus = exports.ResponseStatus = void 0;
var ResponseStatus;
(function (ResponseStatus) {
    ResponseStatus["SUCCESS"] = "\u0412\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u043E";
    ResponseStatus["FAILURE"] = "\u041D\u0435 \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u043E";
    ResponseStatus["ERROR"] = "\u041E\u0448\u0438\u0431\u043A\u0430";
})(ResponseStatus = exports.ResponseStatus || (exports.ResponseStatus = {}));
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
var ReduxSpaceActions;
(function (ReduxSpaceActions) {
    ReduxSpaceActions["FETCH_SPACES"] = "FETCH_SPACES";
    ReduxSpaceActions["SET_FETCH_SPACES_SUCCESS_RESPONSE"] = "FETCH_SPACES_SUCCESS_RESPONSE";
    ReduxSpaceActions["SET_FETCH_SPACES_FAILURE_RESPONSE"] = "FETCH_SPACES_FAILURE_RESPONSE";
    ReduxSpaceActions["SET_POST_PROVIDE_SPACE_SUCCESS_RESPONSE"] = "SET_POST_PROVIDE_SPACE_SUCCESS_RESPONSE";
    ReduxSpaceActions["SET_POST_PROVIDE_SPACE_FAILURE_RESPONSE"] = "SET_POST_PROVIDE_SPACE_FAILURE_RESPONSE";
    ReduxSpaceActions["SET_PROVIDE_SPACE_DATA"] = "SET_PROVIDE_SPACE_DATA";
    ReduxSpaceActions["SET_EDIT_SPACE_DATA"] = "SET_EDIT_SPACE_DATA";
})(ReduxSpaceActions = exports.ReduxSpaceActions || (exports.ReduxSpaceActions = {}));
var ReduxAuthActions;
(function (ReduxAuthActions) {
    ReduxAuthActions["FETCH_USER_IS_LOGGED_IN"] = "REQUIRE_USER_IS_LOGGED_IN";
    ReduxAuthActions["LOGIN_USER"] = "LOGIN_USER";
    ReduxAuthActions["LOGOUT_USER"] = "LOGOUT_USER";
    ReduxAuthActions["ANNUALIZE_LOGIN_RESPONSE"] = "ANNUALIZE_LOGIN_RESPONSE";
    ReduxAuthActions["SIGNUP_USER"] = "SIGNUP_USER";
    ReduxAuthActions["ANNUALIZE_SIGNUP_RESPONSE"] = "ANNUALIZE_SIGNUP_RESPONSE";
    ReduxAuthActions["ANNUALIZE_LOGOUT_RESPONSE"] = "ANNUALIZE_LOGOUT_RESPONSE";
})(ReduxAuthActions = exports.ReduxAuthActions || (exports.ReduxAuthActions = {}));
var ReduxCitiesActions;
(function (ReduxCitiesActions) {
    ReduxCitiesActions["FETCH_CITIES"] = "FETCH_CITIES";
    ReduxCitiesActions["FETCH_CITIES_BY_SEARCH_PATTERN"] = "FETCH_CITIES_BY_SEARCH_PATTERN";
    ReduxCitiesActions["FETCH_MAJOR_CITIES"] = "FETCH_MAJOR_CITIES";
    ReduxCitiesActions["ANNUALIZE_FOUND_BY_SEARCH_PATTERN_CITIES"] = "ANNUALIZE_FOUND_BY_SEARCH_PATTERN_CITIES";
})(ReduxCitiesActions = exports.ReduxCitiesActions || (exports.ReduxCitiesActions = {}));
var ReduxModalActions;
(function (ReduxModalActions) {
    ReduxModalActions["TOGGLE_LOGIN_MODAL"] = "TOGGLE_LOGIN_MODAL";
    ReduxModalActions["TOGGLE_SIGNUP_MODAL"] = "TOGGLE_SIGNUP_MODAL";
    ReduxModalActions["TOGGLE_EDIT_USER_MODAL"] = "TOGGLE_EDIT_USER_MODAL";
})(ReduxModalActions = exports.ReduxModalActions || (exports.ReduxModalActions = {}));
var ReduxUserActions;
(function (ReduxUserActions) {
    ReduxUserActions["FETCH_USER"] = "FETCH_USER";
    // FIXME it should be fetch user response
})(ReduxUserActions = exports.ReduxUserActions || (exports.ReduxUserActions = {}));
var ReduxEmailVerificationActions;
(function (ReduxEmailVerificationActions) {
    ReduxEmailVerificationActions["SEND_VERIFICATION_CODE"] = "SEND_VERIFICATION_CODE";
    ReduxEmailVerificationActions["CHECK_VERIFICATION_CODE"] = "CHECK_VERIFICATION_CODE";
    ReduxEmailVerificationActions["ANNUALIZE_SEND_VERIFICATION_CODE_RESPONSE"] = "ANNUALIZE_SEND_VERIFICATION_CODE_RESPONSE";
})(ReduxEmailVerificationActions = exports.ReduxEmailVerificationActions || (exports.ReduxEmailVerificationActions = {}));
var ReduxImageActions;
(function (ReduxImageActions) {
    ReduxImageActions["SET_UPLOAD_IMAGES_SUCCESS_RESPONSE"] = "SET_UPLOAD_IMAGES_SUCCESS_RESPONSE";
    ReduxImageActions["SET_UPLOAD_IMAGES_FAILURE_RESPONSE"] = "SET_UPLOAD_IMAGES_FAILURE_RESPONSE";
})(ReduxImageActions = exports.ReduxImageActions || (exports.ReduxImageActions = {}));
var ReduxCommonActions;
(function (ReduxCommonActions) {
    ReduxCommonActions["TOGGLE_TIMER"] = "TOGGLE_TIMER";
    ReduxCommonActions["SET_DATE_PICKER_DATE"] = "SET_DATE_PICKER_DATE";
})(ReduxCommonActions = exports.ReduxCommonActions || (exports.ReduxCommonActions = {}));
var SagaTasks;
(function (SagaTasks) {
    SagaTasks["REQUEST_SPACES"] = "REQUEST_SPACES";
    SagaTasks["REQUEST_USER_LOGIN_STATE"] = "REQUEST_USER_LOGIN_STATE";
    SagaTasks["REQUEST_CITIES"] = "REQUEST_CITIES";
    SagaTasks["REQUEST_CITIES_BY_SEARCH_PATTERN"] = "REQUEST_CITIES_BY_SEARCH_PATTERN";
    SagaTasks["REQUEST_MAJOR_CITIES"] = "REQUEST_MAJOR_CITIES";
    SagaTasks["REQUEST_USER_LOGOUT"] = "REQUEST_USER_LOGOUT";
    SagaTasks["POST_LOGIN"] = "POST_LOGIN";
    SagaTasks["POST_SIGNUP"] = "POST_SIGNUP";
    SagaTasks["POST_SEND_VERIFICATION_CODE"] = "POST_SEND_VERIFICATION_CODE";
    SagaTasks["POST_CHECK_VERIFICATION_CODE"] = "POST_CHECK_VERIFICATION_CODE";
    SagaTasks["POST_UPLOAD_SPACE_IMAGES"] = "POST_UPLOAD_SPACE_IMAGES";
    SagaTasks["POST_PROVIDE_SPACE"] = "POST_PROVIDE_SPACE";
})(SagaTasks = exports.SagaTasks || (exports.SagaTasks = {}));
var ApiUrls;
(function (ApiUrls) {
    ApiUrls["SPACES"] = "spaces";
    ApiUrls["USERS"] = "users";
    ApiUrls["AUTH"] = "auth";
    ApiUrls["CITIES"] = "cities";
    ApiUrls["EMAIL_VERIFICATION"] = "emailVerification";
    ApiUrls["IMAGES"] = "images";
})(ApiUrls = exports.ApiUrls || (exports.ApiUrls = {}));
var AlertTypes;
(function (AlertTypes) {
    AlertTypes["SUCCESS"] = "success";
    AlertTypes["FAILURE"] = "failure";
    AlertTypes["WARNING"] = "warning";
})(AlertTypes = exports.AlertTypes || (exports.AlertTypes = {}));
var CustomResponseMessages;
(function (CustomResponseMessages) {
    CustomResponseMessages["UNKNOWN_ERROR"] = "\u041F\u0440\u043E\u0438\u0437\u043E\u0448\u043B\u0430 \u043E\u0448\u0438\u0431\u043A\u0430. \u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u0435\u0449\u0435 \u0440\u0430\u0437.";
})(CustomResponseMessages = exports.CustomResponseMessages || (exports.CustomResponseMessages = {}));
// TODO
var LocalStorageItems;
(function (LocalStorageItems) {
    LocalStorageItems["LAST_VERIFICATION_REQUESTED"] = "lastVerificationRequested";
})(LocalStorageItems = exports.LocalStorageItems || (exports.LocalStorageItems = {}));
var UrlPathnames;
(function (UrlPathnames) {
    UrlPathnames["HOME"] = "/";
    UrlPathnames["LOGIN"] = "/login";
    UrlPathnames["SIGNUP"] = "/signup";
    UrlPathnames["PROVIDE_SPACE"] = "/provide-space";
    UrlPathnames["HOW_IT_WORKS"] = "/how-it-works";
})(UrlPathnames = exports.UrlPathnames || (exports.UrlPathnames = {}));
//# sourceMappingURL=types.js.map