import { IsArray, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { Categories, DeliveryWays, Location, PaymentTypes, user } from "../../Common/newTypes.mjs";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class AddItemDto {

    @ApiProperty({ example: 'Trailer Lev', description: 'Item name' })
    @IsString()
    title!: string;

    @ApiProperty({ example: 'Length: 1m', description: 'Item description' })
    @IsString()
    content!: string;

    @ApiProperty({ example: 2, description: 'Quantity available (count)' })
    @IsNumber()
    amount!: number;

    @ApiProperty({ example: 2, description: 'Price per unit', required: false })
    @IsOptional()
    @IsNumber()
    price?: number;

    @ApiProperty({ example: 'UAH', description: 'Currency code (e.g., UAH, USD)', required: false })
    @IsOptional()
    @IsString()
    currency?: string;

    @ApiProperty({ type: Location, description: 'Item location' })
    @Type(() => Location)
    location!: Location;

    @ApiProperty({ example: PaymentTypes.cashless, enum: PaymentTypes, description: 'Payment type' })
    @IsEnum(PaymentTypes)
    paymentType!: PaymentTypes;

    @ApiProperty({ example: [DeliveryWays.ups], isArray: true, enum: DeliveryWays, description: 'Delivery methods' })
    @IsArray()
    @IsEnum(DeliveryWays, { each: true })
    deliveryWays!: DeliveryWays[];

    @ApiProperty({ example: Categories.trailers, enum: Categories, description: 'Item category' })
    @IsEnum(Categories)
    category!: Categories;

    @ApiProperty({ example: { brand: 'BMW' }, description: 'Custom category-specific filter data' })
    filter!: Record<string, any>; 

    @IsOptional()
    user!: user; 
}