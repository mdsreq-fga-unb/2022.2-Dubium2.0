import "./style.css";

import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import apiRequest from "../../../services/api";
import handleCurso from "../../../services/curso";
import jwt from 'jwt-decode' 
import BookmarkIcon from "@mui/icons-material/Bookmark";
import PersonIcon from "@mui/icons-material/Person";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton } from "@mui/material";
import { FotoContext } from "../../../context/FotoProvider";

export default function AvisoSelecionado() {
  const [avisoSelecionado, setAvisoSelecionado] = useState({});
  const [favorito, setFavorito] = useState(false);
  const [token, setToken] = useState('');
  const [infosSalvas, setInfosSalvas] = useState({});
  const [editando, setEditando] = useState(false);
  const [tituloEditado, setTituloEditado] = useState("");
  const [conteudoEditado, setConteudoEditado] = useState("");
  const [materiaEditada, setMateriaEditada] = useState("");
  const fotoContext = useContext(FotoContext)
  const { idAviso } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    setToken(document.cookie.replace(/(?:(?:^|.*;\s*)jwt\s*\=\s*([^;]*).*$)|^.*$/, '$1'))
  }, [])

  const getUsuario = () => {
    const idUsuario = jwt(token).secret.id
    apiRequest
    .get(`/usuario/salvos/${idUsuario}`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    .then((response) => {
      setInfosSalvas(response.data);
    })
    .catch((err) => {
      console.error("ops! ocorreu um erro" + err);
    });
  }

  useEffect(() => {
    if(token && infosSalvas){
      getUsuario()
    }
  }, [token]);

  const getAviso = () => {
    apiRequest
      .get(`/aviso/${idAviso}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        setAvisoSelecionado(response.data);
      })
      .catch((err) => {
        console.error("ops! ocorreu um erro" + err);
      });
  }

  useEffect(() => {
    if(token){
      getAviso()
    }
  }, [token]);

  const habilitarEdicao = () => {
    setEditando(true);
    setTituloEditado(avisoSelecionado?.titulo || "");
    setConteudoEditado(avisoSelecionado?.conteudo || "");
    setMateriaEditada(avisoSelecionado?.materia || "");
  };

  const cancelarEdicao = () => {
    setEditando(false);
    setTituloEditado("");
    setConteudoEditado("");
    setMateriaEditada("");
  };

  const deleteAviso = async () => {
    await apiRequest
      .delete(`/aviso/${idAviso}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then(() => {
        alert("Aviso deletado!");
      })
      .catch((error) => console.log(error));

    navigate(-1);
  };

  const updateFavorito = async (bool) => {
    const infoAviso = {
      idUsuario: jwt(token).secret.id,
      idAviso: idAviso,
      favorito: !bool
    };

    await apiRequest
      .post(`/aviso/favoritar/${idAviso}`, infoAviso, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        getAviso()
      })
      .catch((error) => console.log(error));
  };

  const salvarAviso = async (bool) => {
    const infoAviso = {
      id_usuario: jwt(token).secret.id,
      id_aviso: idAviso,
      salvo: !bool
    };

    await apiRequest
      .post("/aviso/salvar", infoAviso, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        getUsuario()
      })
      .catch((error) => console.log(error));
  };

  const editarAviso = async () => {
    const infoAviso = {
      id_usuario: jwt(token).secret.id,
      id_aviso: idAviso,
      // titulo: tituloEditado,
      conteudo: conteudoEditado,
      materia: tituloEditado
    };
  
    await apiRequest
      .put(`/aviso/editar/${idAviso}`, infoAviso, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        setEditando(false);
        getAviso()
      })
      .catch((error) => window.alert(error.response.data.message));
  };

  return (
    token && (
      <div className="container">
        <div className="pergunta-selecionada">
          <div className="ps-usuario-container">
            <div className="ps-usuario-info">
            <Link className="link-usuario" to={`/usuario/${avisoSelecionado?.usuario?.id}`}>
            <img src={fotoContext[avisoSelecionado?.usuario?.id]} className="fotosCards" />
              <div className="ps-usuario-info-texto">
                <span>{avisoSelecionado?.usuario?.nome}</span>
                <span style={{ color: "#757575" }}>
                  {handleCurso(avisoSelecionado?.usuario?.curso)}
                </span>
              </div>
              </Link>
            </div>
            <div className="right-buttons">
            {avisoSelecionado?.usuario?.id === jwt(token).secret.id && (
              <IconButton onClick={deleteAviso}>
                <DeleteIcon sx={{ fontSize: 16 }} />
              </IconButton>
            )}
            {avisoSelecionado?.usuario?.id === jwt(token).secret.id && (
              <IconButton onClick={habilitarEdicao}>
                <EditIcon sx={{ fontSize: 16 }} />
              </IconButton>
            )}
            </div>
          </div>
          <span className="filtro">
            {avisoSelecionado?.materia?.toUpperCase()}
          </span>
          {editando ? (
            <div>
              <label htmlFor="">Título: </label><br></br><br></br>
              <input
                type="text"
                value={tituloEditado}
                onChange={(e) => setTituloEditado(e.target.value)}
                className="textarea-editar"
              />
              <label htmlFor="">Conteúdo:</label><br></br><br></br>
              <textarea className="conteudoArea"
                value={conteudoEditado}
                onChange={(e) => setConteudoEditado(e.target.value)}
              ></textarea>
              <div>
              <button className="salvar-editar" onClick={editarAviso}>Salvar</button>
              <button className="cancelar-editar" onClick={cancelarEdicao}>Cancelar</button>
              </div>
            </div>
          ) : (
            <div>
              <span className="conteudo">{avisoSelecionado?.conteudo}</span>
            </div>
          )}
          <ul className="ps-favoritar-salvar">
            <li
              className="item-interacao"
              onClick={() => {
                updateFavorito(
                  avisoSelecionado?.favoritadoPor?.includes(jwt(token).secret.id)
                );
              }}
            >
              <IconButton>
                <StarIcon
                  className={
                    avisoSelecionado?.favoritadoPor?.includes(jwt(token).secret.id)
                      ? "corFavorito"
                      : ""
                  }
                  sx={{ fontSize: 16 }}
                />
              </IconButton>
              <span>Favoritar</span>
            </li>
            <li
              className="item-interacao"
              onClick={() => {
                salvarAviso(infosSalvas?.avisos?.includes(idAviso));
              }}
            >
              <IconButton>
                <BookmarkIcon
                  className={
                    infosSalvas?.avisos?.includes(idAviso) ? "corFavorito" : ""
                  }
                  sx={{ fontSize: 16 }}
                />
              </IconButton>
              <span>
                {infosSalvas?.avisos?.includes(idAviso) ? "Salvo" : "Salvar"}
              </span>
            </li>
          </ul>
        </div>
      </div>
    )
  );
}
