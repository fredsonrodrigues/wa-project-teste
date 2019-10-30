import { setJSExceptionHandler } from 'react-native-exception-handler';
import RNRestart from 'react-native-restart';
import { IS_DEV } from '~/config';
import Alert from '~/facades/alert';
import Toast from '~/facades/toast';
import logService from '~/services/log';

setJSExceptionHandler((err: any, isFatal: boolean) => {
  if (!err) return;

  logService.handleError(err);

  if (!isFatal) {
    Toast.showError(err);
    return;
  }

  Alert.error(err, 'Reabrir', 'É necessário reabrir o app').subscribe(() => RNRestart.Restart());
}, !IS_DEV);
