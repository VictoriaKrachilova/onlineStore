import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length, IsOptional, IsNumberString } from "class-validator";
import { DeliveryWays, Location, PaymentTypes } from "../../Common/newTypes.mjs";

export class RegisterDto {

    @ApiProperty({ example: 'user@gmail.com', description: 'E-mail' })
    @IsString({ message: 'email must be string' })
    @IsEmail({}, { message: "Incorrect email" })
    readonly email!: string;

    @ApiProperty({ example: '12345678', description: 'Password' })
    @IsString()
    // @Length(8, 16, { message: 'Not less than 8 and not more than 16' })
    readonly password!: string;

    @ApiProperty({ example: 'Jon Scot', description: 'name' })
    @IsString()
    readonly name!: string;

    @ApiProperty({ example: 'AMPARO', description: 'store name' })
    @IsString()
    @IsOptional()
    readonly storeName?: string;

    @ApiProperty({ example: '380680000000', description: 'User phone' })
    @IsNumberString()
    @IsOptional()
    readonly phone?: string;

    @ApiProperty({ example: 'UA', description: 'User country' })
    @IsString()
    readonly country!: string;

    @ApiProperty({ example: PaymentTypes.cashless, description: 'payment types', enum: PaymentTypes })
    @IsOptional()
    defaultPaymentType?: PaymentTypes;

    @ApiProperty({ example: DeliveryWays.ups, description: 'payment types', isArray: true, enum: DeliveryWays })
    @IsOptional()
    defaultDeliveryWays?: Array<DeliveryWays>;

    // @ApiProperty({ example: 'w793rh4dy05l1672390078153', description: 'Photo token' })
    // @IsOptional()
    // @IsString()
    // readonly token?: string;

    @ApiProperty({ example: null, description: 'Google id' })
    @IsOptional()
    @IsString()
    readonly googleId?: string | null;

    @ApiProperty({ example: null })
    @IsOptional()
    readonly isActivate?: boolean;

}
