import React, { useEffect, useState } from "react";
import {
 View,
 Text,
 StyleSheet,
 Pressable,
 ActivityIndicator,
} from "react-native";
import { FlatList } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import BackButton from "../../components/BackButton";
import CardIdoso from "../../components/CardIdoso";
import { useRouter } from "expo-router";
import { IIdoso, IOrder } from "../../interfaces/idoso.interface";
import Toast from "react-native-toast-message";
import { SelectList } from "react-native-dropdown-select-list";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IUser } from "../../interfaces/user.interface";
import database from "../../db";
import Idoso from "../../model/Idoso";
import { Collection, Q } from "@nozbe/watermelondb";
import { getImageUri } from "../../shared/helpers/image.helper";


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


export default function ListarIdosos() {
 const [idosos, setIdosos] = useState<IIdoso[]>([]);
 const [loading, setLoading] = useState(true);
 const [orderOption, setOrderOption] = useState<IOrder>(data[0].key);
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
       }
     } catch (error) {
       console.error("Erro ao obter usuário:", error);
     }
   };


   getIdUsuario();
 }, []);


 const getIdosos = async () => {
   if (!idUsuario) return;


   setLoading(true);


   try {
     const idosoCollection = database.get('idoso') as Collection<Idoso>;


     const query = Q.sortBy(
       orderOption.column,
       orderOption.dir.toLowerCase() as 'asc' | 'desc'
     );


     const idosoRecords = await idosoCollection.query(query).fetch();


     const mappedIdoso = idosoRecords.map((item) => ({
       ...item._raw,
       foto: getImageUri(item.foto),
     }));


     setIdosos(mappedIdoso);
     console.log("Idosos carregados:", mappedIdoso);
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


 const navigateCadastrar = () => {
   router.push("/private/pages/cadastrarIdoso");
 };


 useEffect(() => {
   if (idUsuario) {
     getIdosos();
   }
 }, [orderOption, idUsuario]);


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
});
