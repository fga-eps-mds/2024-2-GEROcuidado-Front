import {
  IOrder,
  IPublicacao,
  IPublicacaoBody,
  IPublicacaoFilter,
  IComentario,
  IComentarioBody,
  IComentarioParams,
} from "../interfaces/forum.interface";
import { IResponse } from "../interfaces/response.interface";

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const API_PORT = process.env.EXPO_PUBLIC_API_FORUM_PORT;
const BASE_URL = `${API_URL}:${API_PORT}/api/forum`;
const CREATE_POST = `${API_URL}:${API_PORT}/api/forum/`;

export const postPublicacao = async (
  body: IPublicacaoBody,
  token: string,
): Promise<IResponse<IPublicacao | null>> => {
  const response = await fetch(CREATE_POST, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message as string);
  }

  return json;
};

export const getAllPublicacao = async (
  offset: number,
  filter: IPublicacaoFilter,
  order: IOrder,
): Promise<IResponse<IPublicacao[] | null>> => {
  const params = `limit=10&offset=${offset}&filter=${JSON.stringify(
    filter,
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

export const updatePublicacao = async (
  id: number,
  body: Partial<IPublicacao>,
  token: string,
): Promise<IResponse<IPublicacao | null>> => {
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

export const deletePublicacaoById = async (
  id: number,
  token: string,
): Promise<IResponse<IPublicacao | null>> => {
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

export const postComentario = async (
  body: IComentarioBody,
  token: string,
): Promise<IResponse<IComentario | null>> => {
  const response = await fetch(`${BASE_URL}/comentarios/comentario`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message as string);
  }

  return json;
};

// Buscar todos os comentários
export const getAllComentarios = async (publicacaoId: number): Promise<IResponse<IComentario[] | null>> => {
  const response = await fetch(`${BASE_URL}/comentarios/all?publicacaoId=${publicacaoId}`, {
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

// Buscar um comentário específico
export const getComentarioById = async (
  id: number
): Promise<IResponse<IComentario | null>> => {
  const response = await fetch(`${BASE_URL}/comentarios/${id}`, {
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

// Atualizar um comentário
export const updateComentario = async (
  id: number,
  body: Partial<IComentario>,
  token: string,
): Promise<IResponse<IComentario | null>> => {
  const response = await fetch(`${BASE_URL}/comentarios/${id}`, {
    method: "PUT",
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

// Deletar um comentário
export const deleteComentarioById = async (
  id: number,
  token: string,
): Promise<IResponse<IComentario | null>> => {
  const response = await fetch(`${BASE_URL}/comentarios/${id}`, {
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
