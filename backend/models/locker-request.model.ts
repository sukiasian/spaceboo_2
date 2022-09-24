import { Column, DataType, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { Optional } from 'sequelize';
import { Space } from './space.model';

export enum LockerRequestType {
    CONNECTION = 1,
    RETURN = 0,
}

interface ILockerRequestAttributes {
    id: number;
    spaceId: string;
    phoneNumber: string;
    type: LockerRequestType;
}

export interface ILockerRequestCreationAttributes extends Optional<ILockerRequestAttributes, 'id'> {}

@Table({ timestamps: true })
export class LockerRequest
    extends Model<ILockerRequestAttributes, ILockerRequestCreationAttributes>
    implements ILockerRequestAttributes
{
    @PrimaryKey
    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, allowNull: false })
    public id: number;

    @ForeignKey(() => Space)
    @Column({ type: DataType.UUID, allowNull: false })
    public spaceId: string;

    @Column({ type: DataType.STRING })
    public phoneNumber: string;

    @Column({ type: DataType.STRING, defaultValue: LockerRequestType.CONNECTION, allowNull: false })
    public type: LockerRequestType;
}
