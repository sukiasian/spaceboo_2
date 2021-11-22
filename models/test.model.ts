import { Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { Optional } from 'sequelize';

interface ITestModel {
    id: string;
    startDate: number;
    finishDate: number;
    readonly text: string;
}

export interface ITestModelCreation extends Optional<ITestModel, 'id'> {}

// export interface ISpaceEdit

@Table({ timestamps: true })
export class Test extends Model<ITestModel, ITestModelCreation> implements ITestModel {
    @PrimaryKey
    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
    public id!: string;

    @Column({ type: DataType.BIGINT })
    public startDate: number;

    @Column({ type: DataType.BIGINT })
    public finishDate: number;

    @Column({ defaultValue: 'user' })
    public text: string;
}
