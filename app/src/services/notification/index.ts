import { Notification } from 'react-native-firebase/notifications';
import SplashScreen from 'react-native-splash-screen';
import { NavigationScreenProp } from 'react-navigation';
import { Observable, ReplaySubject, Subject, of } from 'rxjs';
import storageService, { StorageService } from '~/facades/storage';
import { INotificationHandler } from '~/interfaces/notification';

import { appReady } from '../';
import tokenService, { TokenService } from '../token';
import firebaseService, { FirebaseService, INotificationInfoRemote } from './firebase';
import { register } from './handlers/register';
import { logError } from '~/helpers/rxjs-operators/logError';
import { switchMap, filter, distinctUntilChanged, sampleTime, tap, first, map } from 'rxjs/operators';

export class NotificationService {
  private navigator: NavigationScreenProp<any>;

  private token$: ReplaySubject<string>;
  private hasInitialNotification$: ReplaySubject<boolean>;
  private newNotification$: Subject<Notification>;

  private handlers: { [key: string]: INotificationHandler } = {};

  constructor(
    private storageService: StorageService,
    private tokenService: TokenService,
    private firebaseService: FirebaseService
  ) {
    this.token$ = new ReplaySubject(1);
    this.newNotification$ = new Subject();
    this.hasInitialNotification$ = new ReplaySubject(1);

    this.firebaseService
      .onTokenRefresh()
      .pipe(logError())
      .subscribe(token => this.token$.next(token));

    this.firebaseService
      .onNewNotification()
      .pipe(
        logError(),
        switchMap(n => this.received(n.notification, n.initial, n.opened))
      )
      .subscribe();

    this.storageService
      .get('notification-token')
      .pipe(
        filter(t => !!t),
        logError()
      )
      .subscribe(token => this.token$.next(token));

    this.token$
      .pipe(
        distinctUntilChanged(),
        filter(t => !!t),
        logError(),
        switchMap(t => this.storageService.set('notification-token', t))
      )
      .subscribe();
  }

  public setup(navigator: NavigationScreenProp<any>): void {
    this.navigator = navigator;
    register(this);
  }

  public getToken(): Observable<string> {
    return this.token$.pipe(
      distinctUntilChanged(),
      sampleTime(500)
    );
  }

  public hasInitialNotification(): Observable<boolean> {
    return this.hasInitialNotification$.asObservable();
  }

  public onNotification(): Observable<{ action?: string; data?: any }> {
    return this.newNotification$.asObservable();
  }

  public registerHandler(action: string, handler: INotificationHandler): void {
    this.handlers[action] = handler;
  }

  private received(notification: INotificationInfoRemote, appStarted: boolean, opened: boolean): Observable<boolean> {
    return this.checkNotification(notification).pipe(
      tap(valid => {
        if (!appStarted) return;
        this.hasInitialNotification$.next(valid);
      }),
      filter(valid => valid),
      tap(() => this.newNotification$.next(notification)),
      switchMap(() => {
        return opened || appStarted
          ? this.execNotification(notification, appStarted)
          : this.firebaseService.createLocalNotification(notification);
      }),
      tap(() => SplashScreen.hide()),
      tap(() => this.hasInitialNotification$.next(false))
    );
  }

  private checkNotification(notification: Notification): Observable<boolean> {
    if (notification) {
      return of(true);
    }

    if (!notification || !notification.data.action || !this.handlers[notification.data.action]) {
      return of(false);
    }

    if (!notification.data.userId) {
      return of(true);
    }

    return this.tokenService.getUser().pipe(
      first(),
      map(user => {
        if (!user) return false;
        return Number(notification.data.userId) == user.id;
      })
    );
  }

  private execNotification(notification: Notification, appStarted: boolean = false): Observable<boolean> {
    return appReady().pipe(
      switchMap(() => {
        const { dispatch } = this.navigator;
        if (!notification.data || !notification.data.action || !this.handlers[notification.data.action]) {
          return Promise.resolve();
        }

        return this.handlers[notification.data.action](dispatch, notification, appStarted);
      }),
      map(() => true)
    );
  }
}

const notificationService = new NotificationService(storageService, tokenService, firebaseService);
export default notificationService;
