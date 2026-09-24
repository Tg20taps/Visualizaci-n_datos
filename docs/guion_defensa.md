# Guion de defensa — EP2

> Documento interno del equipo. **No se entrega.**
> Cubre las tareas 32, 33 y 34, y es la evidencia de preparación para **IE3** (estrategia de comunicación, 22%) e **IE11** (recursos integrados, 14%).

**Regla que manda sobre todo lo demás:** la lámina apoya, la voz explica. Si lo que se dice es lo que la lámina ya tiene escrito, IE11 se pierde aunque el contenido sea correcto. Lo de abajo es lo que se **dice**, no lo que se lee.

---

## Reparto y tiempos

10 minutos reales. El reparto es **cruzado a propósito** respecto de cómo quedaron redactadas las láminas: el que no la escribió es el que la presenta. Si alguno se traba, esa parte no está entendida y hay que volver sobre ella antes del ensayo final (tarea 33).

| # | Lámina | Presenta | Tiempo | Acumulado |
|---|---|---|---|---|
| 1 | Portada | Claudio | 0:20 | 0:20 |
| 2 | Audiencia y propósito | Claudio | 0:50 | 1:10 |
| 3 | Auditamos los datos primero | Claudio | 1:15 | 2:25 |
| 4 | 31.991 títulos | Claudio | 0:45 | 3:10 |
| 5 | Lo que más se produce no es lo que mejor se recibe | Claudio | 1:10 | 4:20 |
| 6 | Terror no es un error: es una apuesta de costo | Matías | 1:15 | 5:35 |
| 7 | La recepción predice el retorno | Matías | 1:10 | 6:45 |
| 8 | Japón y Corea | Matías | 0:50 | 7:35 |
| 9 | Las tres recomendaciones | Matías | 1:35 | 9:10 |
| 10 | La mayor debilidad de nuestra solución | Matías | 0:50 | 10:00 |

**Si se pasan de 10 minutos, se cortan láminas, no se habla más rápido.** El orden de corte, de lo primero que sale a lo último:

1. **Lámina 4** (los KPIs). Es contexto, no argumento. El 31.991 se puede decir de paso en la lámina 3.
2. **Lámina 8** (países). Duele, pero la recomendación 2 sobrevive citando el dato desde la lámina 9.
3. **Lámina 2** se funde con la 1: el propósito se dice mientras está la portada.

**Lo que no se corta nunca:** la 3 (auditoría), la 5 (hallazgo), la 6 (corrección), la 9 (recomendaciones) y la 10 (debilidad). Esas cinco son el argumento completo; el resto es apoyo.

---

## Lámina por lámina

### 1 · Portada — *Claudio* — 0:20

> "Buenas. Matías Retamal y Claudio González. Analizamos el catálogo de StreamView: 31.991 títulos entre 2010 y 2025. La pregunta que fuimos a responder es si lo que el catálogo produce coincide con lo que la audiencia recibe mejor. Adelanto que no coincide, y que dónde no coincide es lo interesante."

*No leer el título. Decir la conclusión de entrada compra la atención de los diez minutos siguientes.*

### 2 · Audiencia y propósito — *Claudio* — 0:50

> "Esto está hecho para una persona concreta: el Gerente de Contenidos. Decide adquisiciones cada pocas semanas, tiene criterio de negocio pero no es perfil técnico, y hoy decide sin una vista consolidada del desempeño del catálogo.
>
> El propósito que nos fijamos fue que pudiera responder tres preguntas en menos de un minuto y sin ayuda técnica: qué está funcionando, dónde hay una oportunidad que hoy no ve, y qué hacer al respecto.
>
> Por eso entregamos dos piezas y no una. El dashboard es para su exploración recurrente: le llega una propuesta concreta, filtra por género o país y comprueba en el momento si encaja. El informe es para respaldar la decisión ante su jefatura: fija una narrativa y deja las recomendaciones por escrito. El dashboard responde preguntas que todavía no le hicimos; el informe defiende las respuestas que ya tenemos."

*Este párrafo es IE2 y la mitad de IE3. Los dos tienen que poder decirlo sin la lámina delante.*

### 3 · Auditamos los datos primero — *Claudio* — 1:15

> "Antes de cualquier gráfico auditamos los datos, y eso cambió el proyecto.
>
> El enunciado pedía relacionar duración con popularidad: la columna `duration` viene 100% nula en películas y constante en las 16.000 series. Pedía análisis por clasificación de edad: la columna `rating` resultó ser copia exacta de `vote_average`, no hay clasificación etaria en el dataset. Un gráfico de evolución del catálogo saldría plano por construcción, porque hay exactamente 1.000 títulos por año. Y las fuentes de usuarios y reproducciones nunca llegaron, así que no medimos retención ni engagement: usamos proxies de recepción y lo declaramos.
>
> Los ocho hallazgos están verificados en código, celda por celda. Decidimos que era mejor entregar menos análisis y que cada uno se sostenga, que entregar los cuatro que el enunciado sugería sabiendo que no se sostienen."

*La lámina más importante de las diez. Es lo que separa este trabajo del resto del curso, y es la que convierte una limitación en un punto a favor.*

### 4 · 31.991 títulos — *Claudio* — 0:45

> "Para situar el tamaño: 31.991 títulos, mitad películas y mitad series. Nota media ponderada 6,71, y digo ponderada porque sin ponderar el ranking del catálogo lo encabezan títulos con un solo voto y nota 10. ROI mediano 1,7 veces, sobre las 3.540 películas que tienen datos financieros: el 78% restante viene con presupuesto en cero. Y casi la mitad del catálogo es drama."

*Si se van de tiempo, esta lámina es la primera que se corta.*

### 5 · El hallazgo — *Claudio* — 1:10

> "Aquí está el hallazgo. Cada punto es un género: a la derecha los que más se producen, arriba los que mejor nota reciben.
>
> Abajo a la derecha, terror y suspenso: 4.387 títulos distintos, un tercio del catálogo de películas, y las dos peores notas. Arriba a la izquierda, documental, musical e histórico: 1.546 títulos y 0,77 puntos más de nota.
>
> Los cortes son las medianas del propio conjunto, no números que elegimos. Y el eje horizontal es logarítmico porque drama quintuplica a bélico; en escala lineal el cuadrante de la izquierda se aplasta contra el margen y el hallazgo no se ve."

*Señalar los dos cuadrantes con la mano, no con el puntero sobre el texto.*

### 6 · Terror no es un error — *Matías* — 1:15

> "Ahora, si nos hubiéramos quedado ahí, la recomendación habría estado mal fundada. Cruzamos nota contra retorno y aparecieron dos cosas que corrigen la lectura.
>
> La primera: terror tiene el presupuesto mediano más bajo del catálogo, 7 millones de dólares, contra 50 de animación o 60 de aventura. Su ROI mediano es 2,03, sobre la mediana. Su volumen no es un descuido de calidad: es una apuesta de costo deliberada, y la nota baja es el precio conocido de esa apuesta.
>
> La segunda: histórico y bélico tienen las mejores notas del catálogo y los peores retornos. Recomendarlos solo por su nota sería recomendar prestigio de catálogo, no un caso de negocio.
>
> El cuadrante que sí sostiene una recomendación de inversión es el de arriba a la derecha: animación, familiar, aventura y musical, por sobre la mediana en las dos dimensiones a la vez."

*Si el profe va a preguntar algo incómodo, es acá. Adelantarse quita el golpe: la pregunta 9 del banco ya está respondida en esta lámina.*

### 7 · La recepción predice el retorno — *Matías* — 1:10

> "Este es el dato que sostiene todo lo demás. A la izquierda, ROI mediano por banda de nota: sube de forma sostenida, de 0,83 bajo nota 5,5 —o sea que ni siquiera recupera lo invertido— hasta 3,23 sobre nota 7.
>
> A la derecha, el mismo indicador por cuartil de presupuesto: sin ningún patrón.
>
> En números duros: el 53% de las películas con nota bajo 6 no recupera lo invertido; entre las de nota sobre 7 son el 21%.
>
> El panel de la derecha está ahí a propósito: sin él, «invertir en calidad» no se distingue de «invertir más». Con él, la recomendación se puede defender."

*Nunca decir "correlación" sin explicarla. Si sale la palabra: "la nota ordena el retorno; el presupuesto no lo ordena".*

### 8 · Japón y Corea — *Matías* — 0:50

> "Por origen: Japón 7,21 y Corea del Sur 7,11 encabezan la recepción. Estados Unidos aporta casi la mitad del catálogo de películas con nota 6,56: de los 24 países con más de 150 títulos, catorce reciben mejor nota.
>
> El corte por idioma ordena igual —japonés, turco, coreano y chino por sobre el inglés—, y que dos cortes independientes den el mismo orden es lo que nos da confianza en la lectura.
>
> Cuidado con lo que esto **no** dice: no dice que el contenido asiático sea mejor. Dice que, entre lo que este catálogo ya tiene, ese contenido recibe mejores calificaciones. Es subrepresentación relativa, no superioridad."

### 9 · Las tres recomendaciones — *Matías* — 1:35

> "Tres decisiones, cada una con una meta que permite comprobar en doce meses si se cumplió.
>
> **Una:** reequilibrar la adquisición hacia animación, familiar, aventura y musical, los únicos cuatro géneros por sobre la mediana en recepción y en retorno. Hoy son el 22,4% del catálogo de películas; la meta es 30% de las nuevas adquisiciones en doce meses, sin aumentar el presupuesto total. Y subrayo: esto no es dejar de producir terror. Terror cumple una función de eficiencia de costo que conviene mantener consciente. Es mover el margen de crecimiento, no desmantelar la base.
>
> **Dos:** abrir una línea de adquisición dedicada a Japón y Corea del Sur. Hoy son el 11,6% del catálogo de películas; la meta es 18%.
>
> **Tres:** condicionar el presupuesto a la recepción esperada y no al revés. En concreto: ningún proyecto del cuartil superior de presupuesto sin evidencia de recepción comparable. La meta es bajar del 36,7% al 30% la proporción de películas que no recupera su presupuesto."

*Las tres, de memoria, con su número. Es la pregunta 7 del banco y la que más probable es que caiga.*

### 10 · La mayor debilidad — *Matías* — 0:50

> "Cerramos con lo que no sabemos, porque es lo más honesto que podemos decir.
>
> Sabemos qué títulos reciben mejor nota de quienes los calificaron. No sabemos cuántas personas los vieron, cuántas los terminaron ni cuántas se suscribieron por ellos. Sin datos de consumo real, todas nuestras conclusiones son sobre composición del catálogo, no sobre comportamiento de audiencia.
>
> Un género puede recibir notas altas de un público pequeño y fiel y aportar poco a la retención, y estos datos no permiten distinguir ese caso. Con reproducciones y suscripciones se podría medir si la recepción alta se traduce en retención, que es la pregunta que el negocio realmente quiere responder.
>
> No está en estos datos, y por eso no lo afirmamos. Gracias."

*Terminar en la debilidad no resta: es exactamente lo que IE12 premia. No pedir disculpas por ella — enunciarla como una decisión.*

---

## Preguntas que pueden caer, y en qué lámina están respondidas

| Pregunta del banco | Lámina que la responde | Quién contesta |
|---|---|---|
| 1 · ¿Por qué el gráfico temporal es plano? | 3 | el que la presentó |
| 2 · ¿Dónde está duración vs popularidad? | 3 | el que la presentó |
| 3 · ¿Por qué no clasificación por edad? | 3 | el que la presentó |
| 4 · ¿Cómo midieron engagement? | 3 y 10 | cualquiera |
| 5 · ¿Por qué el ROI solo sobre 3.540? | 4 y 7 | Matías |
| 6 · ¿Por qué ese tipo de gráfico? | 5 (log) y 7 (dos paneles) | el que la presentó |
| 7 · ¿Qué haría distinto el Gerente mañana? | 9 | Matías |
| 8 · ¿Mayor debilidad? | 10 | Matías |
| 9 · ¿Terror no es simplemente barato? | 6 | Matías |
| 10 · ¿Por qué no recomiendan histórico? | 6 | Matías |
| 11 · ¿La ventaja de las series no es artefacto del umbral? | ninguna — respuesta oral | Claudio |
| 12 · ¿Por qué no comparan géneros entre tipos? | ninguna — respuesta oral | Claudio |

**Las dos últimas no tienen lámina.** Son las más técnicas y las más probables si el profe entró al repositorio. Hay que tenerlas de memoria:

- **11:** "Lo comprobamos. Con un umbral común de 30 votos para ambos tipos, películas promedian 6,37 y series 7,45; con 100 votos, 6,46 contra 7,63. La brecha crece al exigir más votos, así que no es artefacto de nuestro método. Lo que sí declaramos es que la mediana de votos de una serie es 32 contra 190 de una película: quien vota una serie ya invirtió horas en ella. Las dos notas no miden exactamente la misma conducta."
- **12:** "Porque usan taxonomías distintas. De 28 etiquetas de género, solo 8 son comunes: las películas tienen `Action` y `Adventure` por separado y las series las agrupan en `Action & Adventure`. Si las mezcláramos, parecería que el catálogo no tiene series de suspenso, cuando lo que pasa es que la taxonomía de TV no usa esa etiqueta. Por eso el análisis por género va separado por tipo y la comparación solo sobre los ocho comunes."

### Si preguntan por el dashboard

> "Lo hicimos como app HTML y no en Power BI. El profe nos dejó elegir. Power BI habría ahorrado programar los filtros, pero como ya están escritos, lo que gana la app es que comparte el código de la paleta y las agregaciones con el informe: no se pueden desincronizar. De hecho, mientras lo construíamos encontramos que el ROI por banda de nota daba distinto al del informe, porque los intervalos se cerraban por el lado contrario. Si el dashboard estuviera en otra herramienta, esa diferencia habría llegado a la entrega."

### Si preguntan por accesibilidad o por la paleta

> "Validamos la paleta con un verificador de contraste y visión cromática deficiente, no a ojo. Encontró que el verde y el rojo que usamos para los cuadrantes miden delta E 4,1 bajo deuteranopía: para un lector con esa condición son el mismo color. Mantuvimos el par porque comunica bueno y malo mejor que cualquier alternativa que pase, y le agregamos el canal que faltaba: cada segmento tiene su propia forma de marca. Círculo, triángulo, rombo y cuadrado. El gráfico se lee igual impreso en blanco y negro."

---

## Checklist del ensayo (tareas 33 y 34)

- [ ] **Ensayo cruzado.** Cada uno presenta la mitad que **no** redactó, según el reparto de arriba. Si alguno se traba, esa parte se repasa y se vuelve a ensayar entera.
- [ ] **Las doce preguntas del banco, en voz alta, sin mirar.** Se turnan: uno pregunta, el otro responde, y se cambia. No vale responder "eso lo hizo el otro".
- [ ] **Ensayo con cronómetro, 10 minutos reales.** Si se pasan, se corta según el orden de arriba. No se habla más rápido.
- [ ] **Prueba de la lámina apagada.** Uno presenta una lámina sin que el otro la vea proyectada. Si el que escucha entiende igual, la voz está cargando el peso — que es lo que pide IE11.
- [ ] **Abrir el dashboard y filtrar una vez**, para que si el profe pide verlo en vivo no sea la primera vez que se usa delante de él.
