// Estado privado de la sesión: sin DOM ni persistencia.
let reservas = [];
let siguienteId = 1;
export const ESTADOS = Object.freeze(['Pendiente', 'Confirmada', 'Cancelada']);
const CAMPOS = ['solicitante', 'correo', 'sala', 'fecha', 'horaInicio', 'horaFin', 'asistentes', 'estado'];

// Contrato técnico, no reglas de negocio: campos escalares y estados del sistema.
function camposDelModelo(datos) {
  if (!datos || typeof datos !== 'object' || Array.isArray(datos)) return null;
  const campos = {};
  for (const campo of CAMPOS) {
    if (!Object.hasOwn(datos, campo)) continue;
    const valor = datos[campo];
    if (campo === 'asistentes' ? typeof valor !== 'number' : typeof valor !== 'string') return null;
    campos[campo] = valor;
  }
  if (Object.hasOwn(campos, 'estado') && !ESTADOS.includes(campos.estado)) return null;
  return campos;
}

export function obtenerReservas() {
  return reservas.map(reserva => ({ ...reserva }));
}

export function obtenerReservaPorId(id) {
  const reserva = reservas.find(reserva => reserva.id === id);
  return reserva ? { ...reserva } : null;
}

export function crearReserva(datos) {
  const campos = camposDelModelo(datos);
  if (!campos) return null;
  // Fase 2: integrar validarReserva antes de guardar, sin duplicar sus reglas aquí.
  const reserva = {
    id: `reserva-${siguienteId++}`,
    solicitante: '', correo: '', sala: '', fecha: '', horaInicio: '', horaFin: '',
    asistentes: 0, estado: 'Pendiente', ...campos,
  };
  reservas.push(reserva);
  return { ...reserva };
}

export function actualizarReserva(id, datos) {
  const indice = reservas.findIndex(reserva => reserva.id === id);
  if (indice === -1) return null;
  const campos = camposDelModelo(datos);
  if (!campos) return null;
  // El ID no pertenece a los campos editables. Fase 2: validar antes de reemplazar.
  reservas[indice] = { ...reservas[indice], ...campos };
  return { ...reservas[indice] };
}

export function eliminarReserva(id) {
  const indice = reservas.findIndex(reserva => reserva.id === id);
  if (indice === -1) return false;
  reservas.splice(indice, 1);
  return true;
}

export function cambiarEstadoReserva(id, estado) {
  if (!ESTADOS.includes(estado)) return null;
  return actualizarReserva(id, { estado });
}
