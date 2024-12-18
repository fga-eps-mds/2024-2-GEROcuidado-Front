import React, { useState } from "react";
import { resetPassword } from "../../services/user.service"; // Importando o serviço para redefinir a senha
import { Alert, Text, View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";

// Função de serviço para redefinir a senha
export const resetPassword = async (email, codigo, novaSenha) => {
  try {
    const response = await axios.post('/api/reset-password', { email, codigo, novaSenha });
    return response.data; // Retorna a resposta da API
  } catch (error) {
    console.error('Erro ao redefinir senha:', error);
    throw error;
  }
};

export default function RedefinirSenha() {
  const [email, setEmail] = useState("");         // Para capturar o email do usuário
  const [codigo, setCodigo] = useState("");       // Para capturar o código de recuperação
  const [newPassword, setNewPassword] = useState(""); // Nova senha
  const [confirmPassword, setConfirmPassword] = useState(""); // Confirmar nova senha

  // Função para tratar a redefinição de senha
  const handleRedefinirSenha = async () => {
    if (!email || !codigo || !newPassword || !confirmPassword) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }
    try {
      const response = await resetPassword(email, codigo, newPassword); // Chama o serviço para redefinir a senha
      if (response.success) {
        Alert.alert("Sucesso", "Senha redefinida com sucesso!");
        router.push("/public/login"); // Redireciona para a página de login
      } else {
        Alert.alert("Erro", response.message || "Erro ao redefinir senha.");
      }
    } catch (error) {
      console.error("Erro ao redefinir a senha:", error);
      Alert.alert("Erro", "Ocorreu um problema ao redefinir a senha.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Redefinir Senha</Text>

      {/* Input para o email */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      {/* Input para o código de recuperação */}
      <TextInput
        style={styles.input}
        placeholder="Código de recuperação"
        value={codigo}
        onChangeText={setCodigo}
      />

      {/* Input para a nova senha */}
      <TextInput
        style={styles.input}
        placeholder="Nova senha"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />

      {/* Input para confirmar a nova senha */}
      <TextInput
        style={styles.input}
        placeholder="Confirme a nova senha"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {/* Botão para redefinir a senha */}
      <TouchableOpacity style={styles.button} onPress={handleRedefinirSenha}>
        <Text style={styles.buttonText}>Redefinir</Text>
      </TouchableOpacity>
    </View>
  );
}

// Estilos reutilizados
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "300",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    width: "90%",
    maxWidth: 400,
    paddingVertical: 12,
    paddingHorizontal: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    marginBottom: 15,
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
