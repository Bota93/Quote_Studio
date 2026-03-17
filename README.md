# Quote Studio

Aplicacion web para crear presupuestos profesionales desde el navegador, con una base pensada no solo para funcionar, sino para demostrar arquitectura frontend solida, mantenimiento sencillo y criterio tecnico.

## Objetivo del proyecto

Este repositorio se desarrolla como una pieza de portfolio profesional. La meta no es entregar un MVP rapido, sino construir una aplicacion que refleje:

- buenas practicas de React y Vite
- separacion clara de responsabilidades
- codigo mantenible y escalable
- robustez frente a errores y casos borde
- decisiones alineadas con documentacion oficial

La referencia principal para ese enfoque esta en [`AGENTS.md`](./AGENTS.md).

## Funcionalidad actual

La aplicacion permite:

- crear presupuestos desde el navegador
- completar datos del emisor y del cliente
- gestionar lineas de servicio
- calcular subtotal, IVA y total automaticamente
- visualizar una previa del presupuesto en tiempo real
- exportar el documento a PDF
- guardar presupuestos localmente con `localStorage`

## Stack

- React 19
- Vite 8
- Tailwind CSS 4
- jsPDF
- uuid

## Instalacion

```bash
pnpm install
pnpm dev
```

## Scripts disponibles

```bash
pnpm dev
pnpm build
pnpm lint
pnpm preview
```

## Estructura actual

```text
.
|-- AGENTS.md
|-- README.md
|-- public/
|-- src/
|   |-- App.jsx
|   |-- index.css
|   |-- main.jsx
|   `-- assets/
`-- .agents/
    `-- skills/
```

La estructura de codigo actual sigue siendo compacta, pero el repositorio ya incorpora una capa de gobernanza tecnica para guiar futuras refactorizaciones y crecimiento.

## AGENTS.md

[`AGENTS.md`](./AGENTS.md) define como debe trabajar el agente dentro de este repositorio. No es una nota auxiliar: actua como contrato de calidad para cualquier cambio futuro.

Sus lineas maestras son:

- priorizar calidad, claridad y correccion sobre velocidad
- diseñar antes de implementar
- separar UI, logica, datos y persistencia
- evitar soluciones rapidas que degraden mantenibilidad
- preparar la base para crecimiento real y posible integracion backend
- seguir patrones oficiales de React y dependencias justificadas

Tambien fija expectativas concretas sobre:

- arquitectura modular
- manejo de errores y validaciones
- higiene de seguridad en frontend
- rendimiento predecible
- commits pequenos y con significado
- uso responsable de IA como apoyo, no como fuente incuestionable

## Skills locales del proyecto

El repositorio incluye skills en [`.agents/skills`](./.agents/skills) para orientar analisis y cambios con mayor consistencia tecnica.

### `frontend-architecture-review`

Ruta: [`.agents/skills/frontend-architecture-review/SKILL.md`](./.agents/skills/frontend-architecture-review/SKILL.md)

Se usa para revisar o proponer decisiones de arquitectura frontend en React cuando importa especialmente:

- mantenibilidad
- modularidad
- flujo de datos predecible
- separacion de responsabilidades
- alineacion con documentacion oficial

Sirve para detectar deuda arquitectonica, proponer estructura objetivo y definir refactors incrementales sin caer en sobreingenieria.

### `quality-and-hardening`

Ruta: [`.agents/skills/quality-and-hardening/SKILL.md`](./.agents/skills/quality-and-hardening/SKILL.md)

Se usa para fortalecer robustez y madurez de la aplicacion, con foco en:

- validacion de entradas
- casos borde
- integridad de calculos
- manejo de errores
- persistencia segura
- higiene de seguridad en frontend

Es especialmente util cuando la meta es que la app se comporte como software preparado para uso real y no solo como demo visual.

### `react-refactor-professional`

Ruta: [`.agents/skills/react-refactor-professional/SKILL.md`](./.agents/skills/react-refactor-professional/SKILL.md)

Se usa para refactorizar codigo React preservando comportamiento, mejorando:

- nombres y legibilidad
- limites entre componentes
- extraccion de hooks o utilidades
- reduccion de duplicacion
- claridad del render y del flujo de estado

Esta skill ayuda a que la base evolucione hacia una estructura mas profesional sin introducir abstracciones innecesarias.

## Como encajan AGENTS y skills

La idea es simple:

- `AGENTS.md` fija los principios globales del repositorio
- las skills aportan guias especializadas para tareas concretas
- el `README` documenta ambos para que cualquier colaboracion futura mantenga el mismo nivel de exigencia

En conjunto, permiten que la evolucion del proyecto sea mas consistente, justificable y preparada para escalar.

## Flujo de uso de la aplicacion

1. Crea o selecciona un presupuesto desde el historial local.
2. Completa los datos del emisor y del cliente.
3. Añade una o varias lineas de servicio.
4. Revisa los calculos automaticos.
5. Valida la previa visual del documento.
6. Exporta el presupuesto a PDF.

## Vision a medio plazo

La direccion del proyecto no es quedarse en una unica pantalla funcional, sino evolucionar hacia una aplicacion frontend mas estructurada, con:

- componentes mas especializados
- hooks y utilidades reutilizables
- logica de calculo y persistencia mejor aislada
- validaciones mas fuertes
- base preparada para integracion con backend

## Autor

Desarrollado por [@Bota93](https://github.com/Bota93)

## Licencia

Este proyecto se distribuye bajo licencia MIT.
