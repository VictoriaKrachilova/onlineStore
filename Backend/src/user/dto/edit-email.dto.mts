import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";
import { user } from "../../Common/newTypes.mjs";

export class EditEmailDto {

    @ApiProperty({ example: 'user2@gmail.com', description: 'New e-mail' })
    @IsString()
    @IsEmail()
    readonly email!: string;

    user!: user;
}
