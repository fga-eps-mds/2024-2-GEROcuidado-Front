export interface JwtPayload {
  id: number;
  nome: string;
  email: string;
  admin: boolean;
  iat: number;
  exp: number;
}
