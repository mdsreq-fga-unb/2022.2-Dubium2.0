import "./style.css";

import apiRequest from "../../../services/api";

import { forumData } from "../Sidebar/data";

import { useForm } from "react-hook-form";
import { useRef, useEffect, useState } from "react";


import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../../../context/AuthProvider";
import jwt from 'jwt-decode'

export default function FormularioPergunta() {
  const navigate = useNavigate();
  
  const [token, setToken] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    setToken(document.cookie.replace(/(?:(?:^|.*;\s*)jwt\s*\=\s*([^;]*).*$)|^.*$/, '$1'))
  }, [])

  const onSubmit = async (data) => {
    let indexEngenharia;

    switch (data.engenharia) {
      case "ENGENHARIAS":
        indexEngenharia = 1;
        break;
      case "ENGENHARIA AEROESPACIAL":
        indexEngenharia = 2;
        break;
      case "ENGENHARIA AUTOMOTIVA":
        indexEngenharia = 3;
        break;
      case "ENGENHARIA ELETRÔNICA":
        indexEngenharia = 4;
        break;
      case "ENGENHARIA DE ENERGIA":
        indexEngenharia = 5;
        break;
      case "ENGENHARIA DE SOFTWARE":
        indexEngenharia = 6;
        break;
      default:
        indexEngenharia = 1;
        break;
    }

    let novaPergunta = {
      // id_usuario: localStorage.getItem("userId"),
      titulo: data.titulo,
      curso: indexEngenharia,
      conteudo: data.textoPergunta,
      filtro: data.filtro,
      idUser: jwt(token).secret
      // arquivo: data.midia,
    };

    await apiRequest
      .post("/pergunta", novaPergunta, {
        headers: {
          Authorization: "Bearer " + token
        }
      })
      .then((response) => {
        alert("Pergunta cadastrada com sucesso!");
      })
      .catch((error) => window.alert(error.response.data.message));
    navigate(-1);
  };

  return (
    <div className="container">
      <div className="form-card">
        <form
          action=""
          onSubmit={handleSubmit(onSubmit)}
          className="formulario"
        >
          <div className="group-input">
            <input
              type="text"
              name="titulo"
              {...register("titulo")}
              className="titulo-input"
              placeholder="Título"
              required
            />
            <select
              name="engenharia"
              {...register("engenharia")}
              className="engenharia-input"
              required
            >
              {forumData.map(
                (data, index) =>
                  index != 0 && (
                    <option
                      value={data.name}
                      key={index}
                      className="opcao-engenharia"
                    >
                      {data.name}
                    </option>
                  )
              )}
            </select>
            <input
              type="text"
              name="filtro"
              {...register("filtro")}
              className="filtro-input"
              placeholder="Matéria"
              required
            />
          </div>
          <textarea
            name="textoPergunta"
            id=""
            cols="30"
            rows="10"
            {...register("textoPergunta")}
            className="texto-pergunta"
            placeholder="Pergunta"
            maxLength={1000}
            required
          ></textarea>
          <div className="group-input" style={{ justifyContent: "center" }}>
            <button type="submit" className="botao-geral">
              Enviar
            </button>
            <button
              className="botao-geral botao-cancelar"
              onClick={() => navigate(-1)}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
