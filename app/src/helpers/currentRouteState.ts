import { NavigationRoute, NavigationState } from 'react-navigation';

export default function getCurrentRouteState(navigationState: NavigationState | NavigationRoute): NavigationRoute {
  if (!navigationState) return null;

  const route = navigationState.routes[navigationState.index];

  return route.routes ? getCurrentRouteState(route) : route;
}
