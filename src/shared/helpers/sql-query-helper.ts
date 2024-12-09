export type ClauseNumber = number | string | undefined;

export function getWhereClauseIN(
  value: number[] | undefined,
  tableColumn: string,
): string {
  if (!value || value.length < 1) return '';
  return ` AND ${tableColumn} IN(${value})`;
}

export function getWhereClauseString(
  value: string | undefined,
  tableColumn: string,
): string {
  if (value === undefined || !value.length) return '';
  return ` AND ${tableColumn} ILIKE('%${value}%')`;
}

export function getWhereClauseNumber(
  value: ClauseNumber,
  tableColumn: string,
): string {
  if (value === undefined || Number.parseInt(value as string) === -1) return '';
  return ` AND ${tableColumn} = ${Number(value)}`;
}

export function getWhereClauseBoolean(
  value: boolean | undefined,
  tableColumn: string,
): string {
  if (value === undefined) return '';

  return ` AND ${tableColumn} = ${Boolean(value)}`;
}

export function getWhereClauseArrayNumber(
  value: number | number[] | undefined,
  tableColumn: string,
): string {
  if (!value) return '';
  const searchValue = Array.isArray(value) ? value : [value];
  return ` AND ${tableColumn} && '{${searchValue}}'::integer[]`;
}
