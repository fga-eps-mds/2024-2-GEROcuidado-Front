import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import BackButton from "../../components/BackButton";
import PublicacaoVisualizar from "../../components/PublicacaoVisualizar";
import { IPublicacaoParams, IPublicacaoUsuario } from "../../interfaces/forum.interface";
import { IUser } from "../../interfaces/user.interface";
import { updatePublicacao } from "../../services/forum.service";

export default function CriarDenuncia() {
  interface IReport {
    idUsuario: number;
    motivo: string;
    descricao: string;
    dataHora: Date | string;
  }

  const params = useLocalSearchParams() as unknown as IPublicacaoParams;
  const [publicacao, setPublicacao] = useState<IPublicacaoUsuario | null>(null);
  const [idUsuario, setIdUsuario] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [report, setReport] = useState<IReport>({
    idUsuario: 0,
    motivo: "",
    descricao: "",
    dataHora: new Date(),
  });

  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const API_PORT = process.env.EXPO_PUBLIC_API_FORUM_PORT;
  const BASE_URL = `${API_URL}:${API_PORT}`;

  const motivoDenuncia = [
    { key: 1, value: "Conteúdo impróprio" },
    { key: 2, value: "Conteúdo ofensivo" },
    { key: 3, value: "Conteúdo falso" },
    { key: 5, value: "Outro motivo" },
  ]

  const mapIdUsuarioReporte = (payload: string) => {
    if (!payload) return [];

    return payload.split(",").map((item) => Number(item));
  };

  const getPublicacaoFromParams = () => {
    const payload: IPublicacaoUsuario = {
      ...params,
      idUsuarioReporte: mapIdUsuarioReporte(params.idUsuarioReporte),
    };
    setPublicacao(payload);
  };

  const getUsuario = () => {
    AsyncStorage.getItem("usuario").then((response) => {
      const usuario = JSON.parse(response as string) as IUser;
      setIdUsuario(usuario?.id);
      setIsAdmin(usuario?.admin);
    });
  };

  const reportPublication = async () => {
    if (!publicacao || !idUsuario) {
      alert("Erro ao reportar publicação");
      return;
    } if (!report.motivo) {
      alert("Selecione um motivo para a denúncia");
      return;
    }
    if (!report.descricao) {
      alert("Descreva o motivo da denúncia");
      return;
    }

    // Substituir quando o back for resolvido
    const token = await AsyncStorage.getItem('token')

    if (!token) {
      console.error('Token não encontrado.');
      return;
    }

    const body = {
      idUsuario: idUsuario,
      motivo: report.motivo,
      descricao: report.descricao,
      publicacaoId: Number(publicacao.id),
      dataHora: new Date(),
    }

    const response = await fetch(`${BASE_URL}/api/forum/denuncias`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      alert("Erro ao reportar publicação");
      return;
    }

    await updatePublicacao(publicacao.id, { idUsuarioReporte: [idUsuario] }, token);

    alert("Denúncia realizada com sucesso");
    router.push({ pathname: "/private/tabs/forum" });
  }

  useEffect(() => getPublicacaoFromParams(), []);
  useEffect(() => getUsuario(), []);


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton route="private/tabs/forum" />

        <Text style={styles.tituloheader}>Denunciar Publicação</Text>
      </View>

      <ScrollView >
        {publicacao && <PublicacaoVisualizar item={publicacao} />}
        <Text style={styles.mainText}>Motivo da denúncia:</Text>
        <View style={styles.actions}>
          <SelectList
            data={motivoDenuncia}
            setSelected={(value: any) =>
              setReport({ ...report, motivo: motivoDenuncia.filter((item) => item.key === value)[0].value })}
            placeholder="Selecione o motivo da denúncia"
            save="key"
            fontFamily="Roboto"
            searchPlaceholder="Pesquisar"
          />
        </View>
        <View style={styles.actions}>
          <TextInput
            style={styles.textReport}
            placeholder="Descreva o motivo da denúncia!"
            multiline
            onChangeText={(value) =>
              setReport({ ...report, descricao: value })
            }
          />
        </View>
        <View style={styles.botoes}>
          <Pressable
            style={styles.confirmReportButton}
            onPress={reportPublication}>
            <Text>Reportar Publicação</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollView: {
    paddingHorizontal: 20,
    flex: 1,
  },

  mainText: {
    fontSize: 20,
    margin: 10,
    fontWeight: "bold",
  },

  confirmReportButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    margin: 10,
    alignItems: "center",

  },

  textReport: {
    height: 100,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    margin: 10,
    textAlignVertical: "top",
  },
  actions: {
    padding: 20,
  },
  header: {
    backgroundColor: "#2CCDB5",
    height: 60,
    flexDirection: "row",
    alignItems: "center",
  },
  tituloheader: {
    fontWeight: "bold",
    color: "white",
    fontSize: 20,
  },
  botoes: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    borderRadius: 5,
    width: 110,
    shadowColor: "#333",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },

});