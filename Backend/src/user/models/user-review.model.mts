import { Column, DataType, Model, Table, BelongsTo, ForeignKey } from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";
import { User } from "./user.model.mjs";


interface UserReviewCreationAttrs {
    authorId: number;
    recipientId: number;
    comment?: string;
    rating: number;
};

@Table({ tableName: 'user_review', createdAt: false, updatedAt: false })
export class UserReview extends Model<UserReview, UserReviewCreationAttrs> {

    @ApiProperty({ example: 1, description: 'Unique identificator' })
    @Column({ type: DataType.BIGINT, unique: true, autoIncrement: true, primaryKey: true })
    declare id: number;

    @ForeignKey(() => User)
    @ApiProperty({ example: 1, description: 'User ID (who left a comment)' })
    @Column({ type: DataType.BIGINT, allowNull: false })
    authorId!: number;

    @ForeignKey(() => User)
    @ApiProperty({ example: 2, description: 'Who received the comment' })
    @Column({ type: DataType.BIGINT, allowNull: false })
    recipientId!: number;

    @ApiProperty({ example: 2, description: 'Rating (from 1 to 5)' })
    @Column({ type: DataType.INTEGER, allowNull: false })
    rating!: number;

    @ApiProperty({ example: 'lies, deceit and provocation', description: 'Comment for rating' })
    @Column({ type: DataType.STRING })
    comment?: string;

    @ApiProperty({ example: 'thanks', description: 'Answer to comment from recipient' })
    @Column({ type: DataType.STRING })
    reply?: string;

    @ApiProperty({ example: 1671455275315, description: 'Created at' })
    @Column({ type: DataType.BIGINT, allowNull: false, defaultValue: () => Date.now() })
    created!: number;

    @ApiProperty({ example: false, description: 'delete' })
    @Column({ type: DataType.BOOLEAN, defaultValue: true, allowNull: false })
    isVisible!: boolean;

    @ApiProperty({ example: 0, description: 'modified reply at' })
    @Column({ type: DataType.BIGINT, allowNull: false, defaultValue: 0 })
    modifiedReplyTimestamp!: number;

    @BelongsTo(() => User, 'authorId')
    author!: User;

    @BelongsTo(() => User, 'recipientId')
    recipient!: User;

}
