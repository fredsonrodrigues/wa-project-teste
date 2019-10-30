import { Linking } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { NavigationDispatch, NavigationScreenProp } from 'react-navigation';
import { Observable, ReplaySubject, of } from 'rxjs';

import { appReady } from '..';
import { register } from './handlers/register';
import { switchMap, tap } from 'rxjs/operators';
import { logError } from '~/helpers/rxjs-operators/logError';

export interface ILinkingHandler {
  validate: (url: string) => boolean;
  handle: (url: string, dispatch: NavigationDispatch, appStarted: boolean) => Promise<void>;
}

export class LinkingService {
  private hasInitialUrl$: ReplaySubject<boolean>;
  private navigator: NavigationScreenProp<any>;
  private handlers: ILinkingHandler[] = [];

  constructor() {
    this.hasInitialUrl$ = new ReplaySubject(1);

    of(true)
      .pipe(
        switchMap(() => Linking.getInitialURL()),
        logError(),
        tap(url => this.execUrl(url, true))
      )
      .subscribe();

    Linking.addEventListener('url', ({ url }) => {
      this.execUrl(url, false);
    });
  }

  public setup(navigator: NavigationScreenProp<any>): void {
    this.navigator = navigator;
    register(this);
  }

  public registerHandler(handler: ILinkingHandler): void {
    this.handlers.push(handler);
  }

  public hasInitialUrl(): Observable<boolean> {
    return this.hasInitialUrl$.asObservable();
  }

  private execUrl(url: string, initial: boolean): any {
    const handler = this.getHandler(url);
    this.hasInitialUrl$.next(handler && initial);

    if (!handler) return;

    appReady()
      .pipe(
        switchMap(() => handler.handle(url, this.navigator.dispatch, initial)),
        tap(() => SplashScreen.hide()),
        tap(() => this.hasInitialUrl$.next(false)),
        logError()
      )
      .subscribe();
  }

  private getHandler(url: string): ILinkingHandler {
    return this.handlers.find(h => h.validate(url));
  }
}

const linkingService = new LinkingService();
export default linkingService;
