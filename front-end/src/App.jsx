import "./App.css";

import PerguntaSelecionada from "./pages/Forum/PerguntaSelecionada";
import FormularioPergunta from "./pages/Forum/FormularioPergunta";
import AvisosFormulario from "./pages/Avisos/AvisosFormulario";
import AvisoSelecionado from "./pages/Avisos/AvisoSelecionado";
import AvisosConteudo from "./pages/Avisos/AvisosConteudo";
import CadastrarUsuarios from "./pages/CadastrarUsuarios";
import RankingUsuarios from "./pages/RankingUsuarios";
import EditarUsuario from "./pages/EditarUsuarios";
import PerfilUsuario from "./pages/PerfilUsuario";
import ForumBody from "./pages/Forum/ForumBody";
import Salvos from "./pages/Salvos";
import Sobre from "./pages/Sobre";
import Login from "./pages/login";
import RecuperarSenha from "./pages/RecuperarSenha";
import AlterarSenha from "./pages/AlterarSenha";
import Chat from "./pages/Chat";
import SalasPublico from "./pages/SalasPublico";
import CriarSala from "./pages/SalasPublico/CriarSala";

import ForumLayout from "./pages/Forum/ForumLayout";
import AuthLayout from "./components/AuthLayout";
import SocketProvider, { SocketContext } from "./context/Socket";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import isAuthenticated from "./isAuth";
import jwt from 'jwt-decode'

function App() {
  const socketContext = useContext(SocketContext);
  const [logado, setLogado] = useState(false);
  const [materiaPesquisada, setMateriaPesquisada] = useState("");
  const [token, setToken] = useState('');

  useEffect(() => {
    setToken(document.cookie.replace(/(?:(?:^|.*;\s*)jwt\s*\=\s*([^;]*).*$)|^.*$/, '$1'))
  }, [])

  const getId = async () => {
    const idUser = await jwt(token).secret.id
    return idUser
  }

  useEffect(() => {
    if(token){
      setTimeout(() => {
        getId()
        .then(idUser => {
          socketContext.emit("idUser", idUser)
        })
        .catch(err => {console.log(err)})
      }, 100);
      }
  }, [token])

  // useEffect(() => {
  //   if(isAuthenticated() && token){
  //     const idUser = jwt(token).secret.id
  //     console.log('idUser')
  //     socketContext.emit("idUser", idUser)
  //   }
  // }, [logado, token])


  return (
    <Router>
      <Routes>
        <Route
          element={<AuthLayout setMateriaPesquisada={setMateriaPesquisada} />}
        >
          <Route path="/" element={<ForumLayout pagina="forum" />}>
            <Route
              index
              element={<ForumBody materiaPesquisada={materiaPesquisada} />}
            />
            <Route
              path="/:id"
              element={<ForumBody materiaPesquisada={materiaPesquisada} />}
            />
            <Route
              path="/pergunta/:idPergunta"
              element={<PerguntaSelecionada />}
            />
            <Route path="/criar-pergunta" element={<FormularioPergunta />} />
          </Route>
          <Route path="/avisos" element={<ForumLayout pagina="avisos" />}>
            <Route
              index
              element={<AvisosConteudo materiaPesquisada={materiaPesquisada} />}
            />
            <Route
              path="/avisos/:id"
              element={<AvisosConteudo materiaPesquisada={materiaPesquisada} />}
            />
            <Route
              path="/avisos/aviso/:idAviso"
              element={<AvisoSelecionado />}
            />
            <Route path="/avisos/criar-aviso" element={<AvisosFormulario />} />
          </Route>
          <Route
            path="/ranking-usuarios"
            element={<RankingUsuarios materiaPesquisada={materiaPesquisada} />}
          />
          <Route
            path="/usuario/:idUsuario"
            element={<PerfilUsuario setLogado={setLogado} />}
          />
          <Route path="/salvos" element={<Salvos />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route
            path="/editar-usuario/:idUsuario"
            element={<EditarUsuario />}
          />
          <Route
            path="/chat/:idChat"
            element={
               <Chat mensagemPesquisada={materiaPesquisada} />
           } />
          <Route
            path="/chat"
            element={
              <Chat />

          } />
        </Route>
        <Route
          path="/salasPublico"
          element={<SalasPublico />} />
        <Route
          path="/criarSala"
          element={<CriarSala />} />
        <Route path="/cadastrar-usuario" element={<CadastrarUsuarios />} />
        <Route path="/login" element={<Login setLogado={setLogado} />} />
        <Route path="/recuperar-senha" element={<RecuperarSenha />} />
        <Route path="/alterar-senha" element={<AlterarSenha />} />
      </Routes>
    </Router>
  );
}

export default App;
