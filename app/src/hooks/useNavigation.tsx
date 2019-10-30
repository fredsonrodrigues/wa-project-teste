import { useMemo } from 'react';
import { NavigationActions, NavigationScreenProps, StackActions } from 'react-navigation';
import { NavigationStackOptions } from 'react-navigation-stack/lib/typescript/types';
import { NavigationDrawerOptions } from 'react-navigation-drawer';
import { NavigationScreenConfig } from 'react-navigation';

export type NavigaitonOptions = NavigationScreenConfig<NavigationStackOptions | NavigationDrawerOptions, any>;

export interface IUseNavigation extends Partial<NavigationScreenProps> {}

export function useNavigation({ navigation }: IUseNavigation) {
  return useMemo(
    () => ({
      back() {
        navigation.goBack(null);
      },
      navigate(routeName: string, params: any = {}, reset: boolean = false) {
        if (!reset) {
          navigation.navigate(routeName, params);
          return;
        }

        navigation.dispatch(
          StackActions.reset({
            index: 0,
            key: null,
            actions: [
              NavigationActions.navigate({
                routeName,
                params,
                action: NavigationActions.navigate({ routeName, params })
              })
            ]
          })
        );
      },
      getParams(paramName: string) {
        return navigation.getParam(paramName);
      }
    }),
    [navigation]
  );
}
