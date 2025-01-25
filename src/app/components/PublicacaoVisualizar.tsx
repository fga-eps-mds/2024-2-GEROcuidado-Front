import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import { IPublicacaoUsuario } from "../interfaces/forum.interface";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AntDesing from "react-native-vector-icons/AntDesign";
import { hasFoto } from "../shared/helpers/foto.helper";
import { getFoto } from "../shared/helpers/photo.helper";
interface IProps {
  item: IPublicacaoUsuario;
}

export default function PublicacaoVisualizar({ item }: IProps) {

  const getFormattedDate = (payload: Date | string): string => {
    const date = new Date(payload);
    return date.toLocaleDateString("pt-BR");
  };

  return (
    <View style={styles.postContainer}>
      <View style={styles.userInfo}>
        {getFoto(item.foto)}
        <Text style={styles.username}>{item.nome || "Usuário deletado"}</Text>
      </View>
      <Text style={styles.titulo}>{item.titulo}</Text>
      <Text style={styles.descricao}>{item.descricao || "Descrição indisponível"} </Text>
      <View style={styles.underInfo}>
        <Text style={styles.categoria}>{item.categoria}</Text>
        <Text style={styles.date}>{getFormattedDate(item.dataHora)}</Text>
      </View>
      <View style={styles.secondUnderInfo}>
      {item.idUsuarioReporte && item.idUsuarioReporte.length > 0 && (
        <View style={styles.reports}>
          <AntDesing name="warning" size={18} color="#FFCC00" />
          <Text style={styles.reportsText}>Usuários reportaram</Text>
        </View>
      )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  postContainer: {
    margin: 10,
    borderRadius: 14,
    elevation: 5,
    backgroundColor: "white",
    shadowColor: "#333",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    padding: 15,
    display: "flex",
    flexDirection: "column",
    height: "auto",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  fotoPerfil: {
    width: 65,
    aspectRatio: 1,
    borderRadius: 100,
  },
  username: {
    color: "#000000",
    opacity: 0.6,
    fontSize: 16,
    marginLeft: 15,
    fontWeight: "500",
    width: "80%",
  },
  titulo: {
    fontSize: 16,
    marginTop: 20,
    fontWeight: "500",
  },
  descricao: {
    fontSize: 16,
    marginTop: 27,
    color: "#000000",
  },
  underInfo: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
    marginTop: 30,
  },
  secondUnderInfo: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "100%",
    marginTop: 10,
  },
  reports: {
    flexDirection: "row",
    alignItems: "center",
  },
  reportsText: {
    color: "#FFCC00",
    marginLeft: 3,
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
  categoria: {
    marginRight: 15,
    color: "#137364",
    fontWeight: "500",
  },
  date: {
    color: "#000000",
    fontSize: 14,
  },
});
