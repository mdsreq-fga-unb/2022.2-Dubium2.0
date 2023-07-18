import "./style.css";
import logo from "../../assets/images/logo.jpg";
import question from "../../assets/images/bichinho.png";
import search from "../../assets/images/mulher.png";
import Cookies from 'js-cookie';
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, redirect, useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthProvider";
import apiRequest from "../../services/api";
import { SocketContext } from "../../context/Socket";
import jwt from 'jwt-decode';
import FotoProvider, { FotoContext } from "../../context/FotoProvider";


export default function Login({ setLogado }) {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);
  const socket = useContext(SocketContext)
  const fotoContext = useContext(FotoContext)
  const [token, setToken] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    let user = {
      username: data.email,
      password: data.senha,
    };

    await apiRequest
      .post("/login", user)
      .then((response) => {
        setLogado(true)
        console.log(response.data)
        document.cookie = `jwt=${response.data.token}; expires=DataDeExpiracao; path=/`
        socket.emit("idUser", jwt(response.data.token).secret.id)
        setToken(response.data.token)
      })
      .catch((err) => {
        console.log(err.message);
        alert("Email ou senha incorreta!");
      });
  };

  useEffect(() => {
    if (token) {
      navigate("/")
    }
  }, [token])

  return (
    <FotoProvider initToken={token}>
      <div className="login">
        <div className="login-descricao">
          <div className="ld-texto">
            <span>
              O Dubium é um produto que visa o auxílio acadêmico aos alunos da
              FGA, focado em ajudá-los / dar suporte para o desenvolvimento
              acadêmico - sanando as dúvidas de estudo - em temas específicos das
              matérias. Gerando assim autonomia e abrangência de conhecimentos,
              sem obrigatoriedade por partes dos estudantes voluntários.
            </span>
          </div>
          <div className="div-imagem">
            <img src={question} alt="" className="ld-imagem" />
            <img src={search} alt="" className="ld-imagem" />
          </div>
        </div>
        <div className="login-cadastro">
          <img src={logo} alt="" className="lc-logo" width={175} />
          <span className="lc-entrar">Entrar</span>
          <form action="" onSubmit={handleSubmit(onSubmit)} className="lc-form">
            <input
              type="email"
              name="email"
              {...register("email")}
              placeholder="Email"
              className="lc-form-input"
            />
            <input
              type="password"
              name="senha"
              {...register("senha")}
              placeholder="Senha"
              className="lc-form-input"
            />
            <div className="lc-form-buttom">
              <button type="submit" className="lc-form-entrar">
                Entrar
              </button>
            </div>
          </form>
          {/*<Link to="/recuperar-senha">
            <span className="lc-alterantiva">Esqueci minha senha</span>
          </Link>*/}
          <Link to="/cadastrar-usuario">
            <span className="lc-alterantiva">Realizar cadastro</span>
          </Link>
        </div>
      </div>
    </FotoProvider>
  );
}
