# Guion de defensa — EP2 (v2)

> Documento interno del equipo. **No se entrega.**
> Cubre las tareas 32, 33 y 34. Es la evidencia de preparación para **IE3** (estrategia de comunicación, 22%) y para **IE11** (recursos integrados, 14%).

**Formato de la defensa:** 10 minutos. Primero se presenta el **informe narrativo** (`docs/informe_narrativo.html`, se recorre con scroll) y después una **demo en vivo del dashboard** (`dashboard/streamview_dashboard.html`).

> **¿Van a presentar con las láminas (`presentacion.pdf`)?** El guion lámina por lámina está en el **punto 8**, al final.

**Regla que manda sobre todo lo demás:** la pantalla apoya y la voz explica. En pantalla van las cifras. La voz dice qué significan y qué hacer con ellas. Si lo que se dice es lo que ya está escrito en pantalla, se pierde IE11 aunque el contenido sea correcto.

**A quién le hablamos:** al *dueño del problema*, no a un técnico. Por eso en voz alta no se dice "correlación", "Z-score", "mediana ponderada" ni "ROI" sin traducirlo en la misma frase. El ROI se dice así: *"cuánto recauda por cada dólar que costó"*.

---

## 0 · Antes de entrar (2 minutos de preparación)

1. **Pestaña 1:** `docs/informe_narrativo.html` en Chrome, en pantalla completa (F11) y con zoom al 100–110 %, arriba del todo.
2. **Pestaña 2:** `dashboard/streamview_dashboard.html` en la página **1 · contexto**, sin filtros. La tecla **F** lo pone en pantalla completa.
3. **Plan B, abierto y minimizado:** `docs/presentacion.pdf`. Si el proyector no muestra bien el HTML, se presenta con las láminas y el guion está en las notas del orador de `docs/presentacion.pptx`, con reparto de Claudio en las láminas 1–5 y Matías en las 6–10.
4. Los dos tienen a mano la **tarjeta de cifras** (al final de este documento). Nadie improvisa un número.

---

## 1 · Por qué este formato (lo que se responde si preguntan por la estrategia · IE3)

> "Elegimos contar primero y demostrar después. El informe narrativo fija una sola lectura, en orden: pregunta, evidencia, giro y decisión. Es lo que el Gerente necesita para defender una decisión ante su jefatura. El dashboard viene después, porque es la herramienta con la que esa decisión se ejecuta y se comprueba cada semana. Si abriéramos con el dashboard, la audiencia estaría mirando botones en vez de escuchando el argumento."

Por qué funciona: la audiencia primero necesita **un solo mensaje** y después **la prueba de que se sostiene**. Mostrar una herramienta interactiva antes de dar el mensaje reparte la atención y sube la carga cognitiva (Sweller, 1988).

---

## 2 · Reparto y tiempos

Las voces se alternan cada 60–90 segundos: el cambio de voz renueva la atención y demuestra que los dos dominan todo el trabajo. El orden es Matías, Claudio, Matías, Claudio, Matías, Claudio y cierra Matías.

| # | Bloque | Pantalla | Habla | Tiempo | Acumulado |
|---|---|---|---|---|---|
| A | Apertura y capítulo 1: la pregunta | Portada → KPIs → "no coinciden" | **Matías** | 1:45 | 1:45 |
| B | Capítulo 2: lo que revisamos primero | Descartes → "1 voto" | **Claudio** | 1:00 | 2:45 |
| C | Capítulo 3: el desajuste | "1 de cada 3" → gráfico de brecha → EE.UU. y Japón | **Matías** | 1:30 | 4:15 |
| D | Capítulo 4: el giro, dónde está la plata | Presupuesto → íconos 53/21 → frase | **Claudio** | 1:30 | 5:45 |
| E | Capítulo 5: tres decisiones y límite | Recomendaciones → "lo que no sabemos" | **Matías** | 1:30 | 7:15 |
| F | Demo del dashboard | Dashboard p1 → Japón → p3 | **Claudio** | 2:15 | 9:30 |
| G | Cierre | Vuelve al informe, pantalla negra final | **Matías** | 0:30 | 10:00 |

**Si se pasan de 10 minutos, se corta, no se habla más rápido.** Orden de corte:

1. Los KPIs del bloque A: se nombran en una frase y se sigue de largo.
2. El tramo EE.UU./Japón del bloque C: la recomendación 2 lo cita igual.
3. En la demo, el paso 1 (vista general): se entra directo al filtro.

**Nunca se cortan** el capítulo 2 (auditoría), los íconos 53/21 del capítulo 4, las tres recomendaciones ni el límite honesto.

---

## 3 · Los diálogos, palabra por palabra

Lo que va entre comillas se dice. Lo que va en *cursiva* es una indicación: qué se hace en pantalla o cómo se dice.

### A · Apertura y capítulo 1 — *Matías* — 0:00 → 1:45

*Pantalla: la portada. Esperar dos segundos en silencio antes de hablar.*

> "Buenas. Somos Matías Retamal y Claudio González.
>
> Les hago una pregunta: si ustedes manejaran un catálogo de treinta y dos mil títulos, ¿no esperarían que lo que más producen fuera lo que su audiencia mejor recibe?
>
> Nosotros también lo esperábamos. No es así. Y lo que les vamos a mostrar es cuánto cuesta esa diferencia y qué hacer con ella en los próximos doce meses."

*Bajar a los KPIs.*

> "Le hablamos a una persona concreta: el Gerente de Contenidos. Cada pocas semanas decide qué comprar, qué producir y qué promocionar. Tiene criterio de negocio pero no es técnico, y hoy decide sin poder ver el catálogo completo de una vez.
>
> El catálogo es este: casi treinta y dos mil títulos, mitad películas y mitad series. Una película típica recauda uno coma siete veces lo que costó, y casi la mitad del catálogo es drama."

*Bajar hasta la frase "no coinciden".*

> "Así que la pregunta de este trabajo es una sola: ¿lo que más producimos es lo que la audiencia mejor recibe? La respuesta corta está en pantalla: no. Pero antes de mostrar por qué, Claudio les va a contar qué tuvimos que descartar, porque eso cambió todo lo que vino después."

*Técnicas usadas: pregunta retórica (activa a la audiencia), la respuesta primero (Minto) y brecha de curiosidad (Loewenstein): se anuncia "cuánto cuesta" sin decirlo todavía.*

### B · Capítulo 2 — *Claudio* — 1:45 → 2:45

*Pantalla: capítulo 2, tarjetas de descartes.*

> "Antes de hacer un solo gráfico, revisamos los datos. El encargo pedía cuatro análisis que estos datos no permiten hacer bien.
>
> La duración viene vacía en todas las películas. La clasificación por edad es, en realidad, una copia de la nota. Hay exactamente mil títulos por año, así que cualquier tendencia en el tiempo sería un efecto del muestreo. Y los datos de usuarios nunca llegaron.
>
> Podríamos haber hecho esos gráficos igual. Se habrían visto bien y habrían estado mal."

*Bajar a la cifra naranja del voto.*

> "Un ejemplo de por qué importa: el título mejor evaluado del catálogo, si se mira la nota sin ajustar, tiene un solo voto. Por eso toda nota de este informe está ponderada por la cantidad de votos. Un diez con un voto no le gana a un ocho coma cuatro con doce mil.
>
> Preferimos responder menos preguntas, pero que cada respuesta se sostenga."

*Técnica: mensaje de dos caras. Admitir los límites al principio sube la credibilidad de todo lo que viene después (Hovland, Lumsdaine y Sheffield, 1949; efecto pratfall de Aronson, 1966). El "un solo voto" es lo inesperado que se recuerda (Heath y Heath, 2007).*

### C · Capítulo 3 — *Matías* — 2:45 → 4:15

*Pantalla: la cifra roja "1 de cada 3".*

> "Primer hallazgo. Una de cada tres películas del catálogo es de terror o suspenso. Y son justamente los dos géneros peor evaluados por la audiencia."

*Bajar a las barras rojo contra verde.*

> "Del otro lado, documental, musical e histórico: un tercio del volumen y casi ocho décimas más de nota. En una escala donde casi todo cae entre seis y siete, ocho décimas es mucho."

*Bajar al gráfico de brecha. Señalar con la mano, no con el mouse: primero abajo a la derecha y después arriba a la izquierda.*

> "Este gráfico lo resume. Cada punto es un género. A la derecha, lo que más se produce; arriba, lo mejor evaluado. Aquí abajo, mucho catálogo y baja recepción. Aquí arriba, poco catálogo y buena recepción: es la oportunidad que hoy nadie está mirando."

*Bajar a EE.UU. contra Japón.*

> "Y el mismo desajuste aparece por país. Estados Unidos aporta más de cuatro veces los títulos de Japón, pero Japón y Corea reciben mejor nota. Ojo: no decimos que el contenido asiático sea mejor. Decimos que, dentro de este catálogo, está subrepresentado respecto de cómo se recibe."

> "Con esto, la recomendación parecía obvia: producir menos terror. Casi la hacemos. Claudio."

*Técnicas: contraste (rojo contra verde, mucho contra poco), señalización visual (Mayer) y un gancho de cierre que abre el giro.*

### D · Capítulo 4, el giro — *Claudio* — 4:15 → 5:45

*Pantalla: barras de presupuesto.*

> "Habría sido un error. Antes de recomendar, cruzamos la nota con la plata: cuánto costó cada película y cuánto recaudó.
>
> Terror es el género más barato de producir: siete millones de dólares la película típica, contra cincuenta de animación. Y aun así recauda dos veces lo que costó, más que el catálogo en general. El terror no es un descuido. Es una apuesta de costo, y la nota baja es el precio conocido de esa apuesta."

*Bajar a los íconos. Hacer una pausa y dejar que los puntos se llenen.*

> "Entonces la pregunta útil no es qué género tiene mala nota. Es qué pasa con la plata según la nota.
>
> De cada cien películas mal evaluadas, cincuenta y tres no recuperan lo que costaron. Más de la mitad pierde plata. De cada cien bien evaluadas, solo veintiuna."

*Bajar a la frase grande. Decirla lento.*

> "La nota predice la plata. El presupuesto, no. Gastar más no garantiza nada. Lo que se paga es producir lo que la audiencia valora.
>
> Y por eso tampoco recomendamos lo mejor evaluado: histórico y bélico tienen muy buena nota y los peores retornos. Eso es prestigio, no negocio. Lo que sí gana dos veces está arriba a la derecha: animación, familiar, aventura y musical."

*Técnicas: el giro narrativo (la historia cambia de dirección y la atención se recupera), frecuencias naturales ("53 de cada 100" se entiende sin estadística; Gigerenzer y Hoffrage, 1995) con arreglo de íconos (Galesic, Garcia-Retamero y Gigerenzer, 2009), aversión a la pérdida ("pierde plata" pesa más que "gana menos"; Kahneman y Tversky, 1979) y una frase ancla corta y repetible.*

### E · Capítulo 5 — *Matías* — 5:45 → 7:15

*Pantalla: recomendación 1.*

> "Tres decisiones, cada una con una meta que en doce meses se puede comprobar si se cumplió.
>
> **Uno.** Mover la adquisición hacia los cuatro géneros que ganan dos veces, en nota y en plata. Hoy son el veintidós por ciento de las películas; la meta es treinta. Y no es dejar de producir terror: es decidir hacia dónde crece el catálogo."

*Bajar a la 2.*

> "**Dos.** Abrir una línea de compra dedicada a Japón y Corea del Sur, que encabezan la recepción. Hoy son menos del doce por ciento; la meta es dieciocho."

*Bajar a la 3.*

> "**Tres.** Que el presupuesto siga a la recepción esperada, y no al revés. Ningún proyecto de los más caros sin evidencia de que se va a recibir bien. Hoy treinta y siete de cada cien películas no recuperan lo que costaron; la meta es bajar a treinta."

*Bajar a la nota "Lo que todavía no sabemos".*

> "Y un límite, dicho con honestidad: sabemos qué títulos se reciben bien, no cuántas personas los vieron. Con datos de reproducción, la siguiente pregunta sería si la buena recepción se traduce en suscriptores que se quedan.
>
> Estas decisiones no se toman una vez. Se revisan cada semana, y para eso construimos la herramienta. Claudio."

*Técnicas: la regla de tres (tres decisiones se recuerdan; cinco no), metas con cifra actual y cifra objetivo (el número actual actúa como ancla) y un límite dicho como decisión, no como disculpa.*

### F · Demo del dashboard — *Claudio* — 7:15 → 9:30

*Cambiar a la pestaña 2 y presionar F para pantalla completa. La navegación va en el mismo orden que el informe: 1 · contexto, 2 · hallazgo, 3 · decisión.*

**Movimiento 1 · la vista general (0:30).**

> "Este es el dashboard que usaría el Gerente cada semana. Arriba, los cuatro números del catálogo. Abajo, cómo se reparte por género, país e idioma. Tiene tres páginas, en el mismo orden de la historia que acabamos de contar: contexto, hallazgo y decisión."

**Movimiento 2 · la prueba en vivo (0:50).** *Filtro País → Japón. Esperar a que cambien las tarjetas y señalar las flechas verdes.*

> "Supongamos que llega una propuesta: comprar un paquete de películas japonesas. ¿Encaja? Filtro por Japón.
>
> La nota sube a siete coma dos, medio punto sobre el catálogo. Y el retorno sube a dos coma setenta y siete: más de un punto por encima. En diez segundos, la recomendación dos dejó de ser una opinión nuestra. Es algo que el Gerente puede comprobar él mismo."

*Limpiar el filtro de país.*

**Movimiento 3 · la decisión (0:55).** *Ir a 3 · decisión. Filtro Tipo → Películas.*

> "Y aquí se pasa del diagnóstico a la acción. Este es el mismo gráfico del informe, pero vivo: cambia con cada filtro. Arriba a la izquierda están los géneros en oportunidad desatendida; abajo a la derecha, los sobreinvertidos. Los títulos de cada gráfico no describen: dan la conclusión, y se reescriben solos con cada selección."

*Bajar a la tabla.*

> "Y esta es la lista corta: los títulos mejor evaluados de los géneros en oportunidad. Es, literalmente, una lista de compras. El dashboard no reemplaza el criterio del Gerente; le dice dónde mirar primero."

*Técnica: ver para creer. Una demostración en vivo con un caso concreto convence más que una afirmación (Duarte, 2010, sobre "mostrar, no contar"). El filtro de Japón confirma en pantalla lo que se dijo dos minutos antes.*

**Si el dashboard falla o se congela:** no se intenta arreglar en vivo. Claudio dice: *"Les muestro la captura de la misma vista"* y vuelve al informe, al gráfico de brecha del capítulo 3. La demo se reduce a narrar qué haría el filtro de Japón, con sus cifras (7,21, +0,50; 2,77×, +1,07×).

### G · Cierre — *Matías* — 9:30 → 10:00

*Volver a la pestaña 1, al cierre oscuro ("La nota predice la plata").*

> "Si se quedan con una sola idea, que sea esta: la nota predice la plata; el presupuesto, no.
>
> Hoy el catálogo produce más de lo que menos se valora. Con tres decisiones medibles y una herramienta para revisarlas cada semana, eso se puede corregir en doce meses. Gracias."

*Técnica: regla pico-final (Kahneman et al., 1993). La gente recuerda una experiencia por su momento más intenso y por su final, así que se termina en la frase ancla y en la acción, no en "eso sería todo".*

---

## 4 · Técnicas de persuasión aplicadas y su fundamento (evidencia para IE3)

Todas las técnicas apuntan a lo mismo: que alguien que no es técnico entienda, recuerde y actúe.

| Técnica | Dónde se usa | Por qué funciona | Referencia |
|---|---|---|---|
| Respuesta primero (pirámide) | Portada del informe: "El catálogo produce lo que menos se valora"; frase "no coinciden" | Un ejecutivo necesita la conclusión antes que el método; lo demás se lee como respaldo | Minto, *The Pyramid Principle* (1987) |
| SCQA: situación, complicación, pregunta, respuesta | Capítulo 1 | Estructura con la que un problema de negocio se entiende en treinta segundos | Minto (1987) |
| Brecha de curiosidad | Apertura ("cuánto cuesta esa diferencia") y el cierre de C ("casi la hacemos") | Una pregunta abierta mantiene la atención hasta que se cierra | Loewenstein (1994) |
| Mensaje de dos caras | Capítulo 2 (descartes) y el límite del capítulo 5 | Reconocer lo que no se sabe hace más creíble lo que sí se afirma | Hovland et al. (1949); Aronson (1966) |
| Lo inesperado | "El mejor evaluado tiene un voto"; "terror es negocio" | La sorpresa rompe el esquema previo y fija el recuerdo | Heath y Heath, *Made to Stick* (2007) |
| Frecuencias naturales y arreglo de íconos | "53 de cada 100" con 100 puntos | Se entiende sin estadística; los porcentajes obligan a imaginarse la base | Gigerenzer y Hoffrage (1995); Galesic et al. (2009) |
| Aversión a la pérdida | "Más de la mitad pierde plata" | Una pérdida pesa más que una ganancia del mismo tamaño | Kahneman y Tversky (1979) |
| Frase ancla repetida | "La nota predice la plata. El presupuesto, no." (capítulo 4 y cierre) | La repetición de una frase corta la vuelve el mensaje que se lleva la audiencia | Heath y Heath (2007) |
| Regla de tres | Tres preguntas, tres capítulos de argumento, tres decisiones | Es la cantidad máxima que se recuerda sin apoyo | Knaflic, *Storytelling with Data* (2015) |
| Baja carga cognitiva | Una idea por pantalla, código oculto, títulos que son conclusiones | La memoria de trabajo es limitada: todo lo que no aporta la ocupa igual | Sweller (1988); Mayer (2009) |
| Codificación dual | Cifra grande + frase + gráfico en cada capítulo | Lo que llega por palabra e imagen a la vez se recuerda mejor | Paivio (1971) |
| Señalización | Color semántico (rojo = revisar, verde = oportunidad), animación que aparece al llegar | Dirige la mirada a lo que importa antes de que se lea el texto | Mayer (2009) |
| Estructura de viaje y giro | Pregunta → hallazgo → giro → decisión | La historia alterna "lo que es" con "lo que podría ser", y el giro recupera la atención a mitad de camino | Duarte, *Resonate* (2010) |
| Pico-final | Cierre en la frase ancla y la acción | Una experiencia se recuerda por su momento más intenso y por cómo termina | Kahneman et al. (1993) |
| Ver para creer | Filtro de Japón en vivo | Una prueba que se ve pasar convence más que una afirmación | Duarte (2010) |

---

## 5 · Tarjeta de cifras (para los dos, de memoria)

Todas salen de `cifras_clave()` en `src/analisis.py`. El JSON completo está en `data/processed/cifras_clave.json`.

| Qué | Cifra | Cómo decirla en voz alta |
|---|---|---|
| Títulos | 31.991 (16.000 películas · 15.991 series) | "casi treinta y dos mil" |
| Nota media ponderada | 6,71 | "seis coma siete" |
| Retorno típico | 1,70× sobre 3.540 películas con datos | "recauda uno coma siete veces lo que costó" |
| Drama | 46,2 % del catálogo | "casi la mitad" |
| Terror + suspenso | 4.387 películas, 1 de cada 3; nota 6,08 | "una de cada tres" |
| Documental + musical + histórico | 1.546 películas; +0,77 de nota | "un tercio del volumen, ocho décimas más" |
| Presupuesto terror / animación / aventura | 7 / 50 / 60 millones de USD | "siete contra cincuenta" |
| Retorno terror | 2,03× | "dos veces lo que costó" |
| Histórico / bélico | nota 6,92 / 6,85; retorno 1,16× / 1,27× | "prestigio, no negocio" |
| No recupera lo invertido | 53 de cada 100 con nota bajo 6; 21 con nota sobre 7; 36,7 % en total | "más de la mitad pierde plata" |
| Retorno por tramo de nota | 0,83× (bajo 5,5) → 3,23× (sobre 7) | "ni siquiera recupera" → "más del triple" |
| Correlación con el retorno | nota 0,33; presupuesto 0,07 | "la nota ordena el retorno; el presupuesto no" |
| Japón / Corea / EE.UU. | 7,21 / 7,11 / 6,56; EE.UU. es 48,5 % de las películas y queda 15.º de 24 | "catorce países reciben mejor nota que EE.UU." |
| Meta 1 | 22,4 % → 30 % | |
| Meta 2 | 11,6 % → 18 % | |
| Meta 3 | 36,7 % → 30 % | |
| Demo Japón | nota 7,21 (▲ +0,50) · retorno 2,77× (▲ +1,07×) | |

---

## 6 · Preguntas que pueden caer (tarea 32)

El banco completo, con las respuestas, está en `CLAUDE.md`. Aquí va quién contesta y dónde está la evidencia en pantalla, para poder **mostrarla** y no solo decirla.

Regla: contesta primero quien presentó esa parte; el otro solo complementa si queda algo sin decir. **Nunca** se contradicen en vivo.

| # | Pregunta | Responde | Qué se muestra |
|---|---|---|---|
| 1 | ¿Por qué el gráfico temporal es plano? | Claudio | Informe, capítulo 2 (descartes) |
| 2 | ¿Dónde está duración vs popularidad? | Claudio | Informe, capítulo 2 |
| 3 | ¿Por qué no clasificación por edad? | Claudio | Informe, capítulo 2 |
| 4 | ¿Cómo midieron engagement? | Matías | Nota "Lo que todavía no sabemos" (capítulo 5) |
| 5 | ¿Por qué el ROI solo sobre 3.540 películas? | Claudio | KPI del capítulo 1: el 78 % de las películas no tiene presupuesto y recaudación válidos (el 70 % viene con presupuesto en cero) |
| 6 | ¿Por qué ese tipo de gráfico? | quien presentó ese gráfico | `docs/decisiones_diseno.md`; dashboard, subtítulo "Paso 2 de 3" (puntos en vez de barras para no truncar el eje) |
| 7 | ¿Qué haría distinto el Gerente mañana? | Matías | Las tres recomendaciones, de memoria y con su número |
| 8 | ¿Mayor debilidad? | Matías | Nota "Lo que todavía no sabemos" |
| 9 | ¿Terror no es solo barato? | Claudio | Capítulo 4: "Es exactamente eso, y por eso no recomendamos dejar de producirlo" |
| 10 | ¿Por qué no recomiendan histórico? | Claudio | Capítulo 4: el cuadrante "prestigio de catálogo" |
| 11 | ¿La ventaja de las series la fabricó el umbral? | Matías | Anexo del informe (película contra serie); respuesta de memoria |
| 12 | ¿Por qué no comparan géneros entre películas y series? | Matías | Respuesta de memoria: de 28 etiquetas, solo 8 son comunes |

**Si preguntan algo que no sabemos:** *"No lo analizamos, y no lo vamos a inventar. Lo que sí podemos decir es…"*, y se vuelve a la evidencia más cercana. Un "no sé" bien dicho suma en IE12; un número inventado lo resta todo.

---

## 7 · Ensayos (tareas 33 y 34)

- **Tarea 33, ensayo cruzado:** una pasada completa con los roles invertidos: Claudio hace A, C, E y G; Matías hace B, D y F. Si alguno se traba, esa parte no está entendida.
- **Tarea 34, ensayo final:** con cronómetro y con el HTML y el dashboard reales en el computador de la presentación. Anotar el tiempo de cada bloque en la tabla del punto 2. Si pasa de 10:00, se aplica el orden de corte; no se habla más rápido.
- **Checklist de voz:** mirar a la audiencia y no a la pantalla, una pausa de un segundo después de cada cifra grande, y señalar con la mano, no con el mouse.

---

## 8 · Guion con las láminas (`presentacion.pdf` / `.pptx`)

Es la versión para presentar **con las 10 láminas**, con la demo del dashboard entre la lámina 9 y la 10. Suma 10:00 exactos. Las voces se alternan: Matías abre y cierra; Claudio hace la auditoría, el giro y la demo. El mismo texto está en las notas del orador de `docs/presentacion.pptx`.

| Lámina | Habla | Tiempo | De → a |
|---|---|---|---|
| 1 · Portada | **Matías** | 0:20 | 0:00 → 0:20 |
| 2 · Audiencia y propósito | **Matías** | 0:40 | 0:20 → 1:00 |
| 3 · Auditamos los datos primero | **Claudio** | 1:00 | 1:00 → 2:00 |
| 4 · Los cuatro números | **Claudio** | 0:30 | 2:00 → 2:30 |
| 5 · El hallazgo | **Matías** | 1:00 | 2:30 → 3:30 |
| 6 · Terror no es un error | **Claudio** | 1:00 | 3:30 → 4:30 |
| 7 · La nota predice la plata | **Claudio** | 1:00 | 4:30 → 5:30 |
| 8 · Japón y Corea | **Matías** | 0:40 | 5:30 → 6:10 |
| 9 · Tres decisiones | **Matías** | 1:20 | 6:10 → 7:30 |
| Demo · Demo del dashboard | **Claudio** | 1:50 | 7:30 → 9:20 |
| 10 · Lo que no sabemos y cierre | **Matías** | 0:40 | 9:20 → 10:00 |

**Orden de corte si se pasan:** primero la lámina 4 (se dice «casi treinta y dos mil títulos» en la 3); después la 8 (la recomendación 2 igual cita a Japón y Corea); después se acorta la demo a solo el filtro de Japón. Nunca se cortan la 3, la 5, la 6, la 7, la 9 ni la 10.

### Lámina 1 · Portada — *Matías* — 0:00 → 0:20

*Esperar dos segundos en silencio antes de hablar.*

> "Buenas. Somos Matías Retamal y Claudio González. Analizamos los casi treinta y dos mil títulos del catálogo de StreamView con una sola pregunta: ¿lo que más producimos es lo que la audiencia mejor recibe? La respuesta está en el título: no. Y esa diferencia tiene un costo que se puede medir."

### Lámina 2 · Audiencia y propósito — *Matías* — 0:20 → 1:00

> "Esto está hecho para una persona: el Gerente de Contenidos. Cada pocas semanas decide qué comprar, qué producir y qué promocionar. Tiene criterio de negocio, no perfil técnico, y hoy decide sin poder ver el catálogo completo. Nuestro objetivo fue que pueda responder estas tres preguntas en menos de un minuto. Por eso entregamos dos piezas: un informe, para defender la decisión ante su jefatura, y un dashboard, para revisarla cada semana. Claudio."

### Lámina 3 · Auditamos los datos primero — *Claudio* — 1:00 → 2:00

*La lámina que nunca se corta.*

> "Antes de hacer un solo gráfico revisamos los datos, y eso cambió el proyecto. El encargo pedía cuatro análisis que estos datos no permiten hacer bien. La duración viene vacía en todas las películas. La clasificación por edad es, en realidad, una copia de la nota. Hay exactamente mil títulos por año, así que cualquier tendencia sería un efecto del muestreo. Y los datos de usuarios nunca llegaron. Podríamos haber hecho esos gráficos igual: se habrían visto bien y habrían estado mal. Preferimos responder menos preguntas, pero que cada respuesta se sostenga."

### Lámina 4 · Los cuatro números — *Claudio* — 2:00 → 2:30

*Primera lámina que se corta si falta tiempo.*

> "El catálogo en cuatro números: casi treinta y dos mil títulos, mitad películas y mitad series. Nota media de seis coma siete, ponderada por votos, porque sin eso el primer lugar lo gana un título con un solo voto. Una película típica recauda uno coma siete veces lo que costó. Y casi la mitad del catálogo es drama. Matías."

### Lámina 5 · El hallazgo — *Matías* — 2:30 → 3:30

*Señalar con la mano: primero abajo a la derecha, después arriba a la izquierda.*

> "Aquí está el hallazgo. Cada punto es un género: a la derecha, lo que más se produce; arriba, lo mejor evaluado. Aquí abajo, terror y suspenso: una de cada tres películas, y las dos peores notas. Aquí arriba, documental, musical e histórico: un tercio del volumen y casi ocho décimas más de nota. Es la oportunidad que hoy nadie está mirando. Con esto, la recomendación parecía obvia: producir menos terror. Casi la hacemos. Claudio."

### Lámina 6 · Terror no es un error — *Claudio* — 3:30 → 4:30

> "Habría sido un error. Cruzamos la nota con la plata y apareció el giro. Terror es el género más barato de producir: siete millones de dólares la película típica, contra cincuenta de animación. Y aun así recauda dos veces lo que costó, más que el catálogo en general. No es un descuido: es una apuesta de costo. Al revés, histórico tiene muy buena nota y el peor retorno: eso es prestigio, no negocio. Lo que gana dos veces, en nota y en plata, son cuatro géneros: animación, familiar, aventura y musical. Arriba a la derecha."

### Lámina 7 · La nota predice la plata — *Claudio* — 4:30 → 5:30

*Pausa de un segundo después de cada cifra.*

> "Y este es el dato que sostiene todo. De cada cien películas mal evaluadas, cincuenta y tres no recuperan lo que costaron: más de la mitad pierde plata. De cada cien bien evaluadas, solo veintiuna. A la derecha, lo que nadie espera: cuánto se gastó casi no dice nada sobre cuánto se recupera. En una frase: la nota predice la plata; el presupuesto, no. Gastar más no garantiza nada; producir lo que la audiencia valora, sí. Matías."

### Lámina 8 · Japón y Corea — *Matías* — 5:30 → 6:10

*Segunda lámina que se corta si falta tiempo.*

> "Lo mismo pasa por país. Japón es el país mejor evaluado del catálogo, y Corea del Sur está entre los tres primeros. Estados Unidos aporta casi la mitad de las películas y queda en el puesto quince de veinticuatro. Ojo: no decimos que el contenido asiático sea mejor. Decimos que, dentro de este catálogo, está subrepresentado respecto de cómo se recibe."

### Lámina 9 · Tres decisiones — *Matías* — 6:10 → 7:30

*Las tres de memoria, con su número. Al terminar, Claudio cambia al dashboard.*

> "Tres decisiones, cada una con una meta que se puede comprobar en doce meses. Uno: mover la compra hacia los cuatro géneros que ganan dos veces. Hoy son el veintidós por ciento de las películas; la meta es treinta. Y no es dejar de producir terror: es decidir hacia dónde crece el catálogo. Dos: abrir una línea de compra en Japón y Corea del Sur. Hoy son menos del doce por ciento; la meta es dieciocho. Tres: que el presupuesto siga a la recepción esperada, y no al revés. Ningún proyecto de los más caros sin evidencia de que se va a recibir bien. Hoy treinta y siete de cada cien películas no recuperan lo que costaron; la meta es bajar a treinta. Estas decisiones se revisan cada semana, y para eso construimos una herramienta. Claudio."

### Demo del dashboard — *Claudio* — 7:30 → 9:20

*Cambiar a la pestaña del dashboard y presionar F. Paso 1: filtro País → Japón. Paso 2: limpiar el filtro, ir a «3 · decisión» y poner Tipo → Películas. Paso 3: bajar a la tabla.*

> "Este es el dashboard que usaría el Gerente. Tiene tres páginas, en el mismo orden que la presentación: contexto, hallazgo y decisión. Supongamos que llega una propuesta: comprar películas japonesas. ¿Encaja? Filtro por Japón. La nota sube a siete coma dos, medio punto sobre el catálogo, y el retorno a dos coma setenta y siete, más de un punto por encima. En diez segundos, la recomendación dos se comprueba sin nosotros. Y aquí se pasa a la acción: es el mismo gráfico de la lámina cinco, pero vivo. Cambia con cada filtro, y el título se reescribe solo con la conclusión. Abajo está la lista corta: los títulos mejor evaluados de los géneros en oportunidad. Es, literalmente, una lista de compras. Matías."

### Lámina 10 · Lo que no sabemos y cierre — *Matías* — 9:20 → 10:00

*Volver a la pestaña de la presentación, lámina 10.*

> "Cerramos con lo que no sabemos. Sabemos qué títulos se reciben bien; no sabemos cuántas personas los vieron ni cuántas se quedaron por ellos. Sin datos de consumo, todo esto es sobre la composición del catálogo, no sobre el comportamiento de la audiencia. Si se quedan con una sola idea, que sea esta: la nota predice la plata; el presupuesto, no. Gracias."
