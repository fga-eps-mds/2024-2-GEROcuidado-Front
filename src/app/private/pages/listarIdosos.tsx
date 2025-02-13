import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
<<<<<<< Updated upstream
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
=======
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
>>>>>>> Stashed changes
} from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import BackButton from "../../components/BackButton";
import CardIdoso from "../../components/CardIdoso";
import { IIdoso, IOrder } from "../../interfaces/idoso.interface";
import { IUser } from "../../interfaces/user.interface";
<<<<<<< Updated upstream
import { getAllIdoso } from "../../services/idoso.service";

=======
import database from "../../db";
import Idoso from "../../model/Idoso";
import { Collection, Q } from "@nozbe/watermelondb";
import { getImageUri } from "../../shared/helpers/image.helper";
import NetInfo from '@react-native-community/netinfo'; // Importando NetInfo para verificar conexão
import { syncDatabaseWithServer } from "../../services/watermelon.service";
>>>>>>> Stashed changes

interface IOrderOption {
  key: IOrder;
  value: string;
}

const data: IOrderOption[] = [
  {
    key: {
      column: "nome",
      dir: "ASC",
    },
    value: "A-Z",
  },
  {
    key: {
      column: "nome",
      dir: "DESC",
    },
    value: "Z-A",
  },
  {
    key: {
      column: "dataNascimento",
      dir: "DESC",
    },
    value: "Mais atual",
  },
  {
    key: {
      column: "dataNascimento",
      dir: "ASC",
    },
    value: "Mais antigo",
  },
];

<<<<<<< Updated upstream
const API_URL = process.env.EXPO_PUBLIC_API_URL;
const API_PORT = process.env.EXPO_PUBLIC_API_USUARIO_PORT;
const BASE_URL = `${API_URL}:${API_PORT}/api/saude/idoso`;

=======
>>>>>>> Stashed changes
export default function ListarIdosos() {
  const [idosos, setIdosos] = useState<IIdoso[]>([]);
  const [loading, setLoading] = useState(true);
  const [orderOption, setOrderOption] = useState<IOrder>(data[0].key);
  const [idUsuario, setIdUsuario] = useState<number | null>(null);
<<<<<<< Updated upstream
  const [token, setToken] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const getIdUsuario = async () => {
      try {
        const response = await AsyncStorage.getItem("usuario");
        if (response) {
          const usuario = JSON.parse(response) as IUser;
          setIdUsuario(usuario.id);
          // console.log("Usuário logado:", usuario);
        }

        const token = await AsyncStorage.getItem("token");
        if (token) {
          setToken(token);
        } else {
          console.log("Token não encontrado no AsyncStorage.");
        }
      } catch (error) {
        console.error("Erro ao obter usuário:", error);
      }
    };
=======
>>>>>>> Stashed changes

  const router = useRouter();

<<<<<<< Updated upstream
    getIdUsuario();
  }, []);

  const getIdosos = async (idUsuario: number) => {
    const idosos = await getAllIdoso(idUsuario, { column: 'nome', dir: 'ASC' })

    if (!idosos) return

    setLoading(false)
    setIdosos(idosos as unknown as IIdoso[])

  }

  const navigateCadastrar = () => {
    router.push("/private/pages/cadastrarIdoso");
  };
=======
  // Função para obter o usuário logado
  useEffect(() => {
    const getIdUsuario = async () => {
      try {
        const response = await AsyncStorage.getItem("usuario");
        if (response) {
          const usuario = JSON.parse(response) as IUser;
          setIdUsuario(usuario.id);
          console.log("Usuário logado:", usuario);
        }
      } catch (error) {
        console.error("Erro ao obter usuário:", error);
      }
    };
>>>>>>> Stashed changes

    getIdUsuario();
  }, []);

<<<<<<< Updated upstream
  useEffect(() => {
    if (idUsuario) {
      getIdosos(idUsuario);
    }
  }, [orderOption, idUsuario]);
=======
  // Função para carregar os idosos do banco local
  const getIdosos = async () => {
    if (!idUsuario) return;
>>>>>>> Stashed changes

    setLoading(true);

<<<<<<< Updated upstream
  return (
    <View style={styles.screen}>
      <View style={styles.backButton}>
        <BackButton route="/private/tabs/perfil" color="#000" />
      </View>
=======
    try {
      const idosoCollection = database.get('idoso') as Collection<Idoso>;
>>>>>>> Stashed changes

      // Usando a mesma lógica de consulta para pegar os idosos não sincronizados
      const idosoRecords = await idosoCollection.query(Q.where('isSynced', Q.eq(false))).fetch();

<<<<<<< Updated upstream
      <Text style={styles.header}>De quem está cuidando agora?</Text>
=======
      if (idosoRecords.length === 0) {
        Toast.show({
          type: "info",
          text1: "Nenhum idoso encontrado.",
        });
      }
>>>>>>> Stashed changes

      console.log("Idosos não sincronizados:", idosoRecords);

<<<<<<< Updated upstream
      <View style={styles.list}>
        <SelectList
          data={data}
          setSelected={(item: IOrder) => {
            setOrderOption(item);
          }}
          search={false}
          boxStyles={styles.boxDropDown}
          inputStyles={styles.boxInputDropDown}
          dropdownStyles={styles.dropDown}
          placeholder="selecione"
        />
      </View>
=======
      const mappedIdoso = idosoRecords.map((item) => ({
        ...item._raw,
        foto: getImageUri(item.foto), // Convertendo a foto para o URI
      }));
>>>>>>> Stashed changes

      setIdosos(mappedIdoso);
    } catch (err) {
      const error = err as { message: string };
      Toast.show({
        type: "error",
        text1: "Erro!",
        text2: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

<<<<<<< Updated upstream
      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#2CCDB5" />
        </View>
      )}
=======
  const navigateCadastrar = () => {
    router.push("/private/pages/cadastrarIdoso");
  };
>>>>>>> Stashed changes

  // UseEffect para verificar a conexão e carregar dados
  useEffect(() => {
    if (idUsuario) {
      NetInfo.fetch().then(state => {
        if (state.isConnected) {
          console.log('Conectado à internet');
          syncIdosoWithServer(); // Sincroniza com o servidor se houver conexão
        } else {
          console.log('Sem conexão');
          getIdosos(); // Carrega dados locais se não houver conexão
        }
      });
    }
  }, [orderOption, idUsuario]);

<<<<<<< Updated upstream
=======
  // Função para sincronizar dados com o servidor
  const syncIdosoWithServer = async () => {
    try {
      setLoading(true);
      const idosoCollection = database.get('idoso') as Collection<Idoso>;
      const idosoRecords = await idosoCollection.query(Q.where('isSynced', Q.eq(false))).fetch(); // Filtra os dados não sincronizados

      // Envia os dados para o backend
      await syncDatabaseWithServer(); // Chama a função para sincronizar o banco de dados com o servidor

      // Atualiza os idosos não sincronizados após a sincronização
      const updatedIdosos = await idosoCollection.query(Q.where('isSynced', Q.eq(false))).fetch();
      console.log("Idosos não sincronizados após sincronização:", updatedIdosos);

      // Marca os dados como sincronizados no banco local
      await database.write(async () => {
        for (let record of idosoRecords) {
          await record.update(item => {
            item.isSynced = true; // Marca o registro como sincronizado
          });
        }
      });

      Toast.show({
        type: 'success',
        text1: 'Sincronização concluída',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao sincronizar',
        text2: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.backButton}>
        <BackButton route="/private/tabs/perfil" color="#000" />
      </View>

      <Text style={styles.header}>De quem está cuidando agora?</Text>

      <View style={styles.list}>
        <SelectList
          data={data}
          setSelected={(item: IOrder) => {
            setOrderOption(item);
          }}
          search={false}
          boxStyles={styles.boxDropDown}
          inputStyles={styles.boxInputDropDown}
          dropdownStyles={styles.dropDown}
          placeholder="selecione"
        />
      </View>

      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#2CCDB5" />
        </View>
      )}

>>>>>>> Stashed changes
      {!loading && (
        <View style={styles.cardIdoso}>
          <FlatList
            showsVerticalScrollIndicator={false}
            numColumns={2}
            data={idosos}
            renderItem={({ item }) => <CardIdoso item={item} />}
          />
        </View>
      )}
<<<<<<< Updated upstream
=======
      
>>>>>>> Stashed changes
      <View style={styles.cadastroContainer}>
        <Pressable style={styles.cadastroBtn} onPress={navigateCadastrar}>
          <AntDesign name="pluscircleo" size={54} />
          <Text style={styles.cadastroText}>Cadastrar um idoso</Text>
        </Pressable>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#FFFFFF",
    height: "100%",
  },
  backButton: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
  },
  header: {
    alignSelf: "center",
    fontSize: 25,
    fontWeight: "bold",
    color: "#3d3d3d",
    marginBottom: 20,
    textAlign: "center",
  },
  cadastroContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: "white",
    paddingTop: 10,
    paddingBottom: 10,
  },
  cadastroBtn: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  cadastroText: {
    marginTop: 8,
    fontWeight: "500",
  },
  cardIdoso: {
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 250,
  },
  idosoSelecionado: {
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 32,
    borderWidth: 3,
    borderColor: "#2CCDB5",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    borderRadius: 5,
    width: 110,
    shadowColor: "#333",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  editButton: {
    backgroundColor: "#2CCDB5",
  },
  actionButtonText: {
    color: "white",
    fontSize: 13,
    fontWeight: "700",
    marginRight: 5,
  },
  actions: {
    alignItems: "center",
    width: "100%",
    padding: 10,
    paddingBottom: 15,
  },
  loading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    marginVertical: 50,
  },
  boxDropDownDefault: {
    borderWidth: 0,
    backgroundColor: "#2CCDB5",
  },
  boxDropDown: {
    borderWidth: 0,
    width: 149,
    backgroundColor: "#2CCDB5",
    shadowRadius: 1,
    shadowColor: "#3d3d3d",
    marginLeft: 5,
  },
  boxInputDropDown: {
    color: "#FFFFFF",
    fontSize: 16,
    paddingRight: 6,
  },
  dropDown: {
    borderColor: "#2CCDB5",
    width: 150,
    marginTop: 3,
    marginLeft: 5,
  },
  list: {
    width: "24%",
    marginLeft: 10,
    marginBottom: 20,
  },
<<<<<<< Updated upstream
});
=======
});
>>>>>>> Stashed changes
