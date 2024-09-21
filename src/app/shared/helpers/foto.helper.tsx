// Funções auxiliares para foto:
import { Image } from 'react-native'; // Import do Image para usar na função getFoto
import React from "react";

export const hasFoto = (foto: string | null | undefined): boolean => {
  if (!foto) return false;
  const raw = foto.split("data:image/png;base64,")[1];
  return raw ? raw.length > 0 : false;
};

export const getFoto = (foto: string | null | undefined, styles: any) => {
  if (hasFoto(foto)) {
    return (
      <Image source={{ uri: foto as string }} style={styles.fotoPerfil} />
    );
  }
};