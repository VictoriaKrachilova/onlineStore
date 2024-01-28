import { user } from "../../Common/newTypes.mjs";
import { ApiProperty } from "@nestjs/swagger";

import { Min, Max, IsString, IsOptional } from "class-validator";

export class EditCommentDto {

    @ApiProperty({ example: 1, description: 'Comment ID' })
    commentId!: number;


    @ApiProperty({ example: "lies, deceit and provocation", description: 'Comment for rating' })
    @IsOptional()
    @IsString()
    comment?: string;

    user!: user;
}
