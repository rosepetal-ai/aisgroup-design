# Referencias visuales y decisiones de comunicaciones v0.4

Consulta: **5 de octubre de 2026**. Dirección actual: **Del plano al volumen**. Este registro sustituye las decisiones de fondos de [v0.3](referencias-visuales-v0.3.md), que se conserva como antecedente de la auditoría web.

## Punto de partida

La instrucción del proyecto recupera la trama de hexágonos que utilizaba AIS Vision Systems y pide desarrollar el juego con hexágono, relieve y 3D. La dirección anterior de marcos, muestreo, rutas y bandas no se mantiene como sistema de fondos. Los nombres **AIS Vision Systems**, **AIS Scanology** y **Rosepetal** conservan su escritura exacta.

El hexágono se convierte en una unidad de construcción que puede repetirse o adquirir altura. La retícula editorial de columnas sigue organizando los textos; la geometría hexagonal organiza la ilustración. No se crea un logo nuevo ni se presenta el 3D como una capacidad técnica de todas las soluciones.

## Referencias externas consultadas

| Proyecto y autor | Evidencia de la fuente | Aplicación propuesta | Diferencia respecto a la referencia |
| --- | --- | --- | --- |
| [Spaces — Fold7 Design](https://fold7design.com/work/spaces) | El estudio desarrolla el hexágono existente mediante una forma cúbica expresiva y una forma de esquina para distintas aplicaciones | Evolucionar una forma heredada hacia un sistema completo, con distintas escalas | No se adoptan sus ilustraciones, tipografías, colores ni composiciones concretas |
| [Journey — Holmes Studio](https://www.holmes-studio.com/projects/journey) | La identidad parte de un hexágono aparente que vive en 3D como un cubo en rotación | Relacionar plano, volumen y movimiento mediante una misma geometría | AIS utiliza un prisma de cara hexagonal; no se copia el símbolo de Journey ni se confunde cubo con prisma hexagonal |
| [Kempner Institute — Opus Design, manual visual](https://kempnerinstitute.harvard.edu/app/uploads/2024/08/Kempner-Institute-Brand-Book-visual-identity.final_.pdf#page=12) | La sección de patrones distingue una textura micro y una trama mega, con aplicación contenida | Separar textura y protagonismo; limitar la repetición y mantener áreas de descanso | La geometría, las escalas, las opacidades y las zonas del sistema AIS son decisiones nuevas |
| [Hexagon Structure — Nina Weisslechner ART*WORKS, para Zentiva](https://artjustworks.com/hexagon-structure) | El proyecto combina patrones sobre vidrio con objetos acústicos 3D en espacios corporativos | Desarrollar la continuidad entre superficie plana y relieve; considerar materialidad | Se utiliza como referencia formal, no como especificación de materiales ni como recurso web listo para usar |
| [CENTIDE — Microbio](https://www.microbio.tv/proyectos/branding-centide/) | Símbolo construido sobre retícula isométrica y hexagonal; iconografía modular y señalética | Extender una lógica geométrica coherente a recursos explicativos | No se incorpora su logo ni su familia de iconos; los iconos funcionales de AIS siguen su propia especificación |

Las referencias aportan criterios de diseño. Los SVG de esta entrega se construyen desde geometría original; no incorporan imágenes, vídeos ni archivos vectoriales de estos proyectos. Los ejemplos reutilizan únicamente los logotipos que ya están en el catálogo del grupo.

## Decisiones propias del sistema

1. **Forma común:** hexágono regular con vértice superior y cara hexagonal conservada al adquirir altura.
2. **Tres expresiones:** trama periférica, campo de bajo relieve y conjunto de prismas protagonistas.
3. **Material y luz:** mate o satinado suave; una luz amplia desde arriba a la izquierda. La profundidad proviene de caras y valores tonales consistentes.
4. **Color:** azul #17356E y blanco como soportes; tonos derivados para luces y sombras de la ilustración, sin convertirlos en nuevos colores de marca.
5. **Composición:** contenido a la izquierda en horizontal y arriba en vertical. No se requiere una textura detrás de cada bloque.
6. **Formato:** seis SVG horizontales de 1600 × 900 y dos SVG verticales de 900 × 1200, con fondo sólido incorporado.
7. **Movimiento:** propuesta de una entrada de 900 ms del plano al volumen. Se entrega un storyboard y una alternativa estática; no se afirma que exista una animación implementada.
8. **Identidad:** los logotipos siguen siendo planos. La escritura de marcas y la propuesta de impresión PANTONE 534 C / CMYK 100–82–36–25 se conservan.

Las fórmulas, tamaños, alturas y zonas de contenido se registran en [graphic-system-v0.4.json](../../assets/communications/graphic-system-v0.4.json). El [apartado 3.4](manual-de-comunicaciones.md#34-elementos-tramas-y-fondos) contiene la aplicación editorial completa.

## Entrega y estado

- **Ocho fondos:** `draft`, listos para revisión de diseño y uso en maquetas.
- **Nueve láminas:** `illustration`, con construcción, atlas, cabecera, móvil, presentación, documento, reglas, storyboard y vista general.
- **Galería de revisión:** HTML local con recursos relativos; no es una web desplegada.
- **Fondos v0.3 y definición anterior:** `retired`, conservados para trazabilidad.
- **Pantone y CMYK:** propuesta provisional, pendiente de muestrario y prueba; no se ha modificado el azul digital.

Se revisan la integridad de SVG y JSON, los enlaces relativos, los identificadores del catálogo, los hashes y el renderizado de las láminas. Las capturas de revisión son derivados de estos SVG, no imágenes nuevas generadas para representar productos o resultados.
