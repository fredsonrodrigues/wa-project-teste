import FlashMessage, { MessageType, showMessage } from 'react-native-flash-message';
import { errorMessageFormatter } from '~/formatters/errorMessage';

import { InteractionManager } from './interactionManager';

const instances = new Set<FlashMessage>();

export default class Toast {
  static show(message: string, duration: number = 3000, type: MessageType = 'default'): void {
    InteractionManager.runAfterInteractions(() => {
      const instance = Array.from(instances).pop();
      const showFunc: typeof showMessage = instance ? (instance as any).showMessage.bind(instance) : showMessage;
      showFunc({
        message,
        type,
        duration,
        position: 'top',
        floating: true,
        backgroundColor: type === 'default' ? 'rgba(0,0,0,0.8)' : type === 'danger' ? 'rgba(237, 47, 47, 0.9)' : null
      });
    });
  }

  static showError(err: any): void {
    this.show(errorMessageFormatter(err), 3000, 'danger');
  }
}

export function registerToastModal(instance: FlashMessage) {
  instances.add(instance);
  return () => {
    (instance as any).hideMessage();
    instances.delete(instance);
  };
}
