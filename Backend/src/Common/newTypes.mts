import { ApiProperty } from "@nestjs/swagger";
import { Request } from 'express';

export interface RequestWithUser extends Request {
    userId: number;
}

export type Conf = {
    release : boolean,
    configType?: string,
    Api: {
        https: number,
        secret: string,
    },
    Postgres: {
        host: string,
        port: number,
        username: string,
        password: string,
        database: string
    },
    ElacticSearch: {
        url: string
    },
    Notify: {
        gmailCredentials: {
            user: string,
            pass: string,
        },
        isNotificationsEnabled: boolean,
    },
    mongo: {
        host: string,
        port: number
    },
};


export class user {
    id!: number;
    country!: string;
    currency!: string;
};

export class Location {
    @ApiProperty({ example: 46.4775, description: 'latitude' })
    lat!: number;
    @ApiProperty({ example: 30.7326, description: 'longitude' })
    lon!: number;
    @ApiProperty({ example: 'Пушкинская 72', description: 'street and number of a house' })
    address!: string;
    @ApiProperty({ example: 'Odesa', description: 'city' })
    city!: string;
    @ApiProperty({ example: 'UA', description: 'country' })
    country!: string;
    @ApiProperty({ example: 'Odesa', description: 'state' })
    state!: string;
};

export enum PaymentTypes {
    cashless = "cashless",
    cash = "cash",
    cashless_vat = "cashless_vat",
    cash_card = "cash_card",
};

export enum DeliveryWays {
    ups = "ups",
    post_1 = "post_1",
    new_post = "nova_post",
    mail_box = "mail_box",
}


export enum Categories {
    
}

export enum Subcategories {
    
}

export enum DeliveryType {
    post_office ="post_office",
    post_box = "post_box",
    courier = "courier"
}

export class DeliveryClass {
    @ApiProperty({ example: "nova_post", description: 'latitude', enum: DeliveryWays })
    transporter!: DeliveryWays;
    @ApiProperty({ example: DeliveryType.post_office, description: 'how to deliver' })
    type!: DeliveryType;
    @ApiProperty({ example: 80, description: 'how much does delivery cost' })
    cost?: number;
    @ApiProperty({ example: "office 123", description: 'info about office' })
    info?: string;
};


