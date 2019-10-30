import { GoogleSignin } from 'react-native-google-signin';
import { Observable, of, throwError } from 'rxjs';

import { GOOGLE_API } from '~/config';
import logService, { LogService } from './log';
import { tap, switchMap, catchError, map } from 'rxjs/operators';

export class GoogleService {
  constructor(private logService: LogService, googleApi: { iosClientId: string; webClientId: string }) {
    const options = { ...googleApi, offlineAccess: true };

    GoogleSignin.hasPlayServices()
      .then(() => GoogleSignin.configure(options))
      .catch(err => logService.handleError(err));
  }

  public login(): Observable<string> {
    return of(true).pipe(
      tap(() => this.logService.breadcrumb('Google Login')),
      switchMap(() => GoogleSignin.signIn()),
      switchMap(() => GoogleSignin.getTokens()),
      catchError(err => {
        return [-5, 12501].includes(err.code) ? of({ accessToken: null }) : throwError(err);
      }),
      map(({ accessToken }) => accessToken),
      tap(a => this.logService.breadcrumb(`Google Login ${a ? 'Completed' : 'Cancelled'}`))
    );
  }
}

const googleService = new GoogleService(logService, GOOGLE_API);
export default googleService;
