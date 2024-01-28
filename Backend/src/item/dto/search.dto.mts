import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNumber, IsOptional } from "class-validator";
import { Categories, Location, Subcategories, user } from "../../Common/newTypes.mjs";

export class SearchItemDto {

    @ApiProperty({ example: 'UA', description: 'Country from IP' })
    @IsString()
    country!: string;
    
    @ApiProperty({ example: 'Trailer Lev', description: 'item name' })
    @IsString()
    title!: string;

    @ApiProperty({ example: 'length: 1m', description: 'item description' })
    @IsString()
    content!: string;

    @ApiProperty({ example: Location })
    @IsOptional()
    location?: Location;

    @ApiProperty({ example: 10, description: 'price from' })
    @IsNumber()
    @IsOptional()
    priceFrom?: number;

    @ApiProperty({ example: 200, description: 'price to' })
    @IsNumber()
    @IsOptional()
    priceTo?: number;

    @ApiProperty({ example: [ Categories.vehicles ], description: 'category', enum: Categories, isArray: true})
    categories!: Array<string>;

    @ApiProperty({ example: [ Subcategories.cars ], description: 'subcategory', enum: Subcategories, isArray: true })
    subcategories!: Array<string>;

    @ApiProperty({ example: { brand: "BMW" }, description: 'all info from category filter' })
    filter!: JSON;
    
    @ApiProperty({ example: 0, description: 'How many items to skip (multiply the page number by the limit). Defolt: 0' })
    @IsOptional()
    @IsNumber()
    skip?: number;

    @ApiProperty({ example: 20, description: 'How many items to show. Defolt: 20' })
    @IsOptional()
    @IsNumber()
    limit?: number;

    user?: user

};
