import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import { IDenuncia, IPublicacaoUsuario } from "../interfaces/forum.interface";
import { getFoto } from "../shared/helpers/photo.helper";

interface IProps {
  item: IPublicacaoUsuario;
}

const URL_DENUNCIAS = `${process.env.EXPO_PUBLIC_API_URL}:${process.env.EXPO_PUBLIC_API_FORUM_PORT}/api/forum/denuncias`;

export default function PublicacaoVisualizar({ item: itemPublicacao }: IProps) {
  const [denuncias, setDenuncias] = useState<{ [idUsuario: number]: IDenuncia[] }>({});
  const [token, setToken] = useState("");

  useEffect(() => {
    const getDenuncias = async () => {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        console.error("Token não encontrado.");
        return;
      }

      setToken(token);

      try {
        const response = await fetch(`${URL_DENUNCIAS}/byPublicacaoId/${itemPublicacao.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const dataDenuncias = await response.json();

        if (!Array.isArray(dataDenuncias.data)) {
          console.error("Erro ao buscar denúncias:", dataDenuncias);
          return;
        }

        // Agrupar denúncias por usuário
        const groupedDenuncias = dataDenuncias.data.reduce(
          (acc: { [idUsuario: number]: IDenuncia[] }, denuncia: IDenuncia) => {
            if (denuncia.idUsuario !== undefined && !acc[denuncia.idUsuario]) {
              acc[denuncia.idUsuario] = [];
            }
            if (denuncia.idUsuario !== undefined) {
              acc[denuncia.idUsuario].push(denuncia);
            }
            return acc;
          },
          {}
        );

        setDenuncias(groupedDenuncias);
      } catch (error) {
        console.error("Erro ao buscar denúncias:", error);
      }
    };

    getDenuncias();
  }, []);

  const getFormattedDate = (payload: Date | string): string => {
    const date = new Date(payload);
    return date.toLocaleDateString("pt-BR");
  };

  return (
    <View style={styles.postContainer}>
      <View style={styles.userInfo}>
        {getFoto(itemPublicacao.foto)}
        <Text style={styles.username}>{itemPublicacao.nome || "Usuário deletado"}</Text>
      </View>
      <Text style={styles.titulo}>{itemPublicacao.titulo}</Text>
      <Text style={styles.descricao}>{itemPublicacao.descricao}</Text>
      <View style={styles.underInfo}>
        <Text style={styles.categoria}>{itemPublicacao.categoria}</Text>
        <Text style={styles.date}>{getFormattedDate(itemPublicacao.dataHora)}</Text>
      </View>
      <View style={styles.secondUnderInfo}>
        {itemPublicacao.idUsuarioReporte && itemPublicacao.idUsuarioReporte.length > 0 && (
          <View style={styles.reports}>
            <View style={styles.reportsContainer}>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: 'center', marginBottom: 5, marginTop: 10, gap: 7 }}>
                <AntDesign name="warning" size={18} color="#FFCC00" />
                <Text style={styles.reportsText}>
                  Reportada por {Object.keys(denuncias).length} usuário(s)
                </Text>
              </View>
              {Object.entries(denuncias).map(([idUsuario, userDenuncias]) => (
                <View key={idUsuario} style={styles.reportGroup}>
                  <Text style={styles.reportUser}>Usuário {idUsuario}</Text>
                  {userDenuncias.map((denuncia, index) => (
                    <View key={index} style={styles.reportItem}>
                      <Text style={styles.reportReason}>Motivo: {denuncia.motivo}</Text>
                      <Text style={styles.reportDescription}>Descrição: {denuncia.descricao}</Text>
                      <Text style={styles.reportDate}>
                        Data: {getFormattedDate(denuncia.dataHora)}
                      </Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
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
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  username: {
    color: "#000",
    opacity: 0.6,
    fontSize: 16,
    marginLeft: 15,
    fontWeight: "500",
  },
  titulo: {
    fontSize: 16,
    marginTop: 20,
    fontWeight: "500",
  },
  descricao: {
    fontSize: 14,
    marginTop: 20,
    color: "#0000000",
  },
  underInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  secondUnderInfo: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  reports: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    backgroundColor: "#FFF4E5",
    borderRadius: 8,
  },
  reportsText: {
    fontSize: 14,
    color: "#FF8800",
    textAlign: "center",
  },
  reportsContainer: {
    flexDirection: "column",
    width: "95%",
  },
  reportGroup: {
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  reportUser: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#442200",
  },
  reportItem: {
    marginTop: 5,
  },
  reportReason: {
    fontSize: 14,
    color: "#663300",
  },
  reportDescription: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#884400",
  },
  reportDate: {
    fontSize: 12,
    color: "#AA5500",
  },
  categoria: {
    color: "#137364",
    fontWeight: "500",
  },
  date: {
    color: "#000",
    fontSize: 14,
  },
});