import * as bcrypt from 'bcrypt';
import { Optional } from 'sequelize';
import { Column, Model, Table, PrimaryKey, DataType, BeforeCreate, BeforeUpdate, HasMany } from 'sequelize-typescript';
import { ErrorMessages, HttpStatus } from '../types/enums';
import AppError from '../utils/AppError';
import { Appointment } from './appointment.model';

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
    CONFIRMED = 'confirmed',
}
export enum UserScopes {
    WITH_PASSWORD = 'withPassword',
    WITH_ROLE = 'withRole',
    WITH_CONFIRMED = 'withConfirmed',
}

export interface IUserAttributes {
    id: string;
    name: string;
    middleName: string;
    surname: string;
    email: string;
    role?: UserRoles;
    password?: string;
    passwordConfirmation?: string;
    confirmed: boolean;
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
}
// FIXME use OMIT instead to avoid duplication
export interface IUserPasswordChange {
    password: string;
    passwordConfirmation: string;
    oldPassword?: string;
}

export const userCreateFields: Partial<keyof IUserAttributes>[] = [
    'name',
    'middleName',
    'surname',
    'password',
    'passwordConfirmation',
    'email',
];
export const userEditFields: Partial<keyof IUserAttributes>[] = [
    'name',
    'middleName',
    'surname',
    // 'password',
    // 'passwordConfirmation',
    // 'email' -- TODO this should be approved by email the same way - with 6 digit code
];

const isCyrillicLiteralsOnly = (value: string) => {
    const symbols = value.match(/[^а-я^-]/gi);

    if (symbols) {
        throw new AppError(HttpStatus.FORBIDDEN, ErrorMessages.NAME_SHOULD_BE_LITERAL_AND_CYRILLIC_ONLY);
    }
};

export const changeUserPasswordFields: Partial<keyof IUserAttributes>[] = ['password', 'passwordConfirmation'];

// TODO add date of birth
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
                UserQueryExcludedAttributes.CONFIRMED,
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
        withConfirmed: {
            attributes: { include: [UserQueryExcludedAttributes.CONFIRMED] },
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
            isCyrillicLiteralsOnly,
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
            isCyrillicLiteralsOnly,
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
            isCyrillicLiteralsOnly,
        },
    })
    public middleName: string;

    @Column({
        allowNull: false,
        validate: {
            notNull: {
                msg: ErrorMessages.REQUIRED_FIELDS_VALIDATE,
            },
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
                    throw new AppError(HttpStatus.BAD_REQUEST, ErrorMessages.PASSWORDS_DO_NOT_MATCH);
                }
            },
        },
    })
    public password: string;

    @Column
    public passwordConfirmation: string;

    @Column({ allowNull: false, defaultValue: false })
    public confirmed: boolean;

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

    verifyPassword(instance: User): (password: string) => Promise<boolean> {
        return async (password: string): Promise<boolean> => {
            return bcrypt.compare(password, instance.password);
        };
    }

    // TODO: номер телефона - у юзера? или у модели? И как это будет работать?
}
