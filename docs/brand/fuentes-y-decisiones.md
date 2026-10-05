# Fuentes y decisiones del manual de marca v0.1

Fecha de consulta: **5 de octubre de 2026**. Este registro separa los antecedentes observados de las decisiones propuestas. La versión del manual es un borrador de trabajo, no una aprobación retrospectiva de todos los recursos existentes.

## 1. Documentación aportada

| ID | Documento | Evidencia utilizada | Tratamiento en v0.1 |
| --- | --- | --- | --- |
| D01 | AIS GROUP - guidelines.pdf | P. 1: origen Rajdhani; p. 2: proporciones; p. 3: variantes y compañías; p. 4: paleta; p. 5: usos y respaldo; p. 6: Rubik y elementos | Continuidad de formas y Rubik; revisión expresa del color, los degradados y el respaldo |
| D02 | Rosepetal - Manual de marca | Secciones Logo, Marca gráfica, Colores, Colores alternativos, Comunicaciones y Materiales gráficos | Se conserva el signo; se toma el azul `#17356E` y el tinte `#D2DFF0` como antecedentes; Roboto y Bebas Neue quedan documentadas |
| D03 | AIS Group - Rebranding marca AIS | Motivación, problemas de aplicación, revisión de webs de junio de 2026 y propuesta | Se prioriza homogeneización cromática, diseño plano, ajuste mínimo y separación entre marca y comunicación |

Los documentos originales permanecen en su ubicación de origen. Esta entrega contiene el manual derivado y recursos preparados para su revisión, sin modificar los originales ni duplicar sus archivos completos en el repositorio.

### Divergencias relevantes

- D01 atribuye colores distintos a cada compañía; la instrucción actual del proyecto pide un azul común. La v0.1 sigue esta última dirección.
- D01 asocia a Rosepetal el rosa `#E3536C`; D02 documenta magenta `#CD294F` y azul `#17356E`, además de negro y blanco. Ningún rosa se eleva a color común.
- D01 p. 4 escribe `#1C2B4E` junto a RGB `25, 43, 78`. Ese HEX equivale a `28, 43, 78`; no se consideran referencias numéricamente idénticas. Tampoco se presume una conversión exacta desde su muestra Pantone.
- D02 menciona una tipografía de logo basada en Antenna; D01, una construcción a partir de Rajdhani. Son antecedentes gráficos, no instrucciones para reconstruir los logos como texto.
- D03 plantea revisar la «I» de AIS, la «o» y los pesos de Rosepetal. Esta versión conserva sus formas y deja ese ajuste para una revisión específica.
- Las capturas de D03 corresponden a junio de 2026. La auditoría web siguiente describe lo consultado en octubre; ambas referencias tienen fechas distintas.

## 2. Aplicaciones web observadas

La revisión se basa en las páginas principales, recursos de marca y hojas de estilo accesibles. Los colores siguientes son ejemplos de declaraciones CSS encontradas; no una auditoría exhaustiva de todas las páginas, componentes o estados.

| Web | Evidencia visual declarada | Implicación |
| --- | --- | --- |
| [AIS Group](https://aisgroup.ai/) | `--color-navy: #0A1228`; acento `#2EB5E8`; familia Inter | Confirma una aplicación oscura con un cian distinto del documento histórico |
| [AIS Vision Automation](https://www.aisautomation.ie/) | `--ais-navy: #1C2B4F`; `--ais-cyan: #00A1DE`; `--ais-amber: #FFB800` | Mantiene una paleta propia con amarillo que requiere transición |
| [AIS Vision Systems](https://aisvision.com/) | `--color-navy: #192853`; familia Rubik | Aporta continuidad tipográfica con D01 y otro azul de aplicación |
| [Rosepetal](https://rosepetal.ai/) | Uso reiterado de `#1A2C5B`, junto a otros azules y acentos; pila de sistema con Roboto | La web no utiliza de forma exclusiva el azul documentado en D02 |
| [AIS Scanology](https://scanology.nl/) | Repetición de `#0664A1` y `#6397C6` en la hoja principal | Confirma la diversidad de tonos del grupo |

No se incorporan cifras de clientes, resultados, certificaciones o estadísticas de estas páginas a los mensajes corporativos del manual. Requieren verificación editorial separada.

## 3. Procedencia de los logotipos

Los cinco SVG utilizados como base se publican en la web de AIS Group. Son referencias observadas, no archivos recibidos como originales maestros definitivos.

| Marca | Recurso web | Original conservado |
| --- | --- | --- |
| AIS Group | [SVG](https://aisgroup.ai/assets/logo/ais-group-light.svg) | `assets/brand/logos/source/ais-group-web-2026-10-05.svg` |
| AIS Vision Systems | [SVG](https://aisgroup.ai/assets/logo/companies/ais-vision-systems-light.svg) | `assets/brand/logos/source/ais-vision-systems-web-2026-10-05.svg` |
| AIS Vision Automation | [SVG](https://aisgroup.ai/assets/logo/companies/ais-vision-automation-light.svg) | `assets/brand/logos/source/ais-vision-automation-web-2026-10-05.svg` |
| AIS Scanology | [SVG](https://aisgroup.ai/assets/logo/companies/ais-scanology-light.svg) | `assets/brand/logos/source/ais-scanology-web-2026-10-05.svg` |
| Rosepetal | [SVG](https://aisgroup.ai/assets/logo/companies/rosepetal-light.svg) | `assets/brand/logos/source/rosepetal-web-2026-10-05.svg` |

Los originales se conservan sin modificar. El catálogo registra su SHA-256, URL y fecha. Las variantes derivadas cambian la tinta y simplifican la estructura técnica del SVG, conservando la geometría visible. No se utilizan fuentes sustitutivas para sus letras.

En AIS Vision Automation, el SVG contiene degradados rasterizados bajo máscaras vectoriales. La variante plana se obtiene de esas máscaras y de los contornos de sus glifos; queda completamente vectorial.

## 4. Decisiones propuestas

| ID | Decisión v0.1 | Base | Estado |
| --- | --- | --- | --- |
| B01 | Azul común `#17356E` | Dirección del proyecto y antecedente D02 | Propuesta |
| B02 | Logotipos planos azul, blanco y negro | Diagnóstico D03 y variantes existentes | Propuesta |
| B03 | Rubik como familia corporativa | D01 y aplicación vigente de AIS Vision Systems | Propuesta |
| B04 | Conservar detalles de letras y proporciones | Objetivo de modificación mínima de D03 | Criterio de esta entrega |
| B05 | Separar respaldo de grupo y descriptor | Legibilidad y problemas señalados en D03 | Propuesta; cambia el criterio anterior |
| B06 | Área libre de H/4 y tamaños mínimos iniciales | Regla operativa nueva | Provisional; validar en soportes |
| B07 | Conservar cian y azul claro como apoyo | `#00A0DE` de D01 y `#D2DFF0` de D02 | Propuesta |
| B08 | Posponer nuevas tramas y variantes compactas | Separación de subproyectos | Pendiente de desarrollo |

## 5. Referencias técnicas

- [DTCG Format Module 2025.10](https://www.designtokens.org/tr/2025.10/format/). Los tokens de color utilizan `$type`, `$value`, `colorSpace` y componentes sRGB normalizados.
- [WCAG 2.2, contraste mínimo](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html). Los ratios del manual se calculan para colores opacos, sin mezclas ni transparencias.
- [Rubik en Google Fonts](https://fonts.google.com/specimen/Rubik). La muestra tipográfica del manual utiliza Rubik en pesos 400, 500 y 600 convertida a contornos en la ilustración. Los binarios de la fuente no se redistribuyen en esta entrega.
