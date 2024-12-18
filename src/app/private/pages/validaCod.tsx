import React, { useState } from "react";
import { validateToken } from "../../services/user.service"; // Importando o serviço de validação do token
import { Alert, Text, View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";

// Função de serviço para validar o token (do código enviado por e-mail)
export const validateToken = async (token) => {
  try {
    const response = await axios.post('/api/validate-code', { codigo: token }); // Envia o código para validação no backend
    return response.data;  // Retorna a resposta da API
  } catch (error) {
    console.error('Erro ao validar token:', error);
    throw error;
  }
};

export default function ValidarToken() {
  const [token, setToken] = useState(""); // Estado para armazenar o token recebido do usuário

  // Função para tratar a validação do token
  const handleValidarToken = async () => {
    if (!token) {
      Alert.alert("Erro", "Por favor, insira o código recebido por e-mail.");
      return;
    }
    try {
      const response = await validateToken(token); // Chamando a API para validar o token
      if (response.success) {
        Alert.alert("Sucesso", "Token validado com sucesso!");
        router.push("/private/redefinirSenha"); // Redireciona para a tela de redefinição de senha
      } else {
        Alert.alert("Erro", response.message || "Token inválido.");
      }
    } catch (error) {
      console.error("Erro ao validar o token:", error);
      Alert.alert("Erro", "Ocorreu um problema ao validar o token.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Validar Código</Text>

      {/* Campo de entrada para o código de validação */}
      <TextInput
        style={styles.input}
        placeholder="Insira o código recebido"
        value={token}
        onChangeText={setToken} // Atualiza o estado do token com o texto inserido
      />

      {/* Botão para validar o código */}
      <TouchableOpacity style={styles.button} onPress={handleValidarToken}>
        <Text style={styles.buttonText}>Validar</Text>
      </TouchableOpacity>
    </View>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#f5f5f5", // Cor de fundo da tela
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#007BFF", // Cor do botão
    padding: 12,
    borderRadius: 8,
    width: "100%",
    alignItems: "center", // Centraliza o texto dentro do botão
  },
  buttonText: {
    color: "#fff", // Cor do texto no botão
    fontWeight: "bold",
  },
});
