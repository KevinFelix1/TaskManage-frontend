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
  emails?: string;
  password?: string;
  repeatPassword?: string;
};
