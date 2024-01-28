import { user } from "../../Common/newTypes.mjs";
import { ApiProperty } from "@nestjs/swagger";
import { Min, Max, IsString, IsInt, IsOptional} from "class-validator";

export class AddReviewDto {


    @ApiProperty({ example: 2, description: 'Who received the comment' })
    recipientId!: number;

    @ApiProperty({ example: 2, description: 'Rating (from 1 to 5)' })
    @IsInt()
    @Min(1)
    @Max(5)
    rating!: number;

    @ApiProperty({ example: "lies, deceit and provocation", description: 'Review for rating' })
    @IsOptional()
    @IsString()
    comment?: string;

    user!: user;
}
