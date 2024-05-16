export type SignUpBody = {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  password: string;
};

export type SignInBody = {
  email: string;
  password: string;
};
