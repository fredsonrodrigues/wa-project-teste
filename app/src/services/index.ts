import { NavigationScreenProp } from 'react-navigation';
import { BehaviorSubject, Observable } from 'rxjs';
import { combineLatest, distinctUntilChanged, filter, first, map, switchMap, tap } from 'rxjs/operators';
import * as cacheOperator from '~/helpers/rxjs-operators/cache';
import * as loaderOperator from '~/helpers/rxjs-operators/loader';
import * as logErrorOperator from '~/helpers/rxjs-operators/logError';

import apiService from './api';
import cacheService from './cache';
import linkingService from './linking';
import loaderService from './loader';
import logService from './log';
import notificationService from './notification';
import tokenService from './token';
import userService from './user';

const setupCompleted$ = new BehaviorSubject(false);
const appDidOpen$ = new BehaviorSubject(false);

export function setupServices(navigator: NavigationScreenProp<any>): void {
  notificationService.setup(navigator);
  linkingService.setup(navigator);
  loaderOperator.setup(loaderService);
  logErrorOperator.setup(logService);
  cacheOperator.setup(cacheService);

  tokenService
    .getUser()
    .pipe(
      tap(user => logService.setUser(user)),
      logErrorOperator.logError()
    )
    .subscribe(() => {}, () => {});

  notificationService
    .getToken()
    .pipe(
      distinctUntilChanged(),
      switchMap(token =>
        apiService.connection().pipe(
          filter(c => c),
          first(),
          map(() => token)
        )
      ),
      filter(token => !!token),
      switchMap(token => userService.updateNotificationToken(token)),
      logErrorOperator.logError()
    )
    .subscribe(() => {}, () => {});

  setupCompleted$.next(true);
}

export function appOpened(): void {
  appDidOpen$.next(true);
}

export function appReady(): Observable<void> {
  return appDidOpen$.pipe(
    combineLatest(setupCompleted$),
    filter(([appDidOpen, setupCompleted]) => appDidOpen && setupCompleted),
    map(() => {})
  );
}

export function appDefaultNavigation(): Observable<boolean> {
  return notificationService.hasInitialNotification().pipe(
    combineLatest(linkingService.hasInitialUrl()),
    map(([hasNotification, hasInitialUrl]) => !hasNotification && !hasInitialUrl)
  );
}
