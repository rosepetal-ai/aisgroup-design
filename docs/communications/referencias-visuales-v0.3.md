# Referencias visuales y decisiones de comunicaciones v0.3

Consulta: **5 de octubre de 2026**. Se revisaron la estructura HTML/CSS y recursos gráficos publicados. Las imágenes conservadas son archivos de las webs, no capturas completas ni pruebas de funcionamiento. No se han utilizado métricas o clientes de las webs como evidencia comercial en los ejemplos.

| Marca y página | Recurso observado | Registro local | Decisión de diseño |
| --- | --- | --- | --- |
| [AIS Group](https://aisgroup.ai/) | `bg-grid`, cuadrícula CSS de 56 × 56 px; apertura azul y foto industrial | [hero-poster.webp](../../assets/communications/references/web-2026-10-05/aisgroup-hero.webp) | Mantener la lógica de retícula; nuevo módulo 64 px con área de lectura limpia |
| [AIS Vision Systems](https://aisvision.com/es/) | `bg-grid`, `cyan-dots`; esquinas de foco en tarjetas; ilustración de visión y hexágonos | [figure__vision-artificial.svg](../../assets/communications/references/web-2026-10-05/vision-figure.svg) | Conservar foco y precisión; sustituir hexágonos como patrón compartido |
| [AIS Vision Automation](https://www.aisautomation.ie/) | Vídeo industrial y fotografía de cámaras; soluciones por actividad | [vision-inspection-solutions-scaled.jpg](../../assets/communications/references/web-2026-10-05/automation-inspection.jpg) | Imagen real protagonista; rutas de proceso como interpretación nueva |
| [AIS Scanology](https://scanology.nl/en/) | Recursos de verificación y lectura; máscaras e ilustraciones geométricas históricas | [figure__verificacion2.svg](../../assets/communications/references/web-2026-10-05/scanology-verification.svg) | Bandas de trazabilidad como nueva abstracción; no códigos ficticios |
| [Rosepetal](https://rosepetal.ai/) | Imagen de segmentación y módulos del recorrido de software; paneles oscuros | [component_localization_and_segmentation.webp](../../assets/communications/references/web-2026-10-05/rosepetal-segmentation.webp) | Marcos de captura y conexión entre etapas; conservar anotaciones técnicas |

## URLs originales de los recursos

- https://aisgroup.ai/assets/backgrounds/hero-poster.webp
- https://aisvision.com/media/themes/aisvision-languages/assets/svg/figure__vision-artificial.svg
- https://www.aisautomation.ie/wp-content/uploads/2026/07/vision-inspection-solutions-scaled.jpg
- https://scanology.nl/wp-content/themes/aisvision-languages/assets/svg/figure__verificacion2.svg
- https://rosepetal.ai/images/component_localization_and_segmentation.webp

La lámina de referencias conserva el contenido visual de estos archivos. Para hacerla autocontenida se generaron previsualizaciones rasterizadas de los SVG y copias de tamaño reducido de las imágenes. No se recolorearon las anotaciones ni se añadieron resultados de detección.

## Qué es nuevo en la propuesta

«De la captura a la acción» es una dirección interna, no un eslogan aprobado. Sus cuatro familias —captura, muestreo, proceso y trazabilidad— son una interpretación de los trabajos y las señales visuales del grupo. La modularidad de 8 px, la malla de 64 px, las opacidades de 8/12 %, los ocho fondos y las reglas de combinación son decisiones propias de v0.3.

Se mantienen el azul principal, el estilo plano de logos y los nombres exactos. La excepción de campo tonal azul solo corresponde a grandes fondos de comunicación digital; los logos siguen planos. Los dos motivos v0.2 quedan como referencias históricas y se utilizan las variantes v0.3 para nuevas piezas.

## Propuesta de impresión

Se selecciona **PANTONE 534 C** como candidato a comprobar en muestrario. La receta **CMYK 100/82/36/25** es una propuesta de trabajo, no una reproducción oficial certificada ni una conversión ICC del HEX #17356E. Se registran por separado la selección de tinta, la receta de proceso y el color digital. Perfil, papel y prueba siguen pendientes.

- [Pantone 534 C, ficha oficial](https://www.pantone.com/color-finder/534-c): identifica el número y biblioteca del candidato.
- [Pantone Color Bridge, descripción oficial](https://www.pantone.com/products/graphics/color-bridge-guide-set-coated-uncoated): explica la comparación entre tinta directa y simulación CMYK sobre papeles estucados/no estucados.

La consulta pública no se utiliza para atribuir a Pantone la receta CMYK del proyecto. La pantalla no sustituye el muestrario.

## Estado y procedencia

Los recursos web tienen estado `reference`; las láminas del manual, `illustration`; los fondos y la propuesta de impresión, `draft`. El catálogo registra hashes y URLs. La disponibilidad pública de un archivo no le asigna una licencia abierta ni acredita derechos para una campaña: antes de utilizarlo como material final, comprobar su autorización dentro del grupo.
