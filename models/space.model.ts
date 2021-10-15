import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { Optional } from 'sequelize';
import { City } from './city.model';
import { Appointment } from './appointment.model';
import { User } from './user.model';

interface ISpaceAttributes {
    id: string;
    address: string;
    type: SpaceType;
    description: string;
    roomsNumber: number;
    lockerConnected: boolean;
    imagesUrl: string[];
    cityId: number;
    userId: string;
    facilities?: string[];
}
export interface ISpaceCreationAttributes extends Optional<ISpaceAttributes, 'id'> {}
export interface ISpace extends ISpaceAttributes {}
export interface ISpaceCreate extends ISpaceCreationAttributes {}
export interface ISpaceEdit {
    address?: string;
    type?: SpaceType;
    description?: string;
    roomsNumber?: number;
    imagesUrl?: string[];
    cityId?: number;
    userId?: string;
    facilities?: string[];
}

export enum SpaceQuerySorting {
    NAME = 'name',
    DATE_OF_CREATION = 'dateOfCreation',
}
export enum SpaceType {
    FLAT = 'Квартира',
    HOUSE = 'Жилой дом',
}

@Table({ timestamps: true })
export class Space extends Model<ISpaceAttributes, ISpaceCreationAttributes> implements ISpaceAttributes {
    @PrimaryKey
    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
    public id!: string;

    @Column
    public address: string;

    @Column({ type: DataType.STRING })
    public type: SpaceType;

    @Column({ type: DataType.SMALLINT })
    public roomsNumber: number;
    // TODO Should be array of PREDEFINED values - TV, A/C and other stuff
    // @IsIn([Object.values(Facilities)])

    @ForeignKey(() => City)
    @Column
    public cityId: number;

    @BelongsTo(() => City)
    public city: City;

    @Column({ defaultValue: false })
    public lockerConnected: boolean;

    @ForeignKey(() => User)
    @Column({ type: DataType.UUID })
    userId: string;

    @BelongsTo(() => User)
    public user: User;

    @Column({ type: DataType.ARRAY(DataType.STRING) })
    public imagesUrl: string[];

    @Column({ type: DataType.CHAR(200) })
    public description: string;

    @Column({ type: DataType.ARRAY(DataType.STRING) })
    public facilities?: string[];

    @HasMany(() => Appointment)
    public appointments: Appointment[];
}
