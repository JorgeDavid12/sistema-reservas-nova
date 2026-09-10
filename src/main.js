import './styles.css';
import { ESTADOS, obtenerReservas, obtenerReservaPorId, crearReserva, actualizarReserva, eliminarReserva, cambiarEstadoReserva } from './crud/reservasCrud.js';
import { llenarOpciones, renderizarReservas, limpiarErrores, mostrarErrores } from './ui/reservasVista.js';
import { SALAS } from './datos/salas.js';
import { validarReserva } from './validaciones/validarReserva.js';

const dialog = document.querySelector('#reservation-dialog');
const form = document.querySelector('#reservation-form');
const list = document.querySelector('#reservation-list');
const feedback = document.querySelector('#feedback');
const deleteDialog = document.querySelector('#delete-dialog');
let idAEliminar = null;
let idEnEdicion = null;
let mostrarValidacion = false;

llenarOpciones(form.elements.sala, SALAS.map(sala => sala.nombre));
llenarOpciones(form.elements.estado, ESTADOS);
function actualizarVista() { renderizarReservas(obtenerReservas(), ESTADOS); }
function mostrarCapacidad() {
  const sala = SALAS.find(sala => sala.nombre === form.elements.sala.value);
  document.querySelector('#room-capacity').textContent = sala ? `Capacidad máxima: ${sala.capacidad} personas` : '';
}

function recogerDatos() {
  const datos = Object.fromEntries(new FormData(form));
  for (const campo of Object.keys(datos)) datos[campo] = datos[campo].trim();
  // Preservar el vacío para distinguir un campo obligatorio de un cero escrito.
  if (datos.asistentes !== '') datos.asistentes = Number(datos.asistentes);
  return datos;
}

function validarDatos(datos) {
  const capacidadSala = SALAS.find(sala => sala.nombre === datos.sala)?.capacidad;
  return validarReserva({ ...datos, capacidadSala });
}

function abrirFormulario(id = null) {
  const reserva = id ? obtenerReservaPorId(id) : null;
  if (id && !reserva) { feedback.textContent = 'La reserva ya no está disponible.'; return; }
  idEnEdicion = id;
  form.reset();
  mostrarValidacion = false;
  limpiarErrores(form);
  if (reserva) {
    for (const campo of ['solicitante', 'correo', 'sala', 'fecha', 'horaInicio', 'horaFin', 'asistentes', 'estado']) {
      form.elements[campo].value = reserva[campo];
    }
  }
  document.querySelector('#form-title').textContent = id ? 'Editar reserva' : 'Nueva reserva';
  document.querySelector('#save-reservation').textContent = id ? 'Guardar cambios' : 'Crear reserva';
  mostrarCapacidad();
  dialog.showModal();
  form.elements.solicitante.focus();
}

function enfocarReserva(id, accion = 'editar') {
  const tarjeta = [...list.children].find(tarjeta => tarjeta.dataset.id === id);
  (tarjeta?.querySelector(`[data-action="${accion}"]`) ?? document.querySelector('#new-reservation')).focus();
}

document.querySelector('#new-reservation').addEventListener('click', () => abrirFormulario());
document.querySelector('#empty-new').addEventListener('click', () => abrirFormulario());
document.querySelector('#close-form').addEventListener('click', () => dialog.close());
document.querySelector('#cancel-form').addEventListener('click', () => dialog.close());
form.elements.sala.addEventListener('change', mostrarCapacidad);
dialog.addEventListener('close', () => {
  form.reset();
  idEnEdicion = null;
  mostrarValidacion = false;
  limpiarErrores(form);
});

function refrescarErrores() {
  if (mostrarValidacion) mostrarErrores(form, validarDatos(recogerDatos()).errores);
}
form.addEventListener('input', refrescarErrores);
form.addEventListener('change', refrescarErrores);

form.addEventListener('submit', event => {
  event.preventDefault();
  const datos = recogerDatos();
  const resultado = validarDatos(datos);
  mostrarValidacion = true;
  mostrarErrores(form, resultado.errores, true);
  if (!resultado.valido) return;
  const editando = idEnEdicion !== null;
  const reserva = editando ? actualizarReserva(idEnEdicion, datos) : crearReserva(datos);
  if (!reserva) {
    document.querySelector('#form-error').textContent = 'No se pudo guardar la reserva. Cierra el formulario e inténtalo nuevamente.';
    return;
  }
  dialog.close();
  actualizarVista();
  feedback.textContent = editando ? 'Reserva actualizada.' : 'Reserva creada.';
  enfocarReserva(reserva.id);
});

list.addEventListener('click', event => {
  const boton = event.target.closest('button[data-action]');
  if (!boton) return;
  const id = boton.closest('[data-id]').dataset.id;
  if (boton.dataset.action === 'editar') { abrirFormulario(id); return; }
  const reserva = obtenerReservaPorId(id);
  if (!reserva) return;
  idAEliminar = id;
  document.querySelector('#delete-description').textContent = `¿Eliminar la reserva de ${reserva.solicitante || 'este solicitante'}? Esta acción no se puede deshacer.`;
  deleteDialog.showModal();
  document.querySelector('#cancel-delete').focus();
});

document.querySelector('#cancel-delete').addEventListener('click', () => deleteDialog.close());
deleteDialog.addEventListener('close', () => { idAEliminar = null; });
document.querySelector('#confirm-delete').addEventListener('click', () => {
  const eliminada = eliminarReserva(idAEliminar);
  deleteDialog.close();
  actualizarVista();
  feedback.textContent = eliminada ? 'Reserva eliminada.' : 'La reserva ya no está disponible.';
  document.querySelector('#new-reservation').focus();
});

list.addEventListener('change', event => {
  if (!event.target.matches('select[data-action="estado"]')) return;
  const id = event.target.closest('[data-id]').dataset.id;
  const reserva = cambiarEstadoReserva(id, event.target.value);
  actualizarVista();
  feedback.textContent = reserva ? `Estado actualizado: ${reserva.estado}.` : 'No se pudo cambiar el estado.';
  enfocarReserva(id, 'estado');
});

actualizarVista();
