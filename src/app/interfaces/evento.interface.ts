export interface IEvento {
    id: string;
    titulo: string;
    descricao: string;
    dataHora: string;
    categoria: string;
    local: string;
    participantes: string[];
    createdAt: string;
    updatedAt: string;
  }
  
  export interface IEventoBody {
    titulo: string;
    descricao: string;
    dataHora: string;
    categoria: string;
    local: string;
    participantes: string[];
  }
  
  export interface IEventoFilter {
    titulo?: string;
    categoria?: string;
    dataHora?: string;
    local?: string;
  }
  
  export interface IOrder {
    field: string;
    direction: 'asc' | 'desc';
  }
  
  export interface IResponse<T> {
    status: string;
    message: string;
    data: T;
  }
  