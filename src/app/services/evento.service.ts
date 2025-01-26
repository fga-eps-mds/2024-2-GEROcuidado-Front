import { IEvento, IEventoBody, IEventoFilter, IOrder } from "../interfaces/evento.interface";
import { IResponse } from "../interfaces/response.interface";

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const API_PORT = process.env.EXPO_PUBLIC_API_SAUDE_PORT;
const BASE_URL = `${API_URL}:${API_PORT}/api/saude/evento`;

// Função para criar um evento
export const postEvento = async (
  body: IEventoBody,
  token: string
): Promise<IResponse<IEvento | null>> => {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const json = await response.json();

  if (response.status !== 201) {
    throw new Error(json.message as string);
  }

  return json;
};

// Função para listar todos os eventos
export const getAllEvento = async (
  filter: IEventoFilter,
  order: IOrder
): Promise<IResponse<IEvento[] | null>> => {
  const params = `limit=20&offset=0&filter=${JSON.stringify(
    filter
  )}&order=${JSON.stringify(order)}`;
  const response = await fetch(`${BASE_URL}?${params}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  const json = await response.json();

  if (response.status !== 200) {
    throw new Error(json.message as string);
  }

  return json;
};

// Função para atualizar um evento
export const updateEvento = async (
  id: number,
  body: Partial<IEvento>,
  token: string
): Promise<IResponse<IEvento | null>> => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const json = await response.json();

  if (response.status !== 200) {
    throw new Error(json.message as string);
  }

  return json;
};

// Função para excluir um evento
export const deleteEvento = async (
  id: number,
  token: string
): Promise<IResponse<IEvento | null>> => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await response.json();

  if (response.status !== 200) {
    throw new Error(json.message as string);
  }

  return json;
};
