import { Button, Icon } from 'native-base';
import React from 'react';
import { StyleSheet } from 'react-native';
import WithNavigation from '~/decorators/withNavigation';
import { IUser } from '~/interfaces/models/user';
import Toast from '~/facades/toast';
import userService from '~/services/user';

import BaseComponent from './Abstract/Base';
import { logError } from '~/helpers/rxjs-operators/logError';
import { bindComponent } from '~/helpers/rxjs-operators/bindComponent';
import { classes, variablesTheme } from '~/assets/theme';

interface IState {
  user?: IUser;
  verified: boolean;
}

@WithNavigation()
export default class ButtonHeaderProfile extends BaseComponent<{}, IState> {
  constructor(props: any) {
    super(props);
    this.state = { verified: false };
  }

  componentWillMount(): void {
    userService
      .get()
      .pipe(
        logError(),
        bindComponent(this)
      )
      .subscribe(
        ({ data: user }) => {
          this.setState({ user, verified: true });
        },
        err => Toast.showError(err)
      );
  }

  navigateLogin = () => this.navigate('Login');
  navigateProfile = () => this.navigate('Profile');

  render() {
    const { user, verified } = this.state;

    if (!verified) {
      return null;
    }

    if (!user) {
      return (
        <Button style={classes.headerButton} onPress={this.navigateLogin}>
          <Icon name='contact' style={styles.icon} />
        </Button>
      );
    }

    return (
      <Button style={classes.headerButton} onPress={this.navigateProfile}>
        <Icon name='contact' style={styles.icon} />
      </Button>
    );
  }
}

const styles = StyleSheet.create({
  avatarImg: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 15
  },
  icon: {
    fontSize: 28,
    color: variablesTheme.toolbarBtnTextColor
  }
});
