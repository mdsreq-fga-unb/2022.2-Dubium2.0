export function horarioFormatado(hour) {
    const horario = new Date(hour);
    const horaFormatada = horario.toLocaleString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    return horaFormatada
}

