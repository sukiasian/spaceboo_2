import * as bcrypt from 'bcrypt';
import { Optional } from 'sequelize';
import { Column, Model, Table, PrimaryKey, DataType, BeforeCreate, BeforeUpdate, HasMany } from 'sequelize-typescript';
import { ErrorMessages } from '../types/enums';
import { Appointment } from './appointment.model';

export interface IUserAttributes {
    id: string;
    name: string;
    middleName: string;
    surname: string;
    email: string;
    password?: string;
    passwordConfirmation?: string;
    facebookId?: string;
    vkontakteId?: string;
    odnoklassnikiId?: string;
    verifyPassword?(instance: User): (password: string) => Promise<boolean>;
}
export interface IUserCreationAttributes extends Optional<IUserAttributes, 'id'> {}
// export interface IUser extends IUserAttributes {}
export interface IUserCreate extends IUserCreationAttributes {}

enum UserQueryExcludedAttributes {
    PASSWORD = 'password',
    PASSWORD_CONFIRMATION = 'passwordConfirmation',
    FACEBOOK_ID = 'facebookId',
    VKONTAKTE_ID = 'vkontakteId',
    ODNOKLASSNIKI_ID = 'odnoklassnikiId',
    CREATED_AT = 'createdAt',
    UPDATED_AT = 'updatedAt',
}
export enum UserScopes {
    WITH_PASSWORD = 'withPassword',
}

@Table({
    timestamps: true,
    defaultScope: {
        attributes: {
            exclude: [
                UserQueryExcludedAttributes.PASSWORD,
                UserQueryExcludedAttributes.PASSWORD_CONFIRMATION,
                UserQueryExcludedAttributes.FACEBOOK_ID,
                UserQueryExcludedAttributes.VKONTAKTE_ID,
                UserQueryExcludedAttributes.ODNOKLASSNIKI_ID,
                UserQueryExcludedAttributes.CREATED_AT,
                UserQueryExcludedAttributes.UPDATED_AT,
            ],
        },
    },
    scopes: {
        withPassword: {
            attributes: { exclude: [] },
        },
    },
})
export class User extends Model<IUserAttributes, IUserCreationAttributes> implements IUserAttributes {
    @PrimaryKey
    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, allowNull: false })
    public id!: string;

    @Column({
        allowNull: false,
        validate: {
            len: {
                msg: ErrorMessages.NAME_LENGTH_VALIDATE,
                args: [2, 25],
            },
            notNull: {
                msg: ErrorMessages.REQUIRED_FIELDS_VALIDATE,
            },
        },
    })
    public name: string;

    @Column({
        allowNull: false,
        validate: {
            len: {
                msg: ErrorMessages.NAME_LENGTH_VALIDATE,
                args: [2, 25],
            },
            notNull: {
                msg: ErrorMessages.REQUIRED_FIELDS_VALIDATE,
            },
        },
    })
    public surname: string;

    @Column({
        allowNull: false,
        validate: {
            len: {
                msg: ErrorMessages.MIDDLE_NAME_LENGTH_VALIDATE,
                args: [2, 25],
            },
            notNull: {
                msg: ErrorMessages.REQUIRED_FIELDS_VALIDATE,
            },
        },
    })
    public middleName: string;

    @Column({
        allowNull: false,
        validate: {
            isEmail: {
                msg: ErrorMessages.IS_EMAIL_VALIDATE,
            },
            // notNull: {
            //     msg: ErrorMessages.REQUIRED_FIELDS_VALIDATE,
            // },
        },
        // unique: { name: 'email', msg: 'not uniqueeee' },
    })
    public email: string;

    @Column({
        validate: {
            len: { msg: ErrorMessages.PASSWORD_LENGTH_VALIDATE, args: [8, 25] },
            checkPasswords(this: User) {
                if (this.password !== this.passwordConfirmation) {
                    // FIXME should be AppError
                    throw new Error(ErrorMessages.PASSWORDS_DO_NOT_MATCH_VALIDATE);
                }
            },
        },
    })
    public password: string;

    @Column
    public passwordConfirmation: string;

    @Column
    public facebookId: string;

    @Column
    public vkontakteId: string;

    @Column
    public odnoklassnikiId: string;

    @HasMany(() => Appointment)
    public appointments: Appointment[];
    @BeforeUpdate
    @BeforeCreate // === pre-hook
    static async hashPasswordAndRemovePasswordConfirmation(instance: User): Promise<void> {
        // NOTE probably here we need a check if password is provided or no - for example, for Facebook auth there's no password, but operations below still probably will be executed
        instance.password = await bcrypt.hash(instance.password, 10);
        instance.passwordConfirmation = undefined;
    }

    verifyPassword(instance: User): (password: string) => Promise<boolean> {
        return async (password: string): Promise<boolean> => {
            return bcrypt.compare(password, instance.password);
        };
    }

    // TODO: номер телефона - у юзера? или у модели? И как это будет работать?
}
