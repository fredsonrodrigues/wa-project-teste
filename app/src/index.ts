import { AppRegistry, YellowBox } from 'react-native';
import firebase from 'react-native-firebase';

import App from './App';

YellowBox.ignoreWarnings([
  'Warning: componentWillReceiveProps',
  'Warning: componentWillMount',
  'Warning: componentWillUpdate',
  'Attempted to invoke',
  'Native TextInput',
  'Task orphaned'
]);

firebase.analytics().setAnalyticsCollectionEnabled(true);

AppRegistry.registerComponent('reactApp', () => App);
