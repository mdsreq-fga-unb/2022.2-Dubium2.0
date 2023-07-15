import "./style.css";

import Header from "../../components/header/index"
import SidebarSalasPublico from "../SalasPublico/SidebarSala/index.jsx";

import SalasPublicas from "../SalasPublico/SalaPrincipal/index.jsx";


export default function ChatPublico() {
    return (
        <div className="containerSalasPublico">

            <Header/>
            <div className="containerSidebarSalasPublico">
                <SidebarSalasPublico/>
            </div>
            <div className="chatPrincipalSalaspublico">
                <SalasPublicas/>
            </div>
        </div>
    );
}