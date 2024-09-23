import React, { useEffect, useState } from "react";
import { Modal, StyleSheet, Text, Pressable, View } from "react-native";
import { EMetricas, IMetrica } from "../interfaces/metricas.interface";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import { TextInput } from "react-native";
import ErrorMessage from "./ErrorMessage";
import { validateValue } from "../shared/helpers/modal.helper";
import ModalButtons from "./ModalButtons";
import styles from "./style/stylesModal";

interface IProps {
  visible: boolean;
  callbackFn: (valor: string) => unknown;
  closeModal: () => unknown;
  message: string;
  metrica: IMetrica;
}

interface IErrors {
  valor?: string;
}

export default function ModalMetrica({
  visible,
  callbackFn,
  closeModal,
  metrica,
  message,
}: Readonly<IProps>) {
  const [valor, setValor] = useState<string>("");
  const [erros, setErros] = useState<IErrors>({});
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    validateValue(valor, setShowErrors, setErros);
  }, [valor]);

  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>{message}</Text>
          <View style={styles.modal}>
            {metrica.categoria == EMetricas.FREQ_CARDIACA && (
              <FontAwesome name="heartbeat" color={"#FF7D7D"} size={60} />
            )}
            {metrica.categoria === EMetricas.HORAS_DORMIDAS && (
              <FontAwesome name="bed" color={"#4B0082"} size={60} />
            )}
            {metrica.categoria == EMetricas.GLICEMIA && (
              <FontAwesome name="cubes" color={"#3F3F3F"} size={60} />
            )}
            {metrica.categoria == EMetricas.ALTURA && (
              <Entypo
                name="ruler"
                color={"#000"}
                size={60}
                style={{ opacity: 0.8 }}
              />
            )}
            {metrica.categoria == EMetricas.TEMPERATURA && (
              <FontAwesome name="thermometer" color={"#FFAC7D"} size={60} />
            )}
            {metrica.categoria == EMetricas.PRESSAO_SANGUINEA && (
              <FontAwesome name="tint" color={"#FF7D7D"} size={60} />
            )}
            {metrica.categoria == EMetricas.PESO && (
              <Icon name="scale-bathroom" color={"#B4026D"} size={60} />
            )}
            {metrica.categoria == EMetricas.SATURACAO_OXIGENIO && (
              <View>
                <Text style={{ fontSize: 60 }}>
                  O<Text style={{ fontSize: 30 }}>2</Text>
                </Text>
              </View>
            )}
            {metrica.categoria == EMetricas.IMC && (
              <Entypo name="calculator" color={"#000"} size={60} />
            )}
            {metrica.categoria == EMetricas.HIDRATACAO && (
              <MaterialCommunityIcons
                name="cup-water"
                color={"#1075c8"}
                size={60}
              />
            )}
            <View style={styles.input}>
              <TextInput
                testID="valorInput"
                value={valor}
                onChangeText={setValor}
                style={styles.textInput}
                placeholderTextColor={"#3D3D3D"}
              />
              <View style={styles.erroValor}>
                <ErrorMessage show={showErrors} text={erros.valor} />
              </View>
            </View>
          </View>
          <ModalButtons
          onCancel={closeModal}
          onSave={() => callbackFn(valor)}
          showErrors={showErrors}
          setShowErrors={setShowErrors}
          erros={erros}
          />
        </View>
      </View>
    </Modal>
  );
}
