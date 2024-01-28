import { user } from "../../Common/newTypes.mjs";
import { ApiProperty } from "@nestjs/swagger";

import { Min, Max, IsString, IsOptional } from "class-validator";

export class EditReviewDto {

    @ApiProperty({ example: 1, description: 'Review ID' })
    commentId!: number;

    @ApiProperty({ example: 2, description: 'Rating (from 1 to 5)' })
    @Min(1)
    @Max(5)
    rating!: number;

    @ApiProperty({ example: "lies, deceit and provocation", description: 'Review for rating' })
    @IsOptional()
    @IsString()
    comment?: string;

    user!: user;
}
