/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable @typescript-eslint/interface-name-prefix */
import { IUserToken } from '../interfaces/tokens/user';

declare module 'express' {
  interface Request {
    user: IUserToken;
  }
}