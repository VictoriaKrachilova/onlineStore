import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length } from "class-validator";
import { user } from "src/Common/newTypes.mjs";

export class SetNewPasswordDto {

    @ApiProperty({ example: '1234567891', description: 'New password' })
    @IsString()
    @Length(8, 16, { message: 'Not less than 8 and not more than 16' })
    readonly password!: string;

    @ApiProperty({ example: 'vhvm634992c31677516259788', description: 'new password' })
    @IsString()
    readonly token!: string;

    user!: user;
}
