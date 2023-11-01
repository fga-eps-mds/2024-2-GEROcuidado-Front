import { Link, router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import CustomButton from "../../components/CustomButton";
import ErrorMessage from "../../components/ErrorMessage";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
  ECategoriaPublicacao,
  IPublicacao,
} from "../../interfaces/forum.interface";
import { IUser } from "../../interfaces/user.interface";
import Toast from "react-native-toast-message";
import {
  deletePublicacaoById,
  updatePublicacao,
} from "../../services/forum.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ModalConfirmation from "../../components/ModalConfirmation";

interface IErrors {
  titulo?: string;
  descricao?: string;
  categoria?: string;
}

export default function EditarPublicacao() {
  const item = useLocalSearchParams() as unknown as IPublicacao & IUser;
  const publicacao = {
    ...item,
    usuario: {
      id: item.idUsuario,
      foto: item.foto,
      admin: item.admin,
      nome: item.nome,
      email: item.email,
    },
  };
  const [titulo, setTitulo] = useState(item.titulo);
  const [descricao, setDescricao] = useState(item.descricao);
  const [categoria, setCategoria] = useState<ECategoriaPublicacao | null>(
    item.categoria ?? ECategoriaPublicacao.GERAL,
  );
  const [erros, setErros] = useState<IErrors>({});
  const [showErrors, setShowErrors] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [showLoadingApagar, setShowLoadingApagar] = useState(false);
  const [token, setToken] = useState<string>("");

  const getToken = () => {
    AsyncStorage.getItem("token").then((response) => {
      setToken(response as string);
    });
  };

  const salvar = async () => {
    if (Object.keys(erros).length > 0) {
      setShowErrors(true);
      return;
    }

    const body: Partial<IPublicacao> = {
      titulo,
      descricao,
      categoria: categoria as ECategoriaPublicacao,
    };

    try {
      setShowLoading(true);
      const response = await updatePublicacao(item.id, body, token);

      Toast.show({
        type: "success",
        text1: "Sucesso!",
        text2: response.message as string,
      });
      router.push("/private/tabs/forum");
    } catch (err) {
      const error = err as { message: string };
      Toast.show({
        type: "error",
        text1: "Erro!",
        text2: error.message,
      });
    } finally {
      setShowLoading(false);
    }
  };

  const apagarPublicacao = async () => {
    try {
      setShowLoadingApagar(true);
      const response = await deletePublicacaoById(item.id, token);
      Toast.show({
        type: "success",
        text1: "Sucesso!",
        text2: response.message as string,
      });
      router.replace("/private/tabs/forum");
    } catch (err) {
      const error = err as { message: string };
      Toast.show({
        type: "error",
        text1: "Erro!",
        text2: error.message,
      });
    } finally {
      setShowLoadingApagar(false);
    }
  };

  const confirmation = () => {
    setModalVisible(!modalVisible);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  useEffect(() => handleErrors, [titulo, descricao, categoria]);
  useEffect(() => getToken());

  const handleErrors = () => {
    const erros: IErrors = {};

    if (!titulo) {
      erros.titulo = "Campo obrigatório!";
    } else if (titulo.length > 100) {
      erros.titulo = "Deve ter no máximo 100 caracteres!";
    }

    if (!descricao) {
      erros.descricao = "Campo Obrigatório!";
    } else if (descricao.length > 500) {
      erros.descricao = "Deve ter no máximo 500 caracteres!";
    }

    if (!categoria) {
      erros.categoria = "Campo Obrigatório!";
    }

    setErros(erros);
  };

  const data = [
    { key: ECategoriaPublicacao.GERAL, value: ECategoriaPublicacao.GERAL },
    { key: ECategoriaPublicacao.SAUDE, value: ECategoriaPublicacao.SAUDE },
    {
      key: ECategoriaPublicacao.ALIMENTACAO,
      value: ECategoriaPublicacao.ALIMENTACAO,
    },
    {
      key: ECategoriaPublicacao.EXERCICIOS,
      value: ECategoriaPublicacao.EXERCICIOS,
    },
  ];

  const navigate = () => {
    const params = { ...item, ...item.usuario, id: item.id };

    router.push({
      pathname: "/private/pages/visualizarPublicacao",
      params: params,
    });
  };

  return (
    <ScrollView>
      <View style={styles.header}>
        <Pressable onPress={navigate}>
          <Icon name="chevron-left" size={40} color="#fff" />
        </Pressable>

        <View>
          <Text style={styles.tituloheader}>Nova publicação</Text>
        </View>
      </View>

      <View style={styles.publicacao}>
        <View style={styles.formControl}>
          <Text style={styles.inputLabel}>Título</Text>
          <TextInput
            onChangeText={setTitulo}
            value={titulo}
            placeholder="Título"
            style={styles.input}
          />
          <ErrorMessage show={showErrors} text={erros.titulo} />
        </View>

        <View style={styles.formControl}>
          <Text style={styles.inputLabel}>Descrição</Text>
          <TextInput
            onChangeText={setDescricao}
            value={descricao}
            multiline={true}
            placeholder="Descrição"
            numberOfLines={12}
            style={styles.input}
          />
          <ErrorMessage show={showErrors} text={erros.descricao} />
        </View>

        <View style={styles.formControl}>
          <View style={styles.selectInput}>
            <SelectList
              data={data}
              setSelected={setCategoria}
              placeholder="Categoria"
              search={false}
              defaultOption={{ key: item.categoria, value: item.categoria }}
            />
          </View>
          <ErrorMessage show={showErrors} text={erros.categoria} />
        </View>

        <View style={styles.linkButton}>
          <CustomButton
            title="Salvar"
            callbackFn={salvar}
            showLoading={showLoading}
          />
        </View>

        <Pressable onPress={confirmation}>
          {showLoadingApagar ? (
            <ActivityIndicator size="small" color="#FF7F7F" />
          ) : (
            <Text style={styles.apagar}>Apagar Publicação</Text>
          )}
        </Pressable>

        <ModalConfirmation
          visible={modalVisible}
          callbackFn={apagarPublicacao}
          closeModal={closeModal}
          message="Apagar publicação?"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
    padding: 20,
  },
  publicacao: {
    borderRadius: 15,
    backgroundColor: "white",
    margin: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  formControl: {
    marginBottom: 15,
  },
  inputLabel: {
    marginBottom: 10,
    fontWeight: "700",
  },
  input: {
    borderWidth: 0,
    padding: 12,
    backgroundColor: "#F1F1F1",
    borderRadius: 10,
    marginBottom: 5,
  },
  selectInput: {
    marginBottom: 5,
  },
  botaoSalvar: {
    marginTop: 30,
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
  },
  apagar: {
    color: "#FF7F7F",
    alignSelf: "center",
    fontSize: 18,
    fontWeight: "600",
  },
  linkButton: {
    alignItems: "center",
    marginTop: 60,
    marginBottom: 60,
  },
});
