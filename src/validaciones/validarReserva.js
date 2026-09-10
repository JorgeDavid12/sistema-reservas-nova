// Unidad pura: analiza únicamente su entrada y devuelve un resultado nuevo.
export function validarReserva(reserva) {
  const errores = [];
  const error = (campo, codigo, mensaje) => errores.push({ campo, codigo, mensaje });
  if (!reserva || typeof reserva !== 'object' || Array.isArray(reserva)) {
    return { valido: false, errores: [{ campo: 'reserva', codigo: 'RESERVA_INVALIDA', mensaje: 'Proporciona los datos de la reserva.' }] };
  }

  const vacio = valor => valor == null || (typeof valor === 'string' && valor.trim() === '');
  function texto(campo, nombre) {
    const valor = reserva[campo];
    if (vacio(valor)) {
      error(campo, 'CAMPO_OBLIGATORIO', `${nombre} es obligatorio.`);
      return null;
    }
    if (typeof valor !== 'string') {
      error(campo, 'TIPO_INVALIDO', `${nombre} debe ser texto.`);
      return null;
    }
    return valor.trim();
  }

  texto('solicitante', 'El nombre del solicitante');
  const correo = texto('correo', 'El correo');
  const sala = texto('sala', 'El espacio seleccionado');
  const fecha = texto('fecha', 'El valor de fecha');
  const inicio = texto('horaInicio', 'El horario de inicio');
  const fin = texto('horaFin', 'El horario de finalización');
  const estado = texto('estado', 'El estado');

  if (correo !== null && !/^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/.test(correo)) {
    error('correo', 'CORREO_INVALIDO', 'Ingresa un correo válido.');
  }

  // Calendario gregoriano, formato del formulario, sin referencia al día actual.
  if (fecha !== null) {
    const partes = /^(\d{4})-(\d{2})-(\d{2})$/.exec(fecha);
    let correcta = false;
    if (partes) {
      const [, anio, mes, dia] = partes.map(Number);
      const bisiesto = anio % 4 === 0 && (anio % 100 !== 0 || anio % 400 === 0);
      const dias = [31, bisiesto ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      correcta = anio >= 1 && mes >= 1 && mes <= 12 && dia >= 1 && dia <= dias[mes - 1];
    }
    if (!correcta) error('fecha', 'FECHA_INVALIDA', 'Ingresa una fecha real con formato AAAA-MM-DD.');
  }

  function minutos(valor, campo) {
    if (valor === null) return null;
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(valor)) {
      error(campo, 'HORA_INVALIDA', 'Ingresa una hora válida con formato HH:MM.');
      return null;
    }
    const [horas, minutos] = valor.split(':').map(Number);
    return horas * 60 + minutos;
  }
  const desde = minutos(inicio, 'horaInicio');
  const hasta = minutos(fin, 'horaFin');
  if (desde !== null && hasta !== null && hasta <= desde) {
    error('horaFin', 'HORARIO_INVALIDO', 'La hora final debe ser posterior a la hora inicial.');
  }

  const asistentes = reserva.asistentes;
  const asistentesValidos = Number.isInteger(asistentes) && asistentes > 0;
  if (vacio(asistentes)) error('asistentes', 'CAMPO_OBLIGATORIO', 'La cantidad de asistentes es obligatoria.');
  else if (!asistentesValidos) error('asistentes', 'ASISTENTES_INVALIDOS', 'Ingresa una cantidad entera de asistentes mayor que 0.');

  const capacidad = reserva.capacidadSala;
  if (!Number.isInteger(capacidad) || capacidad <= 0) {
    error('capacidadSala', 'CAPACIDAD_INVALIDA', 'Selecciona una sala con capacidad válida.');
  } else if (asistentesValidos && asistentes > capacidad) {
    error('asistentes', 'CAPACIDAD_SUPERADA', `La cantidad de asistentes supera la capacidad de ${sala || 'la sala'} (${capacidad} personas).`);
  }
  if (estado !== null && !['Pendiente', 'Confirmada', 'Cancelada'].includes(estado)) {
    error('estado', 'ESTADO_INVALIDO', 'Selecciona Pendiente, Confirmada o Cancelada.');
  }
  return { valido: errores.length === 0, errores };
}
