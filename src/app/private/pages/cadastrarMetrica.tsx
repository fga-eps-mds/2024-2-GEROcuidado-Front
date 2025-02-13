import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Pressable,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { IUser } from "../../interfaces/user.interface";
import { IIdoso } from "../../interfaces/idoso.interface";
import { router } from "expo-router";
import { postMetrica } from "../../services/metrica.service";
import { EMetricas, IMetrica } from "../../interfaces/metricas.interface";
import Toast from "react-native-toast-message";
import { getFoto } from "../../shared/helpers/photo.helper";
import database from "../../db";
import { checkNetworkConnection } from '../../components/networkUtils';


export default function CriarMetrica() {
  const [user, setUser] = useState<IUser | undefined>(undefined);
  const [idoso, setIdoso] = useState<IIdoso>();
  const [token, setToken] = useState<string>("");
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("token").then(setToken);
    AsyncStorage.getItem("usuario").then(response => {
      if (response) setUser(JSON.parse(response));
    });
    AsyncStorage.getItem("idoso").then(response => {
      if (response) setIdoso(JSON.parse(response));
    });
  }, []);

  const handleMetricSelection = async (metricType: EMetricas) => {
    const metrica: IMetrica = {
      idIdoso: Number(idoso?.id),
      categoria: metricType,
      sincronizado: false,
      dataCriacao: new Date().toISOString(),
    };

    try {
      setShowLoading(true);
      const isOnline = await checkInternetConnection();

      if (isOnline) {
        const response = await postMetrica(metrica, token);
        await database.updateMetricaSyncStatus(metrica.id, true);
        Toast.show({ type: "success", text1: "Sucesso!", text2: response.message });
      } else {
        await database.insertMetrica(metrica);
        Toast.show({ type: "info", text1: "Sem conexão!", text2: "A métrica será sincronizada quando a internet voltar." });
      }
    } catch (err) {
      Toast.show({ type: "error", text1: "Erro!", text2: err.message });
    } finally {
      setShowLoading(false);
      router.replace("private/tabs/registros");
    }
  };

  const renderMetricCard = (metricType, iconName, description, iconColor) => (
    <Pressable key={metricType} style={styles.metricCard} onPress={() => handleMetricSelection(metricType)}>
      <View style={styles.metricCardContent}>
        <Icon name={iconName} color={iconColor} size={30} style={styles.metricCardIcon} />
        <View style={styles.metricsName}>
          <Text style={styles.metricCardText}>{description}</Text>
          <Text style={styles.cadastrarPlaceholder}>Cadastrar {description}</Text>
        </View>
        <Icon name="chevron-right" color={"#888"} />
      </View>
    </Pressable>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.push("private/tabs/registros")}>
          <Icon name="chevron-left" color={"black"} size={20} style={styles.chevronLeft} />
        </Pressable>
        <View style={styles.photoAndName}>
          {user?.id && idoso?.id && (
            <>
              {getFoto(idoso?.foto)}
              <Text style={styles.nomeUsuario}><Text style={styles.negrito}>{idoso?.nome}</Text></Text>
            </>
          )}
        </View>
        <View style={styles.none}></View>
      </View>
      <Text style={styles.textoAbaixoDoBotao}>Selecione a métrica a ser cadastrada</Text>
      <View style={styles.metricCardsContainer}>
        {renderMetricCard(EMetricas.FREQ_CARDIACA, "heartbeat", "Frequência Cardíaca", "#FF7D7D")}
        {renderMetricCard(EMetricas.PRESSAO_SANGUINEA, "tint", "Pressão Sanguínea", "#FF7D7D")}
        {renderMetricCard(EMetricas.SATURACAO_OXIGENIO, "oxygen", "Saturação do Oxigênio", "#87F4E4")}
        {renderMetricCard(EMetricas.TEMPERATURA, "thermometer", "Temperatura", "#FFAC7D")}
        {renderMetricCard(EMetricas.GLICEMIA, "cubes", "Glicemia", "#3F3F3F")}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", height: 100, backgroundColor: "#2CCDB5" },
  photoAndName: { padding: 10, flexDirection: "column", alignSelf: "center", alignItems: "center" },
  none: { width: 30 },
  nomeUsuario: { color: "#FFFFFF", fontSize: 16, marginTop: 10, maxWidth: "100%" },
  container: { flexGrow: 1 },
  textoAbaixoDoBotao: { marginTop: 30, textAlign: "center", color: "#3F3F3F", fontSize: 20 },
  metricCardsContainer: { flexDirection: "column", alignItems: "center", marginTop: 20 },
  metricCard: { flexDirection: "row", alignItems: "center", backgroundColor: "white", padding: 15, borderRadius: 10, marginBottom: 20, width: "80%", shadowColor: "#000", shadowOffset: { width: 3, height: 3 }, shadowOpacity: 0.2, shadowRadius: 4 },
  metricCardIcon: { marginRight: 10 },
  metricCardText: { color: "#3F3F3F", fontSize: 16 },
  cadastrarPlaceholder: { color: "#A9A9A9", fontSize: 12, marginTop: 5 },
  chevronLeft: { marginLeft: 15, width: 15 },
  negrito: { fontWeight: "bold" },
});
