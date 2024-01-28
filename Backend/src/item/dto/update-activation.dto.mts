import { user } from "../../Common/newTypes.mjs";
import { ApiProperty } from "@nestjs/swagger";

export class updateActivationDto {

    @ApiProperty({ example: 2, description: 'Cargo ID' })
    id!: number;

    @ApiProperty({ example: false, description: 'Deactivate or activate cargo' })
    isActive!: boolean;

    user!: user;
}