import * as React from 'react';
import { View } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { filter, first, map, switchMap } from 'rxjs/operators';
import BaseComponent from '~/components/Shared/Abstract/Base';
import { bindComponent } from '~/helpers/rxjs-operators/bindComponent';
import { logError } from '~/helpers/rxjs-operators/logError';
import { appDefaultNavigation, appOpened } from '~/services';
import tokenService from '~/services/token';

export default class IndexPage extends BaseComponent {
  public componentWillMount(): void {
    appOpened();

    appDefaultNavigation()
      .pipe(
        first(),
        filter(ok => ok),
        switchMap(() => tokenService.isAuthenticated()),
        map(isAuthenticated => {
          setTimeout(() => SplashScreen.hide(), 500);
          this.navigate(isAuthenticated ? 'Homem' : 'Home', null, true);
        }),
        logError(),
        bindComponent(this)
      )
      .subscribe();
  }

  public render(): JSX.Element {
    return <View />;
  }
}
