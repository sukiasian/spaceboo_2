import { IServerResponse } from '../types/types';

enum HttpMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
    PATCH = 'PATCH',
}

interface IHttpRequest {
    url: string;
}

class HttpRequest implements IHttpRequest {
    url: string;
    headers: HeadersInit | undefined = { 'Content-Type': 'application/json' };

    constructor(url: string) {
        this.url = url;
    }

    prepareUrlWithPath(urlPath?: string | null) {
        return `${this.url + urlPath}`;
    }

    async get(urlPath = '') {
        const res = await fetch(this.prepareUrlWithPath(urlPath));

        return {
            statusCode: res.status,
            ...(await res.json()),
        };
    }

    async post(urlPath = '', body: any, headers?: HeadersInit): Promise<IServerResponse> {
        // FIXME this wont work if the content type is not application/json (but why ? if body is stringified)

        const res = await fetch(this.prepareUrlWithPath(urlPath), {
            method: HttpMethod.POST,
            body: JSON.stringify(body),
            headers: { ...this.headers, ...headers },
        });

        return {
            statusCode: res.status,
            ...(await res.json()),
        };
    }

    async postMultipartFormData(urlPath = '', body: FormData): Promise<IServerResponse> {
        const res = await fetch(this.prepareUrlWithPath(urlPath), {
            method: HttpMethod.POST,
            body,
        });

        return {
            statusCode: res.status,
            ...(await res.json()),
        };
    }

    // FIXME urlPath should be optional. Add headers

    async put(urlPath: string = '', body: any, headers?: HeadersInit | undefined) {
        const res = await fetch(this.prepareUrlWithPath(urlPath), {
            method: HttpMethod.PUT,
            body: JSON.stringify(body),
            headers: { ...this.headers, ...headers },
        });

        return {
            statusCode: res.status,
            ...(await res.json()),
        };
    }

    async delete(urlPath: string = '') {
        const res = await fetch(this.prepareUrlWithPath(urlPath), { method: HttpMethod.DELETE });

        return {
            statusCode: res.status,
            ...(await res.json()),
        };
    }
}

// FIXME probably it should be process.env.something + don't forget about using proxy
export const httpRequester = new HttpRequest('/api/v1/');
// NOTE can we go with static methods ?
