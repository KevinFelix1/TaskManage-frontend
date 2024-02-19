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

export type ValidationErrors = {
  username?: string;
  email?: string;
  password?: string;
  repeatPassword?: string;
  undefined?: string;
};
