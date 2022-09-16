import { BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { Optional } from 'sequelize';
import { Region } from './region.model';

interface ICityAttributes {
    id: number;
    regionId: number;
    name: string;
    supports_locker: boolean;
    region?: Region;
}

export interface ICityCreationAttributes extends Optional<ICityAttributes, 'id'> {}

@Table({ timestamps: false })
export class City extends Model<ICityAttributes, ICityCreationAttributes> implements ICityAttributes {
    @PrimaryKey
    @Column({
        type: DataType.INTEGER,
    })
    public id: number;

    @ForeignKey(() => Region)
    @Column({ type: DataType.INTEGER })
    public regionId: number;

    @Column({ type: DataType.STRING })
    public name: string;

    @Column({ defaultValue: false })
    public supports_locker: boolean;

    @BelongsTo(() => Region)
    public region?: Region;
}
