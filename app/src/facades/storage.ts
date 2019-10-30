import AsyncStorage from '@react-native-community/async-storage';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { apiResponseFormatter } from '~/formatters/apiResponse';

export class StorageService {
  public get<T = any>(key: string): Observable<T> {
    return of(true).pipe(
      switchMap(() => AsyncStorage.getItem(key)),
      map(data => (data ? apiResponseFormatter(JSON.parse(data)) : null))
    );
  }

  public set<T = any>(key: string, value: T): Observable<T> {
    return of(true).pipe(
      switchMap(() => AsyncStorage.setItem(key, JSON.stringify(value))),
      map(() => value)
    );
  }

  public clear(regexp: RegExp): Observable<void> {
    return of(true).pipe(
      switchMap(() => AsyncStorage.getAllKeys()),
      switchMap(keys => {
        if (regexp) {
          keys = keys.filter(k => regexp.test(k));
        }

        if (!keys.length) return of(null);
        return AsyncStorage.multiRemove(keys);
      })
    );
  }
}

const storageService = new StorageService();
export default storageService;
