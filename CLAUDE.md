# CLAUDE.md — Plan de trabajo y checklist de rúbrica

Documento de trabajo interno del equipo. **No se entrega.** Sirve para (a) avanzar tarea a tarea sin perderse y (b) verificar que cada punto de las dos rúbricas quedó cubierto con evidencia.

**Equipo:** Matías Retamal · Claudio González

**Forma de trabajo:** lineal y conjunta. Las tareas van numeradas del 1 al 34 y se hacen **en ese orden, los dos sobre la misma tarea**. Nada de repartirse bloques: el que escribe cambia, el proyecto avanza en un solo frente. Una tarea no se marca lista hasta que los dos entienden lo que quedó hecho y podrían explicarlo solos.

**Por qué así:** EP2 vale 21% y se evalúa **individualmente con preguntas cruzadas** — al profe le da lo mismo quién hizo qué, y puede preguntarle a cualquiera de los dos sobre cualquier parte. Trabajando en paralelo se avanza más rápido pero cada uno queda ciego de la mitad, y ahí es donde se pierde la nota grande.

**Alcance confirmado:** no van a llegar datos de usuarios ni reproducciones. El proyecto es sobre desempeño del catálogo y eso ya no se discute.

---

## Las dos rúbricas evalúan cosas distintas

Esto define dónde poner el esfuerzo. No son la misma nota con distinto peso.

**EP1 — Encargo (9%). Evalúa las visualizaciones en sí.**

| IE | Qué mide | Peso |
|---|---|---|
| IE4 | Principios de percepción visual y jerarquía | 14% |
| IE5 | Atributos visuales: color, tamaño, posición, contraste, forma | 16% |
| IE6 | Visualizaciones claras que minimizan carga cognitiva | 20% |
| IE7 | Tipo de gráfico adecuado según naturaleza de los datos | 12% |
| IE9 | Coherencia entre visualizaciones, propósito y audiencia | 20% |
| IE10 | Narrativa visual estructurada | 18% |

**EP2 — Presentación (21%). No evalúa ni una línea de código ni de análisis. Evalúa si saben explicar por qué.**

| IE | Qué mide | Peso |
|---|---|---|
| IE1 | Identifica la audiencia objetivo y sus necesidades | 12% |
| IE2 | Define el propósito comunicacional ligado al problema | 16% |
| IE3 | Justifica la estrategia de comunicación | 22% |
| IE8 | Justifica técnicamente las representaciones visuales | 18% |
| IE11 | Integra recursos orales, escritos y visuales | 14% |
| IE12 | Fundamenta conclusiones con evidencia del análisis | 18% |

**Consecuencia práctica:** un gráfico extra no sube EP2 ni un punto. Una justificación sólida sube hasta 22%. Producir menos y explicar mejor es la estrategia dominante.

---

# Las 34 tareas, en orden

## Bloque A — Auditoría de los datos (tareas 1 a 7)

Va primero y completo antes de cualquier gráfico. Es lo que separa este proyecto del resto del curso.

- [x] **1.** Copiar los dos CSV a `data/raw/`. No se tocan nunca más: toda transformación se hace en código y sale a `data/processed/`.
- [x] **2.** Crear `notebooks/01_auditoria_datos.ipynb`. Cargar ambos archivos e imprimir `shape`, `dtypes` y `head()` de cada uno.
- [x] **3.** Calcular y guardar el % de nulos por columna de ambos archivos (`df.isna().mean()`). Pegar la salida en `docs/calidad_datos.md`, sección 2.
- [x] **4.** Verificar en código los ocho hallazgos de la tabla del README, uno por uno, con una celda cada uno. Que se vea el cálculo, no la afirmación. Los tres críticos: `duration` 100% nula, `rating` idéntica a `vote_average`, y exactamente 1.000 títulos por año.
- [x] **5.** Contar duplicados: `show_id` dentro de cada archivo y colisiones entre ambos. Confirmar los 9 internos en series y los 397 cruzados.
- [x] **6.** Definir el umbral mínimo de `vote_count` para rankings. Mirar la distribución, elegir un número y **escribir el motivo en una frase**. Sin motivo escrito, la tarea no está lista.
- [x] **7.** Completar `docs/calidad_datos.md` entero: tabla brief vs dataset, tabla de nulos, análisis descartados con la celda que lo demuestra, decisiones de limpieza y cierre de impacto.

## Bloque B — Limpieza e integración (tareas 8 a 14)

- [x] **8.** Crear `src/limpieza.py` con una función de carga que lea ambos CSV desde `data/raw/`.
- [x] **9.** Prefijar los IDs: `MOV_` y `TV_`. Sin esto, al concatenar se mezclan 397 registros.
- [x] **10.** Eliminar `rating` (copia de `vote_average`) y `duration` (inservible). Dejar comentado en el código por qué se eliminan.
- [x] **11.** Agregar columna `tipo` con valores Película / Serie y concatenar los dos archivos en una sola tabla. *(Ojo: la columna `type` ya existe con `Movie` / `TV Show` — es traducir/normalizar, no crear una columna nueva.)*
- [x] **12.** Explotar `genres`, `country` y `cast` a formato largo (una fila por título-género, etc.) para poder agregar por esas dimensiones. Guardar como tablas aparte, no reemplazar la principal.
- [x] **13.** Crear las métricas derivadas: `roi = revenue / budget` solo donde ambos sean mayores a cero, y un `score_ponderado` estilo IMDb que castigue los títulos con pocos votos.
- [x] **14.** Exportar `data/processed/catalogo_unificado.csv` desde `notebooks/02_limpieza_integracion.ipynb`, importando las funciones de `src/limpieza.py` — no copiando el código dentro del notebook.

## Bloque C — Análisis exploratorio (tareas 15 a 21)

Cada gráfico se guarda en `images/exploratorio/` **y** genera su entrada en `docs/decisiones_diseno.md` en el mismo momento. Si se deja para el final, no se escribe nunca.

- [x] **15.** Definir la paleta y la tipografía del proyecto en `src/graficos.py`. Una sola, usada después en el 100% de los gráficos y replicada en el dashboard.
- [x] **16.** Desempeño por género: volumen vs nota media ponderada. Responde "qué géneros priorizar".
- [x] **17.** Contenidos por país y por idioma. Responde "qué países priorizar".
- [x] **18.** ROI vs nota, sobre el subconjunto de 3.540 películas con datos financieros válidos. Declarar el subconjunto en el propio título o subtítulo del gráfico.
- [x] **19.** Brecha oferta/recepción: géneros con mucho volumen y baja nota (sobreinvertido) contra poco volumen y alta nota. **Este es el hallazgo que vende la presentación** — es la oportunidad desatendida que el Gerente no ve hoy.
- [x] **20.** Comparar Películas vs Series en las dimensiones que apliquen (no en ROI, que series no tiene).
- [x] **21.** Revisar los gráficos de los pasos 16 a 20 y eliminar los que no respondan ninguna de las preguntas del Gerente de Contenidos. Por bonito que esté, si no responde nada, fuera. Esto es IE9.

## Bloque D — Dashboard (tareas 22 a 27)

- [ ] **22.** Confirmar con el profe la herramienta. Si deja elegir: **Power BI**. La rúbrica paga por filtros, KPIs y navegación, y en Power BI eso sale casi gratis; en Streamlit o Dash se gastan horas programando interacciones que valen los mismos puntos.
- [ ] **23.** Cargar `data/processed/catalogo_unificado.csv` y armar los 4 KPIs de cabecera: total de títulos, nota media ponderada, ROI mediano, % del catálogo en el género líder.
- [ ] **24.** Agregar los filtros: tipo, género, país, idioma, rango de años.
- [ ] **25.** Distribuir los visuales en 3 páginas con navegación: Visión general → Desempeño por contenido → Recomendaciones. Máximo 5 o 6 visuales por página; si no cabe, es otra página, no letra más chica.
- [ ] **26.** Aplicar la paleta de la tarea 15 y revisar contraste. Una categoría conserva su color en todos los visuales, en el dashboard y en el informe.
- [ ] **27.** Poner una nota al pie visible con el alcance declarado: datos de catálogo, no de usuarios.

## Bloque E — Informe ejecutivo (tareas 28 a 30)

- [ ] **28.** Redactar las secciones en el orden que exige el enunciado: problema de negocio → objetivos → audiencia y propósito comunicacional → fuentes de datos → **calidad y limitaciones** (sección agregada, es el diferencial) → análisis exploratorio → justificación de las representaciones → narrativa visual → diseño del dashboard → evaluación crítica → conclusiones y recomendaciones.
- [ ] **29.** Insertar los gráficos finales desde `images/finales/`. Cada título de gráfico redactado como la conclusión, no como la descripción: "Drama lidera en volumen pero no en nota", no "Géneros por cantidad".
- [ ] **30.** Escribir las 3 recomendaciones finales, concretas y medibles, cada una apuntando al gráfico que la respalda. Exportar a PDF en `docs/informe_ejecutivo.pdf`.

## Bloque F — Presentación y defensa (tareas 31 a 34)

- [ ] **31.** Armar ~10 láminas para 10 minutos, una idea por lámina, siguiendo la secuencia: qué está pasando → por qué ocurre → qué implica para el negocio → qué recomendamos.
- [ ] **32.** Repasar juntos el banco de preguntas de más abajo hasta que **los dos** respondan las ocho sin dudar.
- [ ] **33.** Ensayo cruzado: Matías presenta las láminas de la segunda mitad y Claudio las de la primera, al revés de como quedaron redactadas. Si alguno se traba, esa parte no está entendida.
- [ ] **34.** Ensayo final con cronómetro, 10 minutos reales. Si se pasa, se cortan láminas, no se habla más rápido.

---

## Checklist de rúbrica — evidencia por indicador

Antes de entregar, cada línea tiene que poder señalarse con el dedo en un archivo concreto.

### EP1

- [ ] **IE4 (14%) Percepción visual.** Jerarquía clara en cada visual: lo más importante arriba a la izquierda, tamaño proporcional a la relevancia, agrupación por proximidad. Evidencia: `docs/decisiones_diseno.md`.
- [ ] **IE5 (16%) Atributos visuales.** Paleta única de la tarea 15 aplicada en todo. Color con función semántica. Contraste verificado y sin depender solo del color para distinguir series.
- [ ] **IE6 (20%) Carga cognitiva.** Sin 3D, sin torta con más de 5 categorías, sin ejes truncados, sin dobles ejes. Títulos redactados como conclusión (tarea 29).
- [ ] **IE7 (12%) Tipo de gráfico.** Justificación por gráfico en `docs/decisiones_diseno.md`. **Los tres análisis descartados cuentan como evidencia aquí**: demostrar que no se graficó algo porque la variable no lo permite es selección correcta.
- [ ] **IE9 (20%) Coherencia.** Tarea 21. Todo visual responde a una pregunta del Gerente de Contenidos.
- [ ] **IE10 (18%) Narrativa.** Informe y presentación siguen la misma secuencia: contexto → hallazgo → implicancia → recomendación.

### EP2

- [ ] **IE1 (12%) Audiencia.** Caracterizar al Gerente de Contenidos: qué decide, con qué frecuencia, qué no sabe hoy, qué nivel técnico tiene. Dos o tres frases, no una etiqueta.
- [ ] **IE2 (16%) Propósito comunicacional.** Enunciado explícito y ligado al problema de negocio. Debe aparecer igual en el informe, en la lámina 2 y en la boca de los dos.
- [ ] **IE3 (22%) Estrategia de comunicación.** El indicador que más pesa de los doce. Por qué dashboard **y** informe: el dashboard para exploración recurrente del Gerente, el informe para respaldar la decisión ante su jefatura. Por qué ese nivel de agregación, por qué ese orden de láminas, por qué se omitió lo que se omitió.
- [ ] **IE8 (18%) Justificación técnica.** Por cada visual: naturaleza de la variable, qué alternativa se evaluó, por qué se descartó. Aquí entran el umbral de votos (tarea 6) y el subconjunto de ROI (tarea 18).
- [ ] **IE11 (14%) Recursos integrados.** No leer la lámina. La lámina apoya, la voz explica. Tareas 33 y 34.
- [ ] **IE12 (18%) Conclusiones con evidencia.** Ninguna recomendación sin su gráfico detrás. Ninguna afirmación que el dataset no soporte — en particular, **nada sobre duración óptima ni sobre clasificación por edad**, que es donde va a caer el resto del curso.

---

## Banco de preguntas difíciles (tarea 32)

Los dos tienen que responder estas sin dudar.

1. ¿Por qué su gráfico de evolución temporal es plano? *(Porque el dataset tiene exactamente 1.000 títulos por año: es un artefacto del muestreo, no un hallazgo. Por eso no lo usamos para conteo.)*
2. La infografía pedía duración vs popularidad. ¿Dónde está? *(`duration` viene 100% nula en películas y constante en series. Está documentado y descartado.)*
3. ¿Por qué no analizaron clasificación por edad? *(La columna `rating` fue sobrescrita con `vote_average`; el dataset no trae clasificación etaria.)*
4. ¿Cómo midieron engagement? *(No lo medimos. No hay datos de usuarios. Usamos proxies de recepción y lo declaramos en el alcance.)*
5. ¿Por qué el ROI solo sobre 3.540 películas? *(70% tiene budget en cero. Incluirlas distorsionaría el indicador.)*
6. ¿Por qué eligieron ese tipo de gráfico y no otro? *(Para cualquier visual del dashboard.)*
7. ¿Qué haría distinto el Gerente de Contenidos mañana gracias a esto? *(Las tres recomendaciones, de memoria.)*
8. ¿Cuál es la mayor debilidad de su solución? *(Con honestidad: sin datos de consumo real, las recomendaciones son sobre composición del catálogo, no sobre comportamiento. Esta respuesta suma en IE12, no resta.)*

---

## Dudas para el profe

- [ ] ¿Hay herramienta obligatoria para el dashboard o se puede elegir? (bloquea la tarea 22)
- [ ] Los tiempos están cruzados entre los PDF: la tabla de EP1 dice 2 h y el texto 3 horas; la de EP2 dice 3 h y el texto 2 horas. ¿Cuál vale?
- [ ] ¿El informe ejecutivo tiene extensión máxima?
