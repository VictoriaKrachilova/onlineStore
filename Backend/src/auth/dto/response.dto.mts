import { ApiProperty } from "@nestjs/swagger";

export class LoginResponseDto {

    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJpYXQiOjE2NzE1Mzc4NzksImV4cCI6MTY3MTYyNDI3OX0.lCn3jMYzt6sdxvpaf598zdkWVZQOuK3PH9cUkTcU03E', description: 'token for authorization' })
    readonly token!: string;
}