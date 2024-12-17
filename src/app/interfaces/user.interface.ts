export interface IUserLogin {
  email: string;
  senha: string;
}

export interface IUserBody extends IUserLogin {
  nome: string;
}

export interface IUser extends IUserBody {
  id: number;
  foto?: string | null;
  admin: boolean;
  data_nascimento: Date;
  descricao: string;
}
