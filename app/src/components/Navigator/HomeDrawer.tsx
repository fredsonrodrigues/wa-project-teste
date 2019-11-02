import HomePage from '~/components/Screens/Home';
import ProfilePage from '~/components/Screens/Profile/Details';
import OrderPage from '~/components/Screens/Order';

import { Drawer } from '../Shared/Drawer';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { variablesTheme } from '~/assets/theme';

export const HomeDrawerScreens: any = {
  Home: { screen: HomePage },
  Profile: { screen: ProfilePage },
  Order: { screen: OrderPage }
};

const HomeDrawerNavigator = createDrawerNavigator(HomeDrawerScreens, {
  initialRouteName: 'Order',
  contentComponent: Drawer as any,
  contentOptions: {
    activeTintColor: variablesTheme.accent
  }
});

export default HomeDrawerNavigator;
