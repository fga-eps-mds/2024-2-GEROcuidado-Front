export const clearSqlInject = (obj: string): string => {
  const regexp = /[^a-zA-Z0-9 ]/g;
  return obj.replace(regexp, '');
};
