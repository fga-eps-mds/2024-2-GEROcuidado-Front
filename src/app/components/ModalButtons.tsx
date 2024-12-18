import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';

interface IErrors {
    valor?: string;
  }

interface IModalButtonsProps {
    onCancel: () => void;
    onSave: () => void;
    showErrors: boolean;
    setShowErrors: (value: boolean) => void;
    erros: IErrors; 
}

const ModalButtons: React.FC<IModalButtonsProps> = ({
  onCancel,
  onSave,
  showErrors,
  setShowErrors,
  erros,
}) => {
  return (
    <View style={styles.buttonContainer}>
      <Pressable
        testID="cancelarBtn"
        style={[styles.button, styles.buttonCancel]}
        onPress={onCancel}
      >
        <Text style={styles.textStyle}>Cancelar</Text>
      </Pressable>
      <Pressable
        testID="callbackBtn"
        style={[styles.button, styles.buttonClose]}
        onPress={() => {
          if (Object.keys(erros).length > 0) {
            setShowErrors(true);
          } else {
            onSave();
          }
        }}
      >
        <Text style={styles.textStyle}>Salvar</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: 100,
  },
  buttonClose: {
    backgroundColor: "#2CCDB5",
    marginHorizontal: 15,
  },
  buttonCancel: {
    backgroundColor: "#FF7F7F",
    marginHorizontal: 15,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default ModalButtons;
