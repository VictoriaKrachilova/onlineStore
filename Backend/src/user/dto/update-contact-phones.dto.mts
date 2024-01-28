import { ApiProperty } from "@nestjs/swagger";
import { user } from "../../Common/newTypes.mjs";

export class updateContactPhonesDto {

    @ApiProperty({ example: ['380997654566', '380986574533', '380775577669'], description: 'Array of contact phones' })
    readonly contactPhones!: Array<string>;

    user!: user;
}
