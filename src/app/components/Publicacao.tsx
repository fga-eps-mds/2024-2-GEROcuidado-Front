import React from "react";
import { View, Image, Text, StyleSheet, Pressable, Button } from "react-native";
import { IPublicacao } from "../interfaces/forum.interface";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import AntDesing from "react-native-vector-icons/AntDesign";
import { hasFoto } from "../shared/helpers/foto.helper";

interface IProps {
  item: IPublicacao;
  crop?: boolean;
}

export default function Publicacao({ item, crop }: Readonly<IProps>) {

  const getFoto = (foto: string | null | undefined) => {
    if (hasFoto(foto)) {
      return (
        <Image testID="imageIcon" source={{ uri: foto as string }} style={styles.fotoPerfil} />
      );
    }

    return (
      <View style={[styles.semFoto, styles.fotoPerfil]}>
        <Icon
          style={styles.semFotoIcon}
          name="image-outline"
          size={15}
          testID="placeholder-icon"
        />
      </View>
    );
  };

  const getFormattedDate = (payload: Date | string): string => {
    const date = new Date(payload);
    return date.toLocaleDateString("pt-BR");
  };

  const makeReport = () => {
    const params = { ...item, ...item.usuario, id: item.id };

    router.push({
      pathname: "/private/pages/criarDenuncia",
      params: { ... params},
    });
  }


  const navigate = () => {
    const params = { ...item,
      id: item.id,
      foto: item.usuario?.foto,
      nome: item.usuario?.nome,
    };

    router.push({
      pathname: "/private/pages/visualizarPublicacao",
      params: {
        ...params
      },
    });
  };

  const getNome = (nome?: string): string => {
    if (!nome) return "Usuário deletado";
    if (!crop) return nome;

    return nome.length < 25 ? nome : nome.slice(0, 25) + "...";
  };

  const getTitulo = (titulo: string): string => {
    if (!crop) return titulo;

    return titulo.length < 30 ? titulo : titulo.slice(0, 30) + "...";
  };

  const getDescricao = (descricao: string): string => {
    if (!crop) return descricao;

    return descricao.length < 250 ? descricao : descricao.slice(0, 250) + "...";
  };

  return (
    <Pressable testID="publicacaoCard" onPress={navigate} style={styles.postContainer}>
      <View style={styles.postHeader}>
        {getFoto(item.usuario?.foto)}
        <View style={styles.userInfo}>
          <Text style={styles.title}>{getTitulo(item.titulo)}</Text>
          <Text style={styles.categoria}>{item.categoria}</Text>
          <View style={styles.subInfo}>
            <Text style={styles.username}>
              {getNome(item.usuario?.nome as string)}
            </Text>
            <Text style={styles.date}>{getFormattedDate(item.dataHora)}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.postContent}>{getDescricao(item.descricao)}</Text>
      <View style={styles.iconContainer}>
        <Pressable onPress={() => {console.log("Não implementado")}}>
          <Icon name="thumb-up-outline" size={25} />
        </Pressable>
        <Pressable onPress={() => {console.log("Não implementado")}}>
          <Icon name="comment-outline" size={25} />
        </Pressable>
        <Pressable onPress={() => {console.log("Não implementado")}}>
          <Icon name="star-outline" size={25} />
        </Pressable>
        <Pressable onPress={() => {console.log("Não implementado")}}>
          <Icon name="eye-outline" size={25} />
        </Pressable>
        <Pressable testID="reportButton" onPress={makeReport}>
          <Icon name="flag" color={"red"} size={25} />
        </Pressable>
      </View>
      <View style={styles.underInfo}>
      {item.idUsuarioReporte && item.idUsuarioReporte.length > 0 && (
        <View style={styles.reports}>
          <AntDesing name="warning" size={18} color="#FFCC00" />
          <Text style={styles.reportsText}>Usuários reportaram</Text>
        </View>
      )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  iconContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    marginTop: 10,
  },
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
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  userInfo: {
    marginLeft: 10,
    width: "100%",
  },
  subInfo: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 5,
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  categoria: {
    opacity: 0.5,
    marginTop: 5,
  },
  date: {
    color: "#000000",
    opacity: 0.5,
    fontSize: 10,
    marginLeft: 10,
  },
  postContent: {
    fontSize: 15,
    marginTop: 15,
  },
  fotoPerfil: {
    width: 45,
    aspectRatio: 1,
    borderRadius: 100,
  },
  semFoto: { position: "relative", backgroundColor: "#EFEFF0" },
  semFotoIcon: {
    position: "absolute",
    right: "34%",
    bottom: "34%",
    opacity: 0.4,
    margin: "auto",
    alignSelf: "center",
    zIndex: 1,
  },
  username: {
    color: "#000001",
    opacity: 0.5,
    fontSize: 13,
  },
  underInfo: {
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
});
