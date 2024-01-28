import { Column, DataType, Model, Table, ForeignKey, BelongsTo, HasMany} from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";
import { Countries } from "./countries.model.mjs";
import { DeliveryWays, PaymentTypes } from "../../Common/newTypes.mjs";


interface UserCreationAttrs {
    email: string;
    password: string | null;
    contactPhones?: Array<string>;
    name: string;
    storeName?: string;
    countryId: number;
    defaultPaymentType?: PaymentTypes;
    defaultDeliveryWays?: Array<DeliveryWays>;
    googleId: string | null;
};

@Table({ tableName: 'user', createdAt: false, updatedAt: false })
export class User extends Model<User, UserCreationAttrs> {

    @ApiProperty({ example: 1, description: 'Unique identificator' })
    @Column({ type: DataType.BIGINT, unique: true, autoIncrement: true, primaryKey: true })
    declare id: number;

    @ApiProperty({ example: 'user@gmail.com', description: 'E-mail' })
    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    email!: string;

    @ApiProperty({ example: '12345678', description: 'Password' })
    @Column({ type: DataType.STRING, allowNull: true })
    password?: string;

    @ApiProperty({ example: '380684668077', description: 'phone', isArray: true })
    @Column({ type: DataType.ARRAY(DataType.STRING), allowNull: false, defaultValue: [] })
    contactPhones?: Array<string>;

    @ApiProperty({ example: 'Jon', description: 'name' })
    @Column({ type: DataType.STRING, allowNull: false })
    name!: string;

    @ApiProperty({ example: 'AMPARO', description: 'store name' })
    @Column({ type: DataType.STRING, allowNull: true })
    storeName?: string;

    @ForeignKey(() => Countries)
    @ApiProperty({ example: 232, description: 'country id' })
    @Column({ type: DataType.BIGINT, allowNull: false })
    countryId!: number;

    @ApiProperty({ example: 1671455275315, description: 'Created at' })
    @Column({ type: DataType.BIGINT, allowNull: false, defaultValue: () => Date.now() })
    created!: number;

    @ApiProperty({ example: '106436365792439342651', description: 'registration from google' })
    @Column({ type: DataType.STRING, allowNull: true  })
    googleId?: string;

    @ApiProperty({ example: 'cashless', description: 'payment types', enum: PaymentTypes })
    @Column({ type: DataType.STRING, allowNull: false, defaultValue: PaymentTypes.cashless })
    defaultPaymentType?: PaymentTypes;

    @ApiProperty({ example: DeliveryWays.ups, description: 'payment types', isArray: true, enum: DeliveryWays })
    @Column({ type: DataType.ARRAY(DataType.STRING), allowNull: false, defaultValue: [ DeliveryWays.ups, DeliveryWays.post_1, DeliveryWays.new_post, DeliveryWays.mail_box ]  })
    defaultDeliveryWays?: Array<DeliveryWays>;
    
    @ApiProperty({ example: 0 })
    @Column({ type: DataType.DECIMAL, allowNull: false, defaultValue: 0 })
    balance!: number;

    @ApiProperty({ example: 4, description: 'User`s rating' })
    @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 4 })
    rating!: number;

    @ApiProperty({ example: 0, description: 'The end of subscription' })
    @Column({ type: DataType.BIGINT, allowNull: false, defaultValue: 0 })
    subscriptionEndTimestamp!: number;

    @ApiProperty({ example: false, description: 'Hidden account or not' })
    @Column({ type: DataType.BOOLEAN, defaultValue: true })
    isVisible!: boolean;
    
    @ApiProperty({ example: null, description: 'confirmed email or not' })
    @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
    isActivate!: boolean;

    @ApiProperty({ example: false, description: 'Banned account or not' })
    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    isBanned!: boolean;

    @BelongsTo(() => Countries)
    country!: Countries;
}
