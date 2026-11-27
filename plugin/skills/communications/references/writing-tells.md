# Tells and plain rewrites

The text check (`engine/text-check.mjs`) holds these lists. **Error**: the export fails. **Warn**: rewrite it, or keep it on purpose and say why.

## Spanish

| Tell | Check | Write instead |
| --- | --- | --- |
| *En el mundo actual*, *En la era de la IA*, *Hoy más que nunca* | error | Empieza por el hecho: *AIS KARIKÓ inspecciona las bandejas por ambas caras.* |
| *desbloquea*, *eleva tu producción*, *revoluciona*, *de primer nivel*, *al siguiente nivel*, *sumérgete* | error | Un verbo llano: *reduce*, *detecta*, *comprueba*, *lee* |
| *haz clic*, *más información sobre*, *descubre cómo*, *saber más* | error | Nada; la llamada a la acción aprobada nombra el destino |
| *En resumen*, *En definitiva*, *En conclusión* al empezar una frase | error | Termina cuando esté dicho |
| *Inspecciona. Rechaza. Registra.* | error | Una frase: *Rechaza las botellas sin tapón y registra cada rechazo.* |
| *innovador*, *potente*, *mucho más que* | warn | El dato que lo demuestra, o nada |
| *no solo… sino también* | warn | Dos hechos: *Comprueba el tapón. También lee el lote.* |
| *rápido, fiable y preciso* | warn | El que se puede comprobar, con su cifra |
| Pregunta retórica en el cuerpo | warn | La respuesta |
| La raya — como coletilla | warn | Coma, dos puntos o punto; la raya solo para un inciso que lo necesite |
| *desliza*, *a continuación te mostramos* | warn | Nada |

## English

| Tell | Check | Write instead |
| --- | --- | --- |
| *In today's fast-paced world*, *In the age of AI* | error | Start with the fact |
| *unlock*, *elevate*, *seamless*, *cutting-edge*, *revolutionise*, *game-changer*, *world-class*, *leverage*, *empower*, *delve*, *reimagine* | error | A plain verb: *cut*, *find*, *check*, *read* |
| *click*, *learn more about*, *discover how*, *find out more*, *read more* | error | Nothing; the approved call to action names the destination |
| *In short*, *In conclusion*, *To sum up*, *At the end of the day* | error | Stop when the point is made |
| *Let's dive in*, *Look no further*, *Whether you're…*, *It's not just…* | error | Say the thing |
| *innovative*, *powerful*, *comprehensive*, *streamline*, *more than just* | warn | The fact that proves it |
| *not only… but also* | warn | Two plain facts |
| *fast, reliable and precise* | warn | The one the reader can check |
| Rhetorical question in body copy; em dash habit; *swipe*, *see below* | warn | The answer; a comma or full stop; nothing |

## Catalan, Portuguese, French

The check runs the same list in each language (the piece's `lang`, or `--lang`):

- **Catalan:** *En el món actual*, *desbloqueja*, *revoluciona*, *al següent nivell*, *fes clic*, *més informació sobre*, *descobreix com*, *En resum* (errors); *no només… sinó també*, *innovador*, *potent*, *llisca* (warn). Typographic apostrophe and punt volat (*l·l*).
- **Portuguese:** *no mundo atual*, *desbloqueie*, *de ponta*, *ao próximo nível*, *clique aqui*, *saiba mais*, *descubra como*, *em resumo* (errors); *não só… mas também*, *inovador*, *poderoso* (warn). European Portuguese for Portugal.
- **French:** *dans le monde d'aujourd'hui*, *débloquez*, *révolutionnez*, *de pointe*, *cliquez*, *en savoir plus*, *découvrez comment*, *en résumé* (errors); *non seulement… mais aussi*, *innovant*, *puissant* (warn). Non-breaking space before *: ; ? !* and inside « ».

## What the check cannot see

It catches words, not thinking. It cannot tell a vague sentence from a specific one, a figure without a source, a paragraph that repeats the one before or a piece with two purposes. Step 6 (read it aloud) and `brand-review` catch those.
