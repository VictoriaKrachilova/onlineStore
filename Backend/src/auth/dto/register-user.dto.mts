import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length, IsOptional, IsNumberString } from "class-validator";
import { DeliveryWays, PaymentTypes } from "../../Common/newTypes.mjs";

export class RegisterUserDto {

    @ApiProperty({ example: 'user@gmail.com', description: 'E-mail' })
    @IsString({ message: 'email must be string' })
    @IsEmail({}, { message: "Incorrect email" })
    readonly email!: string;

    @ApiProperty({ example: "12345678", description: 'Password' })
    @IsString()
    @Length(8, 16, { message: 'Not less than 8 and not more than 16' })
    @IsOptional()
    readonly password!: string;

    @ApiProperty({ example: 'Jon Scot', description: 'name' })
    @IsString()
    @IsOptional()
    readonly name!: string;

    @ApiProperty({ example: 'AMPARO', description: 'store name' })
    @IsString()
    @IsOptional()
    readonly storeName!: string;

    @ApiProperty({ example: '380680000000', description: 'User phone' })
    @IsNumberString()
    @IsOptional()
    readonly phone!: string;

    @ApiProperty({ example: 'UA', description: 'User country' })
    @IsString()
    readonly country!: string;

    @ApiProperty({ example: PaymentTypes.cashless, description: 'payment types', enum: PaymentTypes })
    @IsOptional()
    defaultPaymentType?: PaymentTypes;

    @ApiProperty({ example: [ DeliveryWays.ups ], description: 'payment types', isArray: true, enum: DeliveryWays })
    @IsOptional()
    defaultDeliveryWays?: Array<DeliveryWays>;
}
