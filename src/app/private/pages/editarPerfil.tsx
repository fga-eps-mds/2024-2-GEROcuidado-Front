import React, { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  TextInput,
  ActivityIndicator,
} from "react-native";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import ErrorMessage from "../../components/ErrorMessage";
import CustomButton from "../../components/CustomButton";
import UploadImage from "../../components/UploadImage";
import ModalConfirmation from "../../components/ModalConfirmation";
import BackButton from "../../components/BackButton";
import database from "../../db";
import User from "../../model/User";
import { Q } from "@nozbe/watermelondb";
import { IUser } from "../../interfaces/user.interface";
import Usuario from "../../model/Usuario";

interface IErrors {
  nome?: string;
}

export default function EditarPerfil() {
  const user = useLocalSearchParams() as unknown as IUser;
  const [foto, setFoto] = useState<string | undefined | null>(user.foto);
  const [nome, setNome] = useState(user.nome);
  const [erros, setErros] = useState<IErrors>({});
  const [showErrors, setShowErrors] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [showLoadingApagar, setShowLoadingApagar] = useState(false);

  useEffect(() => {
    console.log("user:", user);
    console.log("foto inicial:", foto);
    console.log("nome inicial:", nome);
  }, []);

  const salvar = async () => {
    if (Object.keys(erros).length > 0) {
      setShowErrors(true);
      return;
    }

    const body = { nome, foto };
    console.log("Dados a serem salvos:", body);

    if (body.foto && isBase64Image(body.foto)) {
      delete body.foto;
      console.log("Foto removida do body, pois está em base64");
    }

    try {
      setShowLoading(true);

      const usersCollection = database.get<Usuario>("usuario");
      console.log("Coleção de usuários obtida:", usersCollection);

      await database.write(async () => {
        const userToUpdate = await usersCollection
          .query(Q.where("id", user.id.toString()))
          .fetch();

        console.log("Usuário encontrado para atualizar:", userToUpdate);

        if (userToUpdate.length > 0) {
          console.log("Estado antes da atualização:", userToUpdate[0]);

          await userToUpdate[0].update((user) => {
            user.nome = nome;
            if (foto) user.foto = foto;
          });

          const updatedUsers = await usersCollection
            .query(Q.where("id", user.id.toString()))
            .fetch();
          console.log("Usuário atualizado no banco de dados:", updatedUsers);

          const updatedUser = {
            ...user,
            nome,
            foto,
          };

          console.log("Usuário atualizado:", updatedUser);

          await AsyncStorage.setItem("usuario", JSON.stringify(updatedUser));
        }
      });

      Toast.show({
        type: "success",
        text1: "Sucesso!",
        text2: "Perfil atualizado com sucesso.",
      });

      router.push("/private/tabs/perfil");
    } catch (err) {
      const error = err as { message: string };
      console.error("Erro ao salvar perfil:", error.message);
      Toast.show({
        type: "error",
        text1: "Erro!",
        text2: error.message,
      });
    } finally {
      setShowLoading(false);
    }
  };

  const isBase64Image = (str: string): boolean => {
    const expression = `data:image\/([a-zA-Z]*);base64,([^\"]*)`;
    const regex = new RegExp(expression);
    return regex.test(str);
  };

  const apagarConta = async () => {
    try {
      setShowLoadingApagar(true);

      const usersCollection = database.get<Usuario>("usuario");
      console.log("Coleção de usuários obtida para deletar:", usersCollection);

      await database.write(async () => {
        const userToDelete = await usersCollection
          .query(Q.where("id", user.id.toString()))
          .fetch();

        console.log("Usuário encontrado para deletar:", userToDelete);

        if (userToDelete.length > 0) {
          await userToDelete[0].destroyPermanently();
          console.log("Usuário deletado com sucesso:", userToDelete[0]);
        }
      });

      await AsyncStorage.removeItem("usuario");
      console.log("Usuário removido do AsyncStorage");

      Toast.show({
        type: "success",
        text1: "Sucesso!",
        text2: "Conta apagada com sucesso.",
      });

      router.replace("/");
    } catch (err) {
      const error = err as { message: string };
      console.error("Erro ao apagar conta:", error.message);
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
    console.log("Modal de confirmação visível:", modalVisible);
  };

  const closeModal = () => {
    setModalVisible(false);
    console.log("Modal fechado");
  };

  useEffect(() => handleErrors(), [nome]);

  const handleErrors = () => {
    const erros: IErrors = {};

    if (!nome) {
      erros.nome = "Campo obrigatório!";
    } else if (nome.length < 5) {
      erros.nome = "O nome completo deve ter pelo menos 5 caractéres.";
    } else if (nome.length > 60) {
      erros.nome = "O nome completo deve ter no máximo 60 caractéres.";
    }

    setErros(erros);
    console.log("Erros de validação:", erros);
  };

  return (
    <View>
      <BackButton route="/private/tabs/perfil" color="#000" />

      {foto && <UploadImage setFoto={setFoto} uri={foto} />}
      {!foto && <UploadImage setFoto={setFoto} />}

      <View style={styles.formControl}>
        <View style={styles.field}>
          <Icon style={styles.iconInput} name="account-outline" size={20} />
          <TextInput
            onChangeText={setNome}
            value={nome}
            placeholder="Nome completo"
            style={styles.textInput}
          />
        </View>
        <ErrorMessage show={showErrors} text={erros.nome} />
      </View>

      <View style={(styles.formControl, styles.disabled)}>
        <View style={styles.field}>
          <Icon style={styles.iconInput} name="email-outline" size={20} />
          <Text style={styles.textInput}>{user.email}</Text>
        </View>
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
          <Text style={styles.apagar}>Apagar Conta</Text>
        )}
      </Pressable>

      <ModalConfirmation
        visible={modalVisible}
        callbackFn={apagarConta}
        closeModal={closeModal}
        message="Prosseguir com a exclusão da conta?"
        messageButton="Apagar"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  apagar: {
    color: "#FF7F7F",
    alignSelf: "center",
    fontSize: 18,
    fontWeight: "600",
  },
  disabled: {
    opacity: 0.5,
  },
  formControl: {
    width: 320,
    flexDirection: "column",
    marginTop: 10,
    alignSelf: "center",
    alignItems: "flex-start",
  },
  field: {
    width: 320,
    height: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#AFB1B6",
    flexDirection: "row",
    paddingBottom: 5,
    marginBottom: 5,
    alignSelf: "center",
  },
  iconInput: {
    width: "10%",
  },
  textInput: {
    color: "#05375a",
    width: "90%",
    paddingLeft: 10,
    fontSize: 17,
  },
  linkButton: {
    alignItems: "center",
    marginTop: 60,
    marginBottom: 60,
  },
});
