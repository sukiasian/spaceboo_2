import { CorsOptions } from 'cors';

export default class CorsConfig {
    public static readonly corsOptions: CorsOptions = {
        origin: function (origin, callback) {
            if (!origin || CorsConfig.whiteList.indexOf(origin) !== -1) {
				console.log(origin);
				
                callback(null, true);
            } else {
				console.log(origin);
				
                callback(new Error('Not allowed by CORS.'));
            }
        },
    };

    private static readonly whiteList: string[] = ['http://www.spaceboo.ru', 'http://www.spaceboo.com'];
}

