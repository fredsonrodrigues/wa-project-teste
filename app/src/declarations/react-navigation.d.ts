/* eslint-disable @typescript-eslint/interface-name-prefix */
import 'react-navigation';

declare module 'react-navigation' {
  export const withNavigation: Function;

  interface NavigationDrawerScreenOptions {
    drawerLockMode?: 'unlocked' | 'locked-closed' | 'locked-open';
  }
}
