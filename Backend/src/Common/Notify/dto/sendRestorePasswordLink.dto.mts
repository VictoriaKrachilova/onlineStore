import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class RestorePasswordDto {

    @ApiProperty({ example: 'qwertyuioplkjhgfdsa', description: 'password restore token' })
    token!: string;

    @ApiProperty({ example: 'uk', description: 'user`s language' })
    lang?: string;

    @ApiProperty({ example: 'UA', description: 'user`s country' })
    country!: string;

    @ApiProperty({ example: 'user@gmail.com', description: 'user`s email' })
    @IsEmail({}, { message: "Incorrect email" })
    email!: string;

    @ApiProperty({ example: 'uk/sendRestorePasswordLink.html', description: 'path to html file' })
    template?: string;

    @ApiProperty({ example: 'Restore Password', description: 'mail header' })
    subject?: string;

    @ApiProperty({ example: 'http://localhost:3000/reset-password?token=${token}', description: 'restore password link' })
    link?: string;
    
}
