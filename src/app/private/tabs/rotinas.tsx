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
import {
  IOrder,
  IRotina,
  IRotinaFilter,
} from "../../interfaces/rotina.interface";
import CardRotina from "../../components/CardRotina";
import { getAllRotina } from "../../services/rotina.service";
import Toast from "react-native-toast-message";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { IIdoso } from "../../interfaces/idoso.interface";
import moment from "moment";
import "moment/locale/pt-br";
import database from "../../db";
import { Collection, Q } from "@nozbe/watermelondb";
import Rotina from "../../model/Rotina";
import { getFoto } from "../../shared/helpers/photo.helper";
import { all } from "axios";

export default function Rotinas() {
  moment.locale("pt-br");

  const [idoso, setIdoso] = useState<IIdoso>();
  const [user, setUser] = useState<IUser>();
  const [rotinas, setRotinas] = useState<Rotina[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(moment());
  const order: IOrder = {
    column: "dataHora",
    dir: "ASC",
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

  const novaRotina = () => {
    router.push({
      pathname: "private/pages/cadastrarRotina",
    });
  };

  const handleUser = () => {
    AsyncStorage.getItem("usuario").then((response) => {
      const usuario = JSON.parse(response as string);
      setUser(usuario);
    });
  };

  const getRotinas = async () => {
    if (idoso == undefined || !selectedDate) return;

    setLoading(true);

    try {
      // const rotinaCollection = database.get('rotina') as Collection<Rotina>;

      // const allIdosoRotinas = await rotinaCollection.query(
      //   Q.where('idoso_id', idoso.id)
      // ).fetch();

      // TODO: tenta fazer essa filtragem direto na query meu nobre
      // const filteredRotinas = allIdosoRotinas.filter((rotina) => {
      //   if (rotina.dias.length > 0) {
      //     const date = selectedDate.toDate();
      //     const weekday = date.getDay().toString();

      //     return rotina.dias.includes(weekday) && rotina.dataHora < date;
      //   } else {
      //     return true;
      //   }
      // });

      const allRotinas = await getAllRotina({
        idIdoso: idoso.id,
        dataHora: selectedDate.toDate().toString(),
      }, { column: "dataHora", dir: "ASC" });

      // setRotinas(filteredRotinas);

      if (Array.isArray(allRotinas) && allRotinas.length > 0) setRotinas(allRotinas);

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
    getRotinas()
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
              scrollable={false}
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

          <Pressable style={styles.botaoCriarRotina} onPress={novaRotina}>
            <Icon name="plus" color={"white"} size={20}></Icon>
            <Text style={styles.textoBotaoCriarRotina}>Nova Rotina</Text>
          </Pressable>

          {loading && (
            <ActivityIndicator
              size="large"
              color="#2CCDB5"
              testID="loading-indicator"
              style={{ marginTop: 100 }}
            />
          )}

          {!loading && rotinas.length > 0 && (
            <View style={styles.rotinas}>
              <FlashList
                data={rotinas}
                renderItem={({ item, index }) => (
                  <CardRotina
                    item={item as unknown as IRotina & { categoria: string }}
                    index={index}
                    date={selectedDate.toDate() || new Date()}
                  />
                )}
                estimatedItemSize={50}
              />
            </View>
          )}
          {rotinas.length === 0 && (
            <View>
              <Text
                style={styles.semRotinas}
              >{`Você ainda não tem nenhuma rotina cadastrada no dia ${moment(
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
  nomeUsuario: {
    color: "#FFFFFF",
    fontSize: 16,
    marginLeft: 20,
    maxWidth: "75%",
  },
  negrito: {
    fontWeight: "bold",
  },
  botaoCriarRotina: {
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
  textoBotaoCriarRotina: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 5,
  },
  rotinas: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  semRotinas: {
    fontSize: 35,
    opacity: 0.3,
    textAlign: "center",
    marginTop: "35%",
  },
});
