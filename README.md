# NOVA BOOKING

Mini sistema CRUD de reservas desarrollado como práctica de pruebas unitarias manuales y aislamiento de lógica dentro de Aseguramiento de la Calidad de Software.

**Estado actual:** Fase 2 completada. Entorno configurado con pnpm. Repositorio público publicado en [GitHub](https://github.com/JorgeDavid12/sistema-reservas-nova), rama `main`. CRUD funcional y unidad de validación integrada. Prueba manual formal pendiente para fases posteriores.

| Quiero... | Ir a |
| --- | --- |
| Entender el proyecto | [Descripción general](#1-descripción-general) |
| Ver cómo está construido | [Arquitectura](#4-arquitectura) |
| Revisar tecnologías | [Stack](#3-stack-tecnológico) |
| Entender qué se probará | [Unidad seleccionada](#6-unidad-seleccionada) |
| Revisar el avance | [Bitácora por fases](#bitácora-de-desarrollo) |
| Ejecutar el proyecto | [Ejecución local](#8-ejecución-local) |
| Revisar estado actual | [Auditoría de Fase 2](#auditoría-de-fase-2) |
| Preparar el videotutorial | [Guion pendiente](GUION_VIDEO.md) |
| Publicar el repositorio | [Git y GitHub](#10-git-y-github) |

---

## 1. Descripción general

Nova Booking simula la gestión de reservas de espacios o salas universitarias. Permite crear, listar, editar, eliminar y cambiar el estado de reservas en memoria. Crear y Editar validan sus datos antes de modificar la memoria.

Actualmente ofrece tarjetas, contadores y un formulario compartido para crear y editar. Su objetivo académico posterior es explicar y probar una unidad de validación sin depender de infraestructura externa.

## 2. Objetivo académico

El proyecto permitirá demostrar:

- Un CRUD con lógica de negocio.
- El aislamiento de una función crítica.
- Entradas válidas e inválidas.
- Resultados esperados y obtenidos, comparados explícitamente.
- Pruebas manuales sin base de datos ni APIs.

El CRUD y la unidad aislada están implementados. Se realizaron comprobaciones técnicas de desarrollo; la suite manual formal del videotutorial sigue pendiente.

## 3. Stack tecnológico

| Tecnología | Uso | Estado |
| --- | --- | --- |
| Vite 8.3.0 | Desarrollo y compilación del frontend | Activo |
| JavaScript modular | Entrada y futura lógica | Activo |
| HTML | Estructura semántica | Activo |
| CSS | Interfaz CRUD oscura y responsive básico | Activo |
| Node.js 24.19.0 | Herramientas locales de desarrollo | Disponible normalmente en el equipo |
| pnpm 12.3.4 | Único gestor de paquetes | Instalación, desarrollo y build verificados |
| Git 2.55.0.windows.3 | Versionado, rama `main` | Activo |
| GitHub / GitHub CLI 2.100.0 | Repositorio público y publicación | Autenticado como `JorgeDavid12` |
| Base de datos | No utilizada | No aplica |
| API externa | No utilizada | No aplica |
| Backend | No utilizado | No aplica |

Vite es la única dependencia directa de desarrollo. No hay dependencias de aplicación, frameworks de interfaz, fuentes remotas ni servicios de persistencia. Node y el servidor de Vite son herramientas de desarrollo, no un backend de reservas.

## 4. Arquitectura

Árbol de archivos fuente y documentación versionados:

```text
nova-booking/
├── src/
│   ├── crud/
│   │   └── reservasCrud.js
│   ├── datos/
│   │   └── salas.js
│   ├── validaciones/
│   │   └── validarReserva.js
│   ├── pruebas/
│   │   └── pruebaValidarReserva.js
│   ├── ui/
│   │   ├── interactions.js
│   │   ├── particles.js
│   │   └── reservasVista.js
│   ├── main.js
│   └── styles.css
├── index.html
├── README.md
├── GUION_VIDEO.md
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
└── .gitignore
```

`node_modules/` y `dist/` son directorios locales generados y excluidos de Git; `.git/` contiene el historial local.

`pnpm-workspace.yaml` conserva únicamente una excepción de antigüedad mínima para `vite@8.3.0`, necesaria con pnpm 12 durante esta migración para mantener la versión existente. No convierte la aplicación en un monorepo ni agrega dependencias.

| Módulo | Responsabilidad | Estado actual |
| --- | --- | --- |
| `crud/reservasCrud.js` | Array privado, seis operaciones públicas y copias de salida | CRUD sin DOM; recibe los datos aprobados por el formulario |
| `validaciones/validarReserva.js` | Reglas puras de negocio | Implementada e importable directamente desde Node |
| `datos/salas.js` | Cuatro salas y sus capacidades | Catálogo estático sin efectos externos |
| `pruebas/pruebaValidarReserva.js` | Pruebas aisladas futuras | Reservado, sin modificaciones |
| `ui/reservasVista.js` | Tarjetas, selectores, contadores y mensajes de error | Renderizado con datos recibidos por parámetro |
| `ui/interactions.js`, `ui/particles.js` | Efectos visuales futuros | Reservados, sin modificaciones |
| `main.js` | Recoge datos, añade capacidad temporal y valida antes de Crear/Editar | Coordina validación, CRUD y presentación |
| `styles.css` | Diseño oscuro, tarjetas, formularios y focus visible | Responsive básico |
| `index.html` | Estructura semántica, resumen, estado vacío y diálogos | Formulario con validación JavaScript y `novalidate` |

La unidad no importa módulos ni conoce la interfaz o el CRUD. El catálogo está en `datos/salas.js`; main obtiene la capacidad y la entrega como contexto de entrada. La capacidad se aplica al validar y no se almacena. El CRUD conserva sus comprobaciones técnicas, sin duplicar reglas de negocio.

## 5. Flujo conceptual

Flujo actual de Crear y Editar:

```text
Formulario → recoger datos + capacidadSala → validarReserva()
  ├─ inválido → mostrar errores, mantener formulario y memoria intactos
  └─ válido → CRUD → array privado → renderizado actualizado
```

El cambio de estado desde tarjeta utiliza directamente la protección de estados del CRUD, sin revalidar la reserva completa. La validación de negocio está en el flujo del formulario: las funciones de almacenamiento no la repiten. Un futuro consumidor del CRUD deberá respetar esa misma frontera.

Ejecución aislada actual:

```text
Datos aislados → validarReserva() → resultado
```

La comparación formal de resultado esperado/obtenido y el reporte PASS / FAIL se desarrollarán posteriormente, sin interfaz ni CRUD como dependencias de la unidad.

## 6. Unidad seleccionada

**`validarReserva(reserva)`** analiza datos y acumula errores sin modificar la entrada. Es una función pura, determinista y sin imports: no utiliza navegador, reloj actual, red, almacenamiento, catálogo ni funciones CRUD.

Entrada: objeto con `solicitante`, `correo`, `sala`, `fecha`, `horaInicio`, `horaFin`, `asistentes`, `estado` y `capacidadSala`. Los campos textuales son strings; asistentes y capacidad son números enteros positivos. La unidad no convierte strings numéricos: esa conversión corresponde a la coordinación del formulario. Los textos se analizan recortando espacios sin cambiar el objeto original.

Salida predecible:

```js
// Válida
{ valido: true, errores: [] }
// Inválida
{ valido: false, errores: [
  { campo: 'correo', codigo: 'CORREO_INVALIDO', mensaje: 'Ingresa un correo válido.' }
] }
```

| Regla | Criterio |
| --- | --- |
| Obligatorios | Ocho campos del formulario presentes y utilizables; espacios solos son vacíos |
| Correo | Expresión sencilla con usuario, arroba y dominio con punto |
| Fecha | Fecha real del calendario gregoriano en AAAA-MM-DD, incluidos años bisiestos; no se compara con hoy |
| Horario | HH:MM entre 00:00 y 23:59; final estrictamente posterior al inicio, sin cruce de medianoche |
| Asistentes | Número entero mayor que cero |
| Capacidad | Contexto numérico entero positivo; asistentes no supera capacidadSala |
| Estado | Pendiente, Confirmada o Cancelada |

Una entrada no objeto devuelve `RESERVA_INVALIDA`; campos de tipo incorrecto devuelven errores controlados. Capacidad ausente/inválida devuelve `CAPACIDAD_INVALIDA`. No se lanzan excepciones por datos normales inválidos ni se detiene el análisis de otros campos al encontrar un error.

## 7. Persistencia

Nova Booking **NO utiliza base de datos**. Las reservas se manejan mediante un array privado en memoria de JavaScript mientras la aplicación está ejecutándose. Al recargar la página desaparecen intencionalmente.

No se utilizarán `localStorage`, `sessionStorage`, IndexedDB, archivos de datos, APIs ni servicios externos para persistir reservas. Esta decisión mantiene el alcance sencillo y permite demostrar el aislamiento de la unidad.

La aplicación inicia vacía, sin datos demo precargados. Los registros ficticios utilizados para comprobar el CRUD no forman parte del código inicial.

## 8. Ejecución local

Entorno verificado: Node.js 24.19.0 y pnpm 12.3.4. Desde la carpeta `nova-booking`:

```sh
pnpm install
pnpm dev
```

Abre la dirección indicada por Vite. Para detener el servidor, pulsa `Ctrl+C`.

Comandos adicionales:

```sh
pnpm build
pnpm preview
```

`build` genera `dist/`; `preview` sirve esa compilación localmente. No existe un comando de pruebas de validación en esta fase.

Si PowerShell bloquea el wrapper pnpm.ps1 por su política de ejecución, puede utilizarse `pnpm.cmd` con los mismos argumentos; por ejemplo, `pnpm.cmd dev`. No es necesario cambiar la política de ejecución.

---

# Bitácora de desarrollo

| Fase | Estado | Objetivo | Resultado |
| --- | --- | --- | --- |
| Fase 0 | ✅ Completada | Preparación y arquitectura | Base preparada, pnpm configurado, arquitectura verificada y repositorio público publicado |
| Fase 1 | ✅ Completada | CRUD funcional | Crear, listar, editar, eliminar y cambiar estado en memoria; revisión funcional y responsive realizada |
| Fase 2 | ✅ Completada | Unidad de validación | Función pura integrada en Crear/Editar; errores por campo y repositorio renombrado |
| Fase 3 | ⏳ Pendiente | Sistema visual base | Pendiente |
| Fase 4 | ⏳ Pendiente | Glassmorphism y figuras | Pendiente |
| Fase 5 | ⏳ Pendiente | Partículas e interacciones | Pendiente |
| Fase 6 | ⏳ Pendiente | Validation Lab y pruebas | Pendiente |
| Fase 7 | ⏳ Pendiente | Video y auditoría final | Pendiente |

## Regla de mantenimiento

> Al finalizar cada fase de desarrollo debe actualizarse esta documentación antes de considerar la fase completada.

La bitácora es **acumulativa**: no borrar el historial de fases anteriores. En cada fase registrar qué se pidió, qué se implementó, archivos afectados, decisiones tomadas, pruebas realizadas, problemas encontrados, posibles pendientes y estado final. Corregir afirmaciones desactualizadas del estado actual sin eliminar la evidencia histórica.

**NOVA BOOKING utiliza pnpm como único gestor de paquetes.** En todas las fases posteriores: usar pnpm, mantener `pnpm-lock.yaml`, no utilizar `npm install`, no generar `package-lock.json`, no utilizar yarn y no agregar dependencias innecesarias.

**Commits:** a partir de Fase 2, todos los mensajes se escriben completamente en español, sin prefijos en inglés. El historial previo se conserva.

**Alcance visual:** a partir de Fase 2, el objetivo de presentación visual se limita a navegadores de escritorio/laptop utilizados durante la demostración. No se realizarán auditorías específicas para teléfono o tablet. La evidencia responsive de Fase 1 permanece como antecedente histórico.

## Fase 0 — Preparación y arquitectura

### Objetivo

Preparar una base simple, ejecutable, modular, versionada y documentada para un CRUD universitario; intentar la publicación pública en GitHub sin implementar las fases siguientes.

### Cambios realizados

- Se creó `nova-booking/` dentro del espacio de trabajo inicialmente vacío.
- Se configuró Vite con JavaScript ES Modules, HTML y CSS.
- Se creó una pantalla temporal oscura con estado «Operativo» actualizado por JavaScript.
- Se reservaron los módulos de CRUD, validación, pruebas y UI con comentarios y `export {}`.
- Se redactaron este índice técnico, arquitectura, bitácora, auditoría y recuperación de pendientes.
- Se creó el guion provisional con participantes y distribución de tiempo.
- Se instaló Vite y se generó el lockfile para reproducir las dependencias.
- Se inicializó Git en la rama `main`, con exclusiones para dependencias, compilación y archivos de entorno.
- Se creó el commit inicial `f88c0fb` — `chore: initialize Nova Booking project architecture` y se verificó el árbol de trabajo limpio tras ese commit.
- En la ejecución inicial se intentó crear el repositorio público mediante GitHub CLI, pero el ejecutable no estaba disponible; el ajuste posterior se registra abajo.

### Archivos creados/modificados

La preparación inicial creó 13 archivos, incluido el antiguo lockfile de npm. No había código previo que modificar. En el ajuste se modifican `package.json` y `README.md`, se elimina `package-lock.json` y se agregan `pnpm-lock.yaml` y `pnpm-workspace.yaml`. Los directorios generados `node_modules/` y `dist/` no forman parte del código versionado.

### Decisiones técnicas

- Solo Vite como dependencia directa de desarrollo; sin React ni backend.
- Vite fijado a `8.3.0`; inicialmente se utilizó el lockfile de npm, sustituido por `pnpm-lock.yaml` en el ajuste de entorno.
- HTML semántico y fuentes del sistema, sin recursos remotos de interfaz.
- Separar la lógica de negocio de la interfaz desde el árbol inicial.
- Reservar módulos futuros sin inventar resultados de validación ni añadir controles sin funcionalidad.
- No añadir un framework de pruebas ni desarrollar casos finales en esta fase.
- Registrar los bloqueos iniciales y sus resoluciones sin improvisar credenciales ni cambiar de servicio.

### Validaciones realizadas

Evidencia histórica de la preparación inicial (los comandos npm de esta tabla no son las instrucciones vigentes):

| Verificación | Resultado observado |
| --- | --- |
| Instalación limpia con Node 24.19.0 | `npm ci` completado; cero vulnerabilidades reportadas por npm en esa ejecución |
| Compilación | `npm run build` completado con Vite 8.3.0 |
| Arranque | Script `dev` iniciado con Node compatible; Vite disponible en `http://127.0.0.1:5173/` |
| Navegador | Título, textos y estado «Operativo» presentes; pantalla temporal revisada visualmente |
| Consola del navegador | Sin advertencias ni errores registrados durante la carga auditada |
| Módulos reservados | Los cinco módulos se importaron desde Node sin DOM ni servicios externos |
| Alcance | Sin CRUD, reglas finales, Validation Lab ni efectos avanzados |
| Publicación inicial | Comando de creación falló porque `gh` no estaba instalado/disponible |
| Git | Commit inicial `f88c0fb` verificado; 13 archivos versionados; `git diff --cached --check` sin errores |
| Exclusiones | `git check-ignore` confirmó `node_modules`, `dist` y `.env`; revisión de archivos versionados sin credenciales |

Importar módulos vacíos comprueba únicamente la estructura y su independencia inicial; no demuestra reglas de negocio que todavía no existen.

### Problemas encontrados

1. **Node global incompatible, resuelto:** inicialmente el sistema resolvía Node 19.5.0 y se recurrió a un runtime temporal compatible. Antes de continuar se instaló Node 24.19.0, ahora disponible normalmente y verificado con `node --version`.
2. **GitHub CLI ausente, resuelto:** inicialmente `gh` no estaba disponible. Posteriormente se instaló GitHub CLI 2.100.0 y se autenticó la cuenta `JorgeDavid12`. Se verificó la sesión y se creó el repositorio público. Esta sesión conservaba un PATH anterior, por lo que se invocaron GitHub CLI y Git 2.55 desde sus rutas instaladas, sin reinstalarlos.
3. **Reinstalación de dependencias:** la revisión automática bloqueó la eliminación recursiva de `node_modules`; se utilizó `pnpm.cmd install --force` y luego una instalación normal exitosa. No se modificó ExecutionPolicy.
4. **Antigüedad mínima de Vite:** pnpm generó una excepción para `vite@8.3.0`. Al comprobar la instalación sin ella apareció `ERR_PNPM_MINIMUM_RELEASE_AGE_VIOLATION`; se conservó la excepción específica en `pnpm-workspace.yaml`. No se desactivó globalmente la política ni se cambió Vite.

### Ajuste de entorno — Migración a pnpm

- La configuración inicial de Vite, instalada con npm, había generado `package-lock.json`.
- Antes de Fase 1 se estandarizó el proyecto con pnpm 12.3.4, registrado como `packageManager`.
- Se eliminó `package-lock.json` y se generó `pnpm-lock.yaml`.
- Se verificaron `pnpm.cmd install`, `pnpm.cmd build` y `pnpm.cmd dev` con Node 24.19.0.
- La pantalla de Fase 0 cargó en `http://127.0.0.1:5174/` con estado «Operativo», sin errores ni advertencias de consola. Se detuvo el servidor temporal después de la comprobación.
- Los módulos reservados se importaron desde Node sin DOM ni servicios externos. No se modificaron `src/`, `index.html`, `.gitignore` ni `GUION_VIDEO.md`.
- Se revisaron los archivos versionados y el historial antes de publicar; no se detectaron credenciales, tokens ni archivos personales innecesarios. Dependencias, compilación y `.env` permanecen excluidos.

### Estado final

Fase 0 completada: entorno, pnpm, Git, GitHub y documentación preparados. Repositorio confirmado como `PUBLIC`, con `main` publicada y configurada como rama predeterminada. El commit de migración `d241f5a` se comprobó en el remoto; este cierre documental queda registrado en un commit posterior. No se inició la Fase 1.

### Próximo paso

Únicamente cuando se autorice la Fase 1, definir el modelo de reserva e implementar crear, listar, editar y eliminar sobre un array en memoria, con una interfaz mínima. Preservar la frontera de `validarReserva(reserva)`; la implementación completa de sus reglas corresponde a la Fase 2.

## Fase 1 — CRUD funcional

### Objetivo

Implementar el CRUD de reservas exclusivamente en memoria, con una interfaz sencilla y usable, conservando la arquitectura y sin adelantar las reglas de validación de Fase 2.

### Cambios realizados

- Array privado con operaciones públicas que devuelven copias y resultados controlados.
- Tarjetas de reservas, contadores por estado y estado vacío con acción de creación.
- Formulario compartido para crear/editar, con carga de datos y conservación del ID.
- Cambio de estado desde la tarjeta o el formulario y confirmación sencilla antes de eliminar.
- Catálogo estático: Aurora (20), Nova (35), Horizon (50) y Pulse (12). Capacidades informativas.
- Diseño oscuro, labels, botones reales, focus visible y diálogos nativos HTML con scroll interior en móvil.

### Modelo de reserva

```js
{
  id: 'reserva-1',
  solicitante: 'María López',
  correo: 'maria@example.com',
  sala: 'Sala Aurora',
  fecha: '2026-09-15',
  horaInicio: '14:00',
  horaFin: '16:00',
  asistentes: 12,
  estado: 'Pendiente'
}
```

Modelo plano: ID y demás campos textuales son strings; asistentes es number. Estados: Pendiente, Confirmada y Cancelada. Los IDs son consecutivos y únicos dentro de la sesión; no se reutilizan al eliminar. Reinician al recargar porque no hay persistencia.

### Operaciones implementadas

| Operación | Resultado |
| --- | --- |
| `obtenerReservas()` | Nuevo array con copias de cada reserva |
| `obtenerReservaPorId(id)` | Copia o `null` si no existe |
| `crearReserva(datos)` | Copia creada con ID nuevo; `null` ante contrato técnico incompatible |
| `actualizarReserva(id, datos)` | Copia actualizada, mismo ID; `null` si no existe o el contrato es incompatible |
| `eliminarReserva(id)` | `true` al eliminar; `false` si no existe |
| `cambiarEstadoReserva(id, estado)` | Actualiza solo estado; copia o `null` ante ID/estado no admitido |

Solo se copian los campos del modelo; campos ajenos e ID entrante no reemplazan el ID interno. Las comprobaciones de tipos escalares y del conjunto de estados protegen el contrato técnico y las copias: no validan correo, horarios, campos obligatorios, asistentes negativos ni capacidad.

### Archivos creados/modificados

Seis archivos: modificados `src/crud/reservasCrud.js`, `src/main.js`, `src/styles.css`, `index.html` y `README.md`; creado `src/ui/reservasVista.js` para separar el renderizado del almacenamiento. El catálogo informativo pequeño reside en ese módulo de interfaz.

### Decisiones técnicas

- Inicio vacío, sin reservas de demostración precargadas.
- Copias superficiales suficientes porque el contrato admite únicamente valores escalares.
- Sin dependencias nuevas; Vite, packageManager y lockfile permanecen sin cambios.
- Formulario con tipos HTML apropiados y `novalidate`; sin `required`, mínimos ni comprobaciones académicas adelantadas. Los controles de fecha/hora siguen teniendo su representación nativa.
- Asistentes se convierte con `Number`; un campo vacío resulta en 0 en esta fase. Su validez corresponde a Fase 2.
- Renderizado mediante `textContent` para que las entradas se muestren como texto y no se interpreten como HTML.
- Diálogo HTML pequeño de confirmación, con foco inicial en «Conservar reserva»; no se agregó infraestructura visual avanzada.

### Pruebas manuales realizadas

| Caso | Resultado observado |
| --- | --- |
| Crear | María López apareció con ID `reserva-1`, sala Aurora, horario 14:00–16:00 y 12 asistentes; total 1 y pendiente 1 |
| Editar | Nombre, sala y asistentes cambiaron a María López editada, Nova y 18; se conservó `reserva-1` y total 1 |
| Cambiar estado | Confirmada actualizó etiqueta y contadores: pendientes 0, confirmadas 1 |
| Segunda reserva | Carlos Méndez en Pulse con 30 asistentes y Cancelada: total 2, confirmadas 1, canceladas 1; la capacidad informativa no bloqueó el alta |
| Cancelar eliminación | «Conservar reserva» mantuvo el registro |
| Eliminar selectivamente | Se eliminó «Reserva para eliminar» y permaneció «Reserva que permanece»; total pasó de 2 a 1 |
| Eliminar última | Lista vacía y todos los contadores en 0, con botón de nueva reserva visible |
| Recargar | Se creó «Temporal para recarga»; después de recargar había 0 tarjetas |
| Contrato técnico desde Node | Copias protegidas, ID conservado, ID inexistente controlado, estado ajeno rechazado; ejecución puntual sin archivos de pruebas ni suite académica |
| Responsive | Revisados 1280×720, 768×1024 y 375×812 sin overflow horizontal de documento; formulario móvil sin overflow horizontal interno y con scroll vertical accesible |
| Consola | Sin errores ni advertencias registrados durante la revisión final |

### Problemas encontrados

La confirmación inicial con `window.confirm` causó una espera de la herramienta de navegador y no permitió verificar claramente su cancelación. Se sustituyó por un diálogo HTML sencillo y se comprobaron conservar, eliminar una reserva y eliminar la última. Se retiró también una restauración de foco redundante que interfería con el foco posterior al guardado; el diálogo conserva su comportamiento nativo al cancelar.

### Estado final

CRUD funcional completado. Sin backend, base de datos, red de aplicación ni almacenamiento persistente. Validación académica, pruebas unitarias y efectos visuales avanzados permanecen pendientes. Se preserva íntegra la bitácora detallada de Fase 0.

### Próximo paso

En Fase 2, definir el contrato e implementar `validarReserva(reserva)` de forma aislada; integrar su resultado antes de guardar sin duplicar reglas en el CRUD. No se continúa automáticamente.

### Auditoría de Fase 1

- [x] Crear, listar, editar, eliminar y cambiar estado funcionan.
- [x] Contadores y estado vacío reflejan los registros actuales.
- [x] Datos solo en memoria; recargar descarta cambios.
- [x] Sin backend, base de datos, APIs, localStorage, sessionStorage ni IndexedDB.
- [x] CRUD sin DOM y UI sin acceso directo al array privado.
- [x] `validarReserva.js` y archivo de pruebas sin modificaciones; reglas de Fase 2 no adelantadas.
- [x] Sin nuevas dependencias; pnpm-lock.yaml es el único lockfile y package-lock.json no existe.
- [x] Instalación con pnpm y compilación verificadas.
- [x] Revisión visual, responsive básico y consola realizados.
- [x] README actualizado y bitácora anterior conservada.

## Fase 2 — Unidad de validación

### Objetivo

Implementar una unidad crítica aislada y conectarla con Crear/Editar, sin adelantar la suite académica, Validation Lab ni el rediseño visual.

### Cambios realizados

- Función pura con resultados estructurados y acumulación de errores.
- Catálogo movido de la UI a `src/datos/salas.js`.
- main recoge y recorta textos, convierte asistentes cuando no está vacío y añade capacidad solo al contexto de validación.
- Errores junto al campo, borde, resumen, `aria-invalid` y `aria-describedby`; foco en el primer error al enviar.
- Tras un envío inválido se revalida al corregir datos, incluidos errores dependientes de sala/asistentes y de ambos horarios. Cerrar y alternar Crear/Editar limpia mensajes anteriores.
- Renombrado del repositorio existente de `nova-booking-unit-testing` a `sistema-reservas-nova`, conservando historial y rama main. GitHub confirmó PUBLIC y actualizó origin a la URL nueva.

### Contrato de validarReserva()

Recibe los ocho campos editables más `capacidadSala`; devuelve `{ valido: boolean, errores: [{ campo, codigo, mensaje }] }`. La capacidad no se agrega al modelo almacenado. Se rechaza de forma controlada un contexto de capacidad ausente o no positivo.

### Reglas implementadas

Obligatorios, correo sencillo, fecha real AAAA-MM-DD, horas HH:MM y orden estricto, asistentes enteros positivos, capacidad máxima y estado permitido. Se acumulan errores independientes evitando errores derivados innecesarios (por ejemplo, no comparar capacidad si asistentes ya es inválido).

### Integración con Crear y Editar

Ambos usan la misma secuencia en main: recoger datos → proporcionar capacidad → validar → mostrar errores o invocar la operación CRUD. Si es inválido, el formulario permanece abierto y la reserva anterior no cambia. Al corregir y enviar, se guarda y se actualiza la interfaz; Editar conserva el ID. El selector de estado en tarjeta conserva su flujo anterior.

### Aislamiento de la unidad

Sin imports, DOM, CRUD, red, almacenamiento, reloj actual ni variables globales mutables. Los datos congelados se procesaron sin mutación y con resultados repetibles. Las reglas no se copiaron al CRUD, que permanece sin modificaciones.

### Archivos creados/modificados

Siete archivos: creado `src/datos/salas.js`; modificados `src/validaciones/validarReserva.js`, `src/main.js`, `src/ui/reservasVista.js`, `src/styles.css`, `index.html` y `README.md`. No se modificaron el CRUD, el archivo reservado de pruebas, el guion, dependencias ni lockfile.

### Comprobaciones realizadas

| Comprobación | Resultado observado |
| --- | --- |
| A — entrada válida | valido true y errores vacío |
| B — correo incorrecto | CORREO_INVALIDO |
| C — horario invertido | HORARIO_INVALIDO |
| D — asistentes negativos | ASISTENTES_INVALIDOS |
| E — Pulse con 20 asistentes y capacidad 12 | CAPACIDAD_SUPERADA |
| F — correo, horario y asistentes incorrectos | Tres errores en una ejecución |
| Límites adicionales en Node | 18 casos en total: espacios, fechas imposibles/bisiestos, horas iguales/fuera de rango, cero, decimal, texto, infinito, estado y capacidad ausente |
| Entradas no objeto | Cinco entradas controladas sin excepciones |
| Obligatorios | Los ocho campos con espacios detectados como obligatorios |
| Correos del enunciado | Los cuatro formatos inválidos rechazados |
| Pureza | Entradas congeladas sin cambios; resultados idénticos al repetir |
| Capacidad temporal | No se guarda en la copia ni en el array del CRUD |
| Crear válido en navegador | Reserva guardada, total 1 |
| Crear inválido | Correo, horario invertido y exceso de capacidad impidieron altas; total permaneció en 1 |
| Editar inválido | Nombre/correo originales permanecieron en la tarjeta y el diálogo siguió abierto |
| Corregir edición | Error desapareció al corregir; guardado correcto con el mismo ID reserva-1 |
| Limpieza | Sin errores antiguos tras cancelar, abrir Editar o volver a Crear |
| Estado de tarjeta | Cambio a Confirmada y contadores correctos |
| Laptop | Revisión en 1280×720, formulario y mensajes legibles; botones accesibles mediante scroll interior del diálogo |
| Consola y build | Sin errores/advertencias de consola; pnpm build correcto |
| GitHub | Nombre nuevo, PUBLIC, main y origin verificados |

Son comprobaciones técnicas de desarrollo ejecutadas directamente, sin crear la suite académica definitiva ni modificar su archivo reservado. No se realizaron pruebas de teléfono/tablet ni cambios destinados a esos dispositivos.

### Problemas encontrados

No se detectaron fallos funcionales en las comprobaciones finales. Se decidió validar capacidad ausente para impedir aceptar reservas sin contexto. La fecha se verifica por calendario, evitando normalizaciones de fechas inexistentes o dependencia del día actual. Los errores normales se devuelven como datos, sin excepciones.

### Estado final

Fase 2 completada: unidad aislada, Crear/Editar protegidos y mensajes coherentes. Sin persistencia ni dependencias nuevas. Se conserva la bitácora de Fases 0 y 1, incluida su evidencia histórica.

### Próximo paso

Fase 3: sistema visual base para laptop. La suite manual formal, Validation Lab y guion final siguen pendientes de sus fases. No se avanzó automáticamente.

### Auditoría de Fase 2

- [x] Unidad implementada e importable desde Node, sin imports ni efectos externos.
- [x] No modifica entradas; devuelve valido y errores estructurados, acumulando problemas.
- [x] Obligatorios, correo, fecha, horario, enteros positivos, capacidad y estado comprobados.
- [x] Crear y Editar validan antes de guardar; entradas inválidas del formulario no llegan al array.
- [x] Edición inválida conserva el registro; reglas no duplicadas en el CRUD.
- [x] Errores comprensibles, asociados a campos y limpiados al corregir/cerrar/cambiar modo.
- [x] Sin backend, base de datos, APIs de aplicación ni persistencia.
- [x] Sin dependencias nuevas; pnpm-lock.yaml único lockfile, sin package-lock.json.
- [x] Build correcto y revisión visual únicamente en laptop.
- [x] README actualizado; historial de fases anteriores conservado.
- [x] Repositorio renombrado, PUBLIC, origin y enlaces actualizados, historial conservado.

## 9. Auditoría de Fase 0

- [x] Proyecto inicia correctamente; Vite funciona.
- [x] Node 24.19.0 disponible.
- [x] pnpm 12.3.4 disponible y declarado en `packageManager`.
- [x] `pnpm-lock.yaml` generado.
- [x] `package-lock.json` eliminado y no regenerado.
- [x] `pnpm install` funciona.
- [x] `pnpm build` funciona.
- [x] `pnpm dev` funciona; servidor temporal detenido al finalizar.
- [x] Página inicial operativa, sin errores ni advertencias de consola.
- [x] JavaScript continúa organizado por módulos.
- [x] No existe backend, base de datos ni APIs externas en la aplicación.
- [x] `validarReserva.js` continúa aislable, sin reglas implementadas.
- [x] README actualizado con historial acumulativo y regla permanente de pnpm.
- [x] `GUION_VIDEO.md` continúa presente.
- [x] Git 2.55.0.windows.3 funciona; historial anterior conservado.
- [x] GitHub CLI 2.100.0 funciona y está autenticado como `JorgeDavid12`.
- [x] Repositorio público creado y confirmado como `PUBLIC`.
- [x] `origin` apunta al repositorio correcto.
- [x] Rama `main` publicada, predeterminada y commit remoto comprobado.
- [x] No se detectaron credenciales versionadas tras revisión de archivos e historial.
- [x] `node_modules/`, `dist/` y `.env` ignorados; sin temporales versionados.

## 10. Git y GitHub

Repositorio: [JorgeDavid12/sistema-reservas-nova](https://github.com/JorgeDavid12/sistema-reservas-nova).

- Visibilidad comprobada: **PUBLIC**.
- Remote: `https://github.com/JorgeDavid12/sistema-reservas-nova.git`.
- Rama local y remota: `main`, también confirmada como rama predeterminada en GitHub.
- Publicación verificada: commit de migración `d241f5a`, seguido del commit documental de cierre.
- Historial inicial conservado: `f88c0fb` y `e7607a9`.

El bloqueo inicial por falta de GitHub CLI quedó resuelto con su instalación y autenticación previas a este ajuste. Se creó el repositorio desde el Git existente, sin reinicializarlo ni sobrescribir commits.

Comprobaciones de publicación:

```sh
git push -u origin main
gh repo view --json name,url,visibility,defaultBranchRef
git status
```

No versionar credenciales, tokens, claves, archivos personales ni `node_modules/`. La propiedad `private: true` de `package.json` evita publicar accidentalmente un paquete en el registro; no impide que GitHub sea público.
