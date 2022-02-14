import { Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { Optional } from 'sequelize';

interface IEmailVerificationAttributes {
    id: string;
    code: number;
    email: string;
}
interface IEmailVerificationCreationAttributes extends Optional<IEmailVerificationAttributes, 'id'> {}
export interface IEmailVerification extends IEmailVerificationAttributes {}

@Table({ timestamps: true })
export class EmailVerification
    extends Model<IEmailVerificationAttributes, IEmailVerificationCreationAttributes>
    implements IEmailVerificationAttributes
{
    @PrimaryKey
    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
    public id!: string;

    @Column({
        type: DataType.INTEGER,
    })
    public code: number;

    @Column
    public email: string;
}
