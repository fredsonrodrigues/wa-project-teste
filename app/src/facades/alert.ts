import { Alert as CoreAlert } from 'react-native';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { errorMessageFormatter } from '~/formatters/errorMessage';

export default class Alert {
  static show(title: string, message: string, okText: string = 'OK'): Observable<boolean> {
    return of(true).pipe(
      switchMap(() => {
        return new Promise<boolean>(resolve => {
          setTimeout(() => {
            CoreAlert.alert(title, message, [{ text: okText, onPress: () => resolve(true) }], {
              onDismiss: () => resolve(false)
            });
          }, 500);
        });
      })
    );
  }

  static error(err: any, okText: string = 'OK', extraText: string = null): Observable<boolean> {
    return this.show('Erro', errorMessageFormatter(err) + (extraText ? `\n\n${extraText}` : ''), okText);
  }

  static confirm(
    title: string,
    message: string,
    okText: string = 'OK',
    cancelText: string = 'Cancelar'
  ): Observable<boolean> {
    return of(true).pipe(
      switchMap(() => {
        return new Promise<boolean>(resolve => {
          CoreAlert.alert(
            title,
            message,
            [
              { text: cancelText, style: 'cancel', onPress: () => resolve(false) },
              { text: okText, onPress: () => resolve(true) }
            ],
            { onDismiss: () => resolve(false) }
          );
        });
      })
    );
  }
}
