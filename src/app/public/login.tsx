import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import { Image, StyleSheet, Text, View, TextInput, Button } from "react-native";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import BackButton from "../components/BackButton";
import CustomButton from "../components/CustomButton";
import ErrorMessage from "../components/ErrorMessage";
import { getUserById, loginUser } from "../services/user.service";
import JWT from "expo-jwt";
import { IUser } from "../interfaces/user.interface";
import { ScrollView } from "react-native";
import database from "../db";
import { Collection, Q } from "@nozbe/watermelondb";
import { syncDatabaseWithServer } from "../services/watermelon.service";
import Usuario from "../model/Usuario";
import ForgetButton from "../components/ForgetButton";

interface IErrors {
  email?: string;
  senha?: string;
}

export default function Login() {
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const API_PORT = process.env.EXPO_PUBLIC_API_USUARIO_PORT;
  const BASE_URL = `${API_URL}:${API_PORT}/api/usuario`;
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [escondeSenha, setEscondeSenha] = useState(true);
  const [erros, setErros] = useState<IErrors>({});
  const [showErrors, setShowErrors] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  
  const login = async () => {
    if (Object.keys(erros).length > 0) {
      setShowErrors(true);
      return;
    }

    const body = { email: email.toLowerCase().trim(), senha };

    try {
      setShowLoading(true);
      console.log("Iniciando o login...");
      console.log(BASE_URL);
      const response = await loginUser(body);
      console.log("Resposta do login:", response);

      const token = response.data;
      console.log("Token recebido:", token);

      await handleUser(token);
      router.push("/private/pages/listarIdosos");
    } catch (err) {
      console.error("Erro durante o login:", err);
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

  const handleErrors = () => {
    const erros: IErrors = {};
    let hasErrors = false;

    // Verifica o campo de email
    if (!email) {
      erros.email = "Campo Obrigatório!";
      hasErrors = true;
      Toast.show({
        type: 'error',
        text1: 'Erro!',
        text2: 'O campo de email é obrigatório!',
      });
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      erros.email = "Email inválido!";
      hasErrors = true;
      Toast.show({
        type: 'error',
        text1: 'Erro!',
        text2: 'Formato de email inválido!',
      });
    }

    // Verifica o campo de senha
    if (!senha) {
      erros.senha = "Campo Obrigatório!";
      hasErrors = true;
      Toast.show({
        type: 'error',
        text1: 'Erro!',
        text2: 'O campo de senha é obrigatório!',
      });
    }

    setErros(erros);

    // Retorna se há erros para interromper a submissão
    return hasErrors;
  };

  useEffect(() => {
    handleErrors();
  }, [email, senha]);


  const handleUser = async (token: string) => {
    try {
      console.log("Processando o token para obter o usuário...");
      AsyncStorage.setItem("token", token);
      const key = process.env.EXPO_PUBLIC_JWT_TOKEN_SECRET as string;

      let userInfo: IUser | null = null;

      try {
        // Decodifica o token JWT
        userInfo = JWT.decode(token, key, { timeSkew: 30 }) as unknown as IUser;
        console.log("Token decodificado:", userInfo);
      } catch (decodeError) {
        console.error("Erro ao decodificar o token:", decodeError);
        // Trate o erro conforme necessário, talvez exiba uma mensagem para o usuário
      }

      if (userInfo) {
        await getUser(userInfo.id, token);
      }
    } catch (err) {
      console.error("Erro ao processar o token:", err);
      throw err;
    }
  };

  const getUser = async (id: number, token: string) => {
    try {
      // Aqui acontece a sincronização com o backend
      await syncDatabaseWithServer();

      // console.log("Buscando usuário no banco...");
      const usersCollection = database.get('usuario') as Collection<Usuario>;

      try {
        const queryResult = await usersCollection.query(
          Q.where('id', id.toString())
        ).fetch();

        // console.log("Resultado da busca no banco:", queryResult);

        const user = queryResult.at(0);

        // if (user instanceof Usuario) {
        //   console.log("Settando usuario a partir do objeto do banco!");

        //   const userTransformed = {
        //     id: user.id.toString(),
        //     email: user.email,
        //     senha: user.senha,
        //     foto: user.foto,
        //     admin: user.admin,
        //     nome: user.nome,
        //     data_nascimento: user.data_nascimento,
        //     descricao: user.descricao,
        //   }

        //   console.log("userTransformed", userTransformed);
        //   await AsyncStorage.setItem("usuario", JSON.stringify(
        //     userTransformed
        //   ));

        const response = await getUserById(id, token);

        const responseUser = response.data as IUser & {
          foto: { data: Uint8Array };
        };

        await AsyncStorage.setItem("usuario", JSON.stringify(
          responseUser
        ));

        // TODO: Remove this in the future
        // console.log("Usuario buscado diretamente da API...");
        // console.log(await usersCollection.query().fetch());

        await AsyncStorage.setItem("usuario", JSON.stringify(responseUser));

      } catch (err) {
        console.log("Erro ao buscar usuário no banco local:", err);
      }


    } catch (err) {
      console.error("Erro ao obter o usuário:", err);
      const error = err as { message: string };
      Toast.show({
        type: "error",
        text1: "Erro!",
        text2: error.message,
      });
    }
  };

  return (
    <View>
      <BackButton color="#000" route="/" />

      <ScrollView>
        <View style={styles.imagem}>
          <Image
            source={require("../../../assets/logo2.png")}
            style={{ width: 280, height: 90 }}
          />
        </View>

        <Text style={styles.titulo}>Bem Vindo de volta!</Text>

        <View style={styles.formControl}>
          <View style={styles.field}>
            <Icon style={styles.iconInput} name="email-outline" size={20} />
            <TextInput
              onChangeText={setEmail}
              value={email}
              placeholder="Email"
              style={styles.textInput}
            />
          </View>
          <ErrorMessage show={showErrors} text={erros.email} />
        </View>

        <View style={styles.formControl}>
          <View style={styles.field}>
            <Icon style={styles.iconInput} name="lock-outline" size={20} />
            <TextInput
              onChangeText={setSenha}
              value={senha}
              placeholder="Senha"
              secureTextEntry={escondeSenha}
              style={styles.passwordInput}
            />

            <Icon
              testID="escondeSenhaIcon"
              onPress={() => setEscondeSenha(!escondeSenha)}
              style={styles.passwordIcon}
              name={escondeSenha ? "eye-outline" : "eye-off-outline"}
              size={20}
            />

          </View>
          <ErrorMessage show={showErrors} text={erros.senha} />
        </View>

        <View style={styles.linkButton}>
          <CustomButton
            title="Entrar"
            callbackFn={login}
            showLoading={showLoading}
          />
        </View>

        <View style={styles.EsqueciButton}>
          <ForgetButton
            title="Esqueci minha senha"
            showLoading={showLoading}
          />
        </View>
      </ScrollView>
    </View>
  );  
}

const styles = StyleSheet.create({
  voltar: {
    marginTop: 5,
  },
  formControl: {
    flexDirection: "column",
    width: 320,
    alignItems: "flex-start",
    alignSelf: "center",
    marginTop: 10,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titulo: {
    fontSize: 28,
    fontWeight: "300",
    textAlign: "center",
    marginBottom: 60,
    marginTop: 35,
  },
  imagem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  button: {
    width: "80%",
    maxWidth: 350,
    paddingVertical: 16,
    paddingHorizontal: 26,
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "#2CCDB5",
    textAlign: "center",
  },
  field: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#AFB1B6",
    paddingBottom: 5,
    width: 320,
    height: 30,
    alignSelf: "center",
  },
  iconInput: {
    width: "10%",
  },
  passwordInput: {
    paddingLeft: 10,
    color: "#05375a",
    width: "80%",
    fontSize: 17,
  },
  passwordIcon: {
    width: "10%",
  },
  textInput: {
    width: "90%",
    paddingLeft: 10,
    color: "#05375a",
    fontSize: 17,
  },
  arrow: {
    alignSelf: "flex-start",
  },
  linkButton: {
    marginTop: 90,
    alignItems: "center",
  },
  foto: {
    backgroundColor: "#EFEFF0",
    borderRadius: 25,
    alignItems: "center",
    display: "flex",
    width: 167,
    height: 174,
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "#AFB1B6",
    marginBottom: 38,
  },
  eye: {
    marginLeft: 100,
  },
  EsqueciButton: {
    marginTop: 35,
    alignItems: "center",
    justifyContent: "center", // Adicionado para centralizar verticalmente
    width: "100%",
    flex: 1,
  }
});