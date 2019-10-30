import { NavigationActions, NavigationDispatch, StackActions } from 'react-navigation';
import { InteractionManager } from '~/facades/interactionManager';

export default {
  validate(url: string): boolean {
    return /informativo\/(\d+)/.test(url);
  },
  async handle(url: string, dispatch: NavigationDispatch, appStarted: boolean): Promise<void> {
    const id = /informativo\/(\d+)/gi.exec(url)[1];

    if (appStarted) {
      dispatch(
        StackActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({
              routeName: 'Home',
              action: NavigationActions.navigate({
                routeName: 'InformativeTab'
              })
            })
          ]
        })
      );

      await InteractionManager.runAfterInteractions();
    }

    dispatch({
      type: 'Navigation/NAVIGATE',
      routeName: 'InformativeDetails',
      params: { id }
    });
  }
};
