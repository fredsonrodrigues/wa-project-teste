/* eslint-disable @typescript-eslint/interface-name-prefix */
import 'joi';
import { ValidationErrorItem } from 'joi';

/* tslint:disable */
declare module 'joi' {
  // @ts-ignore
  export interface ValidationErrorItemString extends ValidationErrorItem {
    path: string;
  }

  export interface StringSchema {
    phone(): StringSchema;
    zipcode(): StringSchema;
  }

  export interface CustomValidationError {
    validationError: boolean;
    message: ValidationErrorItemString[];
  }
}