import { Column, DataType, Model, Table } from "sequelize-typescript";

interface CountriesAttrs {
    id: number;
    name: string;
    phone: string;
    languages: Array<string>;
    alpha2: string;
    currency: string;
    iso_code: string;
};

@Table({ tableName: 'countries', createdAt: false, updatedAt: false })
export class Countries extends Model<Countries, CountriesAttrs> {

    @Column({ type: DataType.BIGINT, unique: true, autoIncrement: true, primaryKey: true })
    declare id: number;

    @Column({ type: DataType.STRING, allowNull: false })
    name!: string;

    @Column({ type: DataType.STRING })
    phone!: string;

    @Column({ type: DataType.ARRAY(DataType.STRING) })
    languages!: Array<string>;

    @Column({ type: DataType.STRING })
    alpha2!: string;

    @Column({ type: DataType.STRING })
    currency!: string;

}
