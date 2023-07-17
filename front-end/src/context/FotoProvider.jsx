    import { createContext, useState, useEffect } from "react";
    import apiRequest from "../services/api.js";
    import jwt from 'jwt-decode';


    const FotoContext = createContext({});
    export { FotoContext }; // Correção aqui

    export const FotoProvider = ({ children, initToken }) => {
    const [fotos, setFotos] = useState([]);


    const getFotos = async () => {
    await apiRequest
        .get("/usuario/fotos")
            .then((response) => {
                setFotos(response.data)
            })
            .catch((err) => {
            console.error("ops! ocorreu um erro" + err);
            });
    }

    useEffect(() => {
        getFotos()
    }, [])

    return (
    <FotoContext.Provider value={fotos}>
        {children}
    </FotoContext.Provider>
    );
    };

    export default FotoProvider;
