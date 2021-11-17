import UtilFunctions from './UtilFunctions';

export class RouteProtector {
    private static readonly UtilFunctions = UtilFunctions;
    // TODO регистрация админов не должна быть доступна для каждого - возможно только авторизованный админ должен уметь это делатьы
    public static adminOnlyProtector = this.UtilFunctions.catchAsync(async (req, res, next) => {
        next();
    });
}
