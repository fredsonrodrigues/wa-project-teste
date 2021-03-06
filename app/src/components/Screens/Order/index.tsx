import * as React from 'react';
import { Animated, Container, Text, View, Icon, Button, Picker, Form, Content, Input, Item, Label } from 'native-base';
import { StatusBar, StyleSheet } from 'react-native';
import ButtonHeaderProfile from '~/components/Shared/ButtonHeaderProfile';
import { classes } from '~/assets/theme';
import BaseComponent from '~/components/Shared/Abstract/Base';

import Toast from '~/facades/toast';
import orderService from '~/services/order';
import { loader } from '~/helpers/rxjs-operators/loader';
import { logError } from '~/helpers/rxjs-operators/logError';
import { bindComponent } from '~/helpers/rxjs-operators/bindComponent';
import { IOrder } from '~/interfaces/models/order';

interface IState {
  animationFade: Animated.Value;
  animationTranslate: Animated.Value;
  animationContainer: any;
}

export default class OrderPage extends BaseComponent<{}, IState> {
  static navigationOptions: NavigaitonOptions = ({ navigation }) => {
    return {
      title: 'Pedidos',
      tabBarLabel: 'Pedidos',
      headerLeft: () => (
        <Button style={classes.headerButton} onPress={navigation.toggleDrawer}>
          <Icon name='menu' style={classes.headerButtonIcon} />
        </Button>
      ),

      headerRight: <ButtonHeaderProfile />,
      drawerIcon: ({ tintColor }) => <Icon name='restaurant' style={{ color: tintColor }} />
    };
  };

  constructor(props: any) {
    super(props);
    this.onValueChange = this.onValueChange.bind(this);
    this.onAmountChange = this.onAmountChange.bind(this);
    this.handleForm = this.handleForm.bind(this);

    this.state = {
      selected: 'key1',
      price: '0,00',
      qtd: '1'
    };

    this.valorProdutos = [
      { cod: 'key0', item: 'Suco de Maça', valor: '25.00' },
      { cod: 'key1', item: 'Suco de uva', valor: '25.00' },
      { cod: 'key2', item: 'Suco de Maracujá', valor: '25.00' },
      { cod: 'key3', item: 'Agua', valor: '20.00' }
    ];
  }

  onValueChange(value: string) {
    this.setState({
      selected: value,
      price: this.valorProdutos.filter(e => e.cod === value)[0].valor,
      qtd: '1'
    });
  }

  onAmountChange(value: string) {
    this.setState({
      qtd: value
    });
  }

  handleForm = () => {
    let order: IOrder = {};
    order.description = this.state.selected;
    order.amount = this.state.qtd;
    order.value = this.state.price;

    orderService
      .save(order)
      .pipe(
        loader(),
        logError(),
        bindComponent(this)
      )
      .subscribe(() => Toast.show('Salvo Com Sucesso'), err => Toast.showError(err));
  };

  render(): JSX.Element {
    return (
      <Container>
        <StatusBar barStyle='light-content' backgroundColor='#000000' />
        <View style={styles.container}>
          <Content>
            <Form>
              <Item>
                <Text>Escolha o seu sabor: </Text>
                <Picker
                  note
                  mode='dropdown'
                  style={styles.picker}
                  selectedValue={this.state.selected}
                  onValueChange={this.onValueChange}
                >
                  <Picker.Item label='Suco de Maçã' value='key0' />
                  <Picker.Item label='Suco de Uva' value='key1' />
                  <Picker.Item label='Suco de Maracujá' value='key2' />
                  <Picker.Item label='Água' value='key3' />
                </Picker>
              </Item>
              <Item>
                <Label>Quantidade: </Label>
                <Input type='number' value={this.state.qtd} onChange={this.onAmountChange} />
              </Item>
              <Item fixedLabel last>
                <Label>Valor do suco: </Label>
                <Text>{this.state.price}</Text>
              </Item>
              <Button style={styles.button} onPress={this.handleForm}>
                <Text>Fazer Pedido</Text>
              </Button>
            </Form>
          </Content>
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  picker: {
    width: 120
  },
  button: {
    justifyContent: 'center'
  }
});
