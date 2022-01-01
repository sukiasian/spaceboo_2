import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { ErrorMessages, HttpStatus } from '../types/enums';
import AppError from './AppError';
import UtilFunctions from './UtilFunctions';

export class Middleware {
    private static readonly userModel: typeof User = User;
    private static readonly utilFunctions: typeof UtilFunctions = UtilFunctions;

    static retrieveEmailFromRequest = this.utilFunctions.catchAsync(
        async (req: express.Request, res: express.Response, next): Promise<void> => {
            const token = req.cookies['jwt'];
            let email: string;
            let user: User;

            if (token) {
                const payload = jwt.decode(token) as jwt.JwtPayload;

                user = await this.userModel.findOne({ where: { id: payload.id as string } });
            } else {
                email = req.body.email;

                user = await this.userModel.findOne({
                    where: {
                        email,
                    },
                });

                if (!email) {
                    throw new AppError(HttpStatus.BAD_REQUEST, ErrorMessages.EMAIL_IS_EMPTY);
                }
            }

            if (!user) {
                throw new AppError(HttpStatus.NOT_FOUND, ErrorMessages.USER_NOT_FOUND);
            }

            res.locals = {
                user,
            };

            next();
        }
    );
}
