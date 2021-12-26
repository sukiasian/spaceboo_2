export interface IComponentDivProps {
    mainDivClassName: string;
}

export enum ReduxSpaceActions {
    FETCH_SPACES = 'FETCH_SPACES',
}

export enum ReduxAuthActions {
    FETCH_USER_IS_LOGGED_IN = 'REQUIRE_USER_IS_LOGGED_IN',
}

export enum ReduxCitiesActions {
    FETCH_CITIES = 'FETCH_CITIES',
    FETCH_CITIES_BY_SEARCH_PATTERN = 'FETCH_CITIES_BY_SEARCH_PATTERN',
}

export enum SagaTasks {
    REQUIRE_USER_IS_LOGGED_IN = 'REQUIRE_USER_IS_LOGGED_IN',
    REQUEST_SPACES = 'REQUEST_SPACES',
    REQUEST_USER_IS_LOGGED_IN = 'REQUEST_LOGGED_IN',
    REQUEST_CITIES = 'REQUEST_CITIES',
    REQUEST_CITIES_BY_SEARCH_PATTERN = 'REQUEST_CITIES_BY_SEARCH_PATTERN',
}

export enum ApiUrls {
    SPACES = 'spaces',
    USERS = 'users',
    AUTH = 'auth',
    CITIES = 'cities',
}
