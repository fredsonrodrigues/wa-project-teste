import apiService, { ApiService } from './api';
import * as Rx from 'rxjs';
import IOrder from 'interfaces/models/order';
import { IPaginationParams, IPaginationResponse } from 'interfaces/pagination';

export class OrderService {
  constructor(private apiService: ApiService) { }

  public list(params: IPaginationParams): Rx.Observable<IPaginationResponse<IOrder>> {
    return this.apiService.get('/order', params);
  }
}

const orderService = new OrderService(apiService);
export default orderService;