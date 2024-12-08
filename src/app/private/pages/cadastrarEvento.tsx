import {
    Pressable,
    StyleSheet,
    Text,
    View,
    TextInput,
    Platform,
    Switch,
  } from "react-native";
  import React, { useEffect, useState } from "react";
  import { ScrollView } from "react-native";
  import Icon from "react-native-vector-icons/MaterialCommunityIcons";
  import { router } from "expo-router";
  import { SelectList } from "react-native-dropdown-select-list";
  import { ECategoriaRotina } from "../../interfaces/rotina.interface";
  import MaskInput, { Masks } from "react-native-mask-input";
  import MaskHour from "../../components/MaskHour";
  import Calendar from "react-native-vector-icons/Feather";
  import { postEvento } from "../../services/evento.service";
  import Toast from "react-native-toast-message";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  import { IIdoso } from "../../interfaces/idoso.interface";
  import ErrorMessage from "../../components/ErrorMessage";
  import * as Notifications from "expo-notifications";
  import database from "../../db";
  import { Collection } from "@nozbe/watermelondb";
  import Evento from "../../model/Evento";
  import { handleNotificacao, validateFields } from "../../shared/helpers/useNotification";
  import CustomButton from "../../components/CustomButton";
  import WeekDays from "../../components/weekDay";
import { Try } from "expo-router/build/views/Try";
  
  interface IErrors {
    titulo?: string;
    data?: string;
    hora?: string;
    categoria?: string;
    descricao?: string;
  }
  
  export default function CadastrarEvento() {
    const getInitialDateTime = (isData = true) => {
      const today = new Date();
      const formattedDate = today.toLocaleDateString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });
      const formattedDateArray = formattedDate.split(" ");
      return isData ? formattedDateArray[0] : formattedDateArray[1];
    };
  
    const [idoso, setIdoso] = useState<IIdoso>();
    const [titulo, setTitulo] = useState("");
    const [data, setData] = useState(getInitialDateTime());
    const [hora, setHora] = useState(getInitialDateTime(false));
    const [notificacao, setNotificacao] = useState(false);
    const [expoToken, setExpoToken] = useState("");
    const [descricao, setDescricao] = useState("");
    const [categoria, setCategoria] = useState<ECategoriaRotina | null>(null);
    const [showLoading, setShowLoading] = useState(false);
    const [erros, setErros] = useState<IErrors>({});
    const [showErrors, setShowErrors] = useState(false);
    const [token, setToken] = useState<string>("");
    const [dias, setDias] = useState<number[]>([]);
  
    const getToken = () => {
      AsyncStorage.getItem("token").then((response) => {
        setToken(response as string);
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
  
    const handleErrors = () => {
      validateFields(titulo, data, hora, categoria, descricao, setErros);
    };
  
    const categorias = [
      { key: ECategoriaRotina.GERAL, value: ECategoriaRotina.GERAL },
      { key: ECategoriaRotina.MEDICAMENTO, value: ECategoriaRotina.MEDICAMENTO },
      { key: ECategoriaRotina.ALIMENTACAO, value: ECategoriaRotina.ALIMENTACAO },
      { key: ECategoriaRotina.EXERCICIOS, value: ECategoriaRotina.EXERCICIOS },
    ];
  
    const getDateIsoString = () => {
      const dateArray = data.split("/");
      return `${dateArray[2]}-${dateArray[1]}-${dateArray[0]}T${hora}:00.000`;
    };
  
    const salvarNoBancoLocal = async () => {
      const eventoCollection = database.get('evento') as Collection<Evento>;
  
      await database.write(async () => {
        await eventoCollection.create((evento) => {
          evento.titulo = titulo;
          evento.descricao = descricao;
          evento.categoria = String(categoria);
          evento.dataHora = new Date(getDateIsoString());
          evento.token = token;
          evento.notificacao = notificacao;
          evento.idIdoso = idoso?.id;
        });
      });
      console.log("Estado atual do banco:", await eventoCollection.query().fetch());
    }

    const salvar = async () => {
      if (Object.keys(erros).length > 0) {
        setShowErrors(true);
        return;
      }
  
      try {
        setShowLoading(true);
        await salvarNoBancoLocal();
        Toast.show({
          type: "success",
          text1: "Sucesso!",
          text2: "Evento criado",
        });
        router.replace({
          pathname: "private/tabs/eventos",
        });
      } catch (err) {
        const error = err as { message: string };
        console.log(error);
        Toast.show({
          type: "error",
          text1: "Erro!",
          text2: "Algo deu errado na criação do evento :(",
        });
      } finally {
        setShowLoading(false);
      }
    };
  
    const goBack = () => {
      router.push({
        pathname: "/private/tabs/eventos",
      });
    };
  
    useEffect(() => getIdoso(), []);
    useEffect(() => getToken(), []);
    useEffect(() => handleErrors(), [titulo, data, hora, categoria, descricao]);
    useEffect(() => {
      handleNotificacao(notificacao, setNotificacao, setExpoToken);
    }, [notificacao]);
  
    return (
      <ScrollView>
        <View style={styles.header}>
          <Pressable onPress={goBack}>
            <Icon name="chevron-left" size={40} color="#fff" />
          </Pressable>
          <Text style={styles.tituloheader}>Novo evento</Text>
        </View>
  
        <View style={styles.evento}>
          <View style={styles.titulo}>
            <TextInput
              value={titulo}
              onChangeText={(titulo) => setTitulo(titulo)}
              placeholder="Adicionar título"
              placeholderTextColor={"#3D3D3D"}
              style={styles.inputTitulo}
            />
          </View>
          <View style={styles.erroTitulo} testID="Erro-titulo">
            <ErrorMessage show={showErrors} text={erros.titulo} />
          </View>
          <View style={styles.dataHora}>
            <Calendar style={styles.iconDataHora} name="calendar" size={20} />
            <MaskInput
              style={styles.textInput}
              value={data}
              onChangeText={setData}
              mask={Masks.DATE_DDMMYYYY}
              placeholder="Data do evento"
              placeholderTextColor={"#3D3D3D"}
            />
          </View>
          <View style={styles.erro} testID="Erro-data">
            <ErrorMessage show={showErrors} text={erros.data} />
          </View>
  
          <View style={styles.dataHora}>
            <Icon
              style={styles.iconDataHora}
              name="clock-time-four-outline"
              size={20}
            />
            <MaskHour
              style={styles.textInput}
              placeholder="Horário de início"
              placeholderTextColor={"#3D3D3D"}
              value={hora}
              maxLength={5}
              inputMaskChange={(hora) => setHora(hora)}
            />
          </View>
          <View style={styles.erro} testID="Erro-hora">
            <ErrorMessage show={showErrors} text={erros.hora} />
          </View>
  
          <View>
            <View style={styles.categoria}>
              {(!categoria || categoria == ECategoriaRotina.GERAL) && (
                <Icon style={styles.iconCategoria} name="view-grid-outline" />
              )}
              {categoria === ECategoriaRotina.ALIMENTACAO && (
                <Icon style={styles.iconCategoria} name="food-apple-outline" />
              )}
              {categoria === ECategoriaRotina.MEDICAMENTO && (
                <Icon style={styles.iconCategoria} name="medical-bag" />
              )}
              {categoria === ECategoriaRotina.EXERCICIOS && (
                <Icon style={styles.iconCategoria} name="dumbbell" />
              )}
              <SelectList
                boxStyles={styles.dropdown}
                inputStyles={styles.categoriaSelecionada}
                data={categorias}
                setSelected={setCategoria}
                placeholder="Categoria"
                search={false}
              />
            </View>
            <View testID="Erro-categoria">
              <ErrorMessage show={showErrors} text={erros.categoria}/>
            </View>
          </View>
  
          <View style={styles.repete}>
            <Text style={styles.repete}>Evento no(s) dia(s)</Text>
          </View>
  
          <View style={styles.weekDays}>
          <WeekDays callbackFn={setDias} dias={[]} />
        </View>
  
          <View style={styles.notificacaoContainer}>
            <Switch
              trackColor={{ false: "#767577", true: "#2CCDB5" }}
              onValueChange={setNotificacao}
              value={notificacao}
            />
            <Text style={styles.notificacaoText}>Ativar notificação</Text>
          </View>
  
          <View style={styles.descricao}>
            <TextInput
              onChangeText={setDescricao}
              value={descricao}
              placeholder="Descrição"
              multiline={true}
              numberOfLines={Platform.OS === "ios" ? undefined : 6}
              style={[
                styles.textInputDescription,
                { minHeight: Platform.OS === "ios" && 6 ? 20 * 6 : null },
              ]}
              placeholderTextColor={"#3D3D3D"}
            />
          </View>
          <View style={styles.erro} testID="Erro-descricao">
            <ErrorMessage show={showErrors} text={erros.descricao} />
          </View>
  
          <View style={styles.linkButton}>
            <CustomButton
              title="Salvar"
              callbackFn={salvar}
              showLoading={showLoading}
            />
          </View>
        </View>
      </ScrollView>
    );
  }
  
  const styles = StyleSheet.create({
    notificacaoContainer: {
      flexDirection: "row",
      alignItems: "center",
      width: "100%",
      fontWeight: "700",
      marginBottom: 20,
    },
    notificacaoText: {
      fontWeight: "600",
      marginLeft: 7,
      fontSize: 16,
      color: "#616161",
    },
    header: {
      backgroundColor: "#2CCDB5",
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      paddingTop: 10,
      paddingBottom: 10,
      alignItems: "center",
      paddingHorizontal: 15,
      marginBottom: 15,
    },
    tituloheader: {
      fontWeight: "bold",
      fontSize: 20,
      color: "#fff",
    },
    evento: {
      flexDirection: "column",
      borderRadius: 15,
      backgroundColor: "white",
      margin: 15,
      padding: 15,
      shadowColor: "#000",
      shadowOffset: { width: 1, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      alignItems: "center",
      justifyContent: "center",
    },
    titulo: {
      width: "100%",
      height: 60,
      backgroundColor: "#F6F6F6",
      borderRadius: 6,
      justifyContent: "center",
      paddingHorizontal: 15,
      marginBottom: -20,
    },
    inputTitulo: {
      width: "100%",
      fontSize: 18,
      color: "#707070",
    },
    erroTitulo: {
      marginBottom: 30,
    },
    dataHora: {
      width: "100%",
      height: 60,
      backgroundColor: "#F6F6F6",
      borderRadius: 6,
      marginBottom: 0,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 15,
    },
    iconDataHora: {
      marginRight: 10,
    },
    textInput: {
      width: "100%",
      fontSize: 18,
      color: "#707070",
    },
    erro: {
      marginBottom: 30,
    },
    dropdown: {
      borderRadius: 5,
      borderWidth: 0,
      height: 60,
      marginBottom: -5,
    },
    categoriaSelecionada: {
      fontSize: 18,
      color: "#707070",
    },
    categoria: {
      flexDirection: "row",
      borderBottomWidth: 1,
      width: 300,
      alignItems: "baseline",
      paddingBottom: 5,
    },
    iconCategoria: {
      marginRight: 10,
      fontSize: 24,
      color: "#707070",
    },
    repete: {
      marginBottom: 5,
    },
    weekDays: {
      marginBottom: 0,
    },
    descricao: {
      width: "100%",
      marginBottom: 0,
    },
    textInputDescription: {
      padding: 10,
      fontSize: 16,
      color: "#707070",
      textAlignVertical: "top",
      backgroundColor: "#F6F6F6",
      borderRadius: 6,
    },
    linkButton: {
      marginBottom: 30,
      alignItems: "center",
    },
  });
