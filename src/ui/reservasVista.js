// Catálogo local informativo: la capacidad no rechaza reservas en Fase 1.
export const SALAS = Object.freeze([
  Object.freeze({ nombre: 'Sala Aurora', capacidad: 20 }),
  Object.freeze({ nombre: 'Sala Nova', capacidad: 35 }),
  Object.freeze({ nombre: 'Sala Horizon', capacidad: 50 }),
  Object.freeze({ nombre: 'Sala Pulse', capacidad: 12 }),
]);

function elemento(tag, texto, clase) {
  const nodo = document.createElement(tag);
  if (texto !== undefined) nodo.textContent = texto;
  if (clase) nodo.className = clase;
  return nodo;
}

export function llenarOpciones(select, valores) {
  select.replaceChildren(...valores.map(valor => {
    const option = elemento('option', valor);
    option.value = valor;
    return option;
  }));
}

export function renderizarReservas(reservas, estados) {
  document.querySelector('#count-total').textContent = reservas.length;
  ['pending', 'confirmed', 'cancelled'].forEach((nombre, indice) => {
    document.querySelector(`#count-${nombre}`).textContent = reservas.filter(r => r.estado === estados[indice]).length;
  });
  document.querySelector('#empty-state').hidden = reservas.length !== 0;
  const tarjetas = reservas.map(reserva => {
    const tarjeta = elemento('article', undefined, 'reservation-card');
    tarjeta.dataset.id = reserva.id;
    const cabecera = elemento('div', undefined, 'card-heading');
    cabecera.append(elemento('p', reserva.sala || 'Sala sin indicar', 'room-name'), elemento('span', reserva.estado, `status status-${estados.indexOf(reserva.estado)}`));
    tarjeta.append(cabecera, elemento('h3', reserva.solicitante || 'Sin solicitante'), elemento('p', reserva.correo || 'Correo sin indicar', 'muted small'));
    const detalles = elemento('dl');
    for (const [etiqueta, valor] of [
      ['Fecha', reserva.fecha || 'Sin indicar'],
      ['Horario', `${reserva.horaInicio || '—'} – ${reserva.horaFin || '—'}`],
      ['Asistentes', reserva.asistentes],
    ]) {
      const fila = elemento('div');
      fila.append(elemento('dt', etiqueta), elemento('dd', valor));
      detalles.append(fila);
    }
    const label = elemento('label', 'Estado de la reserva', 'small');
    label.htmlFor = `estado-${reserva.id}`;
    const select = elemento('select');
    select.id = label.htmlFor;
    select.dataset.action = 'estado';
    llenarOpciones(select, estados);
    select.value = reserva.estado;
    const acciones = elemento('div', undefined, 'card-actions');
    for (const [accion, texto] of [['editar', 'Editar'], ['eliminar', 'Eliminar']]) {
      const boton = elemento('button', texto, accion === 'eliminar' ? 'danger' : '');
      boton.type = 'button';
      boton.dataset.action = accion;
      acciones.append(boton);
    }
    tarjeta.append(detalles, label, select, acciones);
    return tarjeta;
  });
  // Los datos se escriben como texto, nunca como HTML.
  document.querySelector('#reservation-list').replaceChildren(...tarjetas);
}
