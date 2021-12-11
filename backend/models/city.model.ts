import { AutoIncrement, Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { Optional } from 'sequelize';

interface ICityAttributes {
    id: number;
    address: string;
    postal_code: number;
    country: string;
    federal_district: string;
    region_type: string;
    region: string;
    area_type: string;
    area: string;
    city_type: string;
    city: string;
    timezone: string;
    supports_locker: boolean;
}

export interface ICityCreationAttributes extends Optional<ICityAttributes, 'id'> {}

@Table({ timestamps: false })
export class City extends Model<ICityAttributes, ICityCreationAttributes> implements ICityAttributes {
    @AutoIncrement
    @PrimaryKey
    @Column({ type: DataType.INTEGER })
    public id: number;

    @Column({ type: DataType.CHAR(255) })
    public address: string;

    @Column({ type: DataType.INTEGER })
    public postal_code: number;

    @Column({ type: DataType.CHAR(255) })
    public country: string;

    @Column({ type: DataType.CHAR(255) })
    public federal_district: string;

    @Column({ type: DataType.CHAR(255) })
    public region_type: string;

    @Column({ type: DataType.CHAR(255) })
    public region: string;

    @Column({ type: DataType.CHAR(255) })
    public area_type: string;

    @Column({ type: DataType.CHAR(255) })
    public area: string;

    @Column({ type: DataType.CHAR(255) })
    public city_type: string;

    @Column({ type: DataType.CHAR(255) })
    public city: string;

    @Column({ type: DataType.CHAR(255) })
    public timezone: string;

    @Column({ defaultValue: false })
    public supports_locker: boolean;
}
