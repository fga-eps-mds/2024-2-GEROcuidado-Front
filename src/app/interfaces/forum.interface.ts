import { IUser } from "./user.interface";

export enum ECategoriaPublicacao {
  SAUDE = "Saúde",
  ALIMENTACAO = "Alimentação",
  EXERCICIOS = "Exercícios",
  GERAL = "Geral",
}

export enum ECategoriaPesquisa {
  SAUDE = "Saúde",
  ALIMENTACAO = "Alimentação",
  EXERCICIOS = "Exercícios",
  GERAL = "Geral",
  TODAS = "Todas",
}

export interface IPublicacaoBody {
  idUsuario: number;
  titulo: string;
  descricao: string;
  dataHora: Date | string;
  categoria: ECategoriaPublicacao;
}

export interface IPublicacao extends IPublicacaoBody {
  id: number;
  usuario?: IUser;
  idUsuarioReporte: number[];
  categoria: ECategoriaPublicacao;
}

export interface IPublicacaoParams extends IPublicacaoBody, IUser {
  id: number;
  usuario?: IUser;
  idUsuarioReporte: string;
}
export interface IDenuncia {
  dataHora: Date | string;
  id: number;
  idUsuario?: number;
  motivo: string;
  descricao: string;
}

export interface IPublicacaoUsuario extends IPublicacao, IUser { }

export interface IPublicacaoFilter {
  titulo?: string;
  isReported?: boolean;
  categoria?: ECategoriaPesquisa;
}

export interface IOrder {
  column: string;
  dir: "DESC" | "ASC";
}

export interface IComentarioBody {
  idUsuario: number;
  conteudo: string;
  dataHora: Date | string;
  publicacaoId: number;
}

export interface IComentario extends IComentarioBody {
  id: number;
  usuario: IUser;
}

export interface IComentarioParams extends IComentarioBody{
  id: number;
}
