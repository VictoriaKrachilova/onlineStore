import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString} from "class-validator";
import { DeliveryWays, Location, PaymentTypes, user } from "../../Common/newTypes.mjs";

export class UpdateProfileDto {

    @ApiProperty({ example: 'Jon Scot', description: 'name', required: false })
    @IsString()
    @IsOptional()
    readonly name!: string;

    @ApiProperty({ example: 'AMPARO', description: 'store name', required: false })
    @IsString()
    @IsOptional()
    readonly storeName?: string;

    @ApiProperty({ example: PaymentTypes.cashless, description: 'payment types', enum: PaymentTypes, required: false })
    @IsOptional()
    defaultPaymentType!: PaymentTypes;

    @ApiProperty({ example: [ DeliveryWays.ups ], description: 'payment types', isArray: true, enum: DeliveryWays, required: false })
    @IsOptional()
    defaultDeliveryWays!: Array<DeliveryWays>;

    user!: user;
}
