import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, TextInput, StyleSheet, ScrollView } from "react-native";
import Toast from "react-native-toast-message";
import { AntDesign, Fontisto } from "@expo/vector-icons";
import BackButton from "../../components/BackButton";
import ErrorMessage from "../../components/ErrorMessage";
import CustomButton from "../../components/CustomButton";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { SelectList } from "react-native-dropdown-select-list";
import { ETipoSanguineo } from "../../interfaces/idoso.interface";
import { postIdoso } from "../../services/idoso.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IUser } from "../../interfaces/user.interface";
import MaskInput, { Masks } from "react-native-mask-input";
import UploadImageV2 from "../../components/UploadImageV2";
import { EMetricas } from "../../interfaces/metricas.interface";
import { postMetrica } from "../../services/metrica.service";
import database from "../../db";
import Idoso from "../../model/Idoso";
import User from "../../model/User";
import { Collection, Q } from "@nozbe/watermelondb";
import { ToastAndroid } from "react-native";
import { useRouter } from "expo-router";
import { IIdoso } from "../../interfaces/idoso.interface";


interface IErrors {
 nome?: string;
 dataNascimento?: string;
 tipoSanguineo?: string;
 telefoneResponsavel?: string;
 descricao?: string;
}

export default function CadastrarIdoso() {
 const [foto, setFoto] = useState<string | undefined>();
 const [nome, setNome] = useState<string>("");
 const [tipoSanguineo, setTipoSanguineo] = useState<ETipoSanguineo>(ETipoSanguineo.AB_NEGATIVO);
 const [telefoneResponsavel, setTelefoneResponsavel] = useState<string>("");
 const [dataNascimento, setDataNascimento] = useState<string>("");
 const [descricao, setDescricao] = useState<string>("");
 const [token, setToken] = useState<string>("");
 const [erros, setErros] = useState<IErrors>({});
 const [showErrors, setShowErrors] = useState<boolean>(false);
 const [showLoading, setShowLoading] = useState<boolean>(false);
 const [idUsuario, setIdUsuario] = useState<number | null>(null);
 const [maskedTelefoneResponsavel, setMaskedTelefoneResponsavel] = useState<string>("");

 const router = useRouter();

 useEffect(() => {
   const getIdUsuario = async () => {
     try {
       const response = await AsyncStorage.getItem("usuario");
       if (response) {
         const usuario = JSON.parse(response) as IUser;
         setIdUsuario(usuario.id);
         console.log("Usuário logado:", usuario);
       } else {
         console.log("Usuário não encontrado no AsyncStorage.");
       }
     } catch (error) {
       console.error("Erro ao obter usuário:", error);
     }
   };


   getIdUsuario();
 }, []);


 useEffect(() => handleErrors(), [nome, telefoneResponsavel, dataNascimento]);


 const getDateIsoString = (value: string) => {
   const dateArray = value.split("/");
   return `${dateArray[2]}-${dateArray[1]}-${dateArray[0]}T12:00:00.000Z`;
 };


 const handleErrors = () => {
   const erros: IErrors = {};


   if (!nome) {
     erros.nome = "Campo obrigatório!";
   } else if (nome.length < 5) {
     erros.nome = "O nome completo deve ter pelo menos 5 caracteres.";
   } else if (nome.length > 60) {
     erros.nome = "O nome completo deve ter no máximo 60 caracteres.";
   }


   if (!dataNascimento) {
     erros.dataNascimento = "Campo obrigatório";
   } else if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dataNascimento)) {
     erros.dataNascimento = "Data deve ser no formato dd/mm/yyyy!";
   }


   if (!telefoneResponsavel) {
     erros.telefoneResponsavel = "Campo obrigatório!";
   } else if (telefoneResponsavel.length !== 11) {
     erros.telefoneResponsavel = "Deve estar no formato (XX)XXXXX-XXXX";
   }


   setErros(erros);
 };


 const salvarNoBancoLocal = async () => {
   if (!idUsuario) {
     console.error('Usuário não encontrado.');
     return;
   }
  try {
     const idosoCollection = database.get('idoso') as Collection<Idoso>;
     const usersCollection = database.get('users') as Collection<User>;
     const userQuery = await usersCollection.query(Q.where('external_id', idUsuario.toString())).fetch();

     if (userQuery.length === 0) {
       console.error('Usuário não encontrado.');
       return;
     }

     const user = userQuery[0];

     await database.write(async () => {
       await idosoCollection.create((idoso) => {
         idoso.nome = nome;
         idoso.dataNascimento = getDateIsoString(dataNascimento);
         idoso.telefoneResponsavel = telefoneResponsavel;
         idoso.descricao = descricao;
         idoso.tipoSanguineo = tipoSanguineo;
         idoso.userId = idUsuario.toString();
         idoso.foto = foto || '';
       });
     });

     console.log("Idoso salvo no banco local com sucesso!");
   } catch (error) {
     console.error("Erro ao salvar o idoso no banco local:", error);
   }
 };

 const salvar = async () => {
   if (Object.keys(erros).length > 0) {
     setShowErrors(true);
     return;
   }

   try {
     setShowLoading(true);
     await salvarNoBancoLocal();
     ToastAndroid.show("Idoso salvo no banco local com sucesso!", ToastAndroid.SHORT);
     router.replace("/private/pages/listarIdosos");
   } catch (err) {
     const error = err as { message: string };
     ToastAndroid.show(`Erro: ${error.message}`, ToastAndroid.SHORT);
   } finally {
     setShowLoading(false);
   }
 };

 useEffect(() => handleErrors(), [nome, telefoneResponsavel, dataNascimento]);

 const data = [
   { key: ETipoSanguineo.A_POSITIVO, value: ETipoSanguineo.A_POSITIVO },
   { key: ETipoSanguineo.A_NEGATIVO, value: ETipoSanguineo.A_NEGATIVO },
   { key: ETipoSanguineo.B_POSITIVO, value: ETipoSanguineo.B_POSITIVO },
   { key: ETipoSanguineo.B_NEGATIVO, value: ETipoSanguineo.B_NEGATIVO },
   { key: ETipoSanguineo.AB_POSITIVO, value: ETipoSanguineo.AB_POSITIVO },
   { key: ETipoSanguineo.AB_NEGATIVO, value: ETipoSanguineo.AB_NEGATIVO },
   { key: ETipoSanguineo.O_POSITIVO, value: ETipoSanguineo.O_POSITIVO },
   { key: ETipoSanguineo.O_NEGATIVO, value: ETipoSanguineo.O_NEGATIVO },
 ];

  return (
    <View>
      <BackButton route="/private/pages/listarIdosos" color="#000" />

      <ScrollView>
        <UploadImageV2 setPhotoCallback={setFoto} base64={foto}></UploadImageV2>

        <View style={styles.formControl}>
          <View style={styles.field}>
            <Icon style={styles.iconInput} name="account-outline" size={20} />
            <TextInput
              onChangeText={setNome}
              value={nome}
              placeholder="Nome"
              style={styles.textInput}
            />
            <Icon
              style={styles.requiredIcon}
              name="asterisk"
              size={10}
              color="red"
            />
          </View>
          <View testID="Erro-nome">
            <ErrorMessage show={showErrors} text={erros.nome} />
          </View>
        </View>

        <View style={styles.formControl}>
          <View style={styles.field}>
            <Icon
              style={styles.iconInput}
              name="cake-variant-outline"
              size={20}
            />
            <MaskInput
              style={styles.textInput}
              value={dataNascimento}
              onChangeText={setDataNascimento}
              mask={Masks.DATE_DDMMYYYY}
              placeholder="Data de Nascimento"
            />
            <Icon
              style={styles.requiredIcon}
              name="asterisk"
              size={10}
              color="red"
            />
          </View>
          <View testID="Erro-data">
            <ErrorMessage show={showErrors} text={erros.dataNascimento} />
          </View>
        </View>

        <View style={styles.formControl}>
          <View style={styles.field}>
            <AntDesign style={styles.iconInput} name="phone" size={20} />
            <MaskInput
              style={styles.textInput}
              value={maskedTelefoneResponsavel}
              onChangeText={(masked, unmasked) => {
                setTelefoneResponsavel(unmasked);
                setMaskedTelefoneResponsavel(masked);
              }}
              mask={Masks.BRL_PHONE}
              placeholder="Telefone Responsável"
            />
            <Icon
              style={styles.requiredIcon}
              name="asterisk"
              size={10}
              color="red"
            />
          </View>
          <View testID="Erro-telefone">
            <ErrorMessage show={showErrors} text={erros.telefoneResponsavel} />
          </View>
        </View>

        <View style={styles.formControl}>
          <View style={styles.field}>
            <Fontisto style={styles.iconInput} name="left-align" size={15} />
            <TextInput
              onChangeText={setDescricao}
              value={descricao}
              placeholder="Descrição"
              style={styles.textInput}
            />
          </View>
        </View>

        <View style={styles.formControl2}>
          <View style={styles.field}>
            <Fontisto style={styles.iconInput2} name="blood-drop" size={20} />
            <View style={styles.formControl2}>
              <SelectList
                boxStyles={styles.dropdown}
                inputStyles={styles.textInput}
                data={data}
                setSelected={setTipoSanguineo}
                placeholder="Tipo Sanguíneo"
                search={false}
              />
            </View>
          </View>
          <ErrorMessage show={showErrors} text={erros.tipoSanguineo} />
        </View>

        <View style={styles.linkButton}>
          <CustomButton
            title="Cadastrar"
            callbackFn={salvar}
            showLoading={showLoading}
          />
        </View>
      </ScrollView>
    </View>
  );
}

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
  apagar: {
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
