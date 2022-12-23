import {
    BeforeCreate,
    BeforeUpdate,
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    HasOne,
    Model,
    PrimaryKey,
    Table,
} from 'sequelize-typescript';
import { Optional } from 'sequelize';
import * as crypto from 'crypto';
import { Space } from './space.model';

interface ILockerAttributes {
    id: number;
    spaceId: string;
    ttlockEmail: string;
    ttlockPassword: string;
}

export interface ILockerCreationAttributes extends Optional<ILockerAttributes, 'id'> {}

@Table({ timestamps: true })
export class Locker extends Model<ILockerAttributes, ILockerCreationAttributes> implements ILockerAttributes {
    @PrimaryKey
    @Column({ type: DataType.INTEGER, allowNull: false })
    public id: number;

    @ForeignKey(() => Space)
    @Column({ type: DataType.UUID, allowNull: false, unique: true })
    public spaceId: string;

    @BelongsTo(() => Space)
    public space: Space;

    @Column
    public ttlockEmail: string;

    @Column
    public ttlockPassword: string;

    @BeforeUpdate
    @BeforeCreate // === pre-hook
    static async hashPasswordAndRemovePasswordConfirmation(instance: Locker): Promise<void> {
        if (instance.ttlockPassword) {
            instance.ttlockPassword = String(crypto.createHash('md5').update(instance.ttlockPassword));
        }
    }
}
