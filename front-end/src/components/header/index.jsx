  import "./style.css";

  import bichinho from "../../assets/images/bichinho.png";
  import logo from "../../assets/images/logo-dubium.png";

  import PersonAddIcon from "@mui/icons-material/PersonAdd";
  import PersonIcon from "@mui/icons-material/Person";
  import SearchIcon from "@mui/icons-material/Search";
  import LogoutIcon from "@mui/icons-material/Logout";
  import LoginIcon from "@mui/icons-material/Login";
  import GroupsIcon from '@mui/icons-material/Groups';
  import isAuthenticated from "../../isAuth";
  import { Link } from "react-router-dom";
  import { useEffect, useState } from "react";
  import apiRequest from "../../services/api";
  import jwt from 'jwt-decode';

  import { SocketContext } from "../../context/Socket";
  import React, { useContext } from "react";
  import SendIcon from '@mui/icons-material/Send';
  import CriarSala from "../../pages/SalasPublico/CriarSala";
  import HighlightOffIcon from '@mui/icons-material/HighlightOff';


  function Header({ setMateriaPesquisada, setLogado }) {
    const [token, setToken] = useState('');
    const [notificacao, setNotificacao] = useState(0)
    const socket = useContext(SocketContext);
    const [mostrarDivSala, setMostrarDivSala] = useState(false);

    useEffect(() => {
      setToken(document.cookie.replace(/(?:(?:^|.*;\s*)jwt\s*\=\s*([^;]*).*$)|^.*$/, '$1'))
    }, [])

    const handleChange = (e) => {
      e.preventDefault();
      setMateriaPesquisada(e.target.value);
    };

    const getChat = async () => {
      let number = 0
      await apiRequest
        .post(`/chat/user`, { idUser: jwt(token).secret.id }, {
          headers: {
            Authorization: "Bearer " + token,
          }
        })
        .then(data => {
          data.data.forEach(e => {
            console.log(e.usuarios[0])
            if (e.usuarios[0].user.id == jwt(token).secret.id) {
              number += e.usuarios[0].user.notificacoes
            } else {
              number += e.usuarios[0].userTarget.notificacoes
            }
          })
          setNotificacao(number)
        })
        .catch(error => {
          console.log(error)
        })
    }

    const divCriarSala = {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backdropFilter: 'blur(5px)',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 999,
      display: mostrarDivSala ? 'flex' : 'none',
    };

    const handleClickCampoCriarSala = () => {
      setMostrarDivSala(false);
      console.log('' + mostrarDivSala);
    };
    const icon = {
      cursor: 'pointer',
    };
    const iconSairDiv = {
      margin: '2rem',
      cursor: 'pointer',
      color: 'black',
      width: '1%',
      height: '1%',
      display: 'flex',
      alignText: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '15px',
    };

    const handleClickIcone = () => {
      setMostrarDivSala(!mostrarDivSala);
    };


    const estiloMensagem = {
      transform: 'rotate(-38deg)'
    };


    useEffect(() => {
      if (token) {
        getChat()
      }
    }, [token])

    useEffect(() => {
      socket.on("decrementarNotificacao", (data) => {
        setNotificacao(prevNumber => prevNumber - data)
      })
      socket.on("incrementarNotificacao", (data) => {
        setNotificacao(prevNumber => prevNumber + 1)
      })

    }, [])


    return (
      <div className="headerDivs">
        <header className="header">
          <Link to="/" className="logo">
            <img src={logo} alt="logo" className="logo" />
          </Link>
          <ul className="list">
            <li className="item">
              <Link to="/">FÓRUM</Link>
            </li>
            <li className="item">
              <Link to={isAuthenticated() ? "/avisos" : "/login"}>
                AVISOS
              </Link>
            </li>
            <li className="item">
              <Link
                // se nao tiver logado redireciona pra login
                to={isAuthenticated() ? "/ranking-usuarios" : "/login"}
              >
                USUARIOS
              </Link>
            </li>
            <li className="item">
              <Link to="/sobre">SOBRE</Link>
            </li>
          </ul>
          <div className="pesquisa">
            <div id="iconePesquisa"><SearchIcon /></div>
            <input id="busca"
              type="text"
              placeholder="Buscar por matéria ou usuário"
              onChange={handleChange}
            />
          </div>
          <ul className="header-login">
              {!isAuthenticated() && (
                <>
                  <Link to="/login">
                    <li className="login-item">
                      <LoginIcon />
                      <span>Entrar</span>
                    </li>
                  </Link>
                  <Link to="/cadastrar-usuario">
                    <li className="login-item">
                      <PersonAddIcon />
                      <span>Cadastrar-se</span>
                    </li>
                  </Link>
                </>
              )}
              {isAuthenticated() && (
                <>
                  {token ?
                  <li className="notification-item">
                    <Link to="/chat"><SendIcon style={estiloMensagem} /> </Link>
                    {notificacao > 0 && <span className="notificacaoHeader">{notificacao}</span>}
                  </li>
                    :
                    <></>
                  }
                  {token ?
                  <li>
                    {/*<label onClick={handleClickIcone} htmlFor="CriarSala"><GroupAddIcon style={icon} /></label>*/}
                    <Link to="/salasPublico"><GroupsIcon /></Link>
                  </li>
                    :
                    <></>
                  }
                  {/* recuperar api de informações do usuario */}
                  {token ?

                    <Link to={`/usuario/${jwt(token).secret.id}`}>
                      <li className="login-item">
                        <PersonIcon />
                        <span>Perfil</span>
                      </li>
                    </Link> :
                    <></>
                  }
                  <Link
                    to="/"
                    onClick={() => {
                      document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                      setLogado(false);
                    }}
                  >
                    <li className="login-item">
                      <LogoutIcon />
                      <span>Sair</span>
                    </li>
                  </Link>

            </>
            )}
          </ul>

          <img src={bichinho} alt="bichinho" className="bichinho" />
        </header>
        {mostrarDivSala && (
          <div className="item" style={divCriarSala} ><CriarSala onClick={handleClickCampoCriarSala} />

            <div className="item" htmlFor="sairDiv" onClick={handleClickCampoCriarSala} style={iconSairDiv}> <HighlightOffIcon style={{ fontSize: '3rem' }} /> </div>
          </div>
        )}
      </div>

    );
  }

  export default Header;
