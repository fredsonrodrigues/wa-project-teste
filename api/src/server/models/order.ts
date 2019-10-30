import { Model } from 'objection';
import { IOrder } from 'interfaces/models/order';

export class Order extends Model implements IOrder {
    public id: number;
    public description: string;
    public amount: string;
    public value: string;

    public static get tableName(): string {
      return 'Order';
    }

    public $formatJson(data: IOrder): IOrder {
      return data;
    }
}