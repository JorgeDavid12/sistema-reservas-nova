import { CASOS_VALIDACION, ejecutarSuiteValidacion } from '../pruebas/pruebaValidarReserva.js';

// Adaptador visual de resultados: no crea, edita ni consulta reservas del CRUD.
const selector = document.querySelector('#lab-case-select');
const lista = document.querySelector('#lab-case-list');
const entrada = document.querySelector('#lab-input');
const esperado = document.querySelector('#lab-expected');
const obtenido = document.querySelector('#lab-obtained');
const descripcion = document.querySelector('#lab-case-description');
const estado = document.querySelector('#lab-status');
const resumen = document.querySelector('#lab-summary');
const botonEjecutar = document.querySelector('#run-validation-lab');
let resultados = [];

function json(valor) {
  return JSON.stringify(valor, null, 2);
}

function mostrarCaso(id) {
  const resultado = resultados.find(item => item.id === id) ?? resultados[0];
  if (!resultado) return;
  selector.value = resultado.id;
  descripcion.textContent = resultado.descripcion;
  entrada.textContent = json(resultado.entrada);
  esperado.textContent = json(resultado.esperado);
  obtenido.textContent = json(resultado.excepcion
    ? { excepcion: resultado.excepcion }
    : { ...resultado.obtenido, errores: resultado.errores.map(error => error.mensaje) });
  estado.textContent = resultado.pass ? 'PASS' : 'FAIL';
  estado.className = `lab-status ${resultado.pass ? 'is-pass' : 'is-fail'}`;
  lista.querySelectorAll('[data-case]').forEach(item => item.classList.toggle('is-selected', item.dataset.case === resultado.id));
}

function renderizarLista() {
  lista.replaceChildren(...resultados.map(resultado => {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = `lab-case ${resultado.pass ? 'is-pass' : 'is-fail'}`;
    item.dataset.case = resultado.id;
    const nombre = document.createElement('span');
    const estadoCaso = document.createElement('strong');
    nombre.textContent = resultado.nombre;
    estadoCaso.textContent = resultado.pass ? 'PASS' : 'FAIL';
    item.append(nombre, estadoCaso);
    return item;
  }));
}

function ejecutarLab() {
  const seleccionado = selector.value || CASOS_VALIDACION[0].id;
  resultados = ejecutarSuiteValidacion();
  const aprobados = resultados.filter(resultado => resultado.pass).length;
  resumen.textContent = `${aprobados}/${resultados.length} casos aprobados`;
  resumen.className = `lab-summary ${aprobados === resultados.length ? 'is-pass' : 'is-fail'}`;
  renderizarLista();
  mostrarCaso(seleccionado);
  document.querySelector('#validation-lab').classList.remove('lab-refreshed');
  void document.querySelector('#validation-lab').offsetWidth;
  document.querySelector('#validation-lab').classList.add('lab-refreshed');
}

selector.replaceChildren(...CASOS_VALIDACION.map(caso => {
  const opcion = document.createElement('option');
  opcion.value = caso.id;
  opcion.textContent = caso.nombre;
  return opcion;
}));
selector.addEventListener('change', () => mostrarCaso(selector.value));
lista.addEventListener('click', event => {
  const item = event.target.closest('[data-case]');
  if (item) mostrarCaso(item.dataset.case);
});
botonEjecutar.addEventListener('click', ejecutarLab);
ejecutarLab();
