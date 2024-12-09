import React, { useState } from "react";
import { forgotPassword } from "../../services/user.service";
import { Alert, Text, View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import axios from 'axios';
//import BackButton from "/components/BackButton.tsx"; Não consigo achar esse caminho, preciso fazer rodar... (é o botão q volta pra outra pag)

export default function EsqueciSenha() {
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const API_PORT = process.env.EXPO_PUBLIC_API_USUARIO_PORT;
  const BASE_URL = `${API_URL}:${API_PORT}/api/usuario/esqueci-senha`;
  const [email, setEmail] = useState("");

  const handleRecuperarSenha = async () => {
    if (!email) {
      Alert.alert("Erro", "Por favor, insira um email válido.");
      return;
    }
    try {
      const response = await forgotPassword(email);
      console.log("E-mail de recuperação enviado:", response);
    } catch (error) {
      console.error("Erro ao solicitar recuperação de senha:", error.message);
    }
    };
  return (
    
    <View style={styles.container}>
      {/* Logo deveria estar aqui, mas não consegui encaixá-la */}

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

      <TouchableOpacity style={styles.button} onPress={handleRecuperarSenha}>
        <Text style={styles.buttonText}>Recuperar senha</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 16,
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
});
