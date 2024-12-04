import React, { useState } from "react";
import { Image, Text, View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
//import BackButton from "/components/BackButton.tsx"; Não consigo achar esse caminho, preciso fazer rodar... (é o botão q volta pra outra pag)

export default function EsqueciSenha() {
  const [email, setEmail] = useState("");

  return (
    
    <View style={styles.container}>
      {/* Logo */}

      {/* Título */}
      <Text style={styles.title}>Esqueceu sua senha? </Text>
      <Text style={styles.subtitle}>Calma, a GERO te ajuda!! </Text>

      {/* Campo de Email */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          placeholderTextColor="black" // Garante que o placeholder tenha cor definida
        />
      </View>

      {/* Botão de Recuperar Senha */}
      <TouchableOpacity style={styles.button}>
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
