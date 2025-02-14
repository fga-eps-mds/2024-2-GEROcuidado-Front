# Estado Atual e Próximos Passos

## Estado Atual
Atualmente, o código para salvar dados tanto localmente quanto remotamente está implementado nesta branch específica. O aplicativo pode operar offline e armazenar os dados localmente, enviando-os ao servidor quando houver conexão com a internet. No entanto, a sincronização entre o banco de dados local e o banco de dados remoto não está funcionando corretamente. 

Isso ocorre porque as tabelas nos dois bancos possuem estruturas diferentes, impedindo a sincronização adequada dos dados. Além disso, foram identificados outros problemas ao longo das tentativas de implementação, como o fato de que o código inteiro estava preparado apenas para funcionar localmente, sem considerar a necessidade de integração com um banco remoto.

## Próximos Passos
1. **Analisar e Unificar Estruturas:**
   - Comparar as tabelas do banco local e do banco remoto.
   - Ajustar a estrutura do banco local para que corresponda à do banco remoto ou vice-versa.

2. **Ajustar a Lógica de Sincronização:**
   - Garantir que os identificadores e relacionamentos estejam coerentes entre os dois bancos.

3. **Ajustar o Código para Suporte a Sincronização:**
   - Refatorar trechos do código que assumem funcionamento exclusivamente local.
   - Ajustar mecanismos para cenários offline e estratégias de reconciliação de dados ao reconectar.

---
Essa abordagem garantirá que o aplicativo funcione corretamente em modo offline e consiga sincronizar os dados de forma confiável quando a conexão for restabelecida.

