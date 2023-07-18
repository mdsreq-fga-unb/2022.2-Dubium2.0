import "./style.css";

import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import apiRequest from "../../../services/api";
import handleCurso from "../../../services/curso";

import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import PersonIcon from "@mui/icons-material/Person";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import StarIcon from "@mui/icons-material/Star";
import SendIcon from "@mui/icons-material/Send";
import { IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

import jwt from 'jwt-decode'
import { FotoContext } from "../../../context/FotoProvider";

export default function PerguntaSelecionada() {
  const [perguntaSelecionada, setPerguntaSelecionada] = useState({});
  const [respostas, setRespostas] = useState([]);
  const [favoritoPergunta, setFavoritoPergunta] = useState(false);
  const [favoritoResposta, setFavoritoResposta] = useState(false);
  const [infosSalvas, setInfosSalvas] = useState({});
  const [comentar, setComentar] = useState(false);
  const [token, setToken] = useState('');
  const fotoContext = useContext(FotoContext)
  const { idPergunta } = useParams();
  const [editando, setEditando] = useState(false);
  const [tituloEditado, setTituloEditado] = useState("");
  const [conteudoEditado, setConteudoEditado] = useState("");
  const [materiaEditada, setMateriaEditada] = useState("");
  const [editarResposta, setEditarResposta] = useState(false)
  const [novoConteudoResposta, setNovoConteudoResposta] = useState("")

  const navigate = useNavigate();


  useEffect(() => {
    setToken(document.cookie.replace(/(?:(?:^|.*;\s*)jwt\s*\=\s*([^;]*).*$)|^.*$/, '$1'))
  }, [])




  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const getPerguntas = () => {
    apiRequest
      .get(`pergunta/${idPergunta}`, {
        headers: {
          Authorization: "Bearer " + token
        }
      })
      .then((response) => {
        console.log(response)
        setPerguntaSelecionada(response.data);
      })
      .catch((err) => {
        console.error("ops! ocorreu um erro" + err);
      });
  }

  useEffect(() => { // get pergunta
    if (token) {
      getPerguntas()
    }
  }, [token]);

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
    if (token && infosSalvas) {
      getUsuario()
    }
  }, [token]);

  useEffect(() => {
    if (token && perguntaSelecionada) {
      console.log(perguntaSelecionada)
      setFavoritoPergunta(perguntaSelecionada?.favoritadoPor?.includes(jwt(token).secret.id) )
    }
  }, [perguntaSelecionada])

  const verificaFavorito = (bool) => {
    if (bool) {
      return bool
    }
    return bool
  }

  // const verificaSalvo = (bool) => {
  //   if(bool){
  //     return bool
  //   }
  //   return bool
  // }

  const getRespostas = () => {
    apiRequest
      .get(`resposta/pergunta/${idPergunta}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        setRespostas(response.data);
      })
      .catch((err) => {
        console.error("ops! ocorreu um erro" + err);
      });
  }

  useEffect(() => {
    if (token) {
      getRespostas()
    }
  }, [token])


  const editarPergunta = async () => {
    const infoPergunta = {
      id_usuario : jwt(token).secret.id,
      id_pergunta: idPergunta,
      conteudo: conteudoEditado,
      titulo: tituloEditado
      
    };
  
    await apiRequest
      .put(`/pergunta/editar/${idPergunta}`, infoPergunta, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        setEditando(false);
        getPerguntas();
        
      })
      .catch((error) => window.alert(error.response.data.message));
  };

  const habilitarEdicaoPergunta = () => {
    setEditando(true);
    setTituloEditado(perguntaSelecionada?.titulo || "");
    setConteudoEditado(perguntaSelecionada?.conteudo || "");
  };

  const habilitarEdicaoResposta = () => {
    setEditarResposta(true);

  };

  const salvarNovaResposta = async (idResposta, novoConteudo) => {
    await apiRequest
      .put("/resposta/editar", { idResposta, novoConteudo }, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then(response => {
        getRespostas()
        setNovoConteudoResposta("")
      })
      .catch(err => {alert(err.response.data.message)})
      setEditarResposta(false)
  }

  const cancelarEdicao = () => {
    setEditando(false);
    setTituloEditado("");
    setConteudoEditado("");
  };

  const deletarPergunta = async () => {
    await apiRequest
      .delete(`/pergunta/${idPergunta}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then(() => {
        alert("Pergunta deletada!");
      })
      .catch((error) => console.log(error));

    navigate(-1);
  };

  const deletarResposta = async (idResposta) => {
    await apiRequest
      .delete(`/resposta/pergunta/${idResposta}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        alert("Resposta deletada!");
        getRespostas()
      })
      .catch((error) => console.log(error));
  };

  const updateFavoritoPergunta = async (bool) => {
    const infoPergunta = {
      idUsuario: jwt(token).secret.id,
      idPergunta: perguntaSelecionada._id,
      favorito: !bool
    }
    await apiRequest
      .post(`/pergunta/favoritar/${perguntaSelecionada._id}`, infoPergunta, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        setFavoritoPergunta(infoPergunta.favorito)
      })
      .catch((error) => console.log(error));
  };

  const updateFavoritoResposta = async (bool, id) => {
    const infoResposta = {
      idUsuario: jwt(token).secret.id,
      idResposta: id,
      favorito: !bool
    };
    await apiRequest
      .post(`/resposta/favoritar/${id}`, infoResposta, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        getRespostas()
      })
      .catch((error) => console.log(error));
  };

  const salvarPergunta = async (bool) => {
    const infoPergunta = {
      id_usuario: jwt(token).secret.id,
      id_pergunta: idPergunta,
      salvo: !bool
    };

    await apiRequest
      .post("/pergunta/salvar", infoPergunta, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        getUsuario()
      })
      .catch((error) => console.log(error));
  };

  const onSubmit = async (data) => { // registra nova resposta
    let novaResposta = {
      Usuario: jwt(token).secret,
      idPergunta: idPergunta,
      conteudo: data.resposta,
    };

    await apiRequest
      .post("/resposta", novaResposta, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then(response => {
        getRespostas()
      })
      .catch((error) => alert(error.response.data.message));

    setComentar(!comentar);
    reset()
  };


  // PERGUNTA
  return (
    <div className="container">
      <div className="pergunta-selecionada">
        <div className="ps-usuario-container">
          <div className="ps-usuario-info">
          <img src={fotoContext[perguntaSelecionada?.idUsuario?.id]} className="fotosCards" />
            <div className="ps-usuario-info-texto">


                <span>{perguntaSelecionada?.idUsuario?.nome}</span>


              <span style={{ color: "#757575" }}>
                {handleCurso(perguntaSelecionada?.usuario?.curso)}
                {/* mais na frente arrumar isso */}
              </span>
            </div>
          </div>
          {token && jwt(token)?.secret?.id == perguntaSelecionada?.idUsuario?.id && (
            <IconButton onClick={deletarPergunta}>
              <DeleteIcon sx={{ fontSize: 16 }} />
            </IconButton>
          )}
          {token && jwt(token)?.secret?.id == perguntaSelecionada?.idUsuario?.id && (
            <IconButton onClick={habilitarEdicaoPergunta}>
              <EditIcon sx={{ fontSize: 16 }} />
            </IconButton>
          )}
        </div>
        <span className="titulo">
            {perguntaSelecionada?.titulo}
          </span>
        <span className="filtroPerguntaSelecionada">
          {perguntaSelecionada?.filtro?.toUpperCase()}
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
              <button className="salvar-editar" onClick={editarPergunta}>Salvar</button>
              <button className="cancelar-editar" onClick={cancelarEdicao}>Cancelar</button>
              </div>
            </div>
          ) : (
            <div>
              <span className="conteudo">{perguntaSelecionada?.conteudo}</span>
            </div>
          )}
        <ul className="container-interacao">
          <div className="ps-favoritar-salvar">
            <li
              className="item-interacao"
              onClick={() => {
                updateFavoritoPergunta(perguntaSelecionada?.favoritadoPor?.includes(jwt(token).secret.id));
              }}
            >
              {/* FAVORITAR PERGUNTA */}
              <IconButton>
                <StarIcon
                  className={favoritoPergunta ? "corFavorito" : ""}
                  sx={{ fontSize: 16 }}
                />
              </IconButton>
              <span>Favoritar</span>
            </li>
            {/* SALVAR PERGUNTA */}
            {token &&
              <li
                className="item-interacao"
                onClick={() => {
                  salvarPergunta(infosSalvas?.perguntas?.includes(idPergunta))
                }}
              >
                <IconButton>
                  <BookmarkIcon sx={{ fontSize: 16 }}
                    className={infosSalvas?.perguntas?.includes(idPergunta) ? "corFavorito" : ""}
                  />
                </IconButton>
                <span>{infosSalvas?.perguntas?.includes(idPergunta) ? "salvo" : "salvar"}</span>
              </li>}
          </div>
          {/* BOTAO PARA RESPONDER */}
          <li className="item-interacao" onClick={() => setComentar(!comentar)}>
            <IconButton>
              <QuestionAnswerIcon sx={{ fontSize: 16 }} />
            </IconButton>
            <span>Responder</span>
          </li>
        </ul>
        {/* RESPOSTA */}
        {comentar && (
          <div>
            <form
              action=""
              onSubmit={handleSubmit(onSubmit)}
              className="formulario"
            >
              <div>
                <textarea
                  name="resposta"
                  {...register("resposta")}
                  cols="30"
                  rows="2"
                  placeholder="Comentar"
                  className="comentar"
                  maxLength={500}
                ></textarea>
                <IconButton type="submit">
                  <SendIcon sx={{ fontSize: 20, color: "#166799" }} />
                </IconButton>
              </div>
            </form>
          </div>
        )}
        {/* puxando respostas da pergunta */}
        <ul className="container-resposta">
          {respostas.map((data, index) => (
            <li value={data._id} key={index} className="card-resposta">
              <div className="usuario-informacao-texto">
              <img src={fotoContext[data.Usuario.id]} className="fotosCards" />
                <span
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <img src={fotoContext[perguntaSelecionada?.data.idUsuario?.id]} className="fotosCards" />
                  {data.Usuario.nome}
                  {token && jwt(token)?.secret?.id == data?.Usuario.id && (
                    <IconButton onClick={() => {deletarResposta(data._id);}} >
                      <DeleteIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  )}
                  {token && jwt(token)?.secret?.id == data?.Usuario.id && !editarResposta && (
                    <IconButton onClick={habilitarEdicaoResposta}>
                      <EditIcon sx={{ fontSize: 16 }} />
                    </IconButton>
            )}
              {token && jwt(token)?.secret?.id == data?.Usuario.id && editarResposta &&
              
                <CloseIcon
                  onClick={() => {setEditarResposta(false)}}
                />
              }
                </span>
                <span>{handleCurso(data.Usuario.curso)}</span>
              </div>
              {!editarResposta && <span>{data.conteudo}</span>}
              { token && jwt(token)?.secret?.id == data?.Usuario.id && editarResposta &&
                
                <div>
                  <input
                      type="text"
                      placeholder={data.conteudo}
                      onChange={(e) => setNovoConteudoResposta(e.target.value)}
                      className="textarea-editar"
                    />
                  <button
                  className="salvar-editar"
                    onClick={() => {
                      salvarNovaResposta(data._id, novoConteudoResposta)
                    }}
                  >salvar</button>
                </div>
              
              
              
              }
              <div
                className="ps-favoritar"
                onClick={() => {
                  verificaFavorito(data.favoritadoPor.includes(jwt(token).secret.id))
                  updateFavoritoResposta(data.favoritadoPor.includes(jwt(token).secret.id), data._id)
                }}
              >
                <IconButton>
                  <StarIcon
                    className={data.favoritadoPor.includes(jwt(token).secret.id) ? "corFavorito" : ""}
                    sx={{ fontSize: 16 }}
                  />
                </IconButton>
                <span>{data.votos}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
