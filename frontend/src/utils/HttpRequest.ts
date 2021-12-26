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

        return res.json();
    }

    async post(urlPath: string = '', body: any, headers?: HeadersInit | undefined) {
        const res = await fetch(this.prepareUrlWithPath(urlPath), {
            method: HttpMethod.POST,
            body: JSON.stringify(body),
            headers: { ...this.headers, ...headers },
        });

        return res.json();
    }

    // FIXME urlPath should be optional. Add headers

    async put(urlPath: string = '', body: any, headers?: HeadersInit | undefined) {
        const res = await fetch(this.prepareUrlWithPath(urlPath), {
            method: HttpMethod.PUT,
            body: JSON.stringify(body),
        });

        return res.json();
    }

    async delete(urlPath: string = '') {
        const res = await fetch(this.prepareUrlWithPath(urlPath), { method: HttpMethod.DELETE });

        return res.json();
    }
}

// FIXME probably it should be process.env.something + don't forget about using proxy
export const httpRequester = new HttpRequest('api/v1/');
// NOTE can we go with static methods ?
