import '@vtex/phone/countries/BRA';

import * as phoneValidator from '@vtex/phone';
import * as JoiCore from 'joi';

function isEmpty(value: any): boolean {
  return value === null || value === undefined || value === '';
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function coerce(value: any, state: any, options: any): any {
  return value === '' ? null : value;
}

export const joi: typeof JoiCore = JoiCore.extend({
  base: JoiCore.string(),
  name: 'string',
  language: {
    phone: 'invalid phone number format',
    zipcode: 'invalid zipcode format'
  },
  coerce,
  rules: [{
    name: 'phone',
    description: 'validate phone',
    validate(params: any, value: any, state: any, options: any): any {
      if (isEmpty(value)) return value;
      value = value.replace(/\D/g, '');

      if (!phoneValidator.validate(value)) {
        return this.createError('string.phone', { v: value }, state, options);
      }

      return value;
    }
  }, {
    name: 'zipcode',
    description: 'validate zipcode',
    validate(params: any, value: any, state: any, options: any): any {
      if (isEmpty(value)) return value;
      value = value.replace(/\D/g, '');

      if (value.length !== 8) {
        return this.createError('string.zipcode', { v: value }, state, options);
      }

      return value;
    }
  }]
}).extend({
  base: JoiCore.date(),
  name: 'date',
  coerce
});

export function validateAsPromise<T>(model: any, schema: JoiCore.Schema): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    joi.validate(model, schema, { abortEarly: false, stripUnknown: <any>{ objects: true, arrays: false } }, (err: any, value: T) => {
      if (!err) return resolve(value);

      reject({
        validationError: true,
        message: err.details.map((d: any) => {
          d.path = d.path.join('.');
          return d;
        })
      });

    });
  });
}