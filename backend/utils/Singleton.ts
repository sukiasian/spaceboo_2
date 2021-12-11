export class Singleton {
    private static instance: any;

    public static getInstance<T>(instance: new () => T): T {
        if (!this.instance) {
            this.instance = new instance();
        }

        return this.instance;
    }
}

export class SingletonFactory {
    public static produce = <T>(instance: any): T => {
        return instance.getInstance(instance);
    };
}
