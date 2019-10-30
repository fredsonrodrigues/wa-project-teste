import './errorHandler';

import ConfigProvider, { ConfigBuilder } from '@react-form-fields/native-base/ConfigProvider';
import langConfig from '@react-form-fields/native-base/ConfigProvider/langs/pt-br';
import snakeCase from 'lodash/snakeCase';
import { Root, StyleProvider } from 'native-base';
import React, { memo, useCallback, useEffect, useRef } from 'react';
import { Keyboard } from 'react-native';
import firebase from 'react-native-firebase';
import FlashMessage from 'react-native-flash-message';
import { MenuProvider } from 'react-native-popup-menu';
import { NavigationState } from 'react-navigation';
import Loader from '~/components/Shared/Loader';

import { variablesTheme } from './assets/theme';
import getTheme from './assets/theme/native-base-theme/components';
import Navigator from './components/Navigator';
import getCurrentRouteState from './helpers/currentRouteState';
import { setupServices } from './services';
import logService from './services/log';

const theme = getTheme(variablesTheme);

const config = new ConfigBuilder()
  .fromLang(langConfig)
  .setValidationOn('onSubmit')
  .setIconProps({ type: 'MaterialCommunityIcons' }, 'chevron-down', 'magnify', 'close')
  .setItemProps({ floatingLabel: false })
  .setLoadingProps({ color: theme.variables.brandDark }, { marginRight: 10 })
  .build();

const App = memo(() => {
  const navigatorRef = useRef<Navigator>();

  useEffect(() => setupServices(navigatorRef.current as any), [navigatorRef]);

  const onNavigationStateChange = useCallback((prevState: NavigationState, currentState: NavigationState) => {
    Keyboard.dismiss();

    if (!currentState || !currentState.routes || !currentState.routes.length || prevState === currentState) return;

    const routeName = getCurrentRouteState(currentState).routeName;

    logService.breadcrumb(routeName, 'navigation');
    firebase.analytics().logEvent(snakeCase(`screen_${routeName}`));
  }, []);

  return (
    <StyleProvider style={theme}>
      <MenuProvider>
        <ConfigProvider value={config}>
          <Root>
            <Loader />
            <Navigator ref={navigatorRef as any} onNavigationStateChange={onNavigationStateChange} />
            <FlashMessage position='top' />
          </Root>
        </ConfigProvider>
      </MenuProvider>
    </StyleProvider>
  );
});

export default App;
