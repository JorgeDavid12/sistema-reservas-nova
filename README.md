# NOVA BOOKING

Mini sistema CRUD de reservas desarrollado como práctica de pruebas unitarias manuales y aislamiento de lógica dentro de Aseguramiento de la Calidad de Software.

**Estado actual:** Fase 0 completada en local. Publicación en GitHub pendiente por falta de GitHub CLI. El CRUD y las reglas de validación todavía no están implementados.

| Quiero... | Ir a |
| --- | --- |
| Entender el proyecto | [Descripción general](#1-descripción-general) |
| Ver cómo está construido | [Arquitectura](#4-arquitectura) |
| Revisar tecnologías | [Stack](#3-stack-tecnológico) |
| Entender qué se probará | [Unidad seleccionada](#6-unidad-seleccionada) |
| Revisar el avance | [Bitácora por fases](#bitácora-de-desarrollo) |
| Ejecutar el proyecto | [Ejecución local](#8-ejecución-local) |
| Revisar estado actual | [Auditoría](#9-auditoría-de-fase-0) |
| Preparar el videotutorial | [Guion pendiente](GUION_VIDEO.md) |
| Publicar el repositorio | [Git y GitHub](#10-git-y-github) |

---

## 1. Descripción general

Nova Booking simula la gestión de reservas de espacios o salas universitarias. En las siguientes fases permitirá crear, consultar, editar y eliminar reservas, aplicando reglas de negocio antes de aceptar los datos.

Actualmente muestra una pantalla temporal para comprobar el arranque y deja preparada la separación de módulos. Su objetivo académico es explicar y probar una unidad de validación sin depender de infraestructura externa.

## 2. Objetivo académico

El proyecto permitirá demostrar:

- Un CRUD con lógica de negocio.
- El aislamiento de una función crítica.
- Entradas válidas e inválidas.
- Resultados esperados y obtenidos, comparados explícitamente.
- Pruebas manuales sin base de datos ni APIs.

Estas capacidades son objetivos futuros; la verificación de arranque de Fase 0 no equivale a pruebas unitarias de reglas todavía inexistentes.

## 3. Stack tecnológico

| Tecnología | Uso | Estado |
| --- | --- | --- |
| Vite 8.3.0 | Desarrollo y compilación del frontend | Activo |
| JavaScript modular | Entrada y futura lógica | Activo |
| HTML | Estructura semántica | Activo |
| CSS | Pantalla temporal oscura | Activo |
| Node.js / npm | Herramientas locales de desarrollo | Verificado con Node 24.19.0 / npm 9.3.1 |
| Git | Versionado local, rama `main` | Activo |
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
│   ├── validaciones/
│   │   └── validarReserva.js
│   ├── pruebas/
│   │   └── pruebaValidarReserva.js
│   ├── ui/
│   │   ├── interactions.js
│   │   └── particles.js
│   ├── main.js
│   └── styles.css
├── index.html
├── README.md
├── GUION_VIDEO.md
├── package.json
├── package-lock.json
└── .gitignore
```

`node_modules/` y `dist/` son directorios locales generados y excluidos de Git; `.git/` contiene el historial local.

| Módulo | Responsabilidad prevista | Implementación en Fase 0 |
| --- | --- | --- |
| `crud/reservasCrud.js` | Operaciones sobre un array privado en memoria; invocar la validación antes de modificarlo | Comentarios y módulo vacío |
| `validaciones/validarReserva.js` | Reglas puras de negocio, independientes del CRUD y la UI | Comentarios y módulo vacío |
| `pruebas/pruebaValidarReserva.js` | Comparaciones manuales aisladas de resultados | Comentarios y módulo vacío |
| `ui/` | Interacciones, partículas y efectos exclusivamente visuales | Comentarios y módulos vacíos |
| `main.js` | Entrada y futura coordinación de módulos | Importa CSS y cambia el estado a «Operativo» |
| `styles.css` | Presentación temporal | Estilos básicos sin animaciones |

La validación no deberá conocer el DOM, modificar reservas, hacer solicitudes de red ni acceder a almacenamiento. El CRUD no deberá contener manipulación del DOM. La UI no deberá decidir reglas de negocio.

Los módulos reservados no se importan en la pantalla inicial porque todavía no tienen comportamiento. Su carga independiente se comprobó desde Node.

## 5. Flujo conceptual

Flujo previsto de la aplicación, todavía no implementado:

```text
Interfaz
   ↓
CRUD
   ↓
validarReserva(reserva)
   ↓
Resultado
```

Al crear o editar, el CRUD solo modificará el array si la validación permite la operación.

Prueba aislada prevista:

```text
Datos de prueba
   ↓
validarReserva(reserva)
   ↓
Resultado obtenido
   ↓
Comparación con resultado esperado
   ↓
PASS / FAIL
```

La prueba llamará directamente a la función, sin pasar por el CRUD ni la interfaz.

## 6. Unidad seleccionada

La unidad prevista es **`validarReserva(reserva)`**. Su implementación completa llegará en la Fase 2. El contrato exacto de entrada y salida se definirá antes de implementar las reglas.

Reglas previstas:

- Campos obligatorios.
- Formato de correo.
- Horario lógico.
- Cantidad válida de asistentes.
- Capacidad de la sala.

Los datos necesarios para validar deberán recibirse como entrada; la función no consultará un catálogo externo. En Fase 0 no existe una función ficticia que acepte todas las reservas: el archivo está preparado, pero la función aún no se exporta.

## 7. Persistencia

Nova Booking **NO utiliza base de datos**. Las reservas se manejarán mediante un array en memoria de JavaScript mientras la aplicación esté ejecutándose. Al recargar la página podrán desaparecer intencionalmente.

No se utilizarán `localStorage`, `sessionStorage`, IndexedDB, archivos de datos, APIs ni servicios externos para persistir reservas. Esta decisión mantiene el alcance sencillo y permite demostrar el aislamiento de la unidad.

En Fase 0 todavía no se crea ni modifica un array de reservas.

## 8. Ejecución local

Requisito: Node.js compatible con `^20.19.0 || >=22.12.0` y npm. Para reproducir el entorno validado, utiliza Node 24.19.0. Consulta los [requisitos oficiales de Vite](https://vite.dev/guide/).

Desde la carpeta `nova-booking`:

```sh
npm install
npm run dev
```

Abre la dirección indicada por Vite. En la auditoría se utilizó `http://127.0.0.1:5173/`. Para detener el servidor, pulsa `Ctrl+C` en su terminal.

Comandos adicionales disponibles:

```sh
npm run build
npm run preview
```

`build` genera `dist/`; `preview` permite revisar esa compilación localmente. No existe un comando de pruebas de validación en esta fase.

### Observación del entorno de preparación

El Node predeterminado del equipo era **19.5.0**, incompatible con Vite 8. La primera instalación emitió `EBADENGINE`. Se corrigió la ejecución de las herramientas usando Node **24.19.0**, disponible en el entorno de trabajo, y se repitió una instalación limpia con `npm ci`, sin avisos de incompatibilidad.

No se modificó la instalación global ni el PATH persistente del equipo. Antes de utilizar los comandos normales desde una nueva terminal, instala o selecciona un Node compatible y comprueba `node --version` y `npm --version`.

Alternativa temporal para este equipo, en PowerShell y desde `nova-booking`, usando el Node ya disponible sin cambiar la configuración global:

```powershell
$novaNodeDir = Join-Path $env:USERPROFILE '.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin'
$env:Path = "$novaNodeDir;$env:Path"
& "$novaNodeDir\node.exe" 'C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js' run dev
```

Esta ruta depende del entorno local. La vía portable es instalar o seleccionar una versión compatible de Node y utilizar `npm install` / `npm run dev`.

---

# Bitácora de desarrollo

| Fase | Estado | Objetivo | Resultado |
| --- | --- | --- | --- |
| Fase 0 | ✅ Completada en local; GitHub pendiente | Preparación y arquitectura | Base ejecutable, documentada y versionada; publicación bloqueada por ausencia de `gh` |
| Fase 1 | ⏳ Pendiente | CRUD funcional | Pendiente |
| Fase 2 | ⏳ Pendiente | Unidad de validación | Pendiente |
| Fase 3 | ⏳ Pendiente | Sistema visual base | Pendiente |
| Fase 4 | ⏳ Pendiente | Glassmorphism y figuras | Pendiente |
| Fase 5 | ⏳ Pendiente | Partículas e interacciones | Pendiente |
| Fase 6 | ⏳ Pendiente | Validation Lab y pruebas | Pendiente |
| Fase 7 | ⏳ Pendiente | Video y auditoría final | Pendiente |

## Regla de mantenimiento

> Al finalizar cada fase de desarrollo debe actualizarse esta documentación antes de considerar la fase completada.

La bitácora es **acumulativa**: no borrar el historial de fases anteriores. En cada fase registrar qué se pidió, qué se implementó, archivos afectados, decisiones tomadas, pruebas realizadas, problemas encontrados, posibles pendientes y estado final. Corregir afirmaciones desactualizadas del estado actual sin eliminar la evidencia histórica.

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
- Se intentó crear el repositorio público mediante GitHub CLI; el ejecutable no está disponible.

### Archivos creados/modificados

Todos los 13 archivos del árbol de [Arquitectura](#4-arquitectura) se crearon en esta fase. No había código previo que modificar. Los directorios generados `node_modules/` y `dist/` no forman parte del código versionado.

### Decisiones técnicas

- Solo Vite como dependencia directa de desarrollo; sin React ni backend.
- Vite fijado a `8.3.0` y versiones resueltas en `package-lock.json`.
- HTML semántico y fuentes del sistema, sin recursos remotos de interfaz.
- Separar la lógica de negocio de la interfaz desde el árbol inicial.
- Reservar módulos futuros sin inventar resultados de validación ni añadir controles sin funcionalidad.
- No añadir un framework de pruebas ni desarrollar casos finales en esta fase.
- Mantener la publicación como pendiente explícito, sin improvisar credenciales ni cambiar de servicio.

### Validaciones realizadas

| Verificación | Resultado observado |
| --- | --- |
| Instalación limpia con Node 24.19.0 | `npm ci` completado; cero vulnerabilidades reportadas por npm en esa ejecución |
| Compilación | `npm run build` completado con Vite 8.3.0 |
| Arranque | Script `dev` iniciado con Node compatible; Vite disponible en `http://127.0.0.1:5173/` |
| Navegador | Título, textos y estado «Operativo» presentes; pantalla temporal revisada visualmente |
| Consola del navegador | Sin advertencias ni errores registrados durante la carga auditada |
| Módulos reservados | Los cinco módulos se importaron desde Node sin DOM ni servicios externos |
| Alcance | Sin CRUD, reglas finales, Validation Lab ni efectos avanzados |
| Publicación | Comando de creación falló porque `gh` no está instalado/disponible |

Importar módulos vacíos comprueba únicamente la estructura y su independencia inicial; no demuestra reglas de negocio que todavía no existen.

### Problemas encontrados

1. **Node global incompatible:** el sistema resolvía Node 19.5.0. Se verificó la aplicación con Node 24.19.0 del entorno y se documentó cómo ejecutarla; queda pendiente actualizar o seleccionar Node en la terminal habitual del usuario.
2. **GitHub CLI ausente:** `gh repo create` no pudo ejecutarse. No existe un repositorio remoto creado por esta fase ni se realizó push. Los pasos concretos están en [Git y GitHub](#10-git-y-github).

### Estado final

Fase 0 terminada en su alcance local: estructura, página inicial, documentación y verificaciones de arranque/compilación. La publicación pública permanece pendiente por el bloqueo de herramientas admitido en el alcance de esta fase; no se presenta como realizada.

### Próximo paso

Resolver los pendientes de entorno/publicación y, únicamente cuando se autorice la Fase 1, definir el modelo de reserva e implementar crear, listar, editar y eliminar sobre un array en memoria, con una interfaz mínima. Preservar la frontera de `validarReserva(reserva)`; la implementación completa de sus reglas corresponde a la Fase 2.

## 9. Auditoría de Fase 0

- [x] El proyecto inicia correctamente con Node compatible.
- [x] Vite funciona y compila.
- [x] JavaScript está organizado por módulos.
- [x] No existe backend de aplicación.
- [x] No existe base de datos.
- [x] No existen APIs externas en la aplicación.
- [x] La estructura separa lógica y UI.
- [x] `validarReserva.js` se mantiene independiente, aún sin reglas implementadas.
- [x] `README.md` está creado y organizado.
- [x] El README contiene bitácora por fases y regla de mantenimiento acumulativo.
- [x] Fase 0 declara su cierre local y conserva los pendientes externos.
- [x] `GUION_VIDEO.md` existe.
- [x] `.gitignore` existe.
- [x] Git está inicializado en `main`.
- [ ] Existe al menos un commit: verificación de cierre pendiente.
- [x] Se intentó crear/subir el repositorio público: bloqueo por falta de `gh`.
- [x] La aplicación abre sin errores ni advertencias de consola en la carga revisada.
- [ ] Repositorio público creado y push completado: pendiente externo.
- [ ] Node compatible seleccionado en la terminal habitual: pendiente de configuración del usuario.

## 10. Git y GitHub

Nombre previsto del repositorio público: **`nova-booking-unit-testing`**.

El intento de `gh repo create nova-booking-unit-testing --public --source . --remote origin --push` terminó con «`gh` no se reconoce». La autenticación no pudo verificarse sin el ejecutable. No se configuró un remote ficticio ni se publicaron datos en otro servicio.

Para completar la publicación:

1. Instala [GitHub CLI](https://cli.github.com/) y abre una terminal nueva.
2. Desde `nova-booking`, autentícate y crea el repositorio público:

```sh
gh auth login
gh repo create nova-booking-unit-testing --public --source . --remote origin --push
gh repo view --json url,visibility
```

La última orden debe devolver `PUBLIC` y la URL real. Si el nombre ya existe en tu cuenta, revisa ese repositorio antes de enlazarlo: no sobrescribir su contenido automáticamente.

No versionar credenciales, tokens, claves, archivos personales ni `node_modules/`. La propiedad `private: true` de `package.json` evita publicar accidentalmente un paquete npm; no impide que el repositorio de GitHub sea público.

Después de publicar, registrar la URL real y la comprobación del push en esta bitácora, marcar el pendiente correspondiente y guardar la actualización en un nuevo commit.
