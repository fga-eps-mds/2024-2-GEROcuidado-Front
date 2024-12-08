import {
    ActivityIndicator,
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
  import { router, useLocalSearchParams } from "expo-router";
  import WeekDays from "../../components/weekDay";
  import { SelectList } from "react-native-dropdown-select-list";
  import Calendar from "react-native-vector-icons/Feather";
  import CustomButton from "../../components/CustomButton";
  import MaskInput, { Masks } from "react-native-mask-input";
  import MaskHour from "../../components/MaskHour";
  import ErrorMessage from "../../components/ErrorMessage";
  import ModalConfirmation from "../../components/ModalConfirmation";
  import Toast from "react-native-toast-message";
  import database from "../../db";
  import { Collection } from "@nozbe/watermelondb";
  import Evento from "../../model/Evento";
  import { validateFields } from "../../shared/helpers/useNotification";
  
  interface IErrors {
    titulo?: string;
    data?: string;
    hora?: string;
    local?: string;
    descricao?: string;
  }
  
  export default function EditarEvento() {
    const { evento } = useLocalSearchParams();
    const params = JSON.parse(evento as string);
    const [titulo, setTitulo] = useState(params.titulo);
    const [local, setLocal] = useState(params.local);
    const [descricao, setDescricao] = useState(params.descricao);
    const [dias, setDias] = useState((params.dias || []).map(Number));
    const [data, setData] = useState("");
    const [hora, setHora] = useState("");
    const [notificacao, setNotificacao] = useState(String(params.notificacao) === "true");
    const [showLoading, setShowLoading] = useState(false);
    const [erros, setErros] = useState<IErrors>({});
    const [showErrors, setShowErrors] = useState(false);
    const [showLoadingApagar, setShowLoadingApagar] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
  
    const handleDataHora = () => {
      const dateString = new Date(params.dataHora).toLocaleString("pt-BR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
      const [data, hora] = dateString.split(" ");
      setData(data);
      setHora(hora);
    };
  
    const handleErrors = () => {
      validateFields(titulo, data, hora, local, descricao, setErros);
    };
  
    const getDateIsoString = (data: string, hora: string) => {
      const dateArray = data.split("/");
      return `${dateArray[2]}-${dateArray[1]}-${dateArray[0]}T${hora}:00.000`;
    };
  
    const salvar = async () => {
      if (Object.keys(erros).length > 0) {
        setShowErrors(true);
        return;
      }
  
      try {
        setShowLoading(true);
  
        const eventoCollection = database.get('evento') as Collection<Evento>;
        await database.write(async () => {
          const evento  = await eventoCollection.find(params.id);

          await evento.update(() => {
            evento.titulo = titulo;
            evento.dataHora = new Date(getDateIsoString(data, hora));
            evento.descricao = descricao;
            evento.notificacao = notificacao;
          });
        });
  
        Toast.show({
          type: "success",
          text1: "Sucesso!",
          text2: "Evento atualizado com sucesso",
        });

        router.back();
  
      } catch (err) {
        console.log("Erro ao atualizar evento:", err);
        Toast.show({
          type: "error",
          text1: "Erro!",
          text2: "Erro ao atualizar evento",
        });
      } finally {
        setShowLoading(false);
      }
    };
  
    const apagarEvento = async () => {
      setModalVisible(false);
      setShowLoadingApagar(true);
  
      try {
        const eventoCollection = database.get('evento') as Collection<Evento>;
        await database.write(async () => {
          const evento = await eventoCollection.find(params.id);
          await evento.destroyPermanently();
        });
  
        router.replace("private/tabs/eventos");
      } catch (err) {
        console.log("Erro ao apagar evento:", err);
      } finally {
        setShowLoadingApagar(false);
      }
    };
  
    useEffect(() => handleDataHora(), []);
    useEffect(() => handleErrors(), [titulo, data, hora, local, descricao]);
  
    const confirmation = () => {
      setModalVisible(!modalVisible);
    };
  
    const closeModal = () => {
      setModalVisible(false);
    };
  
    return (
      <ScrollView>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()}>
            <Icon name="chevron-left" size={40} color="#fff" />
          </Pressable>
          <Text style={styles.tituloheader}>Detalhes do evento</Text>
        </View>
  
        <View style={styles.Evento}>
          <TextInput
            value={titulo}
            onChangeText={(NewTitulo) => {setTitulo(NewTitulo);}}
            placeholder="Título do evento"
            style={styles.inputTitulo}
          />
          <ErrorMessage show={showErrors} text={erros.titulo} />
  
          <View style={styles.dataHora}>
            <Calendar name="calendar" size={20} />
            <MaskInput
              value={data}
              onChangeText={setData}
              mask={Masks.DATE_DDMMYYYY}
              placeholder="Data"
              style={styles.textInput}
            />
          </View>
          <ErrorMessage show={showErrors} text={erros.data} />
  
          <View style={styles.dataHora}>
            <Icon name="clock-time-four-outline" size={20} />
            <MaskHour
              placeholder="Horário"
              value={hora}
              inputMaskChange={setHora}
            />
          </View>
          <ErrorMessage show={showErrors} text={erros.hora} />

          <View style={styles.repete}>
          <Text style={styles.repete}>Evento no(s) dia(s)</Text>
        </View>

        <View style={styles.notificacaoContainer}>
          <Switch
            trackColor={{ false: "#767577", true: "#2CCDB5" }}
            onValueChange={setNotificacao}
            value={notificacao}
          />
          <Text style={styles.notificacaoText}>Ativar notificação</Text>
        </View>

        <View style={styles.weekDays}>
          <WeekDays dias={dias} callbackFn={setDias} />
        </View>
          <TextInput
            value={descricao}
            onChangeText={(NewDescription) => {setDescricao(NewDescription);}}
            placeholder="Descrição"
            style={styles.textInputDescription}
            multiline={true}
            numberOfLines={4}
          />
          <ErrorMessage show={showErrors} text={erros.descricao} />

  
          <View style={styles.linkButton}>
          <CustomButton
            title="Salvar"
            callbackFn={salvar}
            showLoading={showLoading}
          />
        </View>
  
          <Pressable onPress={confirmation}>
            {showLoadingApagar ? (
              <ActivityIndicator size="small" color="#FF7F7F" />
            ) : (
              <Text style={styles.apagar}>Apagar Evento</Text>
            )}
          </Pressable>
  
          <ModalConfirmation
            visible={modalVisible}
            callbackFn={apagarEvento}
            closeModal={closeModal}
            message="Apagar este evento?"
            messageButton="Apagar"
          />
        </View>
      </ScrollView>
    );
  }
  
  const styles = StyleSheet.create({
    header: {
        backgroundColor: "#2CCDB5",
        height: 60,
        flexDirection: "row",
        alignItems: "center",
      },
      tituloheader: {
        fontWeight: "bold",
        color: "white",
        fontSize: 20,
      },
      Evento: {
        borderRadius: 15,
        backgroundColor: "white",
        margin: 15,
        padding: 15,
        shadowColor: "#000",
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        alignItems: "center",
      },
      titulo: {
        flexDirection: "row",
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#333333",
        paddingBottom: 5,
        marginBottom: 1,
      },
      inputTitulo: {
        color: "black",
        fontSize: 17,
        textAlign: "center",
      },
      dataHora: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "black",
        paddingBottom: 5,
        width: 300,
        marginBottom: 1,
      },
      iconDataHora: {
        fontSize: 25,
        opacity: 0.8,
      },
      textInput: {
        paddingLeft: 10,
        color: "black",
        fontSize: 17,
        width: 280,
      },
      categoria: {
        flexDirection: "row",
        borderBottomWidth: 1,
        width: 300,
        alignItems: "baseline",
        paddingBottom: 5,
      },
      iconCategoria: {
        fontSize: 25,
        opacity: 0.8,
      },
      dropdown: {
        borderWidth: 0,
        paddingLeft: 10,
        width: 280,
        fontSize: 17,
      },
      categoriaSelecionada: {
        fontSize: 17,
        color: "#3D3D3D",
      },
      repete: {
        alignSelf: "flex-start",
        marginTop: 10,
        fontSize: 17,
        color: "#616161",
      },
      weekDays: {
        flexDirection: "row",
        marginTop: 15,
        marginBottom: 15,
      },
      iconDesciption: {
        width: "10%",
        fontSize: 18,
      },
      descricao: {
        borderBottomWidth: 0,
        borderBottomColor: "black",
        paddingBottom: 5,
        width: 300,
      },
      textInputDescription: {
        borderRadius: 10,
        backgroundColor: "#F1F1F1",
        fontSize: 17,
        width: 300,
        padding: 12,
      },
      linkButton: {
        marginTop: 20,
        marginBottom: 40,
        alignItems: "center",
        width: 250,
      },
      erroTitulo: {
        marginBottom: 35,
      },
      erro: {
        marginBottom: 15,
        alignSelf: "flex-start",
      },
      apagar: {
        color: "#FF7F7F",
        alignSelf: "center",
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 25,
        alignItems: "center",
      },
      notificacaoContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        fontWeight: "700",
        marginBottom: 10,
      },
      notificacaoText: {
        fontWeight: "600",
        marginLeft: 7,
        fontSize: 16,
        color: "#616161",
      },
  });
  