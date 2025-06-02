import { Column, DataType, Model, Table, ForeignKey, BelongsTo} from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";
import { Categories, DeliveryWays, Location, PaymentTypes } from "../../Common/newTypes.mjs";
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
  category: Categories;
  filter: Record<string, any>; // вместо JSON — безопаснее
  filenames?: string[];
  modifiedTimestamp?: number;
  isActive?: boolean;
  created?: number;
}

@Table({ tableName: 'item', createdAt: false, updatedAt: false })
export class Item extends Model<Item, ItemCreationAttrs> {

  @ApiProperty({ example: 1, description: 'Unique identifier' })
  @Column({ type: DataType.BIGINT, unique: true, autoIncrement: true, primaryKey: true })
  declare id: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.BIGINT, allowNull: false })
  userId!: number;

  @ApiProperty({ example: 'Trailer Lev', description: 'Item name' })
  @Column({ type: DataType.STRING, allowNull: false })
  title!: string;

  @ApiProperty({ example: 'Length: 1m', description: 'Item description' })
  @Column({ type: DataType.STRING, allowNull: false })
  content!: string;

  @ApiProperty({ example: 2, description: 'Quantity available' })
  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 1 })
  amount!: number;

  @ApiProperty({ example: 2500, description: 'Price per unit' })
  @Column({ type: DataType.BIGINT, allowNull: true })
  price?: number;

  @ApiProperty({ example: 'UAH', description: 'Currency' })
  @Column({ type: DataType.STRING, allowNull: true })
  currency?: string;

  @ApiProperty({ enum: Categories, description: 'Category of item' })
  @Column({ type: DataType.STRING, allowNull: false })
  category!: Categories;

  @ApiProperty({ example: { brand: 'BMW' }, description: 'Additional filter data' })
  @Column({ type: DataType.JSONB, allowNull: false, defaultValue: {} })
  filter!: Record<string, any>;

  @ApiProperty({ type: Location, description: 'Location of item' })
  @Column({ type: DataType.JSONB, allowNull: false, defaultValue: {} })
  location!: Location;

  @ApiProperty({ enum: PaymentTypes, description: 'Accepted payment type' })
  @Column({ type: DataType.STRING, allowNull: false, defaultValue: PaymentTypes.cashless })
  paymentType!: PaymentTypes;

  @ApiProperty({ example: ['photo-1.jpg'], description: 'List of item image filenames' })
  @Column({ type: DataType.ARRAY(DataType.STRING), allowNull: false, defaultValue: [] })
  filenames!: string[];

  @ApiProperty({ example: 1671455275315, description: 'Unix timestamp when modified' })
  @Column({ type: DataType.BIGINT, allowNull: false, defaultValue: 0 })
  modifiedTimestamp!: number;

  @ApiProperty({ example: true, description: 'Whether the item is active' })
  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  isActive!: boolean;

  @ApiProperty({ example: 1671455275315, description: 'Unix timestamp when created' })
  @Column({ type: DataType.BIGINT, allowNull: false, defaultValue: () => Date.now() })
  created!: number;

  @BelongsTo(() => User)
  user!: User;
}
