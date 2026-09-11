import { iniciarParticulas } from './particles.js';

// Entrada exclusivamente visual: no intercepta eventos del CRUD ni de validación.
const detenerParticulas = iniciarParticulas(document.querySelector('#ambient-particles'));
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const selectorIluminado = '.metric, .reservation-card, .empty-state, button, dialog';
let elementosActivos = [];
let frame = 0;
let pendiente;

function limpiarIluminacion() {
  for (const elemento of elementosActivos) {
    elemento.style.removeProperty('--cursor-x');
    elemento.style.removeProperty('--cursor-y');
    elemento.classList.remove('cursor-near');
  }
  elementosActivos = [];
}

function iluminar(event) {
  if (motion.matches) return;
  pendiente = { path: event.composedPath(), x: event.clientX, y: event.clientY };
  if (frame) return;
  frame = requestAnimationFrame(() => {
    frame = 0;
    const siguientes = pendiente.path.filter(nodo => nodo instanceof Element && nodo.matches(selectorIluminado));
    for (const elemento of elementosActivos) {
      if (siguientes.includes(elemento)) continue;
      elemento.style.removeProperty('--cursor-x');
      elemento.style.removeProperty('--cursor-y');
      elemento.classList.remove('cursor-near');
    }
    for (const elemento of siguientes) {
      const rect = elemento.getBoundingClientRect();
      elemento.style.setProperty('--cursor-x', `${pendiente.x - rect.left}px`);
      elemento.style.setProperty('--cursor-y', `${pendiente.y - rect.top}px`);
      elemento.classList.add('cursor-near');
    }
    elementosActivos = siguientes;
  });
}

function reiniciarAnimacion(elemento, clase) {
  elemento.classList.remove(clase);
  void elemento.offsetWidth;
  elemento.classList.add(clase);
}

const contadores = [...document.querySelectorAll('.metric strong')];
const valoresContadores = new WeakMap(contadores.map(contador => [contador, contador.textContent]));
const observadorContadores = new MutationObserver(registros => {
  if (motion.matches) return;
  for (const { target } of registros) {
    if (valoresContadores.get(target) === target.textContent) continue;
    valoresContadores.set(target, target.textContent);
    reiniciarAnimacion(target, 'counter-updated');
  }
});
contadores.forEach(contador => observadorContadores.observe(contador, { childList: true, characterData: true, subtree: true }));

const lista = document.querySelector('#reservation-list');
const idsConocidos = new Set();
const estadosConocidos = new Map();
function animarReservas() {
  const animacionesActivas = !motion.matches;
  for (const tarjeta of lista.querySelectorAll('.reservation-card')) {
    const id = tarjeta.dataset.id;
    const estado = tarjeta.querySelector('.status')?.textContent;
    if (!idsConocidos.has(id)) {
      idsConocidos.add(id);
      if (animacionesActivas) tarjeta.classList.add('reservation-enter');
    } else if (animacionesActivas && estadosConocidos.has(id) && estadosConocidos.get(id) !== estado) {
      tarjeta.classList.add('state-updated');
    }
    estadosConocidos.set(id, estado);
  }
}
const observadorReservas = new MutationObserver(animarReservas);
observadorReservas.observe(lista, { childList: true });
animarReservas();

const feedback = document.querySelector('#feedback');
const observadorFeedback = new MutationObserver(() => {
  if (!motion.matches && feedback.textContent.trim()) reiniciarAnimacion(feedback, 'feedback-visible');
});
observadorFeedback.observe(feedback, { childList: true, characterData: true, subtree: true });

function alCambiarMovimiento() {
  limpiarIluminacion();
  if (motion.matches) document.querySelectorAll('.reservation-enter, .state-updated, .counter-updated, .feedback-visible').forEach(elemento => elemento.classList.remove('reservation-enter', 'state-updated', 'counter-updated', 'feedback-visible'));
}

document.addEventListener('pointermove', iluminar, { passive: true });
document.addEventListener('pointerleave', limpiarIluminacion);
motion.addEventListener('change', alCambiarMovimiento);

function destruir() {
  detenerParticulas();
  cancelAnimationFrame(frame);
  limpiarIluminacion();
  observadorContadores.disconnect();
  observadorReservas.disconnect();
  observadorFeedback.disconnect();
  document.removeEventListener('pointermove', iluminar);
  document.removeEventListener('pointerleave', limpiarIluminacion);
  motion.removeEventListener('change', alCambiarMovimiento);
}

// La visibilidad pausa el canvas; HMR elimina todos los listeners y observadores.
if (import.meta.hot) import.meta.hot.dispose(destruir);
