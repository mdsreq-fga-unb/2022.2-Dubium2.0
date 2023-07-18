# Sprint 2
16/05/2023 - 31/05/2023


## 3.1. Descrição
<!-- descrever de forma geral o objetivo da sprint -->

O que deu certo nessa última Sprint ?

- Chat privado: nessa sprint foi possível criar instâncias de chats entre usuários (US 38)

- Chat: também é possível recuperar as mensagens enviadas pelos usuários através do banco de dados (US 44)

- Os testes foram criados, tivemos momentos importantes para o desenvolvimento da equipe e pessoal também. 


Quais problemas foram foram encontrados?

- Como maior dificuldade encontramos a integração e implementação das requisições dos dados dos usuários no chat, e problemas de conexão com banco de dados.

- Em relação ao chat, o problema atual é a lógica por trás de salvar as mensagens no banco de dados.

- O gerenciamento de tempo foi um problema mas foi muito ligado a falta de familiaridade com o código.

- Alguns membros da equipe tiveram problemas para a utilização do banco de dados.


Como esses problemas foram resolvidos ?

- Como o tempo da sprint foi apertado devido a outras demandas da faculdade e também relacionado ao refatoramento de algumas partes do código, não foi efetivamente resolvido. 

- Foi adotado uma solução temporária para salvar as mensagens via HTTP. A escolha deste método é temporária por não ser eficiente, uma vez que a comunicação HTTP é statless, logo para um chat em tempo real não é a melhor opção. Uma das possíveis soluções serão: 1. armazenar as mensagens em cache e salvar quando tiver um acúmulo específico de mensagens; 2. usar o próprio socket.io (sateful) para armazenar essas mensagens; 3. usar o MongoDB Change Streams para implementar eventos em tempo real.

- A conexão com o banco de dados foi reestabelecida com a reinstalação do mesmo, pois havia alguns arquivos em falta no pacote de instalação.

- A questão da requisições foi implementada com o tempo, conseguimos verificar o que estava de errado e resolver.

O que pode ser mudado para que o time seja mais eficaz?

- A questão de uma melhor organização das US, pois ficaram poucos débitos técnicos que poderiam ser evitados.

- Melhor gerenciamento de tempo e divisão de demandas entre os membros da equipe.

O que cada um pode melhorar?

- O mesmo que o que pode ser mudado para o time ser mais eficaz: gerenciar melhor o tempo.

- A questão da organização e da comunicação com o grupo para sanar dúvidas e sabermos mais sobre o andamento das US.


Relato de programação em pares

- No geral ficamos alternando e nos ajudando, foi bem agregador e produzimos bastante, tanto em sala quanto a distância, principalmente nas requisições e nas verificações do chat. Nessas alternâncias de duplas, algumas se saíram melhores na execução da implementação das US, porém todas as duplas contribuiram em algo para a entrega.


## 3.2. Tarefas
<!-- descrever as issues que definimos para essa sprint e alocar um responsavel por ela -->
Tarefas | Descrição | Responsáveis
------ | --------- | -----------
01 | Documentação | [Fábio](https://github.com/fabioaletorres)
02 | Documentação | [Fábio](https://github.com/fabioaletorres)