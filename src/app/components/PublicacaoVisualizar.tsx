import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, Button, FlatList, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AntDesing from "react-native-vector-icons/AntDesign";
import { getFoto } from "../shared/helpers/photo.helper";
import { getAllComentarios, postComentario, deleteComentarioById } from "../services/forum.service";
import { IComentario, IComentarioBody } from "../interfaces/forum.interface";

interface IProps {
  item: any;
  token: string;
}

export default function PublicacaoVisualizar({ item, token }: IProps) {
  const [comentarios, setComentarios] = useState<IComentario[]>([]);
  const [novoComentario, setNovoComentario] = useState("");

  useEffect(() => {
    carregarComentarios(item.id); 
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

  const handleAdicionarComentario = async () =>{
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

      if(isNaN(comentarioBody.idUsuario) || isNaN(comentarioBody.publicacaoId)){
        console.error("Erro: o idUsuario ou o idPublicacao não são numeros");
        return;
      }

      try {
        const response = await postComentario(comentarioBody, token);
        if (response.data) {
          console.log(comentarioBody);
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
      await deleteComentarioById(idComentario, token);
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
      <View style={styles.secondUnderInfo}>
        {item.idUsuarioReporte && item.idUsuarioReporte.length > 0 && (
          <View style={styles.reports}>
            <AntDesing name="warning" size={18} color="#FFCC00" />
            <Text style={styles.reportsText}>Usuários reportaram</Text>
          </View>
        )}
      </View>
      
      {/* Seção de Comentários pfv funciona pfv */}
      <View style={styles.commentsSection}>
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  postContainer: { 
    padding: 15, 
    backgroundColor: "white", 
    borderRadius: 10,
     elevation: 3 
    },
  userInfo: { 
    flexDirection: "row", 
    alignItems: "center" },
  username: { marginLeft: 10, fontWeight: "bold" },
  titulo: { fontSize: 18, fontWeight: "bold", marginVertical: 10 },
  descricao: { fontSize: 14, marginBottom: 10 },
  underInfo: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  categoria: { color: "#137364", fontWeight: "500" },
  date: { fontSize: 14 },
  secondUnderInfo: { alignItems: "flex-end" },
  reports: { flexDirection: "row", alignItems: "center" },
  reportsText: { marginLeft: 5, color: "#FFCC00" },
  commentsSection: { marginTop: 20 },
  commentsTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },
  commentContainer: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 5 },
  commentUser: { fontWeight: "bold" },
  commentText: { flex: 1 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 8, marginTop: 10 },
});
