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
import StarIcon from "@mui/icons-material/Star";
import SendIcon from "@mui/icons-material/Send";
import { IconButton } from "@mui/material";

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
      .catch((error) => console.log(error));

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
        </div>
        <span className="filtroPerguntaSeleionada">
          {perguntaSelecionada?.filtro?.toUpperCase()}
        </span>
        <span>{perguntaSelecionada?.conteudo}</span>
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

                  {data.Usuario.nome}
                  {token && jwt(token)?.secret?.id == data?.Usuario.id && (
                    <IconButton
                      onClick={() => {
                        deletarResposta(data._id);
                      }}
                    >
                      <DeleteIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  )}
                </span>
                <span>{handleCurso(data.Usuario.curso)}</span>
              </div>
              <span>{data.conteudo}</span>
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
