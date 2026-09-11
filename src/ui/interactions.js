import { iniciarParticulas } from './particles.js';

// Entrada exclusivamente visual: listeners pasivos, sin tocar eventos del CRUD.
const detenerParticulas = iniciarParticulas(document.querySelector('#ambient-particles'));
const motion = matchMedia('(prefers-reduced-motion: reduce)');
let tarjetaActiva = null;
let frame = 0;
let pendiente;
function limpiar() {
  tarjetaActiva?.style.removeProperty('--cursor-x');
  tarjetaActiva?.style.removeProperty('--cursor-y');
  tarjetaActiva = null;
}
function iluminar(event) {
  if (motion.matches) return;
  pendiente = { target: event.target, x: event.clientX, y: event.clientY };
  if (frame) return;
  frame = requestAnimationFrame(() => {
    frame = 0;
    const tarjeta = pendiente.target.closest?.('.metric, .reservation-card, .page-heading');
    if (tarjeta !== tarjetaActiva) limpiar();
    if (!tarjeta) return;
    tarjetaActiva = tarjeta;
    const rect = tarjeta.getBoundingClientRect();
    tarjeta.style.setProperty('--cursor-x', `${pendiente.x - rect.left}px`);
    tarjeta.style.setProperty('--cursor-y', `${pendiente.y - rect.top}px`);
  });
}
document.addEventListener('pointermove', iluminar, { passive: true });
document.addEventListener('pointerleave', limpiar);
motion.addEventListener('change', limpiar);
function destruir() {
  detenerParticulas(); cancelAnimationFrame(frame); limpiar();
  document.removeEventListener('pointermove', iluminar);
  document.removeEventListener('pointerleave', limpiar);
  motion.removeEventListener('change', limpiar);
}
// La visibilidad pausa el dibujo sin destruirlo al volver desde la caché del navegador.
if (import.meta.hot) import.meta.hot.dispose(destruir);
