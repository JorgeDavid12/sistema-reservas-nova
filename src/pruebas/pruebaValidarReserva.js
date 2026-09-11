import { validarReserva } from '../validaciones/validarReserva.js';

// Suite manual aislada: no importa DOM, CRUD, UI, almacenamiento ni datos del sistema.
const entradaValida = Object.freeze({
  solicitante: 'Ana Rivera',
  correo: 'ana@nova.test',
  sala: 'Sala Aurora',
  fecha: '2026-10-20',
  horaInicio: '09:00',
  horaFin: '10:30',
  asistentes: 12,
  estado: 'Pendiente',
  capacidadSala: 20,
});

export const CASOS_VALIDACION = Object.freeze([
  {
    id: 'reserva-valida',
    nombre: 'Reserva válida',
    descripcion: 'Acepta datos completos que cumplen formato, horario y capacidad.',
    entrada: { ...entradaValida },
    esperado: { valido: true, codigos: [] },
  },
  {
    id: 'correo-invalido',
    nombre: 'Correo inválido',
    descripcion: 'Detecta un correo sin dominio válido.',
    entrada: { ...entradaValida, correo: 'ana@nova' },
    esperado: { valido: false, codigos: ['CORREO_INVALIDO'] },
  },
  {
    id: 'horario-invalido',
    nombre: 'Horario inválido',
    descripcion: 'Rechaza una hora final anterior a la hora de inicio.',
    entrada: { ...entradaValida, horaInicio: '11:00', horaFin: '10:00' },
    esperado: { valido: false, codigos: ['HORARIO_INVALIDO'] },
  },
  {
    id: 'asistentes-invalidos',
    nombre: 'Asistentes inválidos',
    descripcion: 'Rechaza cantidades que no sean enteros mayores que cero.',
    entrada: { ...entradaValida, asistentes: 0 },
    esperado: { valido: false, codigos: ['ASISTENTES_INVALIDOS'] },
  },
  {
    id: 'capacidad-superada',
    nombre: 'Capacidad superada',
    descripcion: 'Detecta cuando los asistentes exceden la capacidad de la sala.',
    entrada: { ...entradaValida, asistentes: 21 },
    esperado: { valido: false, codigos: ['CAPACIDAD_SUPERADA'] },
  },
  {
    id: 'varios-errores',
    nombre: 'Varios errores simultáneos',
    descripcion: 'Agrupa fallos independientes en una sola ejecución.',
    entrada: {
      ...entradaValida,
      solicitante: '',
      correo: 'correo-invalido',
      fecha: '2026-02-30',
      horaInicio: '15:00',
      horaFin: '14:00',
      asistentes: -2,
      capacidadSala: 0,
    },
    esperado: {
      valido: false,
      codigos: [
        'CAMPO_OBLIGATORIO',
        'CORREO_INVALIDO',
        'FECHA_INVALIDA',
        'HORARIO_INVALIDO',
        'ASISTENTES_INVALIDOS',
        'CAPACIDAD_INVALIDA',
      ],
    },
  },
]);

function simplificarResultado(resultado) {
  return {
    valido: resultado.valido,
    codigos: resultado.errores.map(error => error.codigo),
  };
}

export function ejecutarCasoValidacion(caso) {
  try {
    const resultado = validarReserva({ ...caso.entrada });
    const obtenido = simplificarResultado(resultado);
    const pass = obtenido.valido === caso.esperado.valido
      && JSON.stringify(obtenido.codigos) === JSON.stringify(caso.esperado.codigos);
    return { ...caso, obtenido, errores: resultado.errores, pass, excepcion: null };
  } catch (error) {
    return {
      ...caso,
      obtenido: null,
      errores: [],
      pass: false,
      excepcion: error instanceof Error ? error.message : String(error),
    };
  }
}

export function ejecutarSuiteValidacion() {
  return CASOS_VALIDACION.map(ejecutarCasoValidacion);
}

export function imprimirReporteManual(resultados = ejecutarSuiteValidacion()) {
  console.log('\nVALIDATION LAB · validarReserva()');
  console.log('Aislamiento: validarReserva.js + datos literales; sin CRUD ni UI.');
  resultados.forEach((resultado, indice) => {
    console.log(`\n[${resultado.pass ? 'PASS' : 'FAIL'}] ${indice + 1}/${resultados.length} · ${resultado.nombre}`);
    console.log('Entrada:', JSON.stringify(resultado.entrada, null, 2));
    console.log('Esperado:', JSON.stringify(resultado.esperado, null, 2));
    console.log('Obtenido:', JSON.stringify(resultado.excepcion ? { excepcion: resultado.excepcion } : resultado.obtenido, null, 2));
  });
  const aprobados = resultados.filter(resultado => resultado.pass).length;
  console.log(`\nResultado final: ${aprobados}/${resultados.length} PASS`);
  return aprobados === resultados.length;
}

if (typeof document === 'undefined') {
  const todoCorrecto = imprimirReporteManual();
  if (!todoCorrecto && globalThis.process) globalThis.process.exitCode = 1;
}
