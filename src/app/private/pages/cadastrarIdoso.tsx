import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, TextInput, ScrollView, ToastAndroid } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign, Fontisto } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { SelectList } from "react-native-dropdown-select-list";
import MaskInput, { Masks } from "react-native-mask-input";
import BackButton from "../../components/BackButton";
import ErrorMessage from "../../components/ErrorMessage";
import CustomButton from "../../components/CustomButton";
import UploadImageV2 from "../../components/UploadImageV2";
import { ETipoSanguineo } from "../../interfaces/idoso.interface";
import { postIdoso } from "../../services/idoso.service";
import database from "../../db";
import Idoso from "../../model/Idoso";
import Usuario from "../../model/Usuario";
import { Collection, Q } from "@nozbe/watermelondb";
import { getTipoSanguineoOptions } from "../../shared/helpers/useNotification";
import styles from "../../components/style/styles";
<<<<<<< Updated upstream

interface IErrors {
  nome?: string;
  dataNascimento?: string;
  tipoSanguineo?: string;
  telefoneResponsavel?: string;
  descricao?: string;
}
=======
import { checkNetworkConnection } from "../../components/networkUtils";
import { syncUnsyncedIdosos } from "../../components/syncService";
>>>>>>> Stashed changes

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const API_PORT = process.env.EXPO_PUBLIC_API_USUARIO_PORT;
const BASE_URL = `${API_URL}:${API_PORT}/api/usuario`;

export default function CadastrarIdoso() {
  const [foto, setFoto] = useState<string | undefined>();
  const [nome, setNome] = useState<string>("");
  const [tipoSanguineo, setTipoSanguineo] = useState<ETipoSanguineo | null>(null);
  const [telefoneResponsavel, setTelefoneResponsavel] = useState<string>("");
  const [dataNascimento, setDataNascimento] = useState<string>("");
  const [descricao, setDescricao] = useState<string>("");
  const [erros, setErros] = useState<any>({});
  const [showErrors, setShowErrors] = useState<boolean>(false);
  const [showLoading, setShowLoading] = useState<boolean>(false);
  const [idUsuario, setIdUsuario] = useState<string | null>(null);
  const [maskedTelefoneResponsavel, setMaskedTelefoneResponsavel] = useState<string>("");

  const router = useRouter();

  useEffect(() => {
    const getIdUsuario = async () => {
      try {
        const response = await AsyncStorage.getItem("usuario");
        if (response) {
<<<<<<< Updated upstream
          const usuario = JSON.parse(response) as IUser;
          // console.log("Usuário logado:", usuario);
          setIdUsuario(Number(usuario.id));
        } else {
          console.log("Usuário não encontrado no AsyncStorage.");
=======
          const usuario = JSON.parse(response);
          if (usuario?.id) {
            setIdUsuario(usuario.id.toString());
          } else {
            console.error("Usuário não encontrado no AsyncStorage.");
          }
>>>>>>> Stashed changes
        }

        const token = await AsyncStorage.getItem("token");
        if (token) {
          setToken(token);
          console.log("Token:", token);
        } else {
          console.log("Token não encontrado no AsyncStorage.");
        }
      } catch (error) {
        console.error("Erro ao obter usuário:", error);
      }
    };

    getIdUsuario();
  }, []);

<<<<<<< Updated upstream

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
      erros.dataNascimento = "Campo obrigatório!";
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

  const metricas = [
    { key: EMetricas.FREQ_CARDIACA, value: EMetricas.FREQ_CARDIACA },
    { key: EMetricas.GLICEMIA, value: EMetricas.GLICEMIA },
    { key: EMetricas.PESO, value: EMetricas.PESO },
    { key: EMetricas.PRESSAO_SANGUINEA, value: EMetricas.PRESSAO_SANGUINEA },
    { key: EMetricas.SATURACAO_OXIGENIO, value: EMetricas.SATURACAO_OXIGENIO },
    { key: EMetricas.TEMPERATURA, value: EMetricas.TEMPERATURA },
    { key: EMetricas.ALTURA, value: EMetricas.ALTURA },
    { key: EMetricas.IMC, value: EMetricas.IMC },
    { key: EMetricas.HORAS_DORMIDAS, value: EMetricas.HORAS_DORMIDAS },
    { key: EMetricas.HIDRATACAO, value: EMetricas.HIDRATACAO },
  ];

  // const salvarNoBancoLocal = async () => {
  //   if (!idUsuario) {
  //     console.error('Usuário não encontrado.');
  //     return;
  //   }

  //   try {
  //     const idosoCollection = database.get('idoso') as Collection<Idoso>;
  //     const usersCollection = database.get('usuario') as Collection<Usuario>;
  //     const metricasCollection = database.get('metrica') as Collection<Metrica>;
  //     const userQuery = await usersCollection.query(Q.where('id', idUsuario.toString())).fetch();

  //     if (userQuery.length === 0) {
  //       console.error('Usuário não encontrado.');
  //       return;
  //     }

  //     const user = userQuery[0];

  //     await database.write(async () => {
  //       const createdIdoso = await idosoCollection.create((idoso) => {
  //         idoso.nome = nome;
  //         idoso.dataNascimento = getDateIsoString(dataNascimento);
  //         idoso.telefoneResponsavel = telefoneResponsavel;
  //         idoso.descricao = descricao;
  //         idoso.tipoSanguineo = tipoSanguineo;
  //         idoso.userId = idUsuario.toString();
  //         idoso.foto = foto || '';
  //       });

  //       for (const tipoMetrica of metricas) {
  //         await metricasCollection.create((metrica) => {
  //           metrica.idIdoso = createdIdoso.id;
  //           metrica.categoria = tipoMetrica.value;
  //           metrica.valorMaximo = "0";
  //         });
  //       }

  //       console.log("Metricas do idoso:", await metricasCollection.query().fetch());
  //     });

  //     console.log("Idoso salvo no banco local com sucesso!");
  //   } catch (error) {
  //     console.error("Erro ao salvar o idoso no banco local:", error);
  //   }
  // };
=======
  const salvarNoBancoLocal = async () => {
    if (!idUsuario) {
      console.error("Usuário não encontrado.");
      return;
    }

    try {
      const idosoCollection = database.get("idoso") as Collection<Idoso>;
      const usersCollection = database.get("usuario") as Collection<Usuario>;
      
      const userQuery = await usersCollection.query(Q.where("id", idUsuario)).fetch();
      if (userQuery.length === 0) {
        console.error("Usuário não encontrado localmente.");
        return;
      }

      if (!nome || !dataNascimento || !telefoneResponsavel || !tipoSanguineo) {
        console.error("Campos obrigatórios faltando:", { nome, dataNascimento, telefoneResponsavel, tipoSanguineo });
        return;
      }
      
      console.log("Dados do idoso antes de salvar:", {
        nome,
        dataNascimento,
        telefoneResponsavel,
        descricao,
        tipoSanguineo,  
        userId: idUsuario,
        foto,
      });

      await database.write(async () => {
        const createdIdoso = await idosoCollection.create((idoso) => {
          idoso.nome = nome;
          idoso.dataNascimento = `${dataNascimento.split("/").reverse().join("-")}T12:00:00.000Z`;
          idoso.telefoneResponsavel = telefoneResponsavel;
          idoso.descricao = descricao;
          idoso.tipoSanguineo = tipoSanguineo;
          idoso.userId = Number(idUsuario); // Garantindo que userId seja um número
          idoso.foto = foto || ""; // Se foto for undefined, atribui uma string vazia
          idoso.sincronizado = false;
        });

        console.log("Idoso criado com sucesso:", createdIdoso);

        const isConnected = await checkNetworkConnection();
        if (isConnected) {
          await syncIdosoWithServer(createdIdoso);
        }
      });
    } catch (error) {
      console.error("Erro ao salvar o idoso no banco local:", error);
    }
  };
>>>>>>> Stashed changes

  const syncIdosoWithServer = async (idoso: Idoso) => {
    try {
      const response = await postIdoso({
        nome: idoso.nome,
        dataNascimento: idoso.dataNascimento,
        telefoneResponsavel: idoso.telefoneResponsavel,
        descricao: idoso.descricao,
        tipoSanguineo: idoso.tipoSanguineo,
        foto: idoso.foto,
        userId: idoso.userId,
      });

      if (response) {
        await database.write(async () => {
          await idoso.update(() => {
            idoso.sincronizado = true;
          });
        });
        console.log("Idoso sincronizado com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao sincronizar idoso com o servidor:", error);
      ToastAndroid.show("Erro ao sincronizar idoso.", ToastAndroid.SHORT);
    }
  };

  const salvar = async () => {
    if (Object.keys(erros).length > 0) {
      setShowErrors(true);
      return;
    }
<<<<<<< Updated upstream

    if (idUsuario === null) {
      throw new Error("Usuário não encontrado.");
    }

    try {
      setShowLoading(true);
      // await salvarNoBancoLocal();

      const body = {
        nome: nome,
        dataNascimento: getDateIsoString(dataNascimento),
        telefoneResponsavel: telefoneResponsavel,
        descricao: descricao,
        tipoSanguineo: tipoSanguineo,
        idUsuario: idUsuario,
        foto: foto || '',
        dataHora: new Date().toISOString()
      };

      await postIdoso(body, token);

=======
    try {
      setShowLoading(true);
      await salvarNoBancoLocal();
>>>>>>> Stashed changes
      ToastAndroid.show("Idoso salvo com sucesso!", ToastAndroid.SHORT);
      router.replace("/private/pages/listarIdosos");
    } catch (err) {
      ToastAndroid.show(`Erro: ${(err as Error).message}`, ToastAndroid.SHORT);
    } finally {
      setShowLoading(false);
    }
  };

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
                data={getTipoSanguineoOptions()}
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
