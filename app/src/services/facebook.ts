import { AccessToken, LoginManager } from 'react-native-fbsdk';
import { Observable, of, empty } from 'rxjs';

import logService, { LogService } from './log';
import { tap, switchMap, catchError, map } from 'rxjs/operators';

export class FacebookService {
  constructor(private logService: LogService) {}

  public login(): Observable<string> {
    return of(true).pipe(
      tap(() => this.logService.breadcrumb('Facebook Login')),
      tap(() => LoginManager.logOut()),
      switchMap(() => LoginManager.logInWithPermissions(['public_profile', 'email'])),
      switchMap(({ isCancelled }) => {
        return isCancelled ? of({ accessToken: null }) : AccessToken.getCurrentAccessToken();
      }),
      catchError(err => {
        if (err.message === 'Login Failed') return empty();
        return Observable.throw(err);
      }),
      map(({ accessToken }) => accessToken),
      tap(a => this.logService.breadcrumb(`Facebook Login ${a ? 'Completed' : 'Cancelled'}`))
    );
  }
}

const facebookService = new FacebookService(logService);
export default facebookService;
