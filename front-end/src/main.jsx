import "./assets/reset.css";
import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";


import { SidebarProvider } from "./context/SidebarProvider";
import { AuthProvider } from "./context/AuthProvider";
import SocketProvider  from "./context/Socket";
import FotoProvider from "./context/FotoProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <SidebarProvider>
  <SocketProvider>
  <FotoProvider>
    <App />
  </FotoProvider>
  </SocketProvider>
  </SidebarProvider>
  );
