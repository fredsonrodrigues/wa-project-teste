import FieldText from '@react-form-fields/native-base/Text';
import ValidationContext from '@react-form-fields/native-base/ValidationContext';
import { Button, Card, Text } from 'native-base';
import React from 'react';
import { StyleSheet } from 'react-native';
import { filter } from 'rxjs/operators';
import { variablesTheme } from '~/assets/theme';
import FormComponent, { IStateForm } from '~/components/Shared/Abstract/Form';
import Toast from '~/facades/toast';
import { bindComponent } from '~/helpers/rxjs-operators/bindComponent';
import { logError } from '~/helpers/rxjs-operators/logError';

interface IState extends IStateForm<{ email: string; password: string }> {}

interface IProps {
  onSubmit: (model: { email: string; password: string }) => void;
}

export default class LoginFormComponent extends FormComponent<IProps, IState> {
  inputStyles = {
    container: styles.inputContainer
  };

  handleSubmit = () => {
    this.isFormValid()
      .pipe(
        filter(valid => valid),
        logError(),
        bindComponent(this)
      )
      .subscribe(
        () => {
          this.props.onSubmit(this.state.model as any);
        },
        err => Toast.showError(err)
      );
  };

  render() {
    const { model } = this.state;

    return (
      <ValidationContext ref={this.bindValidationContext}>
        <Card style={styles.card}>
          <FieldText
            placeholder='Email'
            keyboardType='email-address'
            validation='required|email'
            value={model.email}
            flowIndex={1}
            onChange={this.updateModel((v, m) => (m.email = v))}
          />

          <FieldText
            placeholder='Senha'
            secureTextEntry={true}
            validation='required'
            value={model.password}
            flowIndex={2}
            onChange={this.updateModel((v, m) => (m.password = v))}
            onSubmitEditing={this.handleSubmit}
          />

          <Button style={styles.button} full onPress={this.handleSubmit}>
            <Text>Entrar</Text>
          </Button>
        </Card>
      </ValidationContext>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    flex: 0,
    padding: 20,
    paddingRight: 30,
    marginTop: 20,
    width: variablesTheme.deviceWidth - 60,
    justifyContent: 'flex-start'
  },
  inputContainer: {
    paddingTop: 0
  },
  button: {
    borderRadius: variablesTheme.borderRadiusBase,
    marginTop: 10
  }
});
