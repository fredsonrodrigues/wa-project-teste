import { enRoles, IUser } from 'interfaces/models/user';

import * as service from './mail';

describe('admin/services/mail', () => {
  const user: IUser = {
    id: 1,
    email: 'admin@waproject.com.br',
    firstName: 'Daniel',
    lastName: 'Prado',
    password: '$hash',
    roles: [enRoles.admin]
  };

  it('should send an email when user is created', () => {
    const notHashedPassword = '123';
    return service.sendUserCreate(user, notHashedPassword).then((mail: any) => {
      expect(mail.to).toEqual(user.email);
      expect(mail.template).toEqual('user-create');
      expect(mail.html).not.toBeEmpty();
      expect(user.password).not.toEqual(notHashedPassword);
    });
  });

  it('should send an email when user is created', () => {
    return service.sendResetPassword(user, 'token').then((mail: any) => {
      expect(mail.to).toEqual(user.email);
      expect(mail.template).toEqual('user-reset-password');
      expect(mail.html).not.toBeEmpty();
    });
  });

});