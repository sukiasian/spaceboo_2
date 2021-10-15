import { userController } from '../controllers/user.controller';

export default class RouteProtectors {
    userController = userController;
    protectUsers(req, res, next) {
        // const user = this.userController.dao; //.findById<User>()
        // NOTE probably SWITCH CASE construction for every type of user - both facebook, google, ok, vk, local.
        if (req.headers.authorization.someToken === 'user.facebookId') {
        }
    }
}
