import "./style.css";

import SidebarChat from "../Chat/SidebarChat/index.jsx";
import ChatPrincipal from "../Chat/ChatPrincipal/index.jsx";
import SocketProvider from '../../context/Socket'
import { useState } from "react";

export default function Chat({ mensagemPesquisada }) {
    return (
        <div className="containerChat">
            <div className="sidebar-Chat">
                <SidebarChat>
                </SidebarChat>
            </div>
            <div className="chat-principal">
                <ChatPrincipal mensagemPesquisada={mensagemPesquisada}>
                </ChatPrincipal>
            </div>
        </div>
    );
}
