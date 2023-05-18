import "./style.css";
import logo from "../../assets/images/logo.jpg";
import question from "../../assets/images/bichinho.png";
import search from "../../assets/images/mulher.png";

import { useContext } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import AuthContext from "../../context/AuthProvider";
import apiRequest from "../../services/api";

export default function Login({ setLogado }) {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  function parseJwt(token) {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  }

  const getUser = async () => {
    const token = localStorage.getItem("token");
    const id = parseJwt(token).sub;
    const user = await apiRequest.get(`usuarios/${id}`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    setUser(user.data);
  };

  const onSubmit = async (data) => {
    let user = {
      username: data.email,
      password: data.senha,
    };

    await apiRequest
      .post("usuarios/login", user)
      .then((response) => {
        localStorage.setItem("token", response.data.access_token);
        localStorage.setItem(
          "userId",
          parseJwt(response.data.access_token).sub
        );
        getUser();
        setLogado(true);
        navigate("/");
      })
      .catch((response) => {
        console.log(response);
        alert("Email ou senha incorreta!");
      });
  };

  return (
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
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            alignItems: "center",
          }}
        >
          <Link to="/recuperar-senha">
            <span className="lc-alterantiva">Esqueci minha senha</span>
          </Link>
          <Link to="/cadastrar-usuario">
            <span className="lc-alterantiva">Realizar cadastro</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
