# NOVA BOOKING

NOVA BOOKING es un mini sistema para administrar reservas de salas mediante una interfaz moderna y sencilla. El proyecto demuestra el funcionamiento de un CRUD y la prueba manual aislada de una unidad de validación.

## ¿Qué es?

Es un mini sistema CRUD de reservas desarrollado para una actividad de Aseguramiento de la Calidad de Software.

Permite:

- Crear reservas.
- Consultar las reservas registradas.
- Editar y eliminar reservas.
- Cambiar el estado de una reserva.
- Validar los datos antes de guardar.

## Objetivo de la actividad

El objetivo principal es demostrar una prueba manual aislada sobre:

```js
validarReserva(reserva)
```

La función verifica datos válidos e inválidos sin utilizar base de datos, APIs ni otros agentes externos.

## Funcionalidades principales

- CRUD de reservas.
- Validación de datos.
- Estados de reserva.
- Gestión de capacidad de salas.
- Validation Lab integrado.
- Pruebas manuales con resultados PASS / FAIL.
- Datos almacenados únicamente en memoria.

## Unidad bajo prueba

`validarReserva(reserva)` comprueba:

- Campos obligatorios.
- Correo.
- Fecha.
- Horario.
- Asistentes.
- Capacidad de la sala.
- Estado de la reserva.

La función está aislada del CRUD y de la interfaz. Recibe los datos de una reserva y devuelve el resultado de la validación sin consultar el DOM, almacenamiento, base de datos o servicios externos.

## Casos de prueba

| Caso | Resultado esperado |
| --- | --- |
| Reserva válida | PASS |
| Correo inválido | PASS al detectar el error |
| Horario inválido | PASS al detectar el error |
| Asistentes inválidos | PASS al detectar el error |
| Capacidad superada | PASS al detectar el error |
| Varios errores simultáneos | PASS al detectar todos |

El Validation Lab compara el resultado esperado con el resultado obtenido y muestra el estado final de cada caso.

## Tecnologías

| Tecnología | Uso |
| --- | --- |
| JavaScript | Lógica del sistema |
| HTML | Estructura |
| CSS | Diseño |
| Vite | Entorno de desarrollo |
| pnpm | Gestión de paquetes |
| Git / GitHub | Control de versiones |

## Ejecutar el proyecto

```bash
pnpm install
pnpm dev
```

Para ejecutar las pruebas manuales:

```bash
pnpm test:validation
```

## Estructura principal

```text
src/
├── crud/
├── datos/
├── pruebas/
├── ui/
├── validaciones/
└── main.js
```

- `crud/`: operaciones para crear, consultar, editar y eliminar reservas.
- `datos/`: información de las salas disponibles.
- `pruebas/`: casos manuales de la unidad bajo prueba.
- `ui/`: presentación de reservas y del Validation Lab.
- `validaciones/`: función aislada `validarReserva()`.
- `main.js`: integración de la interfaz y los módulos del sistema.

## Repositorio

[https://github.com/JorgeDavid12/sistema-reservas-nova](https://github.com/JorgeDavid12/sistema-reservas-nova)
