export const bufferToBase64 = (buffer: Buffer): string => {
  const base64 = Buffer.from(buffer).toString();

  return isBase64(base64) ? base64 : '';
};

export const getImageUri = (value: Buffer | string): string => {
  return `data:image/png;base64,${Buffer.from(value).toString()}`;
};

export function isBase64(value: unknown): boolean {
  return typeof value === 'string' && isBase64Image(value);
}

export function isBase64Image(str: string): boolean {
  const expression = `data:image\/([a-zA-Z]*);base64,([^\"]*)`;
  const regex = new RegExp(expression);

  return regex.test(str);
}
