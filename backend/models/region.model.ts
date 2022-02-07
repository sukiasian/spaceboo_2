import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { Optional } from 'sequelize';
import { District } from './district.model';
import { City } from './city.model';

interface IRegionAttributes {
    id: number;
    districtId: number;
    name: string;
    district: District;
    cities?: City[];
}

export interface IRegionCreationAttributes extends Optional<IRegionAttributes, 'id'> {}

@Table({ timestamps: false })
export class Region extends Model<IRegionAttributes, IRegionCreationAttributes> implements IRegionAttributes {
    @PrimaryKey
    @Column({ type: DataType.INTEGER })
    public id: number;

    @ForeignKey(() => District)
    @Column({ type: DataType.INTEGER })
    public districtId: number;

    @Column({ type: DataType.STRING })
    public name: string;

    @BelongsTo(() => District)
    public district: District;

    @HasMany(() => City)
    public cities?: City[];
}
