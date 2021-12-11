import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { Optional } from 'sequelize';
import { City } from './city.model';
import { Appointment } from './appointment.model';
import { User } from './user.model';
import { ErrorMessages } from '../types/enums';

interface ISpaceAttributes {
    id: string;
    address: string;
    pricePerNight: number;
    type: SpaceType;
    description: string;
    roomsNumber: number;
    lockerConnected: boolean;
    imagesUrl?: string[];
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
    cityId?: number;
    userId?: string;
    facilities?: string[];
}

export enum SpaceType {
    FLAT = 'Квартира',
    HOUSE = 'Жилой дом',
}

export const spaceEditFields: Partial<keyof ISpaceAttributes>[] = [
    'address',
    'type',
    'description',
    'roomsNumber',
    'cityId',
    'userId',
    'facilities',
];

// TODO do we need paranoid or no? paranoid just 'mutes', hides
@Table({ timestamps: true, paranoid: false })
export class Space extends Model<ISpaceAttributes, ISpaceCreationAttributes> implements ISpaceAttributes {
    @PrimaryKey
    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
    public id!: string;

    @Column({ allowNull: false })
    public address: string;

    @Column({ allowNull: false })
    public pricePerNight: number;

    @Column({ allowNull: false, type: DataType.STRING })
    public type: SpaceType;

    @Column({ allowNull: false, type: DataType.SMALLINT })
    public roomsNumber: number;
    // TODO Should be array of PREDEFINED values - TV, A/C and other stuff
    // @IsIn([Object.values(Facilities)])

    @ForeignKey(() => City)
    @Column({ allowNull: false })
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

    @Column({
        type: DataType.ARRAY(DataType.STRING),
        allowNull: false,
        validate: {
            isSpecificLength(value) {
                if (value.length > 10) {
                    throw new Error(ErrorMessages.SPACE_IMAGES_VALIDATE);
                }
            },
        },
    })
    public imagesUrl: string[];

    @Column({ type: DataType.CHAR(200) })
    public description: string;

    @Column({ type: DataType.ARRAY(DataType.STRING) })
    public facilities?: string[];

    @HasMany(() => Appointment)
    public appointments: Appointment[];
}
