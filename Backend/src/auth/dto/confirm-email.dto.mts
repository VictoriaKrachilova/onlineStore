import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class ConfirmEmailDto {

    @ApiProperty({ example: '123456qwertyu', description: 'user`s token activate (confirm email)' })
    @IsString()
    token!: string;

}