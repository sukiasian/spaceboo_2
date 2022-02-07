import { Column, DataType, HasMany, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { Optional } from 'sequelize';
import { Region } from './region.model';

interface IDistrictAttributes {
    id: number;
    name: string;
    regions?: Region[];
}

export interface IDistrictCreationAttributes extends Optional<IDistrictAttributes, 'id'> {}

@Table({ timestamps: false })
export class District extends Model<IDistrictAttributes, IDistrictCreationAttributes> implements IDistrictAttributes {
    @PrimaryKey
    @Column({ type: DataType.INTEGER })
    public id: number;

    @Column({ type: DataType.STRING })
    public name: string;

    @HasMany(() => Region)
    public regions?: Region[];
}
