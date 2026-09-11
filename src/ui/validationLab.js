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
const mensajeEjecucion = document.querySelector('#lab-execution-message');
const laboratorio = document.querySelector('#validation-lab');
let resultados = [];

function json(valor) {
  return JSON.stringify(valor, null, 2);
}

function mostrarCaso(id) {
  const caso = CASOS_VALIDACION.find(item => item.id === id) ?? CASOS_VALIDACION[0];
  const resultado = resultados.find(item => item.id === caso.id);
  selector.value = caso.id;
  descripcion.textContent = caso.descripcion;
  entrada.textContent = json(caso.entrada);
  esperado.textContent = json(caso.esperado);
  obtenido.textContent = resultado
    ? json(resultado.excepcion
      ? { excepcion: resultado.excepcion }
      : { ...resultado.obtenido, errores: resultado.errores.map(error => error.mensaje) })
    : 'Pendiente de ejecución.';
  lista.querySelectorAll('[data-case]').forEach(item => item.classList.toggle('is-selected', item.dataset.case === caso.id));
}

function renderizarLista(modo = 'preparado') {
  const casos = resultados.length ? resultados : CASOS_VALIDACION;
  lista.replaceChildren(...casos.map(caso => {
    const item = document.createElement('button');
    item.type = 'button';
    const claseResultado = modo === 'ejecutando'
      ? 'is-running'
      : resultados.length
        ? (caso.pass ? 'is-pass' : 'is-fail')
        : 'is-ready';
    item.className = `lab-case ${claseResultado}`;
    item.dataset.case = caso.id;
    item.disabled = modo === 'ejecutando';
    const nombre = document.createElement('span');
    const estadoCaso = document.createElement('strong');
    nombre.textContent = caso.nombre;
    estadoCaso.textContent = modo === 'ejecutando'
      ? 'Ejecutando...'
      : resultados.length
        ? (caso.pass ? 'PASS' : 'FAIL')
        : 'Preparado';
    item.append(nombre, estadoCaso);
    return item;
  }));
}

function prepararLab() {
  renderizarLista();
  mostrarCaso(CASOS_VALIDACION[0].id);
  resumen.textContent = `${CASOS_VALIDACION.length} casos preparados`;
  resumen.className = 'lab-summary is-ready';
  estado.textContent = 'Listo para ejecutar';
  estado.className = 'lab-status is-ready';
  mensajeEjecucion.textContent = '';
}

function esperar(ms) {
  return new Promise(resolve => window.setTimeout(resolve, ms));
}

async function ejecutarLab() {
  const seleccionado = selector.value || CASOS_VALIDACION[0].id;
  botonEjecutar.disabled = true;
  botonEjecutar.textContent = 'Ejecutando pruebas...';
  selector.disabled = true;
  mensajeEjecucion.textContent = '';
  resumen.textContent = `Ejecutando ${CASOS_VALIDACION.length} casos...`;
  resumen.className = 'lab-summary is-running';
  estado.textContent = 'Ejecutando...';
  estado.className = 'lab-status is-running';
  resultados = [];
  renderizarLista('ejecutando');
  mostrarCaso(seleccionado);

  await esperar(650);
  resultados = ejecutarSuiteValidacion();
  const aprobados = resultados.filter(resultado => resultado.pass).length;
  const todoCorrecto = aprobados === resultados.length;
  resumen.textContent = `${aprobados}/${resultados.length} casos aprobados`;
  resumen.className = `lab-summary ${todoCorrecto ? 'is-pass' : 'is-fail'}`;
  estado.textContent = todoCorrecto ? 'PASS' : 'FAIL';
  estado.className = `lab-status ${todoCorrecto ? 'is-pass' : 'is-fail'}`;
  mensajeEjecucion.textContent = todoCorrecto
    ? '✓ Pruebas ejecutadas correctamente'
    : `Se detectaron ${resultados.length - aprobados} caso(s) con FAIL`;
  mensajeEjecucion.className = `lab-execution-message ${todoCorrecto ? 'is-pass' : 'is-fail'}`;
  renderizarLista();
  mostrarCaso(seleccionado);
  selector.disabled = false;
  botonEjecutar.disabled = false;
  botonEjecutar.textContent = 'Ejecutar los 6 casos';
  laboratorio.classList.remove('lab-refreshed');
  void laboratorio.offsetWidth;
  laboratorio.classList.add('lab-refreshed');
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
prepararLab();
