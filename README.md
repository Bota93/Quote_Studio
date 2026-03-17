# Quote Studio

Aplicacion web para crear presupuestos profesionales desde el navegador con una experiencia rapida, clara y lista para trabajar con clientes reales.

## Demo del proyecto

Generador de presupuestos con soporte para:

- datos del emisor
- datos del cliente
- lineas de servicio
- calculo automatico de subtotal, IVA y total
- vista previa visual del presupuesto
- exportacion a PDF con `jsPDF`
- persistencia local con `localStorage`

## Stack

- React 19
- Vite 8
- Tailwind CSS 4
- jsPDF
- uuid
- localStorage

## Captura general

La aplicacion esta planteada como una herramienta de escritorio ligera dentro del navegador:

- panel lateral con historial de presupuestos guardados localmente
- formulario central para configurar emisor, cliente y servicios
- vista previa visual del presupuesto en tiempo real
- exportacion directa a PDF

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

## Estructura principal

```text
src/
  App.jsx
  index.css
  main.jsx
```

## Como funciona

1. Crea o selecciona un presupuesto desde el historial local.
2. Completa los datos del emisor y del cliente.
3. Añade una o varias lineas de servicio con cantidad y precio.
4. La aplicacion calcula automaticamente subtotal, IVA y total.
5. Revisa la vista previa del documento.
6. Exporta el presupuesto a PDF cuando este listo.

## Persistencia local

Los presupuestos se guardan en el navegador usando `localStorage`, por lo que:

- no hace falta backend para esta primera version
- los datos persisten entre recargas
- cada presupuesto puede reabrirse desde el historial local

## Buenas practicas aplicadas

- estructura simple y mantenible para una primera iteracion
- separacion clara entre datos, calculos y renderizado
- carga diferida de `jsPDF` para reducir el peso inicial
- validacion tecnica con `pnpm lint` y `pnpm build`
- interfaz responsive pensada para escritorio y tablet

## Roadmap

- edicion de plantillas de presupuesto
- selector de impuestos predefinidos
- exportacion e importacion en JSON
- sincronizacion con backend
- autenticacion de usuarios
- generacion de facturas a partir de presupuestos

## Autor

Desarrollado por [@Bota93](https://github.com/Bota93)

## Licencia

Este proyecto se distribuye bajo la licencia MIT.