import React, { useState } from "react";
import { forgotPassword } from "../../services/user.service";
import { Image, Alert, Text, View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { ScrollView } from "react-native";
import BackButton from "../../components/BackButton"
import RememberButton from "../../components/rememberButton";

export default function EsqueciSenha() {
  const [email, setEmail] = useState("");
  const [showLoading, setShowLoading] = useState(false);

  const handleRecuperarSenha = async () => {
    if (!email) {
      Alert.alert("Erro", "Por favor, insira um email válido.");
      return;
    }
    try {
      const response = await forgotPassword(email);
      console.log("E-mail de recuperação enviado:", response);
      Alert.alert("Sucesso", "E-mail de recuperação enviado com sucesso!");
    } catch (error) {
      console.error("Erro ao solicitar recuperação de senha:", error.message);
    }
    };

  return (

    
    <View style={styles.container}>
    <BackButton color="#000" route="/" />

      <View style={styles.imagem}>
        <Image
          source={require("../../../../assets/logo.png")}
          style={{ width: 220, height: 200 }}
        />
      </View>

      <Text style={styles.title}>Esqueceu sua senha? </Text>
      <Text style={styles.subtitle}>Calma, a GERO te ajuda!! </Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          placeholderTextColor="black" 
        />
      </View>

      <View style={styles.EsqueciButton}>
                <RememberButton
                  title="Recuperar senha"
                  showLoading={showLoading}
                  onPress={handleRecuperarSenha}
                />
              </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 20,
    },
  logo: {
    width: 280,
    height: 90,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "300",
    textAlign: "center",
    marginBottom: 19,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "300",
    textAlign: "center",
    marginBottom: 10,
  },
  inputContainer: {
    width: "90%",
    maxWidth: 400,
    borderBottomWidth: 1,
    borderBottomColor: "#CCC",
    marginBottom: 20,
  },
  input: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    color: "#333",
    width: "100%",
  },
  button: {
    width: "90%",
    maxWidth: 200,
    backgroundColor: "#2CCDB5",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  imagem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  EsqueciButton: {
    marginTop: 35,
    alignItems: "center",
    justifyContent: "center", // Adicionado para centralizar verticalmente
    width: "100%",
    flex: 1,
  },
});
