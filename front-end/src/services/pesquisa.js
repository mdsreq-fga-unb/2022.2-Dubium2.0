export default function pesquisaPosts(postArray, post) {
    const avisosFiltrados = postArray.filter(
        (e) =>
          e.filtro
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .startsWith(
              post
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase()
            ) ||
          // eslint-disable-next-line eqeqeq
          e.filtro
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase() ==
            post
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .toLowerCase()
      );

      return avisosFiltrados;
}

export function pesquisaAviso(postArray, post) {
  const avisosFiltrados = postArray.filter(
      (e) =>
        e.materia
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .startsWith(
            post
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .toLowerCase()
          ) ||
        // eslint-disable-next-line eqeqeq
        e.materia
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase() ==
          post
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
    );

    return avisosFiltrados;
}

export function pesquisaUsuario(usuarioArray, usuario) {
  const usuariosFiltrados = usuarioArray.filter(
      (e) =>
        e.nome_completo
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .startsWith(
            usuario
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .toLowerCase()
          ) ||
        // eslint-disable-next-line eqeqeq
        e.nome_completo
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase() ==
          usuario
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
    );

    return usuariosFiltrados;
}

export function pesquisaMensagem(mensagens, texto) {
  const regex = new RegExp(texto, "gi");
  const mensagensFiltradas = mensagens.filter(
      (e) =>
        regex.test(e.message)
    );
  console.log(mensagensFiltradas)
  return mensagensFiltradas;
}