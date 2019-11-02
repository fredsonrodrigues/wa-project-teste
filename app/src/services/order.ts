import apiService, { ApiService } from './api';
import cacheService, { CacheService } from './cache';
import notificationService, { NotificationService } from './notification';
import tokenService, { TokenService } from './token';
import { cacheClean } from '~/helpers/rxjs-operators/cache';

import { IOrder } from '~/interfaces/models/order';

export class OrderService {
  constructor(
    private apiService: ApiService,
    private cacheService: CacheService,
    private notificationService: NotificationService,
    private tokenService: TokenService
  ) {}

  public save(model: IOrder): Observable<IOrder> {
    return this.apiService.post<IOrder>('/order/', model).pipe(cacheClean('service-profile'));
  }
}

const orderService = new OrderService(apiService, cacheService, notificationService, tokenService);
export default orderService;
