import { user } from "../../Common/newTypes.mjs";
import { ApiProperty } from "@nestjs/swagger";
import { Min, Max, IsString, IsInt, IsOptional} from "class-validator";

export class AddCommentDto {

    @ApiProperty({ example: 34, description: 'item id' })
    itemId!: number;

    @ApiProperty({ example: "how much does it cost?", description: 'Comment for rating' })
    @IsString()
    comment!: string;

    user!: user;
}
