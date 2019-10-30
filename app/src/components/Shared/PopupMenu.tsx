import { ActionSheet, Button, Icon, NativeBase } from 'native-base';
import * as React from 'react';
import { findNodeHandle, Platform, UIManager } from 'react-native';
import logService from '~/services/log';

interface IProps extends NativeBase.Button {
  actions: {
    display: string;
    onPress: () => void;
  }[];
}

export class PopupMenu extends React.Component<IProps> {
  private button: Button;

  setRef = (button: Button) => {
    this.button = button;
  };

  handlePress = (): void => {
    const { actions } = this.props;

    if (Platform.OS === 'ios') {
      ActionSheet.show(
        {
          options: [...actions, { display: 'Cancelar' }].map(a => a.display),
          cancelButtonIndex: actions.length,
          title: 'Selecione'
        },
        buttonIndex => {
          if (!actions[buttonIndex]) return;
          actions[buttonIndex].onPress();
        }
      );

      return;
    }

    (UIManager as any).showPopupMenu(
      findNodeHandle(this.button),
      actions.map((a: any) => a.display),
      (err: any) => logService.handleError(err),
      (event: string, buttonIndex: number) => {
        if (event !== 'itemSelected') return;
        actions[buttonIndex].onPress();
      }
    );
  };

  render(): JSX.Element {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { onPress, actions, ...props } = this.props;

    return (
      <Button {...props} onPress={this.handlePress} ref={this.setRef}>
        <Icon active name='more' />
      </Button>
    );
  }
}
