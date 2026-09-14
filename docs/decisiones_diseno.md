# Decisiones de diseño visual

> Una entrada por cada gráfico que llega al informe o a la presentación.
> Este archivo es la fuente directa de evidencia para **IE7** (EP1: tipo de gráfico adecuado)
> e **IE8** (EP2: justificación técnica de las representaciones).
> Se completa en el momento de crear el gráfico, no al final.

---

## Sistema visual del proyecto

Definido en `src/graficos.py` y replicado en el dashboard. Un solo módulo decide cómo se ve todo: ningún notebook fija colores ni tamaños a mano.

### Paleta

| Rol | Color | Uso |
|---|---|---|
| Película | `#2a78d6` azul | Color semántico fijo. La categoría "Película" es azul en el 100% de los visuales, del informe y del dashboard |
| Serie | `#eb6834` naranja | Ídem para "Serie" |
| Oportunidad | `#0ca30c` verde | Solo el cuadrante accionable "poco volumen, buena nota" |
| Sobreinvertido | `#d03b3b` rojo | Solo el cuadrante "mucho volumen, nota baja" |
| Contexto | `#898781` / `#c3c2b7` gris | Todo lo que no es el punto del gráfico |
| Rampa secuencial | azul `#cde2fb` → `#104281` | Magnitud continua (un solo tono, claro a oscuro) |

**Validación de accesibilidad.** La paleta categórica se verificó con un validador de contraste y visión cromática deficiente, no a ojo. El peor par adyacente da ΔE 9,1 bajo protanopía (objetivo ≥8) y 19,6 en visión normal (piso ≥15); todos los tonos caen dentro de la banda de luminosidad y superan el piso de croma. El orden de asignación de colores es fijo y **nunca se cicla**: un noveno color no se inventa, la cola se agrupa en "Otros".

**El color nunca viaja solo.** Todo gráfico lleva etiqueta directa con el valor; la distinción película/serie se refuerza además con la forma (círculo contra cuadrado). Un lector daltónico, o una impresión en blanco y negro, siguen siendo legibles.

### Tipografía y números

Familia sans del sistema (DejaVu Sans, con respaldo a Liberation Sans / Helvetica / Arial). Una sola familia, tres pesos.

Convención numérica chilena en todos los ejes y etiquetas: **coma decimal y punto de miles** (`6,51` y `13.217`, no `6.51` y `13,217`). Un eje que dice `6.5` se lee como "seis mil quinientos" en el idioma de la audiencia.

Las categorías se muestran traducidas al español (`src/etiquetas.py`): `Horror` → `Terror`, `ko` → `Coreano`. Se traduce la etiqueta que se dibuja, nunca el valor del dato: el catálogo procesado conserva los valores originales para que el pipeline siga siendo verificable contra la fuente.

### Reglas que el módulo hace cumplir

- Sin 3D, sin ejes truncados en gráficos de barra, sin doble eje, sin torta de más de 5 categorías.
- Grilla solo en el eje del valor, en tono hairline. El dato es lo único con contraste alto.
- Título redactado como **conclusión**; subtítulo con el **alcance** (subconjunto, umbral, unidad).
- Nota al pie con la fuente y el alcance declarado — *datos de catálogo, no de usuarios* — en los cinco visuales.

---

## 16 · Nota ponderada por género (películas)

- **Pregunta de negocio que responde:** ¿Qué géneros priorizar en adquisición y producción?
- **Naturaleza de las variables:** categórica nominal (género) × continua acotada (nota 0–10) + conteo (volumen).
- **Tipo de gráfico elegido:** dot plot horizontal ordenado por valor, con el volumen como columna de texto.
- **Por qué este y no otro:** el rango útil de notas es estrecho (5,89 a 7,01). Una barra codifica magnitud **desde cero**: con este rango o se trunca el eje —prohibido, IE6— o todas las barras quedan indistinguibles. El punto codifica por **posición**, que no exige origen en cero, y permite acercar el eje al rango real de los datos sin mentir.
- **Alternativa descartada y motivo:** *barras horizontales* (obligarían a truncar el eje); *gráfico de doble eje con volumen y nota* (la escala elegida decidiría cuál serie va "arriba" — eso es una conclusión regalada por el diseño, no por los datos; por eso el volumen va como texto).
- **Principio de percepción aplicado:** orden como jerarquía — el ranking descendente hace que la posición vertical ya cargue significado. Énfasis por color solo en los dos extremos accionables; el resto en gris para que el hallazgo no compita con el contexto.
- **Atributo visual que codifica el dato principal:** posición sobre un eje común (el canal más preciso de la escala de Cleveland–McGill).
- **Alcance declarado en el gráfico:** películas con ≥30 votos (13.217 de 16.000), géneros con ≥200 títulos.
- **Archivo:** `images/finales/16_genero_nota_peliculas.png`

## 17 · Nota ponderada por país de origen

- **Pregunta de negocio que responde:** ¿Qué mercados de origen priorizar?
- **Naturaleza de las variables:** categórica nominal (país) × continua acotada (nota).
- **Tipo de gráfico elegido:** dot plot horizontal, idéntico en forma al anterior.
- **Por qué este y no otro:** la repetición es deliberada. Cuando la pregunta es análoga, repetir la gramática visual permite que el Gerente lea el segundo gráfico sin volver a aprender a leerlo.
- **Alternativa descartada y motivo:** *mapa coroplético.* El dato es "país que aparece en la ficha del título", no volumen de producción ni de consumo. Un mapa sugiere cobertura geográfica e invita a leer más de lo que el dato dice. El dot plot ordenado responde la misma pregunta sin esa insinuación.
- **Principio de percepción aplicado:** énfasis — Japón, Corea, China y Turquía en azul; Estados Unidos en rojo por ser el contraste de la historia; el resto en gris.
- **Atributo visual que codifica el dato principal:** posición.
- **Alcance declarado en el gráfico:** países con ≥150 títulos con votación suficiente. Un título coproducido cuenta en cada país que lo lista.
- **Archivo:** `images/finales/17_paises_nota.png`

## 18 · ROI por nota y por presupuesto

- **Pregunta de negocio que responde:** ¿Dónde el gasto en producción se traduce en retorno?
- **Naturaleza de las variables:** continua agrupada en tramos (nota, cuartil de presupuesto) × continua (ROI mediano).
- **Tipo de gráfico elegido:** dos paneles de barras verticales, misma unidad y misma escala, con línea de referencia en el punto de equilibrio.
- **Por qué este y no otro:** aquí las barras **sí** corresponden: el ROI tiene cero absoluto y significativo, y el eje parte en cero sin problema. Agrupar en tramos hace legible una relación que en 3.540 puntos sueltos sería una nube ilegible.
- **Alternativa descartada y motivo:** *dispersión ROI contra nota título a título.* El ROI tiene una cola larguísima (media 781×, mediana 1,7×): la nube quedaría aplastada contra el eje por un puñado de títulos de presupuesto mínimo. Se usa la **mediana** por la misma razón — la media no describe a ninguna película real.
- **Por qué dos paneles y no dos ejes:** el panel derecho es el **control**. Si el retorno subiera también con el presupuesto, la recomendación sería "gastar más" y no "apuntar a la nota". Dos paneles con la misma escala permiten comparar visualmente; un doble eje permitiría fabricar la conclusión eligiendo la escala.
- **Principio de percepción aplicado:** comparación por proximidad y escala compartida. La rampa secuencial en el panel izquierdo refuerza con color el orden que ya dice la altura; el panel derecho va en gris porque su mensaje es la *ausencia* de patrón.
- **Atributo visual que codifica el dato principal:** longitud desde una base cero.
- **Alcance declarado en el gráfico:** las 3.540 películas con `budget` y `revenue` positivos — el 22% del catálogo de películas.
- **Archivo:** `images/finales/18_roi_nota_presupuesto.png`

## 19 · Brecha oferta / recepción por género

**El visual que sostiene la recomendación.**

- **Pregunta de negocio que responde:** ¿Dónde hay una oportunidad que hoy no se ve?
- **Naturaleza de las variables:** dos continuas emparejadas por categoría (volumen × nota, por género).
- **Tipo de gráfico elegido:** dispersión con cuadrantes cortados en las medianas, etiquetas directas en todos los puntos.
- **Por qué este y no otro:** la pregunta es de **posición conjunta**. No es "cuál género tiene más" ni "cuál tiene mejor nota" — esos son los gráficos 16 y 17 — sino *qué géneros ocupan el cuadrante equivocado*. Solo una dispersión muestra las dos dimensiones a la vez y hace visible el desalineamiento.
- **Alternativa descartada y motivo:** *barras agrupadas de volumen y nota.* Obligan a comparar dos escalas distintas barra por barra y el cruce —que es el hallazgo— no aparece nunca.
- **Por qué medianas y no medias:** con Drama en 5.737 títulos, la media de volumen se desplaza y casi todo cae del mismo lado. La mediana parte el conjunto en dos mitades reales.
- **Por qué eje logarítmico:** Drama (5.737) quintuplica a Bélico (381). En escala lineal, dos tercios de los géneros se aplastan contra el margen izquierdo y el cuadrante de la oportunidad se vuelve ilegible. El eje va rotulado como logarítmico en el propio gráfico.
- **Principio de percepción aplicado:** agrupación por región — los cuadrantes crean cuatro zonas con significado propio, rotuladas con texto y no solo con color. Tamaño de marca mayor y etiqueta en negrita para los puntos accionables.
- **Atributo visual que codifica el dato principal:** posición en dos ejes; el color es redundante con el cuadrante, nunca la única señal.
- **Archivo:** `images/finales/19_brecha_oferta_recepcion.png`

## 20 · Película contra serie en los géneros comunes

- **Pregunta de negocio que responde:** ¿Conviene invertir en película o en serie?
- **Naturaleza de las variables:** categórica (género) × continua (nota) × binaria (tipo).
- **Tipo de gráfico elegido:** gráfico de mancuerna (*dumbbell*).
- **Por qué este y no otro:** la pregunta es la **distancia** entre dos valores emparejados. La mancuerna codifica esa distancia como longitud de un segmento, que es lo que el ojo mide mejor.
- **Alternativa descartada y motivo:** *barras agrupadas.* Obligan a comparar dos alturas y restar mentalmente; la brecha —el dato que importa— no está dibujada en ninguna parte.
- **Restricción metodológica declarada:** solo los géneros que ambos tipos comparten, con ≥100 títulos de cada lado. Películas y series usan **taxonomías de género distintas** (8 etiquetas comunes de 28); comparar `Thriller`, que solo existe en películas, con `Action & Adventure`, que solo existe en series, sería comparar dos vocabularios y no dos catálogos. Se excluye Western: con 26 series, la diferencia no se distingue del ruido.
- **Principio de percepción aplicado:** similitud y codificación redundante — círculo azul para película, cuadrado naranja para serie. La forma repite lo que dice el color, de modo que el gráfico sobrevive a una impresión en blanco y negro o a un lector con daltonismo.
- **Atributo visual que codifica el dato principal:** posición de los extremos y longitud del segmento.
- **Limitación declarada:** la ventaja de las series sobrevive a un umbral común de votos (6,37 contra 7,45 con `vote_count ≥ 30`), pero la mediana de votos de una serie es 32 contra 190 de una película. Las dos notas no miden exactamente la misma conducta. Se declara en el informe y en la defensa.
- **Archivo:** `images/finales/20_peliculas_vs_series.png`

---

## Análisis que NO se graficaron

Demostrar que algo no se graficó porque la variable no lo permite **es selección correcta de representación**, y cuenta como evidencia de IE7.

| Análisis | Por qué no existe un gráfico | Evidencia |
|---|---|---|
| Duración contra popularidad | `duration` es 100% nula en películas y constante en series: cero varianza | notebook 01, Hallazgo 2 |
| Desempeño por clasificación etaria | La columna `rating` es copia de `vote_average`; no hay clasificación por edad en el dataset | notebook 01, Hallazgo 1 |
| Evolución del catálogo en el tiempo | 1.000 títulos exactos por año: cualquier gráfico de conteo sale plano por construcción del muestreo, no por un hallazgo | notebook 01, Hallazgo 3 |
| Antigüedad del contenido al incorporarse | `release_year` coincide con el año de `date_added` en el 100% de las filas | notebook 01, Hallazgo adicional |
| Ranking de géneros mezclando ambos tipos | Taxonomías distintas: solo 8 de 28 etiquetas son comunes | notebook 01, Hallazgo 8 |
| Top de directores | 68,5% de nulos en series; además no responde ninguna de las cinco preguntas del Gerente | notebook 01, Hallazgo 7 |
| Mapa coroplético | El dato es "país en la ficha", no producción ni consumo; el mapa haría leer más de lo que el dato soporta | decisión de diseño, visual 17 |
| Torta de participación por género | 18 géneros en una torta es ilegible, y la pregunta es de orden, no de parte-todo | decisión de diseño, visual 16 |
