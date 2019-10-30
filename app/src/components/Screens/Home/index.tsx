import { Button, Container, Content, Icon, View } from 'native-base';
import * as React from 'react';
import { classes } from '~/assets/theme';
import BaseComponent from '~/components/Shared/Abstract/Base';
import ButtonHeaderProfile from '~/components/Shared/ButtonHeaderProfile';
import { NavigaitonOptions } from '~/hooks/useNavigation';

import WelcomeCard from './components/WelcomeCard';

export default class HomePage extends BaseComponent {
  static navigationOptions: NavigaitonOptions = ({ navigation }) => {
    return {
      title: 'Início',
      tabBarLabel: 'Início',
      headerLeft: () => (
        <Button style={classes.headerButton} onPress={navigation.toggleDrawer}>
          <Icon name='menu' style={classes.headerButtonIcon} />
        </Button>
      ),

      headerRight: <ButtonHeaderProfile />,
      drawerIcon: ({ tintColor }) => <Icon name='home' style={{ color: tintColor }} />
    };
  };

  public render(): JSX.Element {
    return (
      <Container style={classes.cardsContainer}>
        <Content>
          <View style={classes.cardsPadding}>
            <WelcomeCard />
          </View>
        </Content>
      </Container>
    );
  }
}
