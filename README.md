# NOVA BOOKING

Mini sistema CRUD de reservas desarrollado como práctica de pruebas unitarias manuales y aislamiento de lógica dentro de Aseguramiento de la Calidad de Software.

**Estado actual:** Fase 4 completada: composición amplia para laptop, cristal refinado, reservas con distribución adaptable y modales unificados. Se conservan las figuras y partículas existentes. Entorno configurado con pnpm. Repositorio público publicado en [GitHub](https://github.com/JorgeDavid12/sistema-reservas-nova), rama `main`. CRUD funcional y unidad de validación integrada. Prueba manual formal pendiente para fases posteriores.

| Quiero... | Ir a |
| --- | --- |
| Entender el proyecto | [Descripción general](#1-descripción-general) |
| Ver cómo está construido | [Arquitectura](#4-arquitectura) |
| Revisar tecnologías | [Stack](#3-stack-tecnológico) |
| Entender qué se probará | [Unidad seleccionada](#6-unidad-seleccionada) |
| Revisar el avance | [Bitácora por fases](#bitácora-de-desarrollo) |
| Ejecutar el proyecto | [Ejecución local](#8-ejecución-local) |
| Revisar estado actual | [Fase 4](#fase-4--glassmorphism-y-composición) |
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
| CSS | Sistema visual bento oscuro para laptop | Activo |
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
| `ui/interactions.js` | Entrada visual independiente desde index.html; iluminación al cursor | Activo, sin acceso al CRUD ni a validación |
| `ui/particles.js` | Canvas decorativo con movimiento y reacción al cursor | 52 partículas, dibujo limitado a 30 FPS y pausa por visibilidad |
| `main.js` | Recoge datos, añade capacidad temporal y valida antes de Crear/Editar | Coordina validación, CRUD y presentación |
| `styles.css` | Variables visuales, bento, cristal, geometría, controles, estados y foco | Fase 4; composición amplia, grid adaptable y cristal refinado |
| `index.html` | Header con acción principal, resumen bento, estado vacío y diálogos | IDs, controles y validación conservados |

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
pnpm test:validation
```

`build` genera `dist/`; `preview` sirve esa compilación localmente. `test:validation` ejecuta los seis casos aislados de `validarReserva()` y devuelve un reporte de entrada, esperado, obtenido y PASS/FAIL.

Si PowerShell bloquea el wrapper pnpm.ps1 por su política de ejecución, puede utilizarse `pnpm.cmd` con los mismos argumentos; por ejemplo, `pnpm.cmd dev`. No es necesario cambiar la política de ejecución.

---

# Bitácora de desarrollo

| Fase | Estado | Objetivo | Resultado |
| --- | --- | --- | --- |
| Fase 0 | ✅ Completada | Preparación y arquitectura | Base preparada, pnpm configurado, arquitectura verificada y repositorio público publicado |
| Fase 1 | ✅ Completada | CRUD funcional | Crear, listar, editar, eliminar y cambiar estado en memoria; revisión funcional y responsive realizada |
| Fase 2 | ✅ Completada | Unidad de validación | Función pura integrada en Crear/Editar; errores por campo y repositorio renombrado |
| Fase 3 | ✅ Completada | Sistema visual base | Bento reforzado con gradientes, cristal, figuras y primera versión de partículas; revisión en laptop |
| Fase 4 | ✅ Completada | Glassmorphism y composición | Mayor ancho, cristal refinado, información interna retirada y revisión con 1, 2 y 3 reservas |
| Fase 5 | ✅ Completada | Partículas e interacciones | Partículas refinadas, respuesta al cursor, figuras sutiles y microinteracciones verificadas en laptop |
| Fase 6 | ✅ Completada | Validation Lab y pruebas | Panel integrado, seis pruebas aisladas y ajustes finales de header, logo y composición |
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

## Fase 3 — Sistema visual base

La entrada inicial se conserva como antecedente. La corrección autorizada posteriormente y el estado vigente se registran al final de esta fase.

### Objetivo

Rediseñar la identidad, composición y jerarquía del dashboard exclusivamente desde HTML y CSS, conservando toda la lógica implementada.

### Nueva dirección visual

Negro profundo y superficies oscuras, iluminación ambiental suave mediante degradados radiales. Violeta y azul en las acciones; verde/cian para confirmadas y magenta/rojo para canceladas y peligro. Los colores se concentran en luces, bordes y acentos. Tipografía local, sin recursos ni ilustraciones externas.

### Cambios de layout

Header con marca NOVA en degradado, subtítulo, indicador de memoria y botón Nueva reserva. Bento de tres columnas: total dominante a la izquierda, pendientes y canceladas apiladas al centro, confirmadas a la derecha. Debajo, reservas en tres columnas y estado vacío horizontal con símbolo abstracto CSS. Aviso de memoria visible en el pie.

### Componentes rediseñados

Botones primarios con degradado, secundarios discretos y peligrosos con acento rosado. Tarjetas compactas, badges por estado, inputs/selects uniformes, foco visible y mensajes de validación contrastados. Crear/Editar y confirmación de eliminación comparten superficies, radios, bordes y sombras. El formulario mantiene sus controles, labels, IDs y mensajes originales.

### Archivos modificados

Solo tres archivos: `index.html`, `src/styles.css` y `README.md`. Sin archivos nuevos, dependencias ni cambios en JavaScript, CRUD, validación, catálogo, persistencia o eventos.

### Decisiones visuales

Variables CSS para superficies, colores, bordes, radios y sombras. Decoraciones estáticas con función exclusivamente visual, sin gráficas ficticias. Transiciones breves de hover/foco y aparición del diálogo; se respeta la preferencia de movimiento reducido. Blur de 3 px únicamente en el fondo del diálogo. Sin partículas, canvas, parallax, tilt ni cristal avanzado. Se redujeron alturas y espacios tras la primera revisión para mejorar la densidad en laptop.

### Revisión realizada

- Navegador de escritorio: revisión inicial en el tamaño disponible y revisión final fijada en 1366×768; sin auditorías de teléfono/tablet.
- Estado vacío y dashboard con tres reservas ficticias introducidas solo para la revisión, sin datos demo agregados al código.
- Tres tarjetas por fila, con nombres, sala, fecha, horario, asistentes, estado y acciones visibles; sin overflow horizontal del documento.
- Crear desde header, envío vacío con seis mensajes de validación y corrección para guardar.
- Edición con correo inválido, error legible y guardado tras corregirlo; cambio de estado con contadores actualizados.
- Confirmación de eliminación visible y opción Conservar reserva comprobada.
- Formulario cómodo en dos columnas; scroll interior disponible cuando se acumulan mensajes.
- Consola sin errores ni advertencias. Build con pnpm completado.
- Diff revisado: archivos JavaScript sin modificaciones, incluidas funciones de renderizado e integración.

### Estado final

Fase 3 completada. Base visual coherente y lista para profundizar su acabado; lógica y bitácoras anteriores conservadas. No se implementó funcionalidad de fases posteriores.

### Pendiente para Fase 4

Cristal más evidente, profundidad, luces detrás del cristal y composición decorativa. Partículas y otras interacciones avanzadas permanecen para su fase correspondiente. No se avanzó automáticamente.

### Corrección — Dirección visual aprobada

**Objetivo y antecedente.** La primera versión resultó demasiado sobria. Se reforzó la referencia tipo Decimal: luces multicolor detrás del contenido, geometría abstracta y superficies de cristal reconocibles. El usuario autorizó expresamente incorporar una primera versión de partículas y glassmorphism dentro de esta corrección de Fase 3; Fases 4 y 5 continúan pendientes.

**Cambios visuales.** Fondo negro con luces violeta, azul eléctrico, magenta, coral y cian. Esfera orbital en el hero; esfera, estrella, anillo y figura facetada en el bento. Formas parcialmente detrás de los paneles, transparencia, backdrop-filter, reflejos interiores y bordes luminosos. Se conserva la distribución: total a la izquierda, pendientes/canceladas al centro y confirmadas a la derecha. Tarjetas compactas y ambos diálogos comparten el acabado; los errores mantienen su contraste rojo.

**Interacción y decisiones.** Canvas decorativo de 52 partículas con movimiento lento, desplazamiento y conexiones cerca del cursor. Dibujo limitado a 30 FPS, resolución limitada a 2×, pausa al ocultar la pestaña y estado estático con movimiento reducido. Los brillos de tarjetas usan listeners pasivos y requestAnimationFrame. Las decoraciones no reciben clics y están ocultas al árbol de accesibilidad. Sin imágenes externas ni dependencias nuevas. Los módulos visuales no importan ni modifican datos del sistema.

**Archivos modificados.** Cinco archivos existentes: `index.html`, `src/styles.css`, `src/ui/interactions.js`, `src/ui/particles.js` y `README.md`. Los módulos visuales antes reservados quedan activos mediante una entrada separada en index.html. `main.js`, CRUD, validación, catálogo, renderizado funcional, dependencias y lockfile permanecen sin cambios, confirmado mediante Git.

**Revisión realizada.** Navegador de laptop a 1366×768, sin auditoría móvil/tablet:

- Gradientes y figuras visibles; cristal que deja percibir los colores detrás del panel, incluido el formulario.
- Partículas visibles en capturas sucesivas, con conexiones cerca del cursor durante la interacción.
- Estado vacío, reserva creada, edición conservando `reserva-1`, cambio a Confirmada con contadores correctos y eliminación hasta volver a cero.
- Envío vacío: seis mensajes por campo y resumen legibles; corrección de datos y guardado comprobados.
- Sin desbordamiento horizontal del documento ni controles inaccesibles en la revisión. No se realizó un perfil de rendimiento ni una nueva captura de registros de consola en esta corrección.
- `pnpm.cmd build` completado con Vite 8.3.0; `git diff --check` sin errores de espacios. La aplicación se revisó con el servidor Vite existente; intentar iniciar otro en el mismo puerto devolvió «Port 5174 is already in use» y se reutilizó el ya activo.

**Problema corregido.** Una esfera sobresalía sobre parte del mensaje de confirmación. Se redujo su altura y se ajustaron separación y orden de capas; el mensaje se volvió a comprobar completo después de cambiar estado.

**Estado final.** Corrección visual de Fase 3 completada. CRUD, validaciones, datos en memoria y eventos funcionales conservados. El historial anterior permanece intacto. Para Fase 4 queda profundizar y afinar la composición de cristal y figuras sobre esta base; Fase 5 podrá evolucionar las partículas. No se inicia ninguna de ellas automáticamente.

## Fase 4 — Glassmorphism y composición

### Objetivo

Pulir la composición de laptop y la profundidad del cristal sin cambiar lógica, validaciones, datos ni comportamiento de partículas.

### Aprovechamiento del ancho y limpieza

Contenedor máximo ampliado de 1240 a 1680 px, con margen interior fluido de 24–48 px. En 1366×768 el contenido medido ocupa aproximadamente 1295 px y deja 36 px a cada lado, frente a unos 95 px del diseño previo. Header, hero, bento y reservas comparten los mismos bordes. Header, separaciones y footer más compactos.

Se retiraron «Datos en memoria», «FASE 03» y «Solo en esta sesión · Las reservas se borran al recargar» de la interfaz. La persistencia exclusivamente en memoria sigue explicada en esta documentación; no se modificó su comportamiento.

### Cristal, figuras y bento

Bordes translúcidos y sombras interiores compartidos, reflejo fino en el borde superior, desenfoque de 22 px y transparencia equilibrada con fondos oscuros. Se ajustaron tamaño, posición y opacidad de las figuras existentes para dejar ver sus contornos detrás del cristal sin cubrir mensajes. No se agregaron figuras ni se modificó el sistema de partículas.

El bento conserva total a la izquierda, pendientes/canceladas apiladas al centro y confirmadas a la derecha, con filas de 78 px y separación de 12 px. Se equilibraron las luces violeta, azul, coral y cian y la escala de los símbolos.

### Reservas y formularios

Grid CSS con distribución automática: una tarjeta hasta 760 px, dos repartidas en el ancho disponible y tres en una fila en las laptops revisadas. Fecha y horario comparten fila para mantener compactas las tarjetas. No se generaron datos permanentes.

Crear/Editar tiene un ancho máximo de 720 px y conserva sus dos columnas, controles y mensajes. Ambos diálogos comparten transparencia, reflejos y sombras; el fondo usa un desenfoque leve para reconocer el dashboard. Campos integrados y errores con fondo rojo oscuro y texto claro.

### Archivos modificados

Tres archivos existentes: `index.html`, `src/styles.css` y `README.md`. Arquitectura sin archivos nuevos. Git confirmó que todos los archivos JavaScript, incluidas partículas e interacciones, así como dependencias y lockfile permanecen intactos.

### Revisión realizada

- Navegador a 1366×768: estado vacío, una, dos y tres reservas; sin desbordamiento horizontal del documento. Tres tarjetas de aproximadamente 421 px, alineadas y sin desbordamiento interno.
- Navegador a 1440×900: tres reservas, ancho de contenido de aproximadamente 1365 px y sin desbordamiento horizontal.
- Inspección visual de luces, figuras, reflejos y separación de superficies: no se observaron colisiones con textos o controles.
- Formulario vacío enviado: seis errores por campo y resumen visibles; datos corregidos y tres reservas creadas mediante el formulario.
- Edición guardada y diálogo de eliminación revisado; eliminar el primer registro conservó `reserva-2` y `reserva-3` y actualizó el total a 2.
- Ausencia de los tres textos internos comprobada en el DOM visible.
- `pnpm.cmd build` completado con Vite 8.3.0. `git diff --check` sin errores de espacios.

Revisión limitada a laptop/escritorio. Los registros ficticios se introdujeron únicamente en la memoria del navegador para revisar la composición. No se añadió una suite de pruebas ni se realizó una auditoría de dispositivos móviles.

### Estado final y pendiente para Fase 5

Fase 4 completada. Sin problemas funcionales observados durante estas comprobaciones. Lógica, eventos y partículas conservados; bitácoras anteriores preservadas. Para Fase 5 queda la evolución autorizada del movimiento, reacción al cursor y microinteracciones. No se continúa automáticamente.

## Fase 5 — Partículas e interacciones

### Mejoras realizadas

Se refinó el canvas existente con 48 partículas de deriva lenta, conexiones tenues entre puntos cercanos y una repulsión corta con entrada y salida suavizadas al acercar o retirar el cursor. El efecto mantiene un carácter ambiental: no dibuja líneas hacia el puntero ni usa movimientos rápidos.

Tarjetas del bento, reservas, estado vacío, botones y diálogos reciben un reflejo localizado por cursor, una iluminación mínima y bordes algo más luminosos. Las figuras del hero y del bento flotan o rotan apenas, con ciclos de 11–20 segundos. Se añadieron transiciones breves para hover y foco, entrada de nuevas reservas, cambio de estado, contadores, confirmaciones y apertura/cierre de diálogos, sin rebotes.

### Rendimiento y movimiento reducido

El canvas conserva el límite de 30 FPS, pausa cuando la pestaña queda oculta y limita el DPR a 1.75. Se redujo la cantidad de partículas de 52 a 48; las conexiones usan distancia al cuadrado y el cursor se procesa en un único `requestAnimationFrame`. Tres observadores acotados atienden solamente lista, contadores y mensaje de confirmación. No se agregaron dependencias ni cálculos ligados a datos del sistema.

Con `prefers-reduced-motion: reduce`, el canvas queda estático con 28 puntos, se eliminan reacción al cursor, flotaciones, animaciones funcionales y transformaciones de hover.

### Archivos modificados

- `src/ui/particles.js`: deriva, repulsión amortiguada, conexiones y límites de renderizado.
- `src/ui/interactions.js`: iluminación por cursor y disparadores visuales desacoplados del CRUD.
- `src/styles.css`: reflejos, flotación y microinteracciones.
- `README.md`: registro de la fase.

### Revisión realizada

- Laptop/escritorio: 1366×768 y 1440×900.
- Partículas visibles sin dominar el contenido, reacción gradual al cursor y conexiones discretas.
- Tarjetas, botones, inputs, contadores, estados, mensajes y ambos diálogos revisados sin saltos ni parpadeos.
- CRUD completo y validaciones comprobados; textos legibles y sin desbordamiento horizontal del documento.
- Build de producción y revisión de Git completados sin modificar reglas de negocio.

### Estado final

Fase 5 completada. La lógica funcional, datos en memoria, reglas de validación, IDs y eventos permanecen sin cambios.

Siguiente fase: **Fase 6 — Validation Lab y pruebas.** No se inició en este trabajo.

## Fase 6 — Validation Lab y pruebas

### Implementación del Validation Lab

Se agregó una sección integrada al dashboard que identifica la unidad `validarReserva()`, explica el caso seleccionado y muestra datos de entrada, resultado esperado, resultado obtenido y estado final PASS/FAIL. Los seis casos pueden recorrerse desde el selector o desde su lista y el botón **Ejecutar los 6 casos** vuelve a calcular el reporte completo.

### Prueba manual y aislamiento

`src/pruebas/pruebaValidarReserva.js` define y compara seis escenarios: reserva válida, correo inválido, horario inválido, asistentes inválidos, capacidad superada y varios errores simultáneos. El comparador verifica tanto `valido` como el orden exacto de los códigos y captura excepciones como FAIL.

La prueba importa únicamente `validarReserva.js` y usa datos literales; no importa DOM, UI, CRUD, catálogo, almacenamiento ni APIs. `src/ui/validationLab.js` es solo un adaptador visual del mismo reporte. La ejecución independiente queda disponible mediante `pnpm test:validation`.

### Ajustes visuales

El header recibió mayor transparencia, luces internas, borde y profundidad coherentes con las tarjetas glassmorphism. La letra «N» fue reemplazada por un símbolo SVG propio que combina calendario, nodo y órbita. Cuando existe una sola reserva, un planeta con anillo ocupa de forma decorativa el espacio derecho sin alterar el ancho de la tarjeta ni cubrir controles. El Lab utiliza superficies oscuras, gradientes, bloques ordenados y acentos verde/rojo para que el resultado sea fácil de explicar en video.

### Archivos modificados

- `index.html`: nuevo logo SVG, estructura del Validation Lab y carga de su módulo.
- `src/pruebas/pruebaValidarReserva.js`: casos, comparación, try-catch y reporte manual.
- `src/ui/validationLab.js`: ejecución y presentación visual aislada.
- `src/styles.css`: estilos del Lab y ajustes de header, logo y composición de una reserva.
- `package.json`: comando `test:validation`.
- `README.md`: bitácora y ejecución local actualizadas.

### Revisión realizada

- `pnpm test:validation`: 6/6 casos PASS con entrada, esperado y obtenido visibles.
- Navegador de laptop a 1366×768 y 1440×900: estado vacío, una reserva, header, logo, composición decorativa y Lab revisados sin desbordamiento horizontal.
- Selección del caso con varios errores y reejecución completa desde el Lab: 6/6 aprobados y estado final PASS.
- Crear reserva válida, intentar edición con correo inválido y guardar después de corregirlo; ID y total conservados.
- CRUD completo comprobado desde sus módulos; `main.js`, CRUD, unidad de validación, catálogo y render funcional permanecen sin cambios.
- Consola del navegador sin errores ni advertencias; build de producción completado.

### Estado final

Fase 6 completada. El Validation Lab demuestra la unidad real sin duplicar sus reglas y los ajustes visuales no modifican el comportamiento funcional ni la persistencia en memoria.

Siguiente fase: **Fase 7 — Video y auditoría final.** No se inició en este trabajo.

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
