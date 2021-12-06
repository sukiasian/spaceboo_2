import { BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { Optional } from 'sequelize';
import { User } from './user.model';

interface IEmailVerificationAttributes {
    id: string;
    code: number;
    email: string;
}
interface IEmailVerificationCreationAttributes extends Optional<IEmailVerificationAttributes, 'id'> {}

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
