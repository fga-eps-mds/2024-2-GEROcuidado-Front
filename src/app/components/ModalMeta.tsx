import React, { useEffect, useState } from "react";
import { Modal, StyleSheet, Text, Pressable, View } from "react-native";
import { EMetricas, IMetrica } from "../interfaces/metricas.interface";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TextInput } from "react-native-gesture-handler";
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

export default function ModalMeta({
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
          <Text style={styles.modalText}>Adicionar uma nova meta</Text>
          <View style={styles.modal}>
            {metrica.categoria == EMetricas.HIDRATACAO && (
              <MaterialCommunityIcons
                name="cup-water"
                color={"#1075c8"}
                size={60}
              />
            )}
            <View style={styles.input}>
              <TextInput
                value={valor}
                onChangeText={setValor}
                style={styles.textInput}
                placeholderTextColor={"#3D3D3D"}
                testID="modal-input"
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