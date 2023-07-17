import "./style.css";

import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import SidebarContext from "../../../context/SidebarProvider";
import {pesquisaAviso} from "../../../services/pesquisa";
import apiRequest from "../../../services/api";
import handleCurso from "../../../services/curso";

import PersonIcon from "@mui/icons-material/Person";
import StarIcon from "@mui/icons-material/Star";
import isAuthenticated from "../../../isAuth";
import jwt from 'jwt-decode'
import { FotoContext } from "../../../context/FotoProvider";

export default function AvisosConteudo({ materiaPesquisada }) {
  const [allQuest, setAllQuest] = useState([]);
  const { elementoSidebar } = useContext(SidebarContext);
  const [token, setToken] = useState('');
  const fotoContext = useContext(FotoContext)


  useEffect(() => {
    setToken(document.cookie.replace(/(?:(?:^|.*;\s*)jwt\s*\=\s*([^;]*).*$)|^.*$/, '$1'))
  }, [])

  const getAvisos = () => {
    if (elementoSidebar) {
      apiRequest.get("/aviso", {
        headers: {
          Authorization: "Bearer " + token,
        }
      })
        .then(response => {
          let filter = response.data.filter(data => data.curso == elementoSidebar)
          setAllQuest(filter)
        })
        .catch(err => {
          return err
        })
    } else {
      apiRequest.get("/aviso", {
        headers: {
          Authorization: "Bearer " + token,
        }
      })
        .then(response => {
          setAllQuest(response.data)
        })
        .catch(err => {
          return err
        })
    }
  }

  useEffect(() => {
    if (token) {
      getAvisos()
    }
  }, [elementoSidebar, token])

  const allQuests = () => {
    apiRequest.get('/aviso', {
      headers: {
        Authorization: "Bearer " + token,
      }
    })
      .then(response => {
        setAllQuest(response.data)
      })
      .catch(error => {
        console.log(error)
      })
  }

  useEffect(() => {
    if (token) {
      allQuests()
    }
  }, [token])

  const avisosFiltrados = pesquisaAviso(allQuest, materiaPesquisada);

  return token && (
    <div className="container">
      <div className="container-pergunta">
        <div className="criar-pergunta">
          <Link to={isAuthenticated() ? "/avisos/criar-aviso" : "/login"}>
            <button className="botaoCriarAviso">CRIAR AVISO</button>
          </Link>
        </div>
        {avisosFiltrados.map((aviso, index) => {
          return (
            <Link
              to={
                isAuthenticated()
                  ? `/avisos/aviso/${aviso._id}`
                  : "/login"
              }
              key={index}
            >
              <div className="card-aviso">
                <div className="infosAviso">
                <div className="usuario-aviso">
                <img src={fotoContext[aviso.usuario.id]} className="fotosCards" />
                  <div className="usuario-informacao-texto">
                    {/* <span>{aviso.usuario.fotoPerfil}</span> */}
                    <span>{aviso.usuario.nome}</span>
                    <span style={{ color: "#757575" }}>
                      {handleCurso(aviso.usuario.curso)}
                    </span>
                  </div>
                </div>

                <span className="filtroAviso">{aviso.materia.toUpperCase()}</span>
                <div className="textoAviso">
                  <span className="textoAviso">{aviso.titulo}</span>
                  <br></br>
                  <span className="textoAviso">{aviso.conteudo}</span>
                </div>
                <div className="like-comentarioAviso">
                  <StarIcon sx={{ color: "#ffa722", fontSize: 16 }} />
                  <span>{aviso.votos} favoritos</span>
                </div>
              </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
