#Backlog do Produto
## Historico de Revisão

| Data     | Versão | Descrição                  | Autor(es)                                                                          |
|----------|--------|----------------------------|---------------------------------------------------------------------------------------------|
|01/05/2023|   0.1  | Definição do backlog do produto        |[Arthur](https://github.com/Arthrok)                           |
|08/05/2023|0.2|Modificações nos Requisitos Não-Funcionais|[Yasmim](https://github.com/yaskisoba)|
|08/05/2023|0.3|Alteração na estrutura de disposição das US, novas US adicionadas|[Yasmim](https://github.com/yaskisoba), [Arthur](https://github.com/Arthrok), [Eric](https://github.com/ericbky), [Fábio](https://github.com/fabioaletorres)|
|08/05/2023|0.3|Backlog, critérios de aceitação e priorização de US|[Yasmim](https://github.com/yaskisoba)

## 1. Personas
**Usuário**: Refere-se ao usuário comum, o estudante que irá utilizar a plataforma.

## 2. Requisitos Não-Funcionais
| Tipo | Req. | Descrição |
| --- | --- | --- |
| Confiabilidade | RNF01 |O sistema deve ser seguro para evitar qualquer tipo de fraude ou violação de privacidade de acordo com a Lei Geral de Proteção de Dados (LGPD).|
| Escalabilidade | RNF02 |O sistema deve ser escalável para suportar um número considerável de usuários e atividades simultâneas a partir da implementação de uma arquitetura de software escalável.|
| Usabilidade | RNF03 |O sistema deve ser acessível, conforme as diretrizes de acessibilidade para conteúdo web (WCAG) do W3C.|
| Usabilidade | RNF04 |O conteúdo de interface da aplicação deve ser totalmente responsivo para dispositivos desktop.|
| Performance | RNF05 |O sistema deve ser rápido e eficiente (5.000ms), proporcionando uma experiência satisfatória ao usuário a partir de constantes otimizações no código.|
| Requisitos de Interface | RNF06 | Padrão de cores deverá seguir o que foi bem definido pelo cliente: Azul, verde, preto, branco e cinza.|
| Requisitos de Interface | RNF07 | Deverá ter modo claro e escuro. |

## 3. Requisitos Funcionais

| Tema | Épico | US | Critérios de Aceitação | Valor de Negócio | Viabilidade | Complexidade | Total |
|------|-------|----|-----------------------|------------------|-------------|--------------|-------|
|**T02** -  Ranking para Classificação de Usuários|**EP04** - Gerenciar ranqueamento de usuários com base em sua atividade.|**US20** - Eu, como usuário, gostaria de responder as respostas de outros usuários, para que eu consiga auxiliá-los.|Qualquer usuário deve poder responder quaisquer outros usuários.|3|3|2|8|
|**T02** -  Ranking para Classificação de Usuários|**EP04** - Gerenciar ranqueamento de usuários com base em sua atividade.|**US21** -  Eu, como usuário, gostaria de responder os avisos enviados pelo(a) monitor(a), para melhor comunicação.|Qualquer usuário deve poder responder os avisos enviados pelo(a) monitor(a)|3|3|2|8|
|**T03** - Administração de Usuários|**EP08** - Gerenciar usuários do sistema.|**US33** - Eu, como usuário, gostaria de visualizar os perfis de outros usuários, quando o mesmo for selecionado.|Ao clicar no usuário desejado, deve ser direcionado ao seu perfil.|3|3|2|8|
|**T03** - Administração de Usuários|**EP08** - Gerenciar usuários do sistema.|**US34** - Eu, como usuário, gostaria de personalizar e adicionar uma foto ao meu perfil para outros usuários me identificarem.|Deve ser possível adicionar fotos de perfil nos formatos: .png, .gif, .jpeg e .jpg.|3|3|2|8|
|**T04** - Chat|**EP10** - Gerenciar mensagens enviadas pelos usuários.|**US37** - Eu, como usuário, quero ser capaz de enviar mensagens públicas para outros usuários em tempo real, para que eu possa ter conversas públicas com outros usuários sem precisar atualizar a página.|Qualquer usuário participante do chat público deve ser capaz de enviar mensagem.|3|3|2|8|
|**T04** - Chat|**EP10** - Gerenciar mensagens enviadas pelos usuários.|**US38** - Eu, como usuário, quero ser capaz de enviar mensagens privadas para outros usuários, para que eu possa ter conversas privadas que não são visíveis para outros usuários.|Deve ser possível visualizar quando um usuário está digitando; Quaisquer usuários podem enviar mensagens privadas entre dois usuários
.|3|3|2|8|
|**T04** - Chat|**EP11** - Gerenciar histórico de conversas.|**US44** - Eu, como usuário, quero ser capaz de visualizar todo o meu histórico de conversas com outro usuário, para que eu possa rever as informações e referências discutidas.|O histórico deve estar disponível sempre que o chat for rolado para cima.|3|3|2|8|
|**T04** - Chat|**EP11** - Gerenciar histórico de conversas.|**US45** - Eu, como usuário, quero ser capaz de pesquisar meu histórico de conversas por palavra-chave ou data específica, para que eu possa encontrar informações importantes de forma rápida e fácil.|Deve ter um botão específico que indique a busca no chat.|3|3|2|8|
|**T04** - Chat|**EP11** - Gerenciar histórico de conversas.|**US46** - Eu, como usuário, quero ser capaz de arquivar ou excluir conversas antigas que não são mais relevantes para mim, para manter minha lista de conversas organizada e fácil de usar.|Deve ser possível acessar um chat arquivado; Um chat excluído pode ser recuperado no máximo 1 dia após sua exclusão.|3|3|2|8|
|**T04** - Chat|**EP11** - Gerenciar histórico de conversas.|**US47** - Eu, como usuário, quero que meu histórico de conversas mais recentes sejam recuperados e carregados mais rapidamente.|Deve seguir um limite máximo de 1000ms.|3|3|2|8|
|**T05** -  Automatização com IA|**EP12** - Implementação GPT3|**US48** - Eu, como usuário, gostaria de ter o conteúdo de avisos analisados por uma IA para maior confiabilidade|Deve ser indicado no post que foi analisado por uma IA.|3|3|2|8|
|**T05** -  Automatização com IA|**EP12** - Implementação GPT3|**US49** - Eu, como usuário, gostaria de ter o conteúdo de perguntas analisados por uma IA para maior confiabilidade.|Deve ser indicado no post que foi analisado por uma IA.|3|3|2|8|
|**T05** -  Automatização com IA|**EP12** - Implementação GPT3|**US50** - Eu, como usuário, gostaria de ter o conteúdo de respostas analisados por uma IA para maior confiabilidade.|Deve ser indicado no post que foi analisado por uma IA.|3|3|2|8|
|**T05** -  Automatização com IA|**EP12** - Implementação GPT3|**US51** - Eu, como usuário, gostaria de ter o conteúdo das mensagens no chat analisados por uma IA quando solicitado.|Deve ser indicado no post que foi analisado por uma IA.|3|3|2|8|
|**T05** -  Automatização com IA|**EP12** - Implementação GPT3|**US52** - Eu, como usuário, gostaria de ter minhas pesquisas analisadas por uma IA para que ela sugira sugestões de salas.|Deve ser indicado no post que foi analisado por uma IA.|3|3|2|8|
|**T04** - Chat|**EP10** Gerenciar mensagens enviadas pelos usuários.|**US39** - Eu, como usuário, quero ser notificado quando uma nova mensagem privada for enviada para mim, para que eu possa saber imediatamente quando uma nova mensagem chegou e respondê-la.|Deve estar num ícone ao lado da sua foto de perfil na página inicial.|3|3|1|7|
|**T02** -  Ranking para Classificação de Usuários|**EP04** - Gerenciar ranqueamento de usuários com base em sua atividade.|**US17** - Eu, como usuário, gostaria de editar meus avisos  para corrigir erro de digitação.|A edição pode ser feita a qualquer momento sem limite de tempo após sua publicação; Somente o autor do aviso pode editá-lo.|3|3|1|7|
|**T02** -  Ranking para Classificação de Usuários|**EP04** - Gerenciar ranqueamento de usuários com base em sua atividade.|**US18** - Eu, como usuário, gostaria de editar minhas perguntas para corrigir erro de digitação.|A edição pode ser feita a qualquer momento sem limite de tempo após sua publicação; Somente o autor da pergunta pode editá-la.|3|3|2|7|
|**T02** -  Ranking para Classificação de Usuários|**EP04** - Gerenciar ranqueamento de usuários com base em sua atividade.|**US19** - Eu, como usuário, gostaria de editar minhas respostas para corrigir erros de digitação|A edição pode ser feita a qualquer momento sem limite de tempo após sua publicação; Somente o autor da pergunta pode editá-la.|3|3|2|7|
