# Recursos de AISGroup Design

Esta carpeta reúne los recursos reutilizables y las imágenes explicativas del sistema de diseño. El [Manual de marca v0.1](../docs/brand/manual-de-marca.md) define la identidad y el azul principal; el [Manual de comunicaciones y aplicaciones v0.4](../docs/communications/manual-de-comunicaciones.md) desarrolla voz, paleta, composición y aplicaciones por soporte.

## Estructura inicial

| Directorio o archivo | Contenido | Uso |
| --- | --- | --- |
| `brand/logos/source/` | Cinco SVG recuperados de la web del grupo, conservados sin cambios | Referencia y trazabilidad; no asumir aprobación definitiva |
| `brand/logos/draft/v0.1/` | Diez variantes vectoriales, azul principal y blanco en negativo | Revisión de la propuesta y pruebas de aplicación |
| `brand/figures/v0.1/` | Siete imágenes SVG del Manual de marca | Explicación visual; no son plantillas comerciales |
| `brand/palette/brand-v0.1.tokens.json` | Azul principal y familia tipográfica en formato DTCG | Fuente de valores propuestos |
| `brand/palette/brand-v0.1.css` | Variables CSS equivalentes | Consumo digital de los valores de marca |
| `brand/palette/contrast-v0.1.json` | Contraste del azul principal con blanco | Verificación de contraste |
| `brand/catalog.json` | Índice, procedencia, estado y hash de recursos de marca | Consulta para personas y futura Web + MCP |
| `communications/figures/v0.1/` | Paleta auxiliar y ejemplo de aplicación | Ilustraciones del Manual de comunicaciones |
| `communications/figures/v0.2/` | Seis láminas: composiciones, documentos, campañas, estructura, movimiento y adaptación | Ejemplos ilustrativos; no sustituyen las plantillas finales |
| `communications/backgrounds/draft/v0.2/` | Marco abierto y líneas de proceso anteriores | Referencia histórica; usar v0.4 en nuevas piezas |
| `communications/figures/v0.3/` | 23 nuevas láminas SVG | Ejemplos detallados por apartado |
| `communications/backgrounds/draft/v0.3/` | Motivos anteriores de captura, muestreo, rutas y bandas | Retirados para nuevas composiciones |
| `communications/backgrounds/draft/v0.4/` | Ocho fondos hexagonales con soporte incorporado | Trama, relieve y volumen; seis horizontales y dos verticales |
| `communications/figures/v0.4/` | Nueve láminas SVG | Geometría, atlas, cabecera, móvil, documentos, reglas y movimiento |
| `communications/previews/v0.4/` | Galería HTML y vista general PNG | Revisión visual local del sistema |
| `communications/graphic-system-v0.4.json` | Familias, geometría, zonas libres y reglas | Definición vigente para composición |
| `communications/graphic-system-v0.3.json` | Definición anterior | Retirada; consultar v0.4 |
| `brand/print/primary-blue-v0.1.json` | Candidato Pantone y receta CMYK | Propuesta provisional de impresión |
| `communications/templates/draft/v0.2/brief.md` | Brief de producción y revisión | Plantilla Markdown de trabajo |
| `communications/palette/` | Tokens DTCG, CSS y contrastes de la paleta auxiliar | Complementan los valores de marca |
| `communications/catalog.json` | Índice, estado y hash de recursos de comunicaciones | Consulta para personas y futura Web + MCP |

Las demás carpetas de fotografías, iconos, fuentes y plantillas finales se crearán cuando incorporen archivos. El catálogo de plantillas especificadas y pendientes está en el Manual de comunicaciones. El estado no se deduce solo de la carpeta: se consulta también el catálogo.

## Nomenclatura y estado

Logos derivados: `{marca}-{blue|white}.svg`, dentro de una carpeta con versión explícita. Originales web: `{marca}-web-{fecha}.svg`.

- `reference`: antecedente conservado, no necesariamente vigente como norma.
- `draft`: propuesta pendiente de aceptación final.
- `in-review`: versión remitida a revisión; todavía no aprobada.
- `illustration`: figura explicativa, incluidos ejemplos de usos incorrectos.
- `approved`: estado reservado para recursos revisados y aceptados; esta entrega no asigna esa aprobación.
- `retired`: recurso retirado de uso, conservado para trazabilidad.

La reproducción a una tinta utiliza siempre la variante `blue`, en el azul principal. `white` corresponde al negativo. No se suministran variantes negras.

Los recursos no se regeneran con IA ni se modifican sobre la marcha para adaptarlos a una pieza. Si falta una variante, se prepara como propuesta y se documenta su relación con el original.

## Archivos editables y compatibilidad

Los logotipos derivados son SVG con contornos, sin fuentes externas, imágenes incrustadas ni scripts. Su fondo es transparente. Los originales web pueden contener degradados o imágenes incrustadas: se preservan exactamente como se recuperaron.

Las figuras de los manuales son SVG autocontenidos. Los ocho fondos v0.4 son recursos reutilizables de composición con fondo sólido incorporado. Los fondos v0.2 y v0.3 se conservan como antecedentes y se retiran del uso nuevo. Las reglas se detallan en el apartado 3.4 del Manual de comunicaciones. Las láminas anteriores utilizan etiquetas de sistema. Las láminas v0.3 y v0.4 y la muestra de Rubik emplean contornos para mostrar la tipografía sin instalarla; conservan títulos y descripciones textuales en el SVG. Las figuras contienen logos insertados como vectores y no dependen de enlaces de imagen externos.

Los enlaces Markdown son relativos para que funcionen dentro del repositorio. Para descargar y leer el manual con todas sus imágenes, conservar la estructura de carpetas; un `.md` aislado no incluye sus recursos.

## Contribución y publicación

Conservar el original, añadir una variante con versión, registrar origen y transformación, revisar su aspecto y actualizar el catálogo. En caso de cambios, actualizar también el manual y los valores derivados que resulten afectados.

El manual de comunicaciones v0.4 conserva los tokens y variables de paleta v0.1 sin cambios de color. Las versiones se registran por recurso.

Los JSON y las variables CSS de esta versión preparan el contenido del futuro portal **Web + MCP**. Los catálogos son índices relacionados de un mismo sistema y utilizan un esquema propio del proyecto; DTCG se utiliza para los tokens. Esta estructura no representa un servidor MCP ya implementado.

Las marcas y los recursos corporativos se utilizan para el trabajo autorizado del grupo. Su presencia en el repositorio no les asigna una licencia abierta ni autoriza usos externos. Las fuentes o recursos de terceros deberán acompañarse de su licencia al incorporarse.

## Ampliación visual v0.3

- [23 láminas nuevas](communications/figures/v0.3/): mensaje, color, retículas, espaciado, referencias web, geometría, fondos, aplicaciones, imagen, iconos, documentos, comercial, campañas, email, infografía, datos, movimiento, interacción, entrega, acceso y reproducción impresa.
- [Ocho fondos transparentes](communications/backgrounds/draft/v0.3/): captura, muestreo, proceso y trazabilidad, en variantes para claro y azul.
- [Referencias web conservadas](communications/references/web-2026-10-05/), con estado `reference`; el [registro visual](../docs/communications/referencias-visuales-v0.3.md) explica su procedencia.
- [Propuesta de impresión del azul](brand/print/primary-blue-v0.1.json): PANTONE 534 C y CMYK 100/82/36/25, provisionales. No altera los tokens digitales.

Los SVG de las nuevas láminas son autocontenidos; los que incluyen imágenes de referencia llevan previsualizaciones incrustadas. Los fondos no incluyen fotografías, texto, logos, scripts ni enlaces externos.
