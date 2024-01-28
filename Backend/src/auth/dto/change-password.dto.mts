import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length } from "class-validator";
import { user } from "src/Common/newTypes.mjs";

export class ChangePasswordDto {

    @ApiProperty({ example: '123456789', description: 'Old password' })
    @IsString()
    @Length(8, 16, { message: 'Not less than 8 and not more than 16' })
    readonly oldPassword!: string;

    @ApiProperty({ example: '1234567891', description: 'new password' })
    @IsString()
    @Length(8, 16, { message: 'Not less than 8 and not more than 16' })
    readonly newPassword!: string;

    user!: user;
}
