import { validate } from './registerNotification';

describe('app/validators/registerNotification', () => {
  it('should return valid', () => {
    return expect(validate({
      notificationToken: '123',
      deviceId: '123',
      application: '123'
    })).toResolve();
  });

  it('should return invalid', () => {
    return expect(validate({})).toReject();
  });

});