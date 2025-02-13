import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, Dimensions, FlatList, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IUser } from "../../interfaces/user.interface";
import NaoAutenticado from "../../components/NaoAutenticado";
import { IIdoso } from "../../interfaces/idoso.interface";
import IdosoNaoSelecionado from "../../components/IdosoNaoSelecionado";
import CardMetrica from "../../components/CardMetrica";
import { router } from "expo-router";
import { getAllMetrica } from "../../services/metrica.service";
import Toast from "react-native-toast-message";
import database from "../../db";
import { Q } from "@nozbe/watermelondb";
import { NetInfo } from "@react-native-community/netinfo";
import { IMetrica } from "../../interfaces/metricas.interface";
import { getFoto } from "../../shared/helpers/photo.helper";
import { syncDatabaseWithServer } from "../../services/watermelon.service";


export default function Registros() {
  const [user, setUser] = useState<IUser | undefined>(undefined);
  const [idoso, setIdoso] = useState<IIdoso>();
  const [metricas, setMetricas] = useState<IMetrica[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => handleUser(), []);
  useEffect(() => getIdoso(), []);
  useEffect(() => { getMetricas() }, [idoso]);

  const handleUser = () => {
    AsyncStorage.getItem("usuario2").then((response) => {
      const usuario = JSON.parse(response as string);
      setUser(usuario);
    });
  };

  const getIdoso = () => {
    AsyncStorage.getItem("idoso").then((idosoString) => {
      if (idosoString) {
        const idosoPayload = JSON.parse(idosoString) as IIdoso;
        setIdoso(idosoPayload);
      }
    });
  };

  const visualizarMetrica = (item: IMetrica) => {
    router.push({
      pathname: "private/pages/visualizarMetrica",
      params: {
        id: item.id,
        idIdoso: item.idIdoso,
        categoria: item.categoria,
        valorMaximo: item.valorMaximo,
      },
    });
  };

  const getMetricas = async () => {
    if (!idoso) return;
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
  
    try {
      setLoading(true);
      // const idosoMetricas = await metricasCollection.query(Q.where('idoso_id', idoso.id)).fetch();

      // Map the WatermelonDB models to your IMetrica interface
      // const metricasData: IMetrica[] = idosoMetricas.map((metrica: any) => ({
      //   id: metrica._raw.id,  // Assuming `id` is a field in the _raw object
      //   idIdoso: metrica._raw.idoso_id,
      //   categoria: metrica._raw.categoria,
      //   valorMaximo: metrica._raw.valorMaximo,
      // }));

      const response = await getAllMetrica({ idIdoso: Number(idoso.id) })

      if (Array.isArray(response) && response.length > 0) {
        setMetricas(response);
      }
=======
    
    const metricaCollection = database.get('metrica');
    
    try {
      setLoading(true);
=======
    
    const metricaCollection = database.get('metrica');
    
    try {
      setLoading(true);
>>>>>>> Stashed changes
=======
    
    const metricaCollection = database.get('metrica');
    
    try {
      setLoading(true);
>>>>>>> Stashed changes
      const idosoMetricas = await metricaCollection.query(Q.where('idoso_id', idoso.id)).fetch();
      
      // Map the WatermelonDB models to your IMetrica interface
      const metricasData: IMetrica[] = idosoMetricas.map((metrica: any) => ({
        id: metrica._raw.id,
        idIdoso: metrica._raw.idoso_id,
        categoria: metrica._raw.categoria,
        valorMaximo: metrica._raw.valorMaximo,
      }));
      
      setMetricas(metricasData);
>>>>>>> Stashed changes
    } catch (err) {
      console.log("Erro ao obter metricas do idoso:", err);
      Toast.show({
        type: "error",
        text1: "Erro ao carregar métricas.",
        text2: "Ocorreu um erro ao buscar as métricas.",
      });
<<<<<<< Updated upstream
<<<<<<< Updated upstream
=======
=======
    } finally {
      setLoading(false);
    }
  };

  const syncMetricasWithServer = async () => {
    try {
      setLoading(true);
      const metricaCollection = database.get('metrica');
      const metricaRecords = await metricaCollection.query(Q.where('isSynced', Q.eq(false))).fetch();

      if (metricaRecords.length > 0) {
        // Sincronizar métricas com o servidor (Função fictícia)
        await syncDatabaseWithServer(metricaRecords);

        // Atualiza o banco local marcando as métricas como sincronizadas
        await database.write(async () => {
          for (let record of metricaRecords) {
            await record.update(item => {
              item.isSynced = true;
            });
          }
        });

        Toast.show({
          type: 'success',
          text1: 'Métricas sincronizadas com sucesso!',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao sincronizar métricas',
        text2: error.message,
      });
>>>>>>> Stashed changes
    } finally {
      setLoading(false);
    }
  };

  const syncMetricasWithServer = async () => {
    try {
      setLoading(true);
      const metricaCollection = database.get('metrica');
      const metricaRecords = await metricaCollection.query(Q.where('isSynced', Q.eq(false))).fetch();

      if (metricaRecords.length > 0) {
        // Sincronizar métricas com o servidor (Função fictícia)
        await syncDatabaseWithServer(metricaRecords);

        // Atualiza o banco local marcando as métricas como sincronizadas
        await database.write(async () => {
          for (let record of metricaRecords) {
            await record.update(item => {
              item.isSynced = true;
            });
          }
        });

        Toast.show({
          type: 'success',
          text1: 'Métricas sincronizadas com sucesso!',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao sincronizar métricas',
        text2: error.message,
      });
>>>>>>> Stashed changes
    } finally {
      setLoading(false);
    }
  };

  const syncMetricasWithServer = async () => {
    try {
      setLoading(true);
      const metricaCollection = database.get('metrica');
      const metricaRecords = await metricaCollection.query(Q.where('isSynced', Q.eq(false))).fetch();

      if (metricaRecords.length > 0) {
        // Sincronizar métricas com o servidor (Função fictícia)
        await syncDatabaseWithServer(metricaRecords);

        // Atualiza o banco local marcando as métricas como sincronizadas
        await database.write(async () => {
          for (let record of metricaRecords) {
            await record.update(item => {
              item.isSynced = true;
            });
          }
        });

        Toast.show({
          type: 'success',
          text1: 'Métricas sincronizadas com sucesso!',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao sincronizar métricas',
        text2: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

<<<<<<< Updated upstream
=======
  useEffect(() => handleUser(), []);
  useEffect(() => getIdoso(), []);
  useEffect(() => {
    if (idoso) {
      NetInfo.fetch().then(state => {
        if (state.isConnected) {
          //console.log('Conectado à internet');
          syncMetricasWithServer();
        } else {
          //console.log('Sem conexão');
          getMetricas();
        }
      });
    }
  }, [idoso]);

>>>>>>> Stashed changes
  return (
    <>
      
      {user?.id && <NaoAutenticado />}

      {user?.id && !idoso?.id && <IdosoNaoSelecionado />}
      
      
      <View>
        <View style={styles.header}>
          {getFoto(idoso?.foto)}
            <Text style={styles.nomeUsuario}>
              <Text style={styles.negrito}>{idoso?.nome}</Text>
            </Text>
        </View>
      </View>
      

      <Pressable style={styles.botaoCriarMetrica} onPress={() => router.push({ pathname: "/private/pages/cadastrarMetrica" })}>
        <Icon name="plus" color={"white"} size={20}></Icon>
        <Text style={styles.textoBotaoCriarMetricas}>Nova Métrica</Text>
      </Pressable>

      <View style={styles.verMetrica}>
        {loading && <Text>Carregando métricas...</Text>}
        {!loading && (
          <FlatList
            data={metricas}
            numColumns={2}
            renderItem={({ item }) => (
              <Pressable onPress={() => visualizarMetrica(item)}>
                <CardMetrica item={item} />
              </Pressable>
            )}
            keyExtractor={(item) => item.id.toString()}
          />
        )}
      </View>
    </>
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
  verMetrica: {
    alignSelf: "center",
    height: Dimensions.get("window").height - 230,
<<<<<<< Updated upstream
    justifyContent: "center",
=======
    justifyContent: "space-between",
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
  cardMetrica: {
    width: "40%",
    margin: 10,
  },
  list: {
    width: "100%",
  },
  textoBotaoCriarMetricas: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 5,
  },
  botaoCriarMetrica: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#B4026D",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    marginLeft: "auto",
    marginRight: 10,
    marginVertical: 10,
  },
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
});
