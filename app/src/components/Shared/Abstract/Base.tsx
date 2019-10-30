import { PureComponent } from 'react';
import {
  NavigationActions,
  NavigationNavigateActionPayload,
  NavigationScreenProp,
  StackActions
} from 'react-navigation';
import { InteractionManager } from '~/facades/interactionManager';

export default abstract class BaseComponent<P = {}, S = {}> extends PureComponent<P, S> {
  public params: any;
  public navigation?: NavigationScreenProp<any>;

  private unmonted: boolean;

  constructor(props: any) {
    super(props);

    this.params = {};
    this.unmonted = false;

    this.navigation = (this.props as any).navigation;

    if (this.navigation) {
      this.params = this.navigation.state.params || {};
    }
  }

  public componentWillUnmount(): void {
    this.unmonted = true;
  }

  public setState<K extends keyof S>(f: (prevState: S, props: P) => Pick<S, K>, callback?: () => any): Promise<void>;
  public setState<K extends keyof S>(state: Pick<S, K>, skip: boolean): Promise<void>;
  public setState<K extends keyof S>(state: Pick<S, K>, skip?: any): Promise<void>;
  public setState(state: any, skip: any): Promise<void> {
    if (this.unmonted) return Promise.resolve();

    return new Promise(resolve => {
      if (skip) {
        return super.setState(state as any, () => resolve());
      }

      return InteractionManager.runAfterInteractions(() => {
        if (this.unmonted) return;
        super.setState(state as any, () => resolve());
      });
    });
  }

  protected navigateBack = (): void => {
    this.navigation.goBack(null);
  };

  protected navigate: {
    (routeName: string, reset?: boolean): void;
    (routeName: string, params: any, reset?: boolean): void;
  } = (routeName: string, resetOrParam?: any, forceReset?: any): void => {
    let params, reset: boolean;

    if (typeof resetOrParam === 'boolean') {
      reset = resetOrParam;
      params = null;
    } else {
      reset = forceReset || false;
      params = resetOrParam;
    }

    if (!reset) {
      this.navigation.navigate(routeName, params);
      return;
    }

    this.navigation.dispatch(
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
  };

  protected navigateBuild(routes: NavigationNavigateActionPayload[]): void {
    this.navigation.dispatch(
      StackActions.reset({
        index: routes.length - 1,
        key: null,
        actions: routes.map(route => NavigationActions.navigate(route))
      })
    );
  }
}
