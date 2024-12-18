import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  voltar: {
    marginTop: 5,
  },
  formControl: {
    flexDirection: "column",
    width: 320,
    alignItems: "flex-start",
    alignSelf: "center",
    marginTop: 10,
  },
  formControl2: {
    flexDirection: "row",
    width: 320,
    alignItems: "flex-start",
    alignSelf: "center",
    marginTop: 10,
  },
  button: {
    width: "80%",
    maxWidth: 350,
    paddingVertical: 16,
    paddingHorizontal: 26,
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "#2CCDB5",
    textAlign: "center",
  },
  field: {
    flexDirection: "row",
    width: 320,
    borderBottomWidth: 1,
    borderBottomColor: "#AFB1B6",
    paddingBottom: 5,
    alignSelf: "center",
    marginBottom: 5,
  },
  fieldBlood: {
    flexDirection: "row",
    width: 320,
    borderBottomWidth: 1,
    borderBottomColor: "#AFB1B6",
    paddingBottom: 5,
    alignSelf: "center",
    marginBottom: 5,
  },
  iconInput: {
    width: "10%",
    alignSelf: "center",
    marginLeft: 10,
  },
  iconInput2: {
    width: "10%",
    marginTop: "7%",
    marginLeft: 10,
  },
  bloodInput: {
    paddingLeft: 10,
    color: "#05375a",
    width: "80%",
    fontSize: 17,
  },
  bloodIcon: {
    width: "10%",
  },
  textInput: {
    width: "90%",
    paddingLeft: 10,
    color: "#05375a",
    fontSize: 17,
  },
  arrow: {
    alignSelf: "flex-start",
  },
  linkButton: {
    marginTop: 60,
    marginBottom: 40,
    alignItems: "center",
  },
  apagarEditar: {
    color: "#FF7F7F",
    alignSelf: "center",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 60,
    alignItems: "center",
  },
  apagarCadastro: {
    color: "#FF7F7F",
    alignSelf: "center",
    fontSize: 18,
    fontWeight: "600",
  },
  dropdown: {
    width: 300,
    borderWidth: 0,
    paddingLeft: 10,
    color: "#05375A",
    fontSize: 17,
  },
  requiredIcon: {
    marginLeft: 5,
  },
});

export default styles;
