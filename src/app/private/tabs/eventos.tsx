import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IUser } from "../../interfaces/user.interface";
import NaoAutenticado from "../../components/NaoAutenticado";
import IdosoNaoSelecionado from "../../components/IdosoNaoSelecionado";
import CalendarStrip from "react-native-calendar-strip";

import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import { IEvento, IEventoFilter, IOrder } from "../../interfaces/evento.interface";
import CardEvento from "../../components/CardEvento";
import { getAllEvento } from "../../services/evento.service";
import Toast from "react-native-toast-message";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { IIdoso } from "../../interfaces/idoso.interface";
import moment from "moment";
import "moment/locale/pt-br";
import database from "../../db";
import { Collection, Q } from "@nozbe/watermelondb";
import Evento from "../../model/Evento";
import { getFoto } from "../../shared/helpers/photo.helper";
import { json } from "@nozbe/watermelondb/decorators";

export default function Eventos() {
  moment.locale("pt-br");

  const [idoso, setIdoso] = useState<IIdoso>();
  const [user, setUser] = useState<IUser>();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(moment());
  const order: IOrder = {
    field: "dataHora",
    direction: "asc",
  };

  const datesWhitelist = [
    {
      start: moment().clone().subtract(1, "y"),
      end: moment().add(1, "y"),
    },
  ];

  const getIdoso = () => {
    AsyncStorage.getItem("idoso").then((idosoString) => {
      if (idosoString) {
        const idosoPayload = JSON.parse(idosoString) as IIdoso;
        setIdoso(idosoPayload);
      }
    });
  };

  const novoEvento = () => {
    router.push({
      pathname: "private/pages/cadastrarEvento",
    });
  };

  const handleUser = () => {
    AsyncStorage.getItem("usuario").then((response) => {
      const usuario = JSON.parse(response as string);
      setUser(usuario);
    });
  };

  const getEventos = async () => {
    if (!idoso || !selectedDate) return;

    setLoading(true);

    try {
      const eventoCollection = database.get('evento') as Collection<Evento>;

      // TODO: Consulta com defeito, arrumar um jeito de filtar com ela
      /*const eventoFiltrados = await eventoCollection.query(
        Q.where('idoso_id', idoso.id),
      ).fetch();*/

      const todosEventos = await eventoCollection.query().fetch();

      const startOfDay = selectedDate.startOf('day').toISOString();
      const endOfDay = selectedDate.endOf('day').toISOString();

      // Metodo menos eficiente, assim que resolvido deve ser descontinuado
      const eventosFiltrados = todosEventos.filter(evento => {
        const eventoDataHora = new Date(evento.dataHora).toISOString(); 
        return evento.idIdoso === idoso.id && eventoDataHora >= startOfDay && eventoDataHora <= endOfDay;
      });

      setEventos(eventosFiltrados);
    } finally {
      setLoading(false);
    }
  };

  const markedDates = [
    {
      date: moment(),
      dots: [{ color: "#fff" }],
    },
  ];

  useEffect(() => handleUser(), []);
  useEffect(() => getIdoso(), []);
  useEffect(() => {
      getEventos();
    },
    [idoso, selectedDate]
  );

  return (
    <>
      {!user?.id && <NaoAutenticado />}

      {user?.id && !idoso?.id && <IdosoNaoSelecionado />}

      {user?.id && idoso?.id && (
        <View>
          <View style={styles.header}>
            {getFoto(idoso?.foto)}
            <Text style={styles.nomeUsuario}>
              <Text style={styles.negrito}>{idoso?.nome}</Text>
            </Text>
          </View>

          <View>
            <CalendarStrip
              scrollerPaging={true}
              scrollable={true}
              style={styles.Calendar}
              calendarHeaderStyle={{ color: "#fff" }}
              dateNumberStyle={{ color: "#fff" }}
              dateNameStyle={{ color: "#fff" }}
              iconContainer={{ flex: 0.1 }}
              highlightDateNameStyle={{ color: "#fff" }}
              highlightDateNumberStyle={{ color: "#fff" }}
              highlightDateContainerStyle={{ backgroundColor: "#B4026D" }}
              showMonth={true}
              datesWhitelist={datesWhitelist}
              onDateSelected={setSelectedDate}
              selectedDate={selectedDate}
              markedDates={markedDates}
            />
          </View>

          <Pressable style={styles.botaoCriarEvento} onPress={novoEvento}>
            <Icon name="plus" color={"white"} size={20}></Icon>
            <Text style={styles.textoBotaoCriarEvento}>Novo Evento</Text>
          </Pressable>

          {loading && (
            <ActivityIndicator
              size="large"
              color="#2CCDB5"
              testID="loading-indicator"
              style={{ marginTop: 100 }}
            />
          )}

          {!loading && eventos.length > 0 && (
            <View style={styles.eventos}>
              <FlashList
                data={eventos}
                renderItem={({ item, index }) => (
                  <CardEvento
                    item={item as unknown as IEvento}
                    index={index}
                    date={selectedDate.toDate() || new Date()}
                  />
                )}
                estimatedItemSize={50}
              />
            </View>
          )}
          {eventos.length === 0 && (
            <View>
              <Text
                style={styles.semEventos}
              >{`Você ainda não tem nenhum evento cadastrado no dia ${moment(
                selectedDate,
              ).format("DD/MM")}`}</Text>
            </View>
          )}
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#2CCDB5",
    width: "100%",
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  fotoPerfil: {
    width: 60,
    aspectRatio: 1,
    borderRadius: 100,
  },
  Calendar: {
    height: 80,
    margin: 0,
    backgroundColor: "#2CCDB5",
  },
  nomeUsuario: {
    color: "#FFFFFF",
    fontSize: 16,
    marginLeft: 20,
    maxWidth: "75%",
  },
  negrito: {
    fontWeight: "bold",
  },
  botaoCriarEvento: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#B4026D",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    marginLeft: "auto",
    marginRight: 10,
    marginVertical: 10,
  },
  textoBotaoCriarEvento: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 5,
  },
  eventos: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  semEventos: {
    fontSize: 35,
    opacity: 0.3,
    textAlign: "center",
    marginTop: "35%",
  },
});
