import "./style.css";

import handleCurso from "../../services/curso";

import { Link } from "react-router-dom";
import { pesquisaUsuario } from "../../services/pesquisa";
import { useContext, useEffect, useState } from "react";
import apiRequest from "../../services/api";
import AuthContext from "../../context/AuthProvider";
import jwt from 'jwt-decode'
import PersonIcon from "@mui/icons-material/Person";
import StarIcon from "@mui/icons-material/Star";

export default function RankingUsuarios({ materiaPesquisada }) {
  const [usuarios, setUsuarios] = useState([]);
  const [token, setToken] = useState('');

  useEffect(() => {
    setToken(document.cookie.replace(/(?:(?:^|.*;\s*)jwt\s*\=\s*([^;]*).*$)|^.*$/, '$1'))
  }, [])

  const getUsuarios = () => {
    apiRequest
      .get("/usuario", {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        setUsuarios(response.data);
      })
      .catch((err) => {
        console.error("ops! ocorreu um erro" + err);
      });
  }

  useEffect(() => {
    if (token) {
      getUsuarios()
    }
  }, [token]);

  const usuariosFiltrados = pesquisaUsuario(usuarios, materiaPesquisada);

  return (
    <div className="container">
      <ul className="ranking-usuario">
        {usuariosFiltrados.map((usuario, index) => (
          <Link
            to={`/usuario/${usuario._id}`}
            key={index}
            style={{ width: "50%" }}
          >
            <li className="usuario-ranqueado">
              <div
                className="dadosUsuario"
              >
                {usuario.foto ? (
                  <img id="imagemPerfil" src={usuario.foto} alt="Selected" />
                ) : (
                  <PersonIcon sx={{ fontSize: 120 }} />
                )}
                <div className="dadosRanking"
                  style={{
                    marginTop: "2rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "5px",
                  }}
                >
                  <span id="textoNome">{usuario.nome_completo}</span>
                  <span id="texto">{handleCurso(usuario.curso)}</span>
                </div>
              </div>
              <div className="ru-favorito">
                {/* <StarIcon sx={{ color: "#ffa722", fontSize: 16 }} />
                <span>{1 - 1} favoritos</span> */}
                {/* arrumar o favoritos */}
              </div>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
}
