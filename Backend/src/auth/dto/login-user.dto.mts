import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, Length } from "class-validator";

export class LoginUserDto {

    @ApiProperty({ example: 'user@gmail.com', description: 'E-mail' })
    @IsString()
    @IsEmail({}, { message: "Incorrect email" })
    @IsOptional()
    readonly email!: string;

    @ApiProperty({ example: '12345678', description: 'Password' })
    @IsString()
    @Length(8, 16, { message: 'Not less than 8 and not more than 16' })
    @IsOptional()
    readonly password!: string;
};