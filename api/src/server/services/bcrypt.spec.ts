import * as service from './bcrypt';

describe('services/bcrypt', () => {

  it('should hash a valid password', async () => {
    const password = 'senha@123';

    return service.hash(password).then((hash: string) => {
      expect(hash).toBeString();
      return expect(service.compare(hash, password)).toResolve();
    });
  });

});