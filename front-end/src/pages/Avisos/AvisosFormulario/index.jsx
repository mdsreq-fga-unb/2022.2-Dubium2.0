import "./style.css";

import apiRequest from "../../../services/api";

import { forumData } from "../../Forum/Sidebar/data";

import jwt from 'jwt-decode' 
import { useForm } from "react-hook-form";

import { useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import AuthContext from "../../../context/AuthProvider";

export default function AvisosFormulario() {

  const [token, setToken] = useState('');

  useEffect(() => {
    setToken(document.cookie.replace(/(?:(?:^|.*;\s*)jwt\s*\=\s*([^;]*).*$)|^.*$/, '$1'))
  }, [])
  
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

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

    let novoAviso = {
      id_usuario: jwt(token).secret,
      tituloAviso: data.tituloAviso,
      corpoAviso: data.textoAviso,
      id_cursoAviso: indexEngenharia,
      filtro: data.filtro,
      midia: data.midia,
    };

    await apiRequest
      .post("/aviso/criar", novoAviso, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        alert("Aviso cadastrado com sucesso!");
      })
      .catch((error) => window.alert(error.response.data.message));

    navigate(-1);
  };

  return (
    <div className="container">
      <div className="form-card">
        {/* <div className="usuario-pergunta">
        <div className="usuario-informacao-texto">
        <span>{usuario.nome_completo}</span>
        <span>{usuario.curso}</span>
        </div>
      </div> */}
        <form
          action=""
          onSubmit={handleSubmit(onSubmit)}
          className="formulario"
        >
          <div className="group-input">
            <input
              type="text"
              name="tituloAviso"
              maxlength="20"
              {...register("tituloAviso")}
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
              maxlength="20"
              {...register("filtro")}
              className="filtro-input"
              placeholder="Matéria"
              required
            />
          </div>
          <textarea
            name="textoAviso"
            id=""
            cols="30"
            rows="10"
            {...register("textoAviso")}
            className="texto-pergunta"
            placeholder="Aviso"
            maxLength={100}
            required
          ></textarea>
          {/* <div className="file-input">
          <input type="file" name="arquivo" {...register("arquivo")} />
        </div> */}
          <div className="group-input" style={{ justifyContent: "center" }}>
            {token &&        
            <button type="submit" className="botao-geral">
              Enviar
            </button>
            }
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
