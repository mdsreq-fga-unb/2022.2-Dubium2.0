import "./App.css";

import apiRequest from "./services/api";

import PerguntaSelecionada from "./pages/Forum/PerguntaSelecionada";
import FormularioPergunta from "./pages/Forum/FormularioPergunta";
import RankingUsuarios from "./pages/RankingUsuarios";
import ForumLayout from "./pages/Forum/ForumLayout";
import PerfilUsuario from "./pages/PerfilUsuario";
import ForumBody from "./pages/Forum/ForumBody";
import Header from "./components/header";
import Footer from "./components/footer";
import Sobre from "./pages/Sobre";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import AvisosConteudo from "./pages/Avisos/AvisosConteudo";
import AvisosFormulario from "./pages/Avisos/AvisosFormulario";
import AvisoSelecionado from "./pages/Avisos/AvisoSelecionado";
import CadastrarUsuarios from "./pages/CadastrarUsuarios";
import EditarUsuario from "./pages/EditarUsuarios";
import Login from "./pages/login";
import Salvos from "./pages/Salvos";


function App() {
  const [usuarios, setUsuarios] = useState([]);
  const [materiaPesquisada, setMateriaPesquisada] = useState("");

  useEffect(() => {
    apiRequest
      .get("usuarios")
      .then((response) => {
        setUsuarios(response.data);
      })
      .catch((err) => {
        console.error("ops! ocorreu um erro" + err);
      });
  }, []);

  return (
    <Router>
      <Header setMateriaPesquisada={setMateriaPesquisada} />
      <Routes>
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
            element={<PerguntaSelecionada usuarios={usuarios} />}
          />
          <Route
            path="/criar-pergunta"
            element={<FormularioPergunta usuarios={usuarios} />}
          />
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
            element={<AvisoSelecionado usuarios={usuarios} />}
          />
          <Route
            path="/avisos/criar-aviso"
            element={<AvisosFormulario usuarios={usuarios} />}
          />
        </Route>
        <Route
          path="/ranking-usuarios"
          element={<RankingUsuarios materiaPesquisada={materiaPesquisada} />}
        />
        <Route path="/usuario/:idUsuario" element={<PerfilUsuario />} />
        <Route path="/cadastro-usuario" element={<CadastrarUsuarios />} />
        <Route path="/editar-usuario/:idUsuario" element={<EditarUsuario />} />
        <Route path="/salvos" element={<Salvos />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;