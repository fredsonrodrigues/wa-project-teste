import { Body, Button, Container, Content, Header, Icon, Left, Right, Text, Title, View } from 'native-base';
import * as React from 'react';
import BaseComponent from '~/components/Shared/Abstract/Base';
import { ServiceError } from '~/errors/serviceError';
import { classes } from '~/assets/theme';

export default class DevPage extends BaseComponent {
  testError = (): void => {
    throw new ServiceError('Test', {
      type: 'Teste',
      meta: 'just works'
    });
  };

  public render(): JSX.Element {
    return (
      <Container style={classes.cardsContainer}>
        <Header>
          <Left>
            <Button transparent onPress={this.navigateBack}>
              <Icon active name='arrow-back' />
            </Button>
          </Left>
          <Body>
            <Title>Dev Menu</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          <View style={[classes.cardsPadding, classes.alignCenter]}>
            <Button onPress={this.testError}>
              <Text>Test Error</Text>
            </Button>
          </View>
        </Content>
      </Container>
    );
  }
}
