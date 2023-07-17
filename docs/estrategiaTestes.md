# Estratégia de Testes

## Historico de Revisão

| Data       | Versão | Descrição                       | Autor(es)                                                                  |
| ---------- | ------ | ------------------------------- | -------------------------------------------------------------------------- |
| 13/07/2023 | 0.1    | Definição de estratégia de teste | [Eric](https://github.com/ericbky) e [Yasmim](https://github.com/yaskisoba) |
| 13/07/2023 | 0.2    | Resultados dos testes| [Eric](https://github.com/ericbky) e [Yasmim](https://github.com/yaskisoba) |


|Tipo de teste|Nível de teste|Técnica de teste|Objetivo|Perspectiva|Escopo|
|-----------|-------|----------|----------|--------------|---------|
|Funcional|Unitário|Automático|Qualidade interna|Técnica| MVP1 e MVP2|
|Funcional|Integração|Automático|Qualidade interna|Técnica| MVP1 e MVP2|
|Funcional|Sistema|Caixa Preta|Qualidade externa|Negócio| MVP1 e MVP2|
|Usabilidade|Aceitação|Caixa Preta|Qualidade externa|Negócio|RNF04, RNF06, RNF07|

## Resultados
### Teste Unitário
#### MVP 1

|US| Descrição| Critérios de Aceitação| Passou? | Observações|
|---|------------|-------------|-------|--------|
|**US17**|Eu, como usuário, gostaria de editar meus avisos para corrigir erros de digitação.| - O título e conteúdo devem ser editáveis. <br> - Somente o autor do aviso pode editá-lo.|Sim|---|
|**US33**|Eu, como usuário, gostaria de visualizar perfis de outros usuários para quando o mesmo for selecionado.|- Ao clicar no usuário desejado, deve ser direcionado ao seu perfil.|----| Por seu critério estar voltado para interface não foi possível realizar um teste unitário.|
|**US34**|Eu, como usuário, gostaria de personalizar e adicionar uma foto ao meu perfil para outros usuários me identificarem.|- Deve ser possível adicionar fotos de perfil nos formatos: .png, .gif, .jpeg e .jpg.|Sim|---|
|**US37**|Eu, como usuário, quero ser capaz de enviar mensagens públicas para outros usuários em tempo real, para que eu possa ter conversas públicas com outros usuários sem precisar atualizar a página.|- Qualquer usuário participante do chat público deve ser capaz de enviar mensagem.|Sim|---|
|**US38**|Eu, como usuário, quero ser capaz de enviar mensagens privadas para outros usuários, para que eu possa ter conversas privadas que não são visíveis para outros usuários.|- Deve ser possível visualizar quando um usuário está digitando. <br> - Quaisquer usuários podem enviar mensagens privadas entre dois usuários|Sim|Com excessão do primeiro critério, por estar voltado para interface não foi possível realizar um teste unitário.|
|**US39**|Eu, como usuário, quero ser notificado quando uma nova mensagem privada for enviada para mim, para que eu possa saber imediatamente quando uma nova mensagem chegou e respondê-la.|Deve estar num ícone ao lado da sua foto de perfil na página inicial.|----|Por seu critério estar voltado para interface não foi possível realizar um teste unitário.|
|**US44**|Eu, como usuário, quero ser capaz de visualizar todo o meu histórico de conversas com outro usuário, para que eu possa rever as informações e referências discutidas.|- O histórico deve estar disponível sempre que o chat for rolado para cima.|----|Por seu critério estar voltado para interface não foi possível realizar um teste unitário.|

#### MVP 2

| US| Critérios de Aceitação| Passou? | Observações|
|---|------------|-------------|-------|



### Teste de Integração
O teste de integração é realizado em todas as branchs logo após um _push_ no repositório. A partir da definição do worflow, foi escrito um arquivo chamado "workflow.yml". Toda vez que um _push_ é realizado aciona o github actions que por sua vez executa alguns jobs: 

![Captura de tela de 2023-07-17 19-48-44](https://github.com/mdsreq-fga-unb/2023.1-Dubium2.0/assets/87377900/af23f37f-f163-4b4b-90e9-45226e8e4b92)

### Teste de Sistema
O teste de sistema foi realizado no MVP1 pela equipe Armazenaí e pode ser conferido a seguir:

![](./img/relatorio.png)

Já o teste de sistema do MVP2 pode ser observado a seguir:

|US|DOR|DOD|Observações|Conclusão|
|-----------|-----------|------------|------------|---------------|


### Teste de Aceitação
O teste de aceitação foi realizado pela cliente, onde passamos em cada requisito não funcional e ela expôs se estavam de acordo com o solicitado e esperado.

|RNF|Descrição|Conclusão|
|-----------|-----------|------------|











