import { CorsOptions } from 'cors';

export default class CorsConfig {
    public static readonly corsOptions: CorsOptions = {
        origin: function (origin, callback) {
            if (CorsConfig.whiteList.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS.'));
            }
        },
    };

    private static readonly whiteList: string[] = ['http://www.spaceboo.ru', 'http://www.spaceboo.com'];
}
