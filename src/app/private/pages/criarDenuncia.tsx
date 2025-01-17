import { router, useLocalSearchParams } from "expo-router";
import { IPublicacao, IPublicacaoParams, IPublicacaoUsuario } from "../../interfaces/forum.interface";
import { Text, View, StyleSheet, ScrollView, Pressable, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import BackButton from "../../components/BackButton";
import Publicacao from "../../components/Publicacao";
import PublicacaoVisualizar from "../../components/PublicacaoVisualizar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IUser } from "../../interfaces/user.interface";
import { SelectList } from "react-native-dropdown-select-list";
import database from "../../db";

export default function CriarDenuncia() {
    interface IReport {
        idUsuario: number;
        motivo: string;
        descricao: string;
    }

    const params = useLocalSearchParams() as unknown as IPublicacaoParams;
    const [publicacao, setPublicacao] = useState<IPublicacaoUsuario | null>(null);
    const [idUsuario, setIdUsuario] = useState<number | null>(null);
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
    const [report, setReport] = useState<IReport>({
        idUsuario: 0,
        motivo: "",
        descricao: "",
    });


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

    const reportPublication = () => {
      console.log("report");
      if (!report.motivo) {
        alert("Selecione um motivo para a denúncia");
        return;
      }
      if (!report.descricao) {
        alert("Descreva o motivo da denúncia");
        return;
      }

      // Substituir quando o back for resolvido
      alert("Denúncia realizada com sucesso");
      router.push({ pathname: "/private/tabs/forum" });
    }

    useEffect(() => getPublicacaoFromParams(), []);
    useEffect(() => getUsuario(), []);


    return(
        <View style = { styles.container}>
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
                  setSelected={(value) => 
                    setReport({ ...report, motivo: value })
                  }
                  placeholder="Selecione o motivo da denúncia"
                  save="key"
                  fontFamily="Roboto"
                  searchPlaceholder="Pesquisar"
                />
              </View>
              <View style={styles.actions}>
                <TextInput
                  style={styles.textReport}
                  placeholder="Descreva o motivo da denúncia (Opcional)"
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

  container:{
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