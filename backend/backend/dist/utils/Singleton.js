"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SingletonFactory = exports.Singleton = void 0;
class Singleton {
    static getInstance(instance) {
        if (!this.instance) {
            this.instance = new instance();
        }
        return this.instance;
    }
}
exports.Singleton = Singleton;
class SingletonFactory {
}
exports.SingletonFactory = SingletonFactory;
SingletonFactory.produce = (instance) => {
    return instance.getInstance(instance);
};
//# sourceMappingURL=Singleton.js.map