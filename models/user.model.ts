import * as bcrypt from 'bcrypt';
import { Optional } from 'sequelize';
import { Column, Model, Table, PrimaryKey, DataType, BeforeCreate, BeforeUpdate, HasMany } from 'sequelize-typescript';
import { ErrorMessages, HttpStatus } from '../types/enums';
import AppError from '../utils/AppError';
import { Appointment } from './appointment.model';

export interface IUserAttributes {
    id: string;
    name: string;
    middleName: string;
    surname: string;
    email: string;
    role?: UserRoles;
    password?: string;
    passwordConfirmation?: string;
    facebookId?: string;
    vkontakteId?: string;
    odnoklassnikiId?: string;
    avatarUrl?: string;
    verifyPassword?(instance: User): (password: string) => Promise<boolean>;
}
export interface IUserCreationAttributes extends Optional<IUserAttributes, 'id'> {}
export interface IUserCreate extends IUserCreationAttributes {}
export interface IUserEdit {
    name?: string;
    middleName?: string;
    surname?: string;
    // email: string;
    password?: string;
    passwordConfirmation?: string;
}

export enum UserRoles {
    ADMIN = 'admin',
    USER = 'user',
}
enum UserQueryExcludedAttributes {
    PASSWORD = 'password',
    PASSWORD_CONFIRMATION = 'passwordConfirmation',
    FACEBOOK_ID = 'facebookId',
    VKONTAKTE_ID = 'vkontakteId',
    ODNOKLASSNIKI_ID = 'odnoklassnikiId',
    CREATED_AT = 'createdAt',
    UPDATED_AT = 'updatedAt',
    ROLE = 'role',
}
export enum UserScopes {
    WITH_PASSWORD = 'withPassword',
    WITH_ROLE = 'withRole',
}

export const userEditFields: Partial<keyof IUserAttributes>[] = [
    'name',
    'middleName',
    'surname',
    'password',
    'passwordConfirmation',
    // 'email'
];

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
                UserQueryExcludedAttributes.ROLE,
            ],
        },
    },
    scopes: {
        withPassword: {
            attributes: { exclude: [] },
        },
        withRole: {
            attributes: { include: [UserQueryExcludedAttributes.ROLE] },
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
        },
        unique: {
            name: 'email',
            msg: ErrorMessages.EMAIL_UNIQUE_VALIDATE,
        },
    })
    public email: string;

    @Column({ allowNull: false, defaultValue: UserRoles.USER })
    role: UserRoles;

    @Column({
        validate: {
            len: { msg: ErrorMessages.PASSWORD_LENGTH_VALIDATE, args: [8, 25] },
            // FIXME comparePasswords, not checkAvailability
            comparePasswordWithPasswordConfirmation(this: User): void {
                if (this.password !== this.passwordConfirmation) {
                    throw new AppError(HttpStatus.BAD_REQUEST, ErrorMessages.PASSWORDS_DO_NOT_MATCH_VALIDATE);
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

    @Column({ allowNull: true })
    public avatarUrl: string;

    @HasMany(() => Appointment)
    public appointments?: Appointment[];

    @BeforeUpdate
    @BeforeCreate // === pre-hook
    static async hashPasswordAndRemovePasswordConfirmation(instance: User): Promise<void> {
        // NOTE probably here we need a check if password is provided or no - for example, for Facebook auth there's no password, but operations below still probably will be executed
        if (instance.password) {
            instance.password = await bcrypt.hash(instance.password, 10);
            instance.passwordConfirmation = undefined;
        }
    }

    // @BeforeUpdate
    // @BeforeBulkUpdate
    // static comparePasswords(instance: User): void {
    //     if (instance.password) {
    //         if (instance.password !== instance.passwordConfirmation) {
    //             throw new Error('errorrrrrrrrr');
    //         }
    //     }
    // }

    verifyPassword(instance: User): (password: string) => Promise<boolean> {
        return async (password: string): Promise<boolean> => {
            return bcrypt.compare(password, instance.password);
        };
    }

    // TODO: номер телефона - у юзера? или у модели? И как это будет работать?
}
