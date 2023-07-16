const request = require("supertest");
const server = require("../index");
const { excluirUsuario, buscarUsuarioPorEmail, obterUsuarios } = require('../service/usuarioService');
const { perguntasCadastradas, deletarPerguntasPorUsuario } = require('../service/perguntaService')
const { avisosCadastrados, deletarAvisosPorUsuario } = require('../service/avisoService')
const { deletarRespostasPorUsuario } = require('../service/respostaService')

let token;
let respostas;

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
        conteudo: 'Que horas começa o evento?',
        filtro: 'C1'
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response).toHaveProperty('status', 201)
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

  it('Deve salvar uma pergunta', async() => {
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
})

describe('Respostas', () => {
  it('Deve criar um comentário', async() => {
    let usuario = await buscarUsuarioPorEmail('usuario_teste@gmail.com')
    let perguntas = await perguntasCadastradas(usuario.id)
    let idPergunta = perguntas[0]._id.toString();

    const response = await request(server)
      .post('/resposta/')
      .send({
        Usuario: {
          username: usuario.email,
          nome: usuario.nome_completo,
          id: usuario.id,
          curso: usuario.curso
        },
        idPergunta: idPergunta,
        conteudo: "Não sei... "
      })
      .set('Authorization', `Bearer ${token}`)

    expect(response).toHaveProperty('status', 201)
  })

  it('Deve retornar as respostas de uma pergunta', async() => {
    let usuario = await buscarUsuarioPorEmail('usuario_teste@gmail.com')
    let perguntas = await perguntasCadastradas(usuario.id)
    let idPergunta = perguntas[0]._id.toString();

    const response = await request(server)
      .get(`/resposta/pergunta/${idPergunta}`)
      .set('Authorization', `Bearer ${token}`)

    respostas = response.body
    expect(Array.isArray(response.body)).toBe(true);
  })

  it('Deve favoritar uma resposta à uma pergunta', async() => {
    let usuario = await buscarUsuarioPorEmail('usuario_teste@gmail.com')
    let perguntas = await perguntasCadastradas(usuario.id)
    let idPergunta = perguntas[0]._id.toString();

    let idResposta = respostas[0]._id.toString();

    const response = await request(server)
      .post('/resposta/favoritar/${idPergunta}')
      .send({
        Usuario: {
          username: usuario.email,
          nome: usuario.nome_completo,
          id: usuario.id,
          curso: usuario.curso
        },
        idResposta: idResposta,
        favorito: true
        })
      .set('Authorization', `Bearer ${token}`)

    expect(response).toHaveProperty('status', 201)
  })

})

describe('Avisos', () => {
  it('Deve criar um aviso', async() => {
    let usuario = await buscarUsuarioPorEmail('usuario_teste@gmail.com')
    const response = await request(server)
      .post('/aviso/criar')
      .send({
        id_usuario: {
          username: usuario.email,
          id: usuario.id,
          nome: usuario.nome_completo,
          curso: usuario.curso,
        },
        tituloAviso: "Aviso",
        corpoAviso: "Esse é um aviso bem maneiro!" ,
        id_cursoAviso: usuario.curso,
        filtro: "Matérias"
      })
      .set('Authorization', `Bearer ${token}`)

    expect(response).toHaveProperty('status', 201)
  })

  it('Deve obter todos os avisos', async() => {
    const response = await request(server)
      .get('/aviso/')
      .set('Authorization', `Bearer ${token}`)

    expect(Array.isArray(response.body)).toBe(true);
  })

  it('Deve obter um aviso a partir do seu id', async() =>{
    let usuario = await buscarUsuarioPorEmail('usuario_teste@gmail.com')
    let avisos = await avisosCadastrados(usuario.id)
    let idAviso = avisos[0]._id.toString();

    const response = await request(server)
      .get(`/aviso/${idAviso}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response).toHaveProperty('status', 201)
  })

  it('Deve editar o aviso se o usuário tiver permissão para editar', async() => {
    let usuario = await buscarUsuarioPorEmail('usuario_teste@gmail.com')
    let avisos = await avisosCadastrados(usuario.id)
    let idAviso = avisos[0]._id.toString();

    const response = await request(server)
      .put(`/aviso/editar/${idAviso}`)
      .send({
        titulo: "Título editado",
        materia: "materia editada",
        conteudo: "conteudo editado"
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response).toHaveProperty('status', 200)
  })

  it('Deve salvar um aviso', async() => {
    let usuario = await buscarUsuarioPorEmail('usuario_teste@gmail.com')
    let avisos = await avisosCadastrados(usuario.id)
    let idAviso = avisos[0]._id.toString();

    const response = await request(server)
      .post(`/aviso/salvar`)
      .send({
        id_usuario: usuario.id,
        id_aviso: idAviso,
        salvo: true
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response).toHaveProperty('status', 201)
  })

  it('Deve retornar todos os avisos salvos', async() => {
    let usuario = await buscarUsuarioPorEmail('usuario_teste@gmail.com')
    let arrayAvisos = usuario.salvos.avisos

    const response = await request(server)
      .post('/aviso/salvos')
      .send({
        arrayAvisos: arrayAvisos
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response).toHaveProperty('status', 201)
  })

  it('Deve favoritar um aviso', async() => {
    let usuario = await buscarUsuarioPorEmail('usuario_teste@gmail.com')
    let avisos = await avisosCadastrados(usuario.id)
    let idAviso = avisos[0]._id.toString();

    const response = await request(server)
      .post(`/aviso/favoritar/${idAviso}`)
      .send({
        idUsuario: usuario.id,
        idAviso: idAviso,
        favorito: true
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response).toHaveProperty('status', 201)
  })


})

describe('Chat', () => {
  it('Deve abrir um chat privado entre duas pessoas', async() => {
    let usuarios = await obterUsuarios()
    usuario_target = usuarios[0]
    let usuario = await buscarUsuarioPorEmail('usuario_teste@gmail.com')

    const response = request(server)
      .post("/chatInstance")
      .send({
        user: {
          id: usuario.id,
          nome: usuario.nome_completo,
          notificacoes: 0
        },
        userTarget: {
          id: usuario_target._id.toString(),
          nome: usuario_target.nome_completo,
          notificacoes: 0
        },
        privado: true
      })
      .set('Authorization', `Bearer ${token}`)

    console.log(response)

  })
})


afterAll( async () => {
  let usuario = await buscarUsuarioPorEmail('usuario_teste@gmail.com')

  //deleta as respostas de teste do banco de dados
  await deletarRespostasPorUsuario(usuario)

  //deleta as perguntas de teste do banco de dados
  await deletarPerguntasPorUsuario(usuario)

  //deleta os avisos de teste do banco de dados
  await deletarAvisosPorUsuario(usuario)

  //retira o usuário de teste do banco de dados
//  await excluirUsuario('usuario_teste@gmail.com')


})

