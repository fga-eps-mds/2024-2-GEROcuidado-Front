export enum ECategoriaRotina {
  MEDICAMENTO = "Medicamentos",
  ALIMENTACAO = "Alimentação",
  EXERCICIOS = "Exercícios",
  GERAL = "Geral",
}

export interface IRotinaBody {
  titulo: string;
  idIdoso: string;
  categoria?: ECategoriaRotina | null;
  descricao?: string;
  notificacao: boolean;
  token?: string;
  dataHoraConcluidos: string[];
  dataHora: Date | string;
  dias: EDiasSemana[];
}

export interface IRotina extends IRotinaBody {
  id: string;
}

export interface IRotinaFilter {
  idIdoso?: string;
  dataHora?: string;
}

export enum EDiasSemana {
  Domingo = 0,
  Segunda = 1,
  Terca = 2,
  Quarta = 3,
  Quinta = 4,
  Sexta = 5,
  Sabado = 6,
}

export interface IOrder {
  column: string;
  dir: "ASC";
}
