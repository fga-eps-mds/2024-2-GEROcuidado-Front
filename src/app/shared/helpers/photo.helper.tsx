import React from "react";
import { Image, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { hasFoto } from "./foto.helper";
import { StyleSheet } from 'react-native';

export const getFoto = (
    foto: string | null | undefined
  ) => {
    // Verifique se a função hasFoto está definida
    if (hasFoto(foto)) {
      return (
        <Image source={{ uri: foto as string }} style={styles.fotoPerfil} testID="foto-resultado" />
      );
    }
  
    return (
      <View style={[styles.semFoto, styles.fotoPerfil]}>
        <Icon style={styles.semFotoIcon} name="image-outline" size={15} />
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    fotoPerfil: {
      width: 60,
      aspectRatio: 1,
      borderRadius: 100,
    },
    semFoto: { position: "relative", backgroundColor: "#EFEFF0" },
    semFotoIcon: {
      position: "absolute",
      right: "38%",
      bottom: "38%",
      opacity: 0.4,
      margin: "auto",
      alignSelf: "center",
      zIndex: 1,
    },
  });
