import { user } from "../../Common/newTypes.mjs";
import { ApiProperty } from "@nestjs/swagger";

import { IsString, IsOptional } from "class-validator";

export class ReplyToReviewDto {

    @ApiProperty({ example: 1, description: 'Review ID' })
    commentId!: number;

    @ApiProperty({ example: "thanks", description: 'Answer to comment from recipient' })
    @IsOptional()
    @IsString()
    reply?: string;

    user!: user;
}
