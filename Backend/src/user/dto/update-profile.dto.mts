import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString} from "class-validator";
import { DeliveryWays, Location, PaymentTypes, user } from "../../Common/newTypes.mjs";

export class UpdateProfileDto {

    @ApiProperty({ example: 'Jon Scot', description: 'name' })
    @IsString()
    readonly name!: string;

    @ApiProperty({ example: 'AMPARO', description: 'store name' })
    @IsString()
    @IsOptional()
    readonly storeName?: string;

    @ApiProperty({ example: 'UA', description: 'User country' })
    @IsString()
    readonly country!: string;

    @ApiProperty({ example: PaymentTypes.cashless, description: 'payment types', enum: PaymentTypes })
    defaultPaymentType!: PaymentTypes;

    @ApiProperty({ example: [ DeliveryWays.ups ], description: 'payment types', isArray: true, enum: DeliveryWays })
    defaultDeliveryWays!: Array<DeliveryWays>;

    user!: user;
}
