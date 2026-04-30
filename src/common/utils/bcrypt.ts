import * as argon2 from 'argon2';

export const hashPassword = async (password: string): Promise<string> => {
  const hash = await argon2.hash(password);
  return hash;
};

export const comparePassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  return argon2.verify(password, hash);
};
