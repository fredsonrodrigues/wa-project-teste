import { NavigationActions, StackActions } from 'react-navigation';
import { INotificationHandler } from '~/interfaces/notification';
import { InteractionManager } from '~/facades/interactionManager';

export const handle: INotificationHandler<{ id: string }> = async (dispatch, info, appStarted) => {
  const id = Number(info.data.id);

  if (appStarted) {
    dispatch(
      StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({
            routeName: 'Home',
            action: NavigationActions.navigate({
              routeName: 'Profile'
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
};
