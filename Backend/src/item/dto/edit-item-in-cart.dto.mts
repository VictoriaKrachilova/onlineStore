import { IsNumber, IsOptional} from "class-validator";
import { user } from "../../Common/newTypes.mjs";
import { ApiProperty } from "@nestjs/swagger";

export class editItemInCartDto {

    @ApiProperty({ example: 2, description: 'item ID' })
    @IsNumber()
    itemId!: number;

    @ApiProperty({ example: 2, description: 'quantity (count), default 1' })
    @IsOptional()
    @IsNumber()
    amount?: number;
    
    user!: user;
}
