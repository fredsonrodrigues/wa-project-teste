import { connectAndMigrate, Connection } from 'db';
import { ServiceError } from 'errors/service';
import { enRoles, IUser } from 'interfaces/models/user';
import { User } from 'models/user';

import * as service from './user';

describe('admin/services/user', () => {
  let connection: Connection;

  const user: IUser = {
    id: 2,
    email: 'test' + Date.now() + '@email.com',
    firstName: 'test',
    lastName: 'test',
    roles: [enRoles.admin]
  };

  beforeAll(async () => connection = await connectAndMigrate());
  afterAll(() => connection.destroy());

  it('should create a new user', async () => {
    const data: IUser = {
      ...user,
      id: null
    };

    return service.save(data).then((user: User) => {
      expect(user).not.toBeUndefined();
      expect(user.password).not.toBeUndefined();
      expect(user.password).not.toBeNull();
      expect(user.password).toBeString();
      expect(user.createdDate).toBeDate();
      expect(user.createdDate.getTime()).not.toBeNaN();
      expect(user.password[0]).toEqual('$');
      expect(user.roles).not.toBeEmpty();
      expect(user.roles[0]).toEqual(enRoles.admin);
    });
  });

  it('should allow to update the user', async () => {
    const data: IUser = {
      ...user,
      email: 'new-admin@email.com'
    };

    return service.save(data).then((user: User) => {
      expect(user).not.toBeUndefined();
      expect(user.id).toEqual(data.id);
      expect(user.email).toEqual(data.email);
    });
  });

  it('should not allow to save an user without roles', async () => {
    const data: IUser = {
      ...user,
      roles: []
    };

    const promise = service.save(data);
    await expect(promise).toReject();

    const err: Error = await promise.catch(err => err);
    expect(err instanceof ServiceError).toBeTrue();
    expect(err.message).toEqual('roles-required');
  });

  it('should not allow to save a sysAdmin user', async () => {
    const data: IUser = {
      ...user,
      roles: [enRoles.sysAdmin]
    };

    const promise = service.save(data);
    await expect(promise).toReject();

    const err: Error = await promise.catch(err => err);
    expect(err instanceof ServiceError).toBeTrue();
    expect(err.message).toEqual('not-allowed-to-change-sysAdmin');
  });

  it('should not allow to save an user with an invalid role', async () => {
    const data: IUser = {
      ...user,
      roles: ['not-valid'] as any
    };

    const promise = service.save(data);
    await expect(promise).toReject();

    const err: Error = await promise.catch(err => err);
    expect(err instanceof ServiceError).toBeTrue();
    expect(err.message).toEqual('invalid-roles');
  });

  it('should not allow to save a user with same email', async () => {
    const data: IUser = {
      ...user,
      id: null,
      email: 'new-admin@email.com'
    };

    const promise = service.save(data);
    await expect(promise).toReject();

    const err: Error = await promise.catch(err => err);
    expect(err instanceof ServiceError).toBeTrue();
    expect(err.message).toEqual('email-unavailable');
  });

  it('should allow remove a user', async () => {
    return expect(service.remove(user.id, { id: null } as any)).toResolve() as any;
  });

  it('should not allow remove an sysAdmin user', async () => {
    const promise = service.remove(1, { id: null } as any);
    await expect(promise).toReject();

    const err: Error = await promise.catch(err => err);
    expect(err instanceof ServiceError).toBeTrue();
    expect(err.message).toEqual('not-allowed-remove-sysAdmin');
  });

  it('should not allow remove the current user', async () => {
    const promise = service.remove(1, { id: 1 } as any);
    await expect(promise).toReject();

    const err: Error = await promise.catch(err => err);
    expect(err instanceof ServiceError).toBeTrue();
    expect(err.message).toEqual('not-allowed-remove-current-user');
  });
});