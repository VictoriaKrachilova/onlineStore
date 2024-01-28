import { Column, DataType, Model, Table, ForeignKey, BelongsTo} from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";
import { Categories, DeliveryWays, Location, PaymentTypes, Subcategories } from "../../Common/newTypes.mjs";
import { User } from "../../user/models/user.model.mjs";


interface ItemCreationAttrs {
    userId: number;
    title: string;
    content: string;
    amount: number;
    price?: number;
    currency?: string;
    location: Location;
    paymentType: PaymentTypes;
    category: string;
    subcategory: string;
    filter: JSON;
};

@Table({ tableName: 'item', createdAt: false, updatedAt: false })
export class Item extends Model<Item, ItemCreationAttrs> {

    @ApiProperty({ example: 1, description: 'Unique identificator' })
    @Column({ type: DataType.BIGINT, unique: true, autoIncrement: true, primaryKey: true })
    declare id: number;

    @ForeignKey(() => User)
    @Column({ type: DataType.BIGINT, allowNull: false })
    userId!: number;

    @ApiProperty({ example: 'Trailer Lev', description: 'item name' })
    @Column({ type: DataType.STRING, allowNull: false })
    title!: string;

    @ApiProperty({ example: 'length: 1m', description: 'item description' })
    @Column({ type: DataType.STRING, allowNull: false })
    content!: string;

    @ApiProperty({ example: 2, description: 'quantity available (count)' })
    @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 1 })
    amount!: number;

    @ApiProperty({ example: 2, description: 'price per one thing' })
    @Column({ type: DataType.BIGINT, allowNull: true })
    price?: number;

    @ApiProperty({ example: "UAH", description: 'currency' })
    @Column({ type: DataType.STRING, allowNull: true})
    currency?: string;

    @ApiProperty({ description: 'category', enum: Categories })
    @Column({ type: DataType.STRING, allowNull: false  })
    category!: string;

    @ApiProperty({ description: 'subcategory', enum: Subcategories })
    @Column({ type: DataType.STRING, allowNull: false  })
    subcategory!: string;

    @ApiProperty({ example: { brand: "BMW" }, description: 'all info from category filter' })
    @Column({ type: DataType.JSON, allowNull: false, defaultValue: {} })
    filter!: JSON;

    @ApiProperty({ type: Location, description: 'item location' })
    @Column({ type: DataType.JSON, defaultValue: {}, allowNull: false })
    location!: Location;

    @ApiProperty({ example: PaymentTypes.cashless, description: 'payment types', enum: PaymentTypes })
    @Column({ type: DataType.STRING, allowNull: false, defaultValue: PaymentTypes.cashless })
    paymentType!: PaymentTypes;

    @ApiProperty({ example: "full-item-2.jpg", description: 'the name of the file from which it can be taken', isArray: true })
    @Column({ type: DataType.ARRAY(DataType.STRING), allowNull: false, defaultValue: [] })
    filenames?: Array<string>

    @ApiProperty({ example: 0, description: 'modified at' })
    @Column({ type: DataType.BIGINT, allowNull: false, defaultValue: 0 })
    modifiedTimestamp!: number;

    @ApiProperty({ example: 0, description: 'Active item or not' })
    @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
    isActive!: boolean;

    @ApiProperty({ example: 1671455275315, description: 'Created at' })
    @Column({ type: DataType.BIGINT, allowNull: false, defaultValue: () => Date.now() })
    created!: number;

    @BelongsTo(() => User)
    user!: User;

}
