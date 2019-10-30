import { Button, Icon, Text, View } from 'native-base';
import React, { PureComponent } from 'react';
import { StyleSheet } from 'react-native';
import { classes, variablesTheme } from '~/assets/theme';

interface IProps {
  onClick: (provider: 'google' | 'facebook') => void;
}

export default class LoginSocialComponent extends PureComponent<IProps> {
  handleGoogle = () => this.props.onClick('google');
  handleFacebook = () => this.props.onClick('facebook');

  render() {
    return (
      <View style={styles.buttons}>
        <Button iconLeft onPress={this.handleFacebook} style={[classes.buttonFacebook, styles.buttonFirst]}>
          <Icon active name='logo-facebook' />
          <Text>FACEBOOK</Text>
        </Button>

        <Button iconLeft onPress={this.handleGoogle} style={classes.buttonGoogle}>
          <Icon active name='logo-google' />
          <Text>GOOGLE</Text>
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttons: {
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    width: variablesTheme.deviceWidth - 50
  },
  buttonFirst: {
    marginRight: 20
  }
});
