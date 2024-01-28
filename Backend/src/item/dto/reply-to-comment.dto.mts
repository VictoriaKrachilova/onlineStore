import { user } from "../../Common/newTypes.mjs";
import { ApiProperty } from "@nestjs/swagger";

import { Min, Max, IsString, IsOptional } from "class-validator";

export class ReplyToCommentDto {

    @ApiProperty({ example: 1, description: 'Comment ID' })
    commentId!: number;

    @ApiProperty({ example: "thanks", description: 'Answer to comment from recipient' })
    @IsOptional()
    @IsString()
    reply?: string;

    user!: user;
}
