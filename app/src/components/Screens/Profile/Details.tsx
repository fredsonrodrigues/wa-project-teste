import { Body, Button, Container, Content, H2, Icon, Left, List, ListItem, Spinner, Text, View } from 'native-base';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import BaseComponent from '~/components/Shared/Abstract/Base';
import ErrorMessage from '~/components/Shared/ErrorMessage';
import { IUser } from '~/interfaces/models/user';
import Alert from '~/facades/alert';
import userService from '~/services/user';
import { NavigaitonOptions } from '~/hooks/useNavigation';
import { classes, variablesTheme } from '~/assets/theme';
import { logError } from '~/helpers/rxjs-operators/logError';
import { bindComponent } from '~/helpers/rxjs-operators/bindComponent';
import { filter, switchMap } from 'rxjs/operators';
import { loader } from '~/helpers/rxjs-operators/loader';

interface IState {
  loading: boolean;
  user?: IUser;
  error?: any;
}

export default class ProfilePage extends BaseComponent<{}, IState> {
  static navigationOptions: NavigaitonOptions = ({ navigation }) => {
    return {
      title: 'Perfil',
      headerLeft: () => (
        <Button style={classes.headerButton} onPress={navigation.toggleDrawer}>
          <Icon name='menu' />
        </Button>
      ),
      headerRight: navigation.getParam('navigateEdit') && (
        <Button style={classes.headerButton} onPress={navigation.getParam('navigateEdit')}>
          <Icon name='create' />
        </Button>
      ),
      drawerIcon: ({ tintColor }) => <Icon name='contact' style={{ color: tintColor }} />
    };
  };

  constructor(props: any) {
    super(props);
    this.state = { loading: true };
  }

  componentDidMount(): void {
    userService
      .get()
      .pipe(
        logError(),
        bindComponent(this)
      )
      .subscribe(
        ({ updating, data }) => {
          this.setState({ loading: updating, user: data, error: false });
          this.navigation.setParams({ navigateEdit: data ? this.navigateEdit : null });
        },
        error => this.setState({ loading: false, error })
      );
  }

  logout = (): void => {
    Alert.confirm('Confirmar', 'Deseja realmente sair?', 'Sim', 'Não')
      .pipe(
        filter(ok => ok),
        switchMap(() => userService.logout().pipe(loader())),
        logError(),
        bindComponent(this)
      )
      .subscribe();
  };

  navigateEdit = () => this.navigate('UserEdit', { user: this.state.user });
  navigateLogin = () => this.navigate('Login', { force: true });

  render(): JSX.Element {
    const { user, loading, error } = this.state;

    return (
      <Container>
        <Content>
          {loading && <Spinner />}
          {!loading && !user && error && <ErrorMessage error={error} />}
          {!loading && !user && !error && (
            <View style={[classes.emptyMessage, classes.alignCenter]}>
              <Icon active name='contact' style={[styles.loginIcon, classes.iconLarge]} />
              <Text style={styles.loginText}>Ainda não te conhecemos, mas gostaríamos de saber mais sobre você!</Text>
              <Button block onPress={this.navigateLogin}>
                <Text>ENTRAR</Text>
              </Button>
            </View>
          )}
          {!loading && user && (
            <View>
              <View style={styles.header}>
                <Icon active name='contact' style={styles.avatarIcon} />
                <H2 style={styles.headerText}>{`${user.firstName} ${user.lastName}`}</H2>
              </View>
              <List>
                {!!user.email && (
                  <ListItem style={[classes.listItem, styles.listItem]}>
                    <Left style={classes.listIconWrapper}>
                      <Icon active name='mail' style={classes.listIcon} />
                    </Left>
                    <Body>
                      <Text>{user.email}</Text>
                    </Body>
                  </ListItem>
                )}
              </List>
              <Button block light style={styles.logoutButton} onPress={this.logout}>
                <Text>SAIR</Text>
              </Button>
            </View>
          )}
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  loginIcon: {
    marginTop: 20,
    marginBottom: 10,
    color: variablesTheme.accent
  },
  loginText: {
    textAlign: 'center',
    marginBottom: 20
  },
  header: {
    backgroundColor: variablesTheme.accent,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerText: {
    color: 'white'
  },
  avatarIcon: {
    marginBottom: 10,
    color: 'white',
    fontSize: 100
  },
  listItem: {
    borderBottomWidth: 0
  },
  logoutButton: {
    margin: 16
  }
});
