import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    centeredView: {
      flexDirection: "column",
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#00000098",
    },
    modal: {
      flexDirection: "row",
      marginBottom: 30,
    },
    erroValor: {
      padding: 5,
    },
    input: {
      flexDirection: "column",
      alignItems: "center",
    },
    textInput: {
      fontSize: 40,
      width: 150,
      marginLeft: 15,
      textAlign: "center",
    },
    modalView: {
      margin: 20,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modalText: {
      marginBottom: 35,
      textAlign: "center",
      fontWeight: "bold",
    },
});

export default styles;
