import * as React from 'react';
import { Animated, Container, Text, View, Icon, Button, Picker, Form, Content } from 'native-base';
import { StatusBar, StyleSheet } from 'react-native';
import ButtonHeaderProfile from '~/components/Shared/ButtonHeaderProfile';
import { classes } from '~/assets/theme';
import BaseComponent from '~/components/Shared/Abstract/Base';

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
    this.state = {
      selected: "key1",
      price: "0,00"
    };

    this.valorProdutos = [
      { cod: "key0", item: 'Suco de Maça', valor: '25.00'},
      { cod: "key1", item: 'Suco de uva', valor: '25.00'},
      { cod: "key2", item: 'Suco de Maracujá', valor: '25.00'},
      { cod: "key3", item: 'Agua', valor: '20.00'}
    ];
  }

  
  onValueChange(value: string) {
    var p = this.valorProdutos.filter(e => e.cod === value)
    this.setState({
      selected: value,
      price: p[0].valor
    });
  }

    render(): JSX.Element {
    
        return (
          <Container>
            <StatusBar barStyle='light-content' backgroundColor='#000000' />
            <View style={styles.container}>
              <Content>
                <Form>
                  <Text>Escolha o seu sabor: </Text>
                  <Picker
                    note
                    mode="dropdown"
                    style={{ width: 120 }}
                    selectedValue={this.state.selected}
                    onValueChange={this.onValueChange.bind(this)}
                  >
                    <Picker.Item label="Suco de Maçã" value="key0" />
                    <Picker.Item label="Suco de Uva" value="key1" />
                    <Picker.Item label="Suco de Maracujá" value="key2" />
                    <Picker.Item label="Água" value="key3" />
                  </Picker>
                  <Text>Valor do suco: {this.state.price}</Text>
                  <Button>
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
    alignItems: 'center',
    backgroundColor: 'white'
  },
  logo: {
    height: 120,
    width: 120,
    marginBottom: 10
  },
  welcome: {
    fontSize: 30,
    textAlign: 'center',
    marginBottom: 5,
    color: 'white',
    backgroundColor: 'transparent',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});