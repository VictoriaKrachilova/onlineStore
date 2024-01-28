import { IsNumber, IsOptional, IsString } from "class-validator";
import { Categories, DeliveryWays, Location, PaymentTypes, Subcategories, user } from "../../Common/newTypes.mjs";
import { ApiProperty } from "@nestjs/swagger";

export class AddItemDto {

    @ApiProperty({ example: 'Trailer Lev', description: 'item name' })
    @IsString()
    title!: string;

    @ApiProperty({ example: 'length: 1m', description: 'item description' })
    @IsString()
    content!: string;

    @ApiProperty({ example: 2, description: 'quantity available (count)' })
    @IsNumber()
    amount!: number;

    @ApiProperty({ example: 2, description: 'price per one thing' })
    @IsOptional()
    @IsNumber()
    price?: number;

    @ApiProperty({ example: "UAH", description: 'currency' })
    @IsOptional()
    @IsString()
    currency?: string;

    @ApiProperty({ type: Location, description: 'item location' })
    location!: Location;

    @ApiProperty({ example: PaymentTypes.cashless, description: 'payment types', enum: PaymentTypes })
    @IsString()
    paymentType!: PaymentTypes;

    @ApiProperty({ example: [ DeliveryWays.ups ], description: 'delivery ways', isArray: true, enum: DeliveryWays })
    deliveryWays!: Array<DeliveryWays>;

    @ApiProperty({ example: Categories.vehicles, description: 'category', enum: Categories })
    @IsString()
    category!: string;

    @ApiProperty({ example: Subcategories.cars, description: 'subcategory', enum: Subcategories })
    @IsString()
    subcategory!: string;

    @ApiProperty({ example: { brand: "BMW" }, description: 'all info from category filter' })
    filter!: JSON;
    
    user!: user;
}
