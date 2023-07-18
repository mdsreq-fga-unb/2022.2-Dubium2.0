import "./style.css";

import handleCurso from "../../services/curso";
import apiRequest from "../../services/api";

import { useContext, useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";

import StarIcon from "@mui/icons-material/Star";
import { IconButton } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import jwt from 'jwt-decode';
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css";
import PerguntasCadastradas from "./PerguntasCadastradas";
import { SocketContext } from "../../context/Socket";


export default function PerfilUsuario({ setLogado }) {
  const [usuarioSelecionado, setUsuarioSelecionado] = useState({});
  const [favorito, setFavorito] = useState(false);
  const [token, setToken] = useState('');
  const socket = useContext(SocketContext);



  const { idUsuario } = useParams();

  const navigate = useNavigate();

  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (event) => {
    const url = "https://api.cloudinary.com/v1_1/dueumomvp/image/upload";
    const formData = new FormData();
    const file = event.target.files[0];

    if (file) {
      formData.append("file", file);
      formData.append("upload_preset", "kp8hqpxl")
      fetch(url, {
        method: 'POST',
        body: formData
      })
      .then(res => res.json())
      .then(data => {
        salvarFoto(data.url)
      })
      .catch(err => console.log(err))
    }
  };

  const salvarFoto = async (urlFoto) => {
    const data = {
      idUsuario: jwt(token).secret.id,
      url: urlFoto
    }
    await apiRequest
    .post("/usuario/salvarFoto", data, {
      headers: {
        Authorization: "Bearer " + token
      }
    })
      .then(response => {
        setSelectedImage(urlFoto)
      })
      .catch(err => {
        console.log(err)
      })
  }



  useEffect(() => {
    setToken(document.cookie.replace(/(?:(?:^|.*;\s*)jwt\s*\=\s*([^;]*).*$)|^.*$/, '$1'))
  }, [])

  const addChatInstance = async () => {
    let verify = false
    const data = {
      user: {
        id: jwt(token).secret.id,
        nome: jwt(token).secret.nome,
        notificacoes: 0
      },
      userTarget: {
        id: usuarioSelecionado._id,
        nome: usuarioSelecionado.nome_completo,
        notificacoes: 0
      },
      privado: true
    }
    usuarioSelecionado.chats.forEach(e => {
      if (e.privado && e.usuarios.includes(data.user.id)) {
        navigate(`/chat/${e.idChat}`)
        return verify = true
      }
    })

    if (!verify) {
      await apiRequest
        .post("/usuario/chatInstance", data, {
          headers: {
            Authorization: "Bearer " + token
          },
        })
        .then(response => {
          console.log("Instância criada com sucesso")
          setTimeout(() => {
            let chat = response.data
            let idUser = chat.usuarios[0].user.id == jwt(token).secret.id ? chat.usuarios[0].userTarget.id : chat.usuarios[0].user.id
            socket.emit("attSidebar", {chat, idUser})
            navigate(`/chat/${chat._id}`)
          }, 150);
        })
        .catch(err => {
          console.log({ error: "Erro ao fazer requisição" })
        })
    }
  }
  

  const getUsuario = () => {
    apiRequest
      .get(`/usuario/${idUsuario}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        setUsuarioSelecionado(response.data);
        setSelectedImage(response.data.foto)
      })
      .catch((err) => {
        console.error("ops! ocorreu um erro" + err);
      });
  }

  useEffect(() => {
    if (token && usuarioSelecionado) {
      getUsuario()
    }
  }, [token]);

  const deletarUsuario = async () => {
    const data = { idUsuario: jwt(token).secret.id }
    await apiRequest
      .post("/usuario/deletar", data, {
        headers: {
          Authorization: "Bearer " + token
        },
      })
      .then(response => {
        alert("Conta deletada com sucesso!");
      })
      .catch((err) => {
        console.error("ops! ocorreu um erro" + err);
      });
      document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      navigate("/");
      setLogado(false);
  };



  const handleDelete = () => {
    confirmAlert({
      title: "Excluir conta",
      message: "Você tem certeza que deseja excluir sua conta?",
      buttons: [
        {
          label: "Sim",
          onClick: () => deletarUsuario(),
        },
        {
          label: "Não",
          onClick: () => { },
        },
      ],
    });
  };

  const updateFavotito = async () => {
    await apiRequest
      .patch(favorito ? `usuarios/menos/${idUsuario}` : `usuarios/${idUsuario}`)
      .then((response) => console.log(response))
      .catch((error) => console.log(error));
  };

  return usuarioSelecionado && (
    <div className="container pu-container">
      <div className="perfil-usuario">
        <div className="pu-perfil">
          {selectedImage ? (
            <img id="imagemPerfil" src={selectedImage} alt="Selected" />
          ) : (
            <PersonIcon sx={{ fontSize: 120 }} />
          )}

          <div className="pu-perfil-texto">
            <span style={{ color: "#201F25" }}>{usuarioSelecionado.nome_completo}</span>
            <span style={{ color: "#757575" }}>
              {handleCurso(usuarioSelecionado.curso)}
            </span>
          </div>
        </div>
        {token && jwt(token).secret.id == idUsuario && (
          <label htmlFor="uploadInput" className="botaoFoto">
            <EditIcon sx={{ fontSize: 16 }} />
            Editar Imagem
          </label>)}
        <input
          id="uploadInput"
          type="file"
          accept=".jpg, .jpeg, .png, .gif"
          onChange={handleImageChange}
          style={{ display: 'none' }}
        />

        {token && jwt(token).secret.id == idUsuario && (
          <Link to="/salvos">
            <button className="button-salvos">PERGUNTAS E AVISOS SALVOS</button>
          </Link>
        )}

        <ul className="pu-informacoes">
          <span style={{ fontSize: "18px" }}>INFORMAÇÕES DE CONTATO</span>
          <li className="pu-item-informacao">
            <span>E-mail:</span>
            <span style={{ color: "#201F25" }}>{usuarioSelecionado?.email}</span>
          </li>
          <li className="pu-item-informacao">
            <span>Telefone:</span>
            <span style={{ color: "#201F25" }}>
              {usuarioSelecionado?.celular}
            </span>
          </li>
        </ul>
        {/* favoritos e salvos */}
        <ul className="pu-interecoes">
          {token && jwt(token).secret.id != idUsuario && (<li
            className="item-interacao"
            onClick={() => {
              updateFavotito();
              setFavorito(!favorito);
            }}
          >
            {/* <IconButton>
              <StarIcon className={favorito ? "corFavorito" : ""} />
            </IconButton>
            <span>Favoritar</span> */}
          </li>)}
          {/* editar usuario */}
          {token && idUsuario == jwt(token).secret.id && (
            <div className="pu-opcoes">
              <Link to={`/editar-usuario/${jwt(token).secret.id}`}>
                <li>
                  <button className="pu-editar">
                    <EditIcon sx={{ fontSize: 16 }} />
                    EDITAR CONTA
                  </button>
                </li>
              </Link>

              <li>
                <button className="pu-excluir" onClick={deletarUsuario}>
                  <DeleteIcon sx={{ fontSize: 16 }} />
                  EXCLUIR CONTA
                </button>
              </li>
            </div>
          )}


          {token && idUsuario != jwt(token).secret.id && (
            <div className="buttonChat"
              onClick={(event) => {
                event.preventDefault()
                addChatInstance()
              }}
              >
                Mensagem
            </div>
          )}

        </ul>
      </div>
      <PerguntasCadastradas idUsuario={idUsuario} />
    </div>
  );
}
