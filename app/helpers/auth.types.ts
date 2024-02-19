export interface AuthRedirectOptions {
  failureRedirect?: string;
  successRedirect?: string;
}

export type User = {
  id?: number;
  name?: string;
  lastname?: string;
  email?: string;
  password?: string;
};

export type Errors = {
  name?: string;
  lastname?: string;
  email?: string;
  password?: string;
  repetPassword?: string;
};

export type Response = null | User;
