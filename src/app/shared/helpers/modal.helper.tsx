interface IErrors {
    valor?: string;
}

export const validateValue = (valor: string | undefined, setShowErrors: (show: boolean) => void, setErros: (errors: IErrors) => void) => {
    const erros: IErrors = {};
    
    if (!valor) {
      erros.valor = "Campo obrigatório!";
      setShowErrors(true);
    } else if (!/^[0-9/.]+$/.test(valor)) {
      erros.valor = "Formato inválido!";
      setShowErrors(true);
    }
  
    setErros(erros);
  };