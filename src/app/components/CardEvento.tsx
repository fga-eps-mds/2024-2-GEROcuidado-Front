import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import { IEvento } from "../interfaces/evento.interface";
import { updateEvento } from "../services/evento.service"
import database from "../db";
import { Collection } from "@nozbe/watermelondb";
import Evento from "../model/Evento";

interface IProps {
  item: IEvento;
  index: number;
  date: Date;
}

export default function CardEvento({ item, index, date }: IProps) {
  const dateString = date.toLocaleString("pt-BR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const [nameIcon, setnameIcon] = useState("view-grid-outline");
  const [check, setCheck] = useState(false);
  const [time, setTime] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);


  const editar = () => {
    const evento = item as unknown as Evento;
    const eventoAttributes = {
      id: evento.id,
      titulo: evento.titulo,
      descricao: evento.descricao,
      dataHora: evento.dataHora,
      local: evento.local,
      criadoEm: evento.createdAt,
      atualizadoEm: evento.updatedAt,
    };
    const params = { evento: JSON.stringify(eventoAttributes) };

    router.push({
      pathname: "/private/pages/editarEvento",
      params: params,
    });
  };

  const handleDataHora = () => {
    const dateString = new Date(item.dataHora).toLocaleString("pt-BR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

    const [data, hora] = dateString.split(" ");
    setTime(hora);
  };

  useEffect(() => handleDataHora(), []);

  return (
    <>
      <Text style={styles.hora}>{time}</Text>
      <Pressable
        testID="card-evento"
        onPress={editar}
        style={[
          styles.container,
          { backgroundColor: index % 2 === 0 ? "#B4E1FF" : "#FFD6B4" },
        ]}
      >
        <View style={styles.icon}>
          <Icon size={30} name={nameIcon}></Icon>
        </View>
        <View style={styles.texts}>
          <Text style={styles.title}>{item.titulo}</Text>
          <Text style={styles.description}>{item.descricao}</Text>
        </View>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  hora: {
    fontSize: 18,
    fontWeight: "300",
    marginLeft: 20,
    marginTop: 10,
  },

  container: {
    flexDirection: "row",
    alignItems: "center",
    width: Dimensions.get("window").width - 40,
    marginRight: 20,
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderRadius: 4,
    padding: 10,
    paddingVertical: 5,
  },
  texts: {
    flexDirection: "column",
    marginLeft: 10,
    marginBottom: 8,
    marginTop: 8,
    marginRight: 8,
    flex: 1,
  },
  title: {
    fontWeight: "500",
    fontSize: 18,
  },
  description: {
    color: "#767676",
    marginTop: 10,
  },
  icon: {},
});
