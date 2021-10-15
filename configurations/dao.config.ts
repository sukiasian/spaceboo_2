import { Singleton } from '../utils/Singleton';

export abstract class Dao extends Singleton {
    protected abstract get model(): any;

    async findById(userId: string, raw = true): Promise<any> {
        return this.model.findOne({ raw: raw, where: { id: userId } });
    }
}
