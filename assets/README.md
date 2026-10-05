# Recursos de AISGroup Design

Esta carpeta reúne los recursos reutilizables y las imágenes explicativas del sistema de diseño. El [Manual de marca v0.1](../docs/brand/manual-de-marca.md) define la identidad y el azul principal; el [Manual de comunicaciones](../docs/communications/manual-de-comunicaciones.md) recoge la paleta auxiliar y sus aplicaciones.

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
| `communications/palette/` | Tokens DTCG, CSS y contrastes de la paleta auxiliar | Complementan los valores de marca |
| `communications/catalog.json` | Índice, estado y hash de recursos de comunicaciones | Consulta para personas y futura Web + MCP |

Las carpetas de fotografías, iconos, plantillas, fuentes o recursos aprobados se crearán cuando tengan contenido revisado. El estado no se deduce solo de la carpeta: se consulta también el catálogo.

## Nomenclatura y estado

Logos derivados: `{marca}-{blue|white}.svg`, dentro de una carpeta con versión explícita. Originales web: `{marca}-web-{fecha}.svg`.

- `reference`: antecedente conservado, no necesariamente vigente como norma.
- `draft`: propuesta pendiente de aceptación final.
- `illustration`: figura explicativa, incluidos ejemplos de usos incorrectos.
- `approved`: estado reservado para recursos revisados y aceptados; esta entrega no asigna esa aprobación.

La reproducción a una tinta utiliza siempre la variante `blue`, en el azul principal. `white` corresponde al negativo. No se suministran variantes negras.

Los recursos no se regeneran con IA ni se modifican sobre la marcha para adaptarlos a una pieza. Si falta una variante, se prepara como propuesta y se documenta su relación con el original.

## Archivos editables y compatibilidad

Los logotipos derivados son SVG con contornos, sin fuentes externas, imágenes incrustadas ni scripts. Su fondo es transparente. Los originales web pueden contener degradados o imágenes incrustadas: se preservan exactamente como se recuperaron.

Las figuras del manual son SVG autocontenidos. Sus etiquetas utilizan una tipografía de sistema; la muestra de Rubik está convertida a contornos para mostrar la fuente correcta sin instalarla. Las figuras contienen logos insertados como vectores y no dependen de enlaces de imagen externos.

Los enlaces Markdown son relativos para que funcionen dentro del repositorio. Para descargar y leer el manual con todas sus imágenes, conservar la estructura de carpetas; un `.md` aislado no incluye sus recursos.

## Contribución y publicación

Conservar el original, añadir una variante con versión, registrar origen y transformación, revisar su aspecto y actualizar el catálogo. En caso de cambios, actualizar también el manual y los valores derivados que resulten afectados.

Los JSON y las variables CSS de esta versión preparan el contenido del futuro portal **Web + MCP**. Los catálogos son índices relacionados de un mismo sistema y utilizan un esquema propio del proyecto; DTCG se utiliza para los tokens. Esta estructura no representa un servidor MCP ya implementado.

Las marcas y los recursos corporativos se utilizan para el trabajo autorizado del grupo. Su presencia en el repositorio no les asigna una licencia abierta ni autoriza usos externos. Las fuentes o recursos de terceros deberán acompañarse de su licencia al incorporarse.
