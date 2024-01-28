import { IsNumber } from "class-validator";
import { user } from "../../Common/newTypes.mjs";
import { ApiProperty } from "@nestjs/swagger";

export class IdDto {

    @ApiProperty({ example: 1, description: 'ID' })
    @IsNumber()
    id!: number;

    user!: user;
}
