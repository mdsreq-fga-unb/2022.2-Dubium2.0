const request = require("supertest");
const server = require("../index");
const { excluirUsuario, buscarUsuarioPorEmail } = require('../service/usuarioService');
const { perguntasCadastradas, deletarPerguntasPorUsuario } = require('../service/perguntaService')

let token;
let idPergunta;

//ignorando console.logs do back-end
//console.log = jest.fn();

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

  it('Deve obter todas as perguntas', async () =>{
    const response = await request(server)
      .get('/pergunta/view')

    expect(Array.isArray(response.body)).toBe(true);
  })

  it('Deve obter uma pergunta a partir do seu ID', async () =>{
    let usuario = await buscarUsuarioPorEmail('usuario_teste@gmail.com')
    let perguntas = await perguntasCadastradas(usuario.id)
    let idPergunta = perguntas[0]._id.toString();

    const response = await request(server)
      .get(`/pergunta/${idPergunta}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response).toHaveProperty('status', 201)
  })

  it('Deve editar a pergunta se o usuário tiver permissão para editar', async () =>{
    let usuario = await buscarUsuarioPorEmail('usuario_teste@gmail.com')
    let perguntas = await perguntasCadastradas(usuario.id)
    let idPergunta = perguntas[0]._id.toString();
    const response = await request(server)
      .put(`/pergunta/editar/${idPergunta}`)
      .send({
        titulo: "Título Editado",
        conteudo: "Conteúdo Editado",
        curso: 1,
        filtro: "IE"
      })
      .set('Authorization', `Bearer ${token}`);

      expect(response).toHaveProperty('status', 200)
  })

  it('Deve retornar um erro se a pergunta não for encontrada', async () =>{
    let idPergunta = "64ab31c0b8fdef813c2c201c" //definindo um id aleatório
    const response = await request(server)
      .put(`/pergunta/editar/${idPergunta}`)
      .send({
        titulo: "Título Editado",
        conteudo: "Conteúdo Editado",
        curso: 1,
        filtro: "IE"
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response).toHaveProperty('status', 500)
  })

  it('Deve retornar um erro se a atualização da pergunta não for bem sucedida', async () =>{
    let idPergunta = "64ab31c0b8fdef813c2c201c" //definindo um id aleatório
    try {
      const response = await request(server)
      .put(`/pergunta/editar/${idPergunta}`)
      .send({
        titulo: 2378123,
        conteudo: "Conteúdo Editado",
        curso: 1,
        filtro: "IE"
      })
      .set('Authorization', `Bearer ${token}`);
    } catch (error){
       expect(response).rejects.toThrow("Pergunta não encontrada!")
    }
  })

  it('Deve favoritar uma pergunta', async () => {
    let usuario = await buscarUsuarioPorEmail('usuario_teste@gmail.com')
    let perguntas = await perguntasCadastradas(usuario.id)
    let idPergunta = perguntas[0]._id.toString();

    const response = await request(server)
      .post(`/pergunta/favoritar/${idPergunta}`)
      .send({
        idUsuario: usuario.id,
        idPergunta: idPergunta,
        favorito: true
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response).toHaveProperty('status', 201)
  })

  it('', async() => {
    let usuario = await buscarUsuarioPorEmail('usuario_teste@gmail.com')
    let perguntas = await perguntasCadastradas(usuario.id)
    let idPergunta = perguntas[0]._id.toString();

    const response = await request(server)
      .post('/pergunta/salvar')
      .send({
        id_usuario: usuario.id,
        id_pergunta: idPergunta,
        salvo: true
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response).toHaveProperty('status', 201)
  })

  it('', async() => {


  })




})

describe('Respostas', () => {

})

describe('Avisos', () => {

})

// describe('Chat', () => {

// })


afterAll( async () => {
  let usuario = await buscarUsuarioPorEmail('usuario_teste@gmail.com')

  //deleta a pergunta de teste do banco de dados
  await deletarPerguntasPorUsuario(usuario)

  //retira o usuário de teste do banco de dados
  await excluirUsuario('usuario_teste@gmail.com')
})

