// Funções auxiliares para foto:
import { Image } from 'react-native';
import React from "react";

export const hasFoto = (foto: string | null | undefined): boolean => {
  // Verifica se a foto não é nula ou indefinida
  if (!foto) return false;

  // Expressão regular para verificar o prefixo de uma imagem base64 (png, jpeg, jpg, gif)
  const base64Regex = /^data:image\/(png|jpeg|jpg|gif);base64,/;
  
  // Retorna verdadeiro se a foto começar com o prefixo válido de imagem base64
  return base64Regex.test(foto);
};