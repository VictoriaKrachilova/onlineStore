import { Column, DataType, Model, Table, ForeignKey, BelongsTo} from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";
import { User } from "../../user/models/user.model.mjs";
import { Item } from "./item.model.mjs";


interface CartCreationAttrs {
    userId: number;
    itemId: number;
    amount?: number;
};

@Table({ tableName: 'cart', createdAt: false, updatedAt: false })
export class Cart extends Model <Cart, CartCreationAttrs> {

    @ApiProperty({ example: 1, description: 'Unique identificator' })
    @Column({ type: DataType.BIGINT, unique: true, autoIncrement: true, primaryKey: true })
    declare id: number;

    @ForeignKey(() => User)
    @Column({ type: DataType.BIGINT, allowNull: false })
    userId!: number;

    @ForeignKey(() => Item)
    @Column({ type: DataType.BIGINT, allowNull: false })
    itemId!: number;

    @ApiProperty({ example: 2, description: 'quantity (count)' })
    @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 1 })
    amount?: number;

    @ApiProperty({ example: 1671455275315, description: 'Created at' })
    @Column({ type: DataType.BIGINT, allowNull: false, defaultValue: () => Date.now() })
    created!: number;

    @BelongsTo(() => User)
    user!: User;

    @BelongsTo(() => Item)
    item!: Item;

}
