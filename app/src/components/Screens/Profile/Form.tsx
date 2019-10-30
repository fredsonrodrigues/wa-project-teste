import ValidationContext from '@react-form-fields/native-base/ValidationContext';
import FieldText from '@react-form-fields/native-base/Text';
import { Button, Container, Content, Form, Icon, List } from 'native-base';
import FormComponent, { IStateForm } from '~/components/Shared/Abstract/Form';
import { IUser } from '~/interfaces/models/user';
import Toast from '~/facades/toast';
import userService from '~/services/user';
import { classes } from '~/assets/theme';
import { NavigaitonOptions } from '~/hooks/useNavigation';
import React from 'react';
import { tap, filter, switchMap } from 'rxjs/operators';
import { loader } from '~/helpers/rxjs-operators/loader';
import { logError } from '~/helpers/rxjs-operators/logError';
import { bindComponent } from '~/helpers/rxjs-operators/bindComponent';

interface IState extends IStateForm<IUser> {}

export default class UserEditPage extends FormComponent<{}, IState> {
  static navigationOptions: NavigaitonOptions = ({ navigation }) => {
    return {
      title: 'Atualizar Perfil',
      headerRight: (
        <Button style={classes.headerButton} onPress={navigation.getParam('onSave')}>
          <Icon name='save' />
        </Button>
      )
    };
  };

  constructor(props: any) {
    super(props);

    this.state = {
      model: { ...(this.params.user || {}) }
    };
  }

  componentDidMount() {
    this.navigation.setParams({ onSave: this.onSave });
  }

  onSave = (): void => {
    this.isFormValid()
      .pipe(
        tap(valid => !valid && Toast.showError('Revise os campos')),
        filter(valid => valid),
        switchMap(() => userService.save(this.state.model as IUser).pipe(loader())),
        logError(),
        bindComponent(this)
      )
      .subscribe(
        () => {
          this.navigateBack();
        },
        err => Toast.showError(err)
      );
  };

  render(): JSX.Element {
    let { model } = this.state;

    return (
      <Container>
        <Content padder keyboardShouldPersistTaps='handled'>
          <Form>
            <ValidationContext ref={this.bindValidationContext}>
              <List>
                <FieldText
                  label='Nome'
                  validation='string|required|min:3|max:50'
                  value={model.firstName}
                  flowIndex={1}
                  onChange={this.updateModel((value, model) => (model.firstName = value))}
                />

                <FieldText
                  label='Sobrenome'
                  validation='string|max:50'
                  value={model.lastName}
                  flowIndex={2}
                  onChange={this.updateModel((value, model) => (model.lastName = value))}
                />

                <FieldText
                  label='Email'
                  validation='string|email|max:150'
                  keyboardType='email-address'
                  value={model.email}
                  flowIndex={3}
                  onChange={this.updateModel((value, model) => (model.email = value))}
                />
              </List>
            </ValidationContext>
          </Form>
        </Content>
      </Container>
    );
  }
}
