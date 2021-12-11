enum HttpMethod {
    get = 'GET',
    post = 'POST',
    put = 'PUT',
    delete = 'DELETE',
    patch = 'PATCH',
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
        try {
            const res = await fetch(this.prepareUrlWithPath(urlPath), {
                method: HttpMethod.post,
                body: JSON.stringify(body),
                headers: { ...this.headers, ...headers },
            });
            return res.json();
        } catch (err) {
            console.error(err);
        }
    }

    // FIXME urlPath should be optional. Add headers

    async put(urlPath: string = '', body: any, headers?: HeadersInit | undefined) {
        const res = await fetch(this.prepareUrlWithPath(urlPath), {
            method: HttpMethod.put,
            body: JSON.stringify(body),
        });
        return res.json();
    }

    async delete(urlPath: string = '') {
        const res = await fetch(this.prepareUrlWithPath(urlPath), { method: HttpMethod.delete });
        return res.json();
    }
}

// FIXME probably it should be process.env.something + don't forget about using proxy
export const httpRequester = new HttpRequest('v1/api/');
// NOTE can we go with static methods ?
