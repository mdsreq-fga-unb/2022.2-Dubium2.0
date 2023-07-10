const request = require("supertest");
const server = require("../index");
const { excluirUsuario, buscarUsuarioPorEmail } = require('../service/usuarioService');
const { perguntasCadastradas } = require('../service/perguntaService')

let token;
let idPergunta;

//ignorando console.logs do back-end
console.log = jest.fn();

beforeAll( async () => {
  //criação de usuário
  const response = await request(server)
    .post("/cadastro")
    .send({
        nome_completo: "Teste da Silva",
        curso: 1,
        matricula: 1234567,
        email: "usuario_teste@gmail.com",
        celular: "619999699",
        password: 123456,
    });
  

});

beforeEach(async () => {
  //antes de cada teste, realiza o login para pegar o token de autenticação
    const response = await request(server)
      .post("/login")
      .send({
        username: 'usuario_teste@gmail.com',
        password: '123456'
      });

    token = response.headers['set-cookie'][0].split('=')[1].split(';')[0];
});


describe('Cadastro', () => {

})

describe('Usuário', () => {
  it('Deve fazer login em um usuário', async () => {
    const response = await request(server)
      .post('/login')
      .send({
        username: 'usuario_teste@gmail.com', 
        password: '123456' 
      })

    expect(response).toHaveProperty('status', 200)
  });
})

describe('Perguntas', () => {
  it('Deve criar uma pergunta', async () =>{
    let usuario = await buscarUsuarioPorEmail('usuario_teste@gmail.com')
    const response = await request(server)
      .post('/pergunta')
      .send({
        idUser: {
          username: usuario.email, 
          id: usuario.id, 
          nome: usuario.nome, 
          curso: usuario.curso
        },
        titulo: 'Rei e Rainha da Derivada',
        curso: 1,
        conteudo: 'É obrigatório participar do evento?',
        filtro: 'C1'
      })
      .set('Authorization', `Bearer ${token}`);
    })

    it('Deve excluir uma pergunta', async () => {
      let usuario = await buscarUsuarioPorEmail('usuario_teste@gmail.com')
      let perguntas = await perguntasCadastradas(usuario.id) 
      let idPergunta = perguntas[0]._id.toString();

      const response = await request(server)
        .delete(`/pergunta/${idPergunta}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response).toHaveProperty('status', 201)
    })
})

describe('Respostas', () => {

})

describe('Avisos', () => {

})

describe('Chat', () => {

})



afterAll( async () => {
  //retira o usuário de teste do banco de dados
  await excluirUsuario('usuario_teste@gmail.com')
})