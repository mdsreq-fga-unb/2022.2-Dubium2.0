import "./style.css";

import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import isAuthenticated from "../../../isAuth.js";

import SidebarContext from "../../../context/SidebarProvider";
import pesquisaPosts from "../../../services/pesquisa";
import handleCurso from "../../../services/curso";
import apiRequest from "../../../services/api";

import PersonIcon from "@mui/icons-material/Person";
import StarIcon from "@mui/icons-material/Star";
import Footer from "../../../components/footer";
import { FotoContext } from "../../../context/FotoProvider";


apiRequest.defaults.withCredentials = true


export default function ForumBody({ materiaPesquisada }) {
  const [allQuest, setAllQuest] = useState([]);
  const { elementoSidebar } = useContext(SidebarContext);
  const fotoContext = useContext(FotoContext)
 
  useEffect(() => {
    function getPerguntas() {
      if (elementoSidebar) {
        apiRequest.get("/pergunta/view")
          .then(response => {
            let filter = response.data.filter(data => data.curso == elementoSidebar)
            setAllQuest(filter)
          })
          .catch(err => {
            return err
          })
      } else {
        apiRequest.get("/pergunta/view")
          .then(response => {
            setAllQuest(response.data)
          })
          .catch(err => {
            return err
          })
      }
    }
    getPerguntas()
  }, [elementoSidebar])


  useEffect(() => {
    function allQuest() {
      apiRequest.get('/pergunta/view', { withCredentials: true })
        .then(response => {
          setAllQuest(response.data)
        })
        .catch(error => {
          console.log(error)
        })
    }

    allQuest()
  }, [])

  const materiasFiltradas = pesquisaPosts(allQuest, materiaPesquisada);

  return (
    <div className="container">
      <div className="container-pergunta">
        <div className="criar-pergunta">
          <Link
            to={isAuthenticated() ? "/criar-pergunta" : "/login"}
          >
            <button className="buttonPergunta">FAÇA UMA PERGUNTA</button>
          </Link>
        </div>
        {materiasFiltradas.map((data, index) => {
          return (
            <Link
              to={ // quando clicar levar pra pergunta específica
                isAuthenticated()
                  ? `/pergunta/${data._id}`
                  : "/login"
              }
              key={index}
            >
              <div className="card-pergunta">
                <div className="infos">
                <div className="usuario-pergunta">
                  <Link className='link-usuario' to={`/usuario/${data.idUsuario.id}`}>
                    <img src={fotoContext[data.idUsuario.id]} className="fotosCards" />
                    <div className="usuario-informacao-texto">

                      <span>{data.idUsuario.nome}</span>

                      <span>
                        {handleCurso(data.curso)}
                      </span>
                    </div>
                  </Link>
                </div>

                <span className="filtro">{data.filtro}</span>
                </div>


                <span id="titulo">{data.titulo.toUpperCase()}</span>
                <span >{data.conteudo}</span>
                <div className="like-comentario">
                  <StarIcon sx={{ color: "#ffa722", fontSize: 16 }} />
                  <span>{data.favoritado} favoritos</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      <Footer />
    </div >
  );
}
