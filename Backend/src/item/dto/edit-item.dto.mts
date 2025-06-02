import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { Categories, DeliveryWays, Location, PaymentTypes, user } from "../../Common/newTypes.mjs";
import { ApiProperty } from "@nestjs/swagger";

export class EditItemDto {

    @ApiProperty({ example: 'Trailer Lev', description: 'Item name', required: false })
    @IsString()
    @IsOptional()
    title?: string;

    @ApiProperty({ example: 'length: 1m', description: 'Item description', required: false })
    @IsString()
    @IsOptional()
    content?: string;

    @ApiProperty({ example: 2, description: 'Quantity available (count)', required: false })
    @IsNumber()
    @IsOptional()
    amount?: number;

    @ApiProperty({ example: 2, description: 'Price per unit', required: false })
    @IsOptional()
    @IsNumber()
    price?: number;

    @ApiProperty({ example: "UAH", description: 'Currency code (e.g., UAH, USD)', required: false })
    @IsOptional()
    @IsString()
    currency?: string;

    @ApiProperty({ type: Location, description: 'Item location', required: false })
    @IsOptional()
    location?: Location;

    @ApiProperty({ example: PaymentTypes.cashless, description: 'Payment type', enum: PaymentTypes, required: false })
    @IsEnum(PaymentTypes)
    @IsOptional()
    paymentType?: PaymentTypes;

    @ApiProperty({ example: [ DeliveryWays.ups ], description: 'Delivery methods', isArray: true, enum: DeliveryWays, required: false })
    @IsOptional()
    @IsEnum(DeliveryWays, { each: true })
    deliveryWays?: Array<DeliveryWays>;

    @ApiProperty({ example: Categories.vehicles, description: 'Item category', enum: Categories, required: false })
    @IsEnum(Categories)
    @IsOptional()
    category?: string;

    @ApiProperty({ example: { brand: "BMW" }, description: 'Custom category-specific filter data', required: false })
    @IsOptional()
    filter?: Record<string, any>;

    user!: user;
}
