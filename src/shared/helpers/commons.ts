import crypto from 'crypto';

export const isNil = (obj: any): obj is null | undefined =>
  isUndefined(obj) || obj === null;

export const isUndefined = (obj: any): obj is undefined =>
  typeof obj === 'undefined';

export const isJsonObject = (str: string) => {
  try {
    const parse = JSON.parse(str);
    return parse && typeof parse === 'object';
  } catch (e) {
    return false;
  }
};

export const createHash = async (length = 6): Promise<string> => {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let text = '';

  for (let i = 0; i < length; i++) {
    const n = crypto.randomBytes(1)[0];
    text += chars.charAt(Math.floor(n % chars.length));
  }

  return Promise.resolve(text);
};
