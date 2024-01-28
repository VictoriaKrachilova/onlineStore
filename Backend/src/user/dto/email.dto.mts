import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class EmailDto {

    @ApiProperty({ example: 'user@gmail.com', description: 'user`s email' })
    @IsEmail()
    email!: string;

}