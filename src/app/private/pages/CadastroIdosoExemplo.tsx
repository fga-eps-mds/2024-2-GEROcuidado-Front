import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View, Button, ToastAndroid } from "react-native";
import { ScrollView } from "react-native";
import database from "../../db";
import Idoso from "../../model/Idoso";
import { ETipoSanguineo } from "../../interfaces/idoso.interface";
import { Collection } from "@nozbe/watermelondb";
import { useRouter } from "expo-router";
import { IUser } from "../../interfaces/user.interface";


export default function InsertIdoso() {
  const [idUsuario, setIdUsuario] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getIdUsuario = async () => {
      try {
        const response = await AsyncStorage.getItem("usuario");
        if (response) {
          const usuario = JSON.parse(response) as IUser;
          setIdUsuario(usuario.id);
          console.log("Usuário logado:", usuario); 
        } else {
          console.log("Usuário não encontrado no AsyncStorage.");
        }
      } catch (error) {
        console.error("Erro ao obter usuário:", error);
      }
    };

    getIdUsuario();
  }, []);

  const handleInsertIdoso = async () => {
    if (!idUsuario) {
      ToastAndroid.show("Usuário não encontrado.", ToastAndroid.SHORT);
      return;
    }

    try {
      await database.write(async () => {
        const idosoCollection = database.get('idoso') as Collection<Idoso>;

        await idosoCollection.create((idoso) => {
          idoso.nome = 'João da Silva'; 
          idoso.dataNascimento = new Date('1945-07-15').toISOString(); 
          idoso.telefoneResponsavel = '987654321'; 
          idoso.descricao = 'Idoso exemplo para testes.'; 
          idoso.tipoSanguineo = ETipoSanguineo.O_POSITIVO; 
          idoso.userId = idUsuario.toString(); 
        });
      });

      ToastAndroid.show("Idoso inserido com sucesso!", ToastAndroid.SHORT);
      router.push("/private/pages/listarIdosos"); 
    } catch (error) {
      console.error("Erro ao inserir o idoso:", error);
      ToastAndroid.show("Erro ao inserir o idoso.", ToastAndroid.SHORT);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.imagem}>
          <Image
            source={require("../../../../assets/logo2.png")}
            style={{ width: 280, height: 90 }}
          />
        </View>
        <Text style={styles.titulo}>Inserir Idoso de Exemplo</Text>
        <Button title="Salvar Idoso Exemplo" onPress={handleInsertIdoso} color="#2CCDB5" />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imagem: {
    marginBottom: 20,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "300",
    textAlign: "center",
    marginBottom: 20,
  },
});