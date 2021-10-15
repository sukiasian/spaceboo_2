import { BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table, Validate } from 'sequelize-typescript';
import { Optional } from 'sequelize';
import { Space } from './space.model';
import { User } from './user.model';

interface IReservationDatePart {
    inclusive: boolean;
    value: string;
}
interface IAppointmentAttributes {
    id: string;
    datesReserved: TDatesReserved;
    spaceId: string;
    userId: string;
}
export interface IAppointment {
    id: string;
    datesReserved: TDatesReserved;
    spaceId: string;
    userId: string;
}
interface IAppointmentCreationAttributes extends Optional<IAppointmentAttributes, 'id'> {}
export type TDatesReserved = [IReservationDatePart, IReservationDatePart];

@Table({ timestamps: true })
export class Appointment
    extends Model<IAppointmentAttributes, IAppointmentCreationAttributes>
    implements IAppointmentAttributes
{
    @PrimaryKey
    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
    public id!: string;

    @Column({ type: DataType.RANGE(DataType.DATE) })
    public datesReserved: TDatesReserved;

    @ForeignKey(() => Space)
    @Column({ type: DataType.UUID })
    public spaceId: string;

    @ForeignKey(() => User)
    @Column({ type: DataType.UUID })
    public userId: string;

    @BelongsTo(() => Space)
    public space: Space;

    @BelongsTo(() => User)
    public user: User;
}
