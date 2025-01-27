import React, { useState } from "react";
import { resetPassword } from "../../services/user.service";
import { Image, Alert, Text, View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { ScrollView } from "react-native";
import BackButton from "../../components/BackButton"

export default function ResetSenha() {
  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [showLoading, setShowLoading] = useState(false);

  const handleResetarSenha = async () => {
    if (!email) {
      Alert.alert("Erro", "Por favor, insira um email válido.");
      return;
    }
    if (!codigo) {
      Alert.alert("Erro", "Por favor, insira um token válido.");
      return;
    }
    if (!novaSenha) {
      Alert.alert("Erro", "Por favor, insira uma senha válida.");
      return;
    }
  
    try {
      setShowLoading(true);
      const response = await resetPassword(email, codigo, novaSenha);
      console.log("Senha alterada com sucesso!", response);
      Alert.alert("Sucesso", "Senha alterada com sucesso!");
      router.push("/public/login");
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Erro ao alterar senha.");
      console.error("Erro ao alterar senha", error);
    } finally {
      setShowLoading(false);
    }
    };

  return (

    
    <View style={styles.container}>
    <BackButton color="#000" route="/" />

      <View style={styles.imagem}>
        <Image
          source={require("../../../../assets/logo.png")}
          style={{ width: 220, height: 90 }}
        />
      </View>

      <Text style={styles.title}>Altere sua senha:</Text>

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

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Token"
          value={codigo}
          onChangeText={setCodigo}
          keyboardType="numeric"
          placeholderTextColor="black" 
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nova Senha"
          value={novaSenha}
          onChangeText={setNovaSenha}
          keyboardType="default"
          placeholderTextColor="black" 
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleResetarSenha}>
        <Text style={styles.buttonText}>Alterar Senha</Text>
      </TouchableOpacity>
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
});
