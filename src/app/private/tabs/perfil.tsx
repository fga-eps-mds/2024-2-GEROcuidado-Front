import React, { useEffect, useState } from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { AntDesign } from "@expo/vector-icons";
import { Text, View, StyleSheet, Image, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IUser } from "../../interfaces/user.interface";
import { router } from "expo-router";
import NaoAutenticado from "../../components/NaoAutenticado";
import { hasFoto } from "../../shared/helpers/foto.helper";
import { getFoto } from "../../shared/helpers/photo.helper";

export default function Perfil() {
  const [user, setUser] = useState<IUser | undefined>(undefined);
  const [idUsuario, setIdUsuario] = useState<number | null>(null);

  const logout = () => {
    AsyncStorage.clear().then(() => router.replace("/"));
  };

  const navigateEditarPerfil = () => {
    router.push({ pathname: "/private/pages/editarPerfil", params: user });
  };

  const navigateIdosos = () => {
    router.push({ pathname: "/private/pages/listarIdosos", params: user });
  };

  useEffect(() => getIdUsuario());

  const handleUser = () => {
    AsyncStorage.getItem("usuario").then((response) => {
      const usuario = JSON.parse(response as string);
      setUser(usuario);
    });
  };

  const getIdUsuario = () => {
    AsyncStorage.getItem("usuario").then((response) => {
      const usuario = JSON.parse(response as string) as IUser;
      setIdUsuario(usuario?.id);
    });
  };

  useEffect(() => handleUser(), []);

  return !idUsuario ? (
    <NaoAutenticado />
  ) : (
    <View>
      <View style={styles.header}>
        {getFoto(user?.foto)}
        <Text style={styles.nomeUsuario}>
          Olá, <Text style={styles.negrito}>{user?.nome}</Text>!
        </Text>
      </View>

      <View style={styles.options}>
        <Pressable
          testID="navigateBtn"
          style={styles.option}
          onPress={navigateEditarPerfil}
        >
          <AntDesign name="setting" size={45} color="#2f2f2f" />

          <View style={styles.optionText}>
            <Text style={styles.optionTextTitle}>Perfil</Text>
            <Text style={styles.optionTextSubTitle}>Edite seu perfil</Text>
          </View>
        </Pressable>

        <Pressable style={styles.option} onPress={navigateIdosos}>
          <Icon name="human-cane" size={45} color="#2f2f2f" />

          <View style={styles.optionText}>
            <Text style={styles.optionTextTitle}>Idosos</Text>
            <Text style={styles.optionTextSubTitle}>Gerencie seus idosos</Text>
          </View>
        </Pressable>

        <Pressable style={styles.option} onPress={logout} testID="logoutBtn">
          <Icon name="logout-variant" size={45} color="#2f2f2f" />

          <View style={styles.optionText}>
            <Text style={styles.optionTextTitle}>Logout</Text>
            <Text style={styles.optionTextSubTitle}>Sair da sua conta</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#2CCDB5",
    width: "100%",
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  fotoPerfil: {
    width: 60,
    aspectRatio: 1,
    borderRadius: 100,
  },
  semFoto: { position: "relative", backgroundColor: "#EFEFF0" },
  semFotoIcon: {
    position: "absolute",
    right: "38%",
    bottom: "38%",
    opacity: 0.4,
    margin: "auto",
    alignSelf: "center",
    zIndex: 1,
  },
  nomeUsuario: {
    color: "#FFFFFF",
    fontSize: 16,
    marginLeft: 20,
    maxWidth: "75%",
  },
  negrito: {
    fontWeight: "bold",
  },
  options: {
    flexDirection: "column",
    width: "100%",
    height: "100%",
    alignItems: "center",
  },
  option: {
    flexDirection: "row",
    width: "90%",
    marginTop: 25,
    text: "#000",
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
  },
  optionText: {
    flexDirection: "column",
    marginVertical: "auto",
    marginLeft: 15,
  },
  optionTextTitle: {
    color: "#000",
    fontWeight: "700",
    fontSize: 20,
  },
  optionTextSubTitle: {
    color: "#989898",
    fontWeight: "500",
  },
});
