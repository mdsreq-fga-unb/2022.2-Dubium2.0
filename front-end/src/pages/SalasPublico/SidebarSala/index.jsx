import React, { useState } from "react";
import CriarSala from "../CriarSala";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link } from "react-router-dom";

// Função de autenticação que retorna true ou false
const isAuthenticated = () => {
  // Lógica de autenticação aqui...
  // Retorne true se o usuário estiver autenticado
  // Retorne false se o usuário não estiver autenticado
  // Por exemplo:
  return true; // Altere essa linha de acordo com a lógica de autenticação real
};

export default function SidebarSalaPublico() {
  const [mostrarDivSala, setMostrarDivSala] = useState(false);

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

  const icon = {
    width: '30px',
    height: '30px',
    cursor: 'pointer',
  };

  const iconSairDiv = {
    margin: '2rem',
    cursor: 'pointer',
    color: 'black',
    width: '1%',
    height: '1%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '15px',
  };

  const handleClickCampoCriarSala = () => {
    setMostrarDivSala(false);
  };

  const handleClickIcone = () => {
    setMostrarDivSala(!mostrarDivSala);
  };

  const handleLogout = () => {
    document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setLogado(false);
  };

  return (
    <div className="containerSidebar">
      <div>
          <div className="criarSalaBotao" onClick={handleClickIcone}>
            <label><GroupAddIcon style={icon} /></label>
            <div>Criar Sala</div>
          </div>
      </div>
      {mostrarDivSala && (
        <div style={divCriarSala}>
          <CriarSala onClick={handleClickCampoCriarSala} />

          <div htmlFor="sairDiv" onClick={handleClickCampoCriarSala} style={iconSairDiv}>
            <HighlightOffIcon style={{ fontSize: '3rem' }} />
          </div>
        </div>
      )}
    </div>
  );
}