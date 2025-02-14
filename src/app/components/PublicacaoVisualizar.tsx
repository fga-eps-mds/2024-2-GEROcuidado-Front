import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, Button, FlatList, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFoto } from "../shared/helpers/photo.helper";
import { getAllComentarios, postComentario, deleteComentarioById } from "../services/forum.service";
import { IComentario, IComentarioBody } from "../interfaces/forum.interface";
import { IDenuncia } from "../interfaces/forum.interface";
import { useRouter } from "expo-router";

const URL_DENUNCIAS = `${process.env.EXPO_PUBLIC_API_URL}:${process.env.EXPO_PUBLIC_API_FORUM_PORT}/api/forum/denuncias`;

interface IProps {
  item: any;
  token?: string;
  showComentarios?:boolean;
}

export default function PublicacaoVisualizar({ item, token, showComentarios=true}: IProps) {
  const [comentarios, setComentarios] = useState<IComentario[]>([]);
  const [novoComentario, setNovoComentario] = useState("");
  const [denuncias, setDenuncias] = useState<{ [idUsuario: number]: IDenuncia[] }>({});;

  useEffect(() => {
    carregarComentarios(item.id);
    carregarDenuncias(item.id);
  }, [item.id]);

  const carregarComentarios = async (publicacaoId: number) => {
    try {
      const response = await getAllComentarios(publicacaoId);
      if (response.data) {
        setComentarios(response.data);
      }
    } catch (error) {
      console.error("Erro ao carregar comentários", error);
    }
  };

  const carregarDenuncias = async (publicacaoId: number) => {
    try {
      const response = await fetch(`${URL_DENUNCIAS}/byPublicacaoId/${publicacaoId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const dataDenuncias = await response.json();

      if (Array.isArray(dataDenuncias.data)) {
        const groupedDenuncias = dataDenuncias.data.reduce(
          (acc: { [idUsuario: number]: IDenuncia[] }, denuncia: IDenuncia) => {
            if (denuncia.idUsuario !== undefined) {
              if (!acc[denuncia.idUsuario]) {
                acc[denuncia.idUsuario] = [];
              }
              acc[denuncia.idUsuario].push(denuncia);
            }
            return acc;
          },
          {}
        );

        setDenuncias(groupedDenuncias);
      }
    } catch (error) {
      console.error("Erro ao buscar denúncias:", error);
    }
  };

  const handleAdicionarComentario = async () => {
    if (novoComentario.trim()) {
      const comentarioBody: IComentarioBody = {
        idUsuario: Number(item.idUsuario),
        publicacaoId: Number(item.id),
        conteudo: novoComentario,
        dataHora: new Date().toISOString(),
      };

      if (!comentarioBody.conteudo) {
        alert("O comentario não pode estar vazio!");
        return;
      }

      if (isNaN(comentarioBody.idUsuario) || isNaN(comentarioBody.publicacaoId)) {
        console.error("Erro: o idUsuario ou o idPublicacao não são numeros");
        return;
      }

      try {
        const response = await postComentario(comentarioBody, token!);
        if (response.data) {
          setComentarios([...comentarios, response.data]);
          setNovoComentario("");
        }
      } catch (error) {
        console.error("Erro ao adicionar comentário", error);
      }
    }
  };

  const handleDeletarComentario = async (idComentario: number) => {
    try {
      await deleteComentarioById(idComentario, token!);
      setComentarios(comentarios.filter((comentario) => comentario.id !== idComentario));
    } catch (error) {
      console.error("Erro ao deletar comentário", error);
    }
  };

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
      <Text style={styles.descricao}>{item.descricao}</Text>
      <View style={styles.underInfo}>
        <Text style={styles.categoria}>{item.categoria}</Text>
        <Text style={styles.date}>{getFormattedDate(item.dataHora)}</Text>
      </View>

      {Object.keys(denuncias).length > 0 && (
        <View style={styles.secondUnderInfo}>
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
        </View>
      )}

      {showComentarios && <View style={styles.commentsSection}>
        <Text style={styles.commentsTitle}>Comentários</Text>
        <FlatList
          data={comentarios}
          keyExtractor={(comentario) => comentario.id.toString()}
          renderItem={({ item: comentario }) => (
            <View style={styles.commentContainer}>
              <Text style={styles.commentText}>
                <Text style={styles.commentUser}>{comentario.usuario?.nome || "Usuario Desconhecido"}:</Text> {comentario.conteudo}
              </Text>
              <TouchableOpacity onPress={() => handleDeletarComentario(comentario.id)}>
                <Icon name="delete" size={18} color="red" />
              </TouchableOpacity>
            </View>
          )}
        />
        <TextInput
          style={styles.input}
          placeholder="Adicione um comentário..."
          value={novoComentario}
          onChangeText={setNovoComentario}
        />
        <Button title="Comentar" onPress={handleAdicionarComentario} />
      </View>}
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
    color: "#000000",
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
  commentsSection: {
    marginTop: 20,
  },
  commentsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  commentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  commentUser: {
    fontWeight: "bold",
  },
  commentText: {
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 8,
    marginTop: 10,
  },
});