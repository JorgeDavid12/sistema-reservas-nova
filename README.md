# NOVA BOOKING

Mini sistema CRUD de reservas desarrollado como práctica de pruebas unitarias manuales y aislamiento de lógica dentro de Aseguramiento de la Calidad de Software.

**Estado actual:** Fase 0 completada. Entorno configurado con pnpm. Repositorio público publicado en [GitHub](https://github.com/JorgeDavid12/nova-booking-unit-testing), rama `main`. CRUD pendiente para Fase 1.

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
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
└── .gitignore
```

`node_modules/` y `dist/` son directorios locales generados y excluidos de Git; `.git/` contiene el historial local.

`pnpm-workspace.yaml` conserva únicamente una excepción de antigüedad mínima para `vite@8.3.0`, necesaria con pnpm 12 durante esta migración para mantener la versión existente. No convierte la aplicación en un monorepo ni agrega dependencias.

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

**NOVA BOOKING utiliza pnpm como único gestor de paquetes.** En todas las fases posteriores: usar pnpm, mantener `pnpm-lock.yaml`, no utilizar `npm install`, no generar `package-lock.json`, no utilizar yarn y no agregar dependencias innecesarias.

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

Repositorio: [JorgeDavid12/nova-booking-unit-testing](https://github.com/JorgeDavid12/nova-booking-unit-testing).

- Visibilidad comprobada: **PUBLIC**.
- Remote: `https://github.com/JorgeDavid12/nova-booking-unit-testing.git`.
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
