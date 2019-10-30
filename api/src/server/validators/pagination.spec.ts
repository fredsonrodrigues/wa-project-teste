import { IPaginationParams } from 'interfaces/pagination';

import { validate } from './pagination';

describe('validators/pagination', () => {
  const model: IPaginationParams = {
    term: '',
    page: 0,
    pageSize: 10,
    orderBy: 'name',
    orderDirection: 'asc'
  };

  const columns = ['name'];

  it('should return valid for a full object', async () => {
    validate(model, columns).catch(err => console.table(err.message));
    await expect(validate(model, columns)).resolves;
  });

  it('should return valid for a minimum object', async () => {
    await expect(validate({ page: 0, pageSize: 10 }, columns)).resolves;
  });

  it('should return invalid when term is not a string', async () => {
    const data = { ...model, term: 1 };

    const promise = validate(data, columns);
    await expect(promise).toReject();

    const result = await promise.catch(err => err);
    expect(result.validationError).toBeTrue();
    expect(result.message).toHaveLength(1);
    expect(result.message[0].path).toEqual('term');
    expect(result.message[0].type).toEqual('string.base');
  });

  it('should return invalid when page is not present', async () => {
    const data = { ...model };
    delete data.page;

    const promise = validate(data, columns);
    await expect(promise).toReject();

    const result = await promise.catch(err => err);
    expect(result.validationError).toBeTrue();
    expect(result.message).toHaveLength(1);
    expect(result.message[0].path).toEqual('page');
    expect(result.message[0].type).toEqual('any.required');
  });

  it('should return invalid when page is not a number', async () => {
    const data = { ...model, page: 't' };

    const promise = validate(data, columns);
    await expect(promise).toReject();

    const result = await promise.catch(err => err);
    expect(result.validationError).toBeTrue();
    expect(result.message).toHaveLength(1);
    expect(result.message[0].path).toEqual('page');
    expect(result.message[0].type).toEqual('number.base');
  });

  it('should return invalid when page is less than 0', async () => {
    const data = { ...model, page: -1 };

    const promise = validate(data, columns);
    await expect(promise).toReject();

    const result = await promise.catch(err => err);
    expect(result.validationError).toBeTrue();
    expect(result.message).toHaveLength(1);
    expect(result.message[0].path).toEqual('page');
    expect(result.message[0].type).toEqual('number.min');
  });

  it('should return invalid when pageSize is not present', async () => {
    const data = { ...model };
    delete data.pageSize;

    const promise = validate(data, columns);
    await expect(promise).toReject();

    const result = await promise.catch(err => err);
    expect(result.validationError).toBeTrue();
    expect(result.message).toHaveLength(1);
    expect(result.message[0].path).toEqual('pageSize');
    expect(result.message[0].type).toEqual('any.required');
  });

  it('should return invalid when pageSize is not a number', async () => {
    const data = { ...model, pageSize: 't' };

    const promise = validate(data, columns);
    await expect(promise).toReject();

    const result = await promise.catch(err => err);
    expect(result.validationError).toBeTrue();
    expect(result.message).toHaveLength(1);
    expect(result.message[0].path).toEqual('pageSize');
    expect(result.message[0].type).toEqual('number.base');
  });

  it('should return invalid when pageSize is less than 1', async () => {
    const data = { ...model, pageSize: 0 };

    const promise = validate(data, columns);
    await expect(promise).toReject();

    const result = await promise.catch(err => err);
    expect(result.validationError).toBeTrue();
    expect(result.message).toHaveLength(1);
    expect(result.message[0].path).toEqual('pageSize');
    expect(result.message[0].type).toEqual('number.min');
  });

  it('should return invalid when orderBy is not a string', async () => {
    const data = { ...model, orderBy: 1 };

    const promise = validate(data, columns);
    await expect(promise).toReject();

    const result = await promise.catch(err => err);
    expect(result.validationError).toBeTrue();
    expect(result.message).toHaveLength(1);
    expect(result.message[0].path).toEqual('orderBy');
    expect(result.message[0].type).toEqual('string.base');
  });

  it('should return invalid when orderBy is not a valid column', async () => {
    const data = { ...model, orderBy: 'invalid' };

    const promise = validate(data, columns);
    await expect(promise).toReject();

    const result = await promise.catch(err => err);
    expect(result.validationError).toBeTrue();
    expect(result.message).toHaveLength(1);
    expect(result.message[0].path).toEqual('orderBy');
    expect(result.message[0].type).toEqual('any.allowOnly');
  });

  it('should return invalid when orderDirection is not a string', async () => {
    const data = { ...model, orderDirection: 1 };

    const promise = validate(data, columns);
    await expect(promise).toReject();

    const result = await promise.catch(err => err);
    expect(result.validationError).toBeTrue();
    expect(result.message).toHaveLength(1);
    expect(result.message[0].path).toEqual('orderDirection');
    expect(result.message[0].type).toEqual('string.base');
  });

  it('should return invalid when orderDirection is not a asc or desc', async () => {
    const data = { ...model, orderDirection: 'invalid' };

    const promise = validate(data, columns);
    await expect(promise).toReject();

    const result = await promise.catch(err => err);
    expect(result.validationError).toBeTrue();
    expect(result.message).toHaveLength(1);
    expect(result.message[0].path).toEqual('orderDirection');
    expect(result.message[0].type).toEqual('any.allowOnly');
  });
});
