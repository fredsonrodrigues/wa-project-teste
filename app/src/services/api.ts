import NetInfo from '@react-native-community/netinfo';
import axios, { AxiosResponse, Method } from 'axios';
import { Observable, ReplaySubject, throwError, of } from 'rxjs';
import { catchError, distinctUntilChanged, first, map, sampleTime, switchMap } from 'rxjs/operators';
import { API_ENDPOINT } from '~/config';
import { ApiError } from '~/errors/api';
import { NoInternetError } from '~/errors/noInternet';
import logService, { LogService } from './log';
import tokenService, { TokenService } from './token';

export class ApiService {
  private connection$: ReplaySubject<boolean>;

  constructor(private apiEndpoint: string, private logService: LogService, private tokenService: TokenService) {
    this.connection$ = new ReplaySubject(1);
    this.watchNetwork();
  }

  public get<T = any>(url: string, params?: any): Observable<T> {
    return this.request('GET', url, params);
  }

  public post<T = any>(url: string, body: any): Observable<T> {
    return this.request('POST', url, body);
  }

  public delete<T = any>(url: string, params?: any): Observable<T> {
    return this.request('DELETE', url, params);
  }

  public connection(): Observable<boolean> {
    return this.connection$.pipe(distinctUntilChanged());
  }

  private request<T>(method: Method, url: string, data: any = null): Observable<T> {
    return this.connection$.pipe(
      sampleTime(500),
      first(),
      switchMap(connected => {
        return !connected ? throwError(new NoInternetError()) : this.tokenService.getToken().pipe();
      }),
      first(),
      map(tokens => {
        return !tokens
          ? {}
          : {
              Authorization: `bearer ${tokens.accessToken}`,
              RefreshToken: tokens.refreshToken
            };
      }),
      switchMap(headers => {
        return axios.request({
          baseURL: this.apiEndpoint,
          url,
          method,
          timeout: 30000,
          headers: {
            'Content-type': 'application/json',
            ...headers
          },
          params: method === 'GET' ? data : null,
          data: method === 'POST' ? data : null
        });
      }),
      switchMap(res => this.checkNewToken(res)),
      map(response => response.data),
      catchError(err => {
        return !err.config ? throwError(err) : throwError(new ApiError(err.config, err.response, err));
      })
    );
  }

  private checkNewToken(response: AxiosResponse): Observable<AxiosResponse> {
    const accessToken = response.headers['x-token'];

    if (!accessToken) {
      return of(response);
    }

    this.logService.breadcrumb('Api New Token', 'manual', accessToken);

    return this.tokenService.setAccessToken(accessToken).pipe(map(() => response));
  }

  private watchNetwork(): void {
    NetInfo.isConnected.fetch().then(isConnected => this.connection$.next(isConnected));
    NetInfo.isConnected.addEventListener('connectionChange', isConnected => {
      this.connection$.next(isConnected);
    });
  }
}

const apiService = new ApiService(API_ENDPOINT, logService, tokenService);
export default apiService;
