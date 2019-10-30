import { Model } from 'objection';
import { IOrder } from 'interfaces/models/order';

export class Order extends Model implements IOrder {
    id?: number;
    description: string;
    amount: string;
    value: string;

    public static get tableName(): string {
        return 'Order';
    }

    public $formatJson(data: IOrder): IOrder {
        return data;
    }
}