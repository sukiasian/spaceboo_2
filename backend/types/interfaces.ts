export interface ICountRows {
    count: string;
}

export interface IRequiredDates {
    beginningDate: string;
    endingDate: string;
    beginningTime?: string;
    endingTime?: string;
}

export interface IQueryString {
    page?: string | number;
    limit?: string | number;
}
