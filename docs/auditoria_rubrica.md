# Auditoría de rúbrica — evidencia verificada

> Documento interno. **No se entrega.**
> Cada línea se comprobó abriendo el archivo, no de memoria. Donde dice *verificado en código*, hay un cálculo que lo respalda.
> Fecha de la revisión: antes de la entrega, sobre la rama `claude/relaxed-ride-h19xgd`.

---

## EP1 — Encargo (9%)

### IE4 · Principios de percepción visual y jerarquía — 14%

| Qué pide | Dónde está | Estado |
|---|---|---|
| Jerarquía clara por visual | `docs/decisiones_diseno.md`, campo **«Principio de percepción aplicado»** en las 6 entradas | ✅ |
| Lo importante primero | Los 6 visuales llevan el título redactado como conclusión arriba a la izquierda, y el subtítulo con el alcance debajo | ✅ |
| Tamaño proporcional a la relevancia | Visual 21: el tamaño de marca codifica volumen. Visuales 19 y 21: marca mayor y etiqueta en negrita para los puntos accionables | ✅ |
| Agrupación por proximidad | Visuales 19 y 21: cuadrantes rotulados en texto que crean cuatro regiones con significado propio | ✅ |
| De-énfasis del contexto | `colores_enfasis()` y el gris `#c3c2b7` en `src/graficos.py`: lo que no es el punto del gráfico se apaga | ✅ |

### IE5 · Atributos visuales — 16%

| Qué pide | Dónde está | Estado |
|---|---|---|
| Paleta única aplicada en todo | `src/graficos.py` define la paleta; `dashboard/estilo.css` y `src/informe/estilo.css` copian los mismos hex | ✅ |
| Color con función semántica | `COLOR_TIPO`: Película siempre `#2a78d6`, Serie siempre `#eb6834`, en gráficos, informe, láminas y dashboard | ✅ |
| Contraste verificado | Paleta pasada por validador de contraste y visión cromática deficiente. Peor par adyacente ΔE 9,1 (protanopía) y 19,6 (visión normal) | ✅ **verificado con script, no a ojo** |
| No depender solo del color | Etiqueta directa en los 6 visuales. Forma distinta por segmento (`MARCA` en `src/graficos.py`): círculo, triángulo, rombo, cuadrado | ✅ |

> **El hallazgo que vale la pena poder contar:** el validador reportó que el verde `#0ca30c` y el rojo `#d03b3b` de los cuadrantes miden **ΔE 4,1 bajo deuteranopía** — por debajo del piso de 6. Para un lector con esa condición eran el mismo color. Se conservó el par, porque comunica «bueno / malo» mejor que cualquier alternativa que pase el gate, y se agregó el canal que faltaba: cada segmento tiene su propia forma de marca. Está documentado junto a la constante `MARCA`.

### IE6 · Carga cognitiva — 20%

| Prohibición | Comprobación | Estado |
|---|---|---|
| Sin 3D | `grep` de `projection='3d'` y `Axes3D` en todo el repositorio: **cero coincidencias** | ✅ verificado |
| Sin torta de más de 5 categorías | **Ninguna torta en todo el proyecto.** La única aparición de la palabra es el comentario que la prohíbe | ✅ verificado |
| Sin ejes truncados | El **único** gráfico de barras es el visual 18, con `set_ylim(0, 3.75)`. Los otros cinco codifican por posición (dot plot, dispersión, mancuerna), donde el origen en cero no aplica | ✅ verificado gráfico por gráfico |
| Sin dobles ejes | `grep` de `twinx` y `twiny`: **cero coincidencias**. El visual 18 usa dos paneles con la misma escala en vez de dos ejes | ✅ verificado |
| Títulos como conclusión | Los 6: *«Terror es el género peor evaluado… y aun así es el quinto más producido»*, no *«Géneros por nota»* | ✅ |

### IE7 · Tipo de gráfico adecuado — 12%

| Qué pide | Dónde está | Estado |
|---|---|---|
| Justificación por gráfico | `docs/decisiones_diseno.md`: los 6 visuales con naturaleza de la variable, tipo elegido, **alternativa evaluada y motivo del descarte** | ✅ |
| Análisis descartados como evidencia | Tabla final de `docs/decisiones_diseno.md`: **8 análisis** que no se graficaron, cada uno con la celda del notebook que lo demuestra | ✅ |

> El argumento más fuerte de este indicador: el dot plot en vez de barras. Con notas entre 5,89 y 7,01, una barra obligaría a truncar el eje —prohibido por IE6— o a dibujar barras indistinguibles. El punto codifica por posición y no necesita origen en cero. Es una decisión donde IE6 e IE7 se tocan, y conviene poder explicarla así.

### IE9 · Coherencia entre visualizaciones, propósito y audiencia — 20%

| Qué pide | Dónde está | Estado |
|---|---|---|
| Todo visual responde una pregunta del Gerente | Tabla de la tarea 21 en `notebooks/03_analisis_exploratorio.ipynb`: los 6 visuales con su pregunta | ✅ |
| Se eliminó lo que no responde nada | Los 8 análisis descartados, con su motivo | ✅ |
| Nivel de agregación coherente con la audiencia | Todo agregado por género, país, idioma y tipo — nunca a nivel de título, salvo la tabla del dashboard, que existe justamente para bajar del diagnóstico a una lista accionable | ✅ |

### IE10 · Narrativa visual estructurada — 18%

| Qué pide | Dónde está | Estado |
|---|---|---|
| Misma secuencia en las tres piezas | contexto → hallazgo → implicancia → recomendación. Informe: sección 8. Láminas: 4→5→6-8→9. Dashboard: las tres páginas rotuladas con el paso que les toca | ✅ |
| La secuencia es visible, no implícita | La navegación del dashboard muestra *contexto · hallazgo e implicancia · recomendación* sobre el nombre de cada página | ✅ |

---

## EP2 — Presentación (21%)

### IE1 · Audiencia objetivo y sus necesidades — 12%

| Qué pide | Dónde está | Estado |
|---|---|---|
| Qué decide y con qué frecuencia | Informe §3: *«decide adquisiciones y prioridades de producción con una periodicidad de semanas, no de meses»* | ✅ |
| Qué nivel técnico tiene | *«no es un perfil técnico: no va a interpretar un coeficiente de correlación ni a discutir un intervalo de confianza, y no debería tener que hacerlo»* | ✅ |
| Qué no sabe hoy | *«si el catálogo está desbalanceado respecto de lo que la audiencia recibe mejor, y si el dinero puesto en producción está puesto donde vuelve»* | ✅ |
| Más de una etiqueta | Tres párrafos en el informe, lámina 2 y el guion | ✅ |

### IE2 · Propósito comunicacional — 16%

| Qué pide | Dónde está | Estado |
|---|---|---|
| Enunciado explícito | *«que el Gerente de Contenidos pueda responder, en menos de un minuto y sin ayuda técnica, tres preguntas…»* | ✅ |
| Aparece **igual** en informe, lámina 2 y en la boca de los dos | `grep` de la frase: aparece en `contenido.html`, `presentacion.html`, `guion_defensa.md` y `README.md` | ✅ **verificado con grep** |
| Ligado al problema de negocio | El propósito se enuncia inmediatamente después del problema y los objetivos, no suelto | ✅ |

### IE3 · Estrategia de comunicación — 22% · *el que más pesa*

| Qué pide | Dónde está | Estado |
|---|---|---|
| Por qué dashboard **y** informe | Informe §3 y guion, lámina 2: *«el dashboard responde preguntas que aún no le hemos hecho; el informe defiende las respuestas que ya tenemos»* | ✅ |
| Por qué ese nivel de agregación | `docs/decisiones_diseno.md` por visual, y `docs/dashboard_spec.md` §1 con la definición exacta de cada KPI | ✅ |
| Por qué ese orden de láminas | `docs/guion_defensa.md`: reparto, tiempos, **y el orden de corte si se pasan de 10 minutos, con el motivo de cada corte** | ✅ |
| Por qué se omitió lo que se omitió | Informe §5 y §7, más los 8 análisis descartados en `decisiones_diseno.md` | ✅ |
| Por qué esa herramienta de dashboard | `docs/dashboard_spec.md` §6: por qué se descartó Power BI y qué gana la app HTML | ✅ |

### IE8 · Justificación técnica de las representaciones — 18%

| Qué pide | Dónde está | Estado |
|---|---|---|
| Naturaleza de la variable, por visual | `docs/decisiones_diseno.md`, campo **«Naturaleza de las variables»** en las 6 entradas | ✅ |
| Alternativa evaluada y por qué se descartó | Campo **«Alternativa descartada y motivo»** en las 6 | ✅ |
| Umbral de votos justificado | `docs/calidad_datos.md` §4, replicado en el notebook 01 | ✅ |
| Subconjunto de ROI declarado | En el **subtítulo del propio visual 18**, no en una nota al pie | ✅ |

### IE11 · Recursos orales, escritos y visuales integrados — 14%

| Qué pide | Dónde está | Estado |
|---|---|---|
| No leer la lámina | `docs/guion_defensa.md`: lo que se **dice** en cada lámina, distinto de lo que la lámina muestra | ✅ material listo |
| Las láminas apoyan | Ninguna lámina lleva párrafos de lectura: idea, dato y gráfico | ✅ |
| Ensayo cruzado (tarea 33) | Reparto asignado en el guion: cada uno presenta la mitad que **no** redactó | ⬜ **pendiente — lo hacen ustedes** |
| Ensayo cronometrado (tarea 34) | Checklist al final del guion | ⬜ **pendiente — lo hacen ustedes** |

### IE12 · Conclusiones fundamentadas con evidencia — 18%

| Qué pide | Dónde está | Estado |
|---|---|---|
| Ninguna recomendación sin su gráfico | Las 3 citan su figura: R1 → figuras 4 y 5, R2 → figura 2, R3 → figura 3 | ✅ |
| Metas medibles | Las 3 llevan cifra de partida, cifra de llegada y plazo | ✅ |
| Nada sobre duración óptima | Declarado explícitamente en el cierre del informe y en la lámina 3 | ✅ |
| Nada sobre clasificación por edad | Ídem | ✅ |
| Debilidad declarada | Informe §10 y lámina 10 completa | ✅ |

---

## Correcciones que salieron de esta auditoría

No todo estaba bien. Lo que se encontró revisando, y se arregló:

1. **Verde y rojo indistinguibles bajo deuteranopía** (ΔE 4,1, bajo el piso de 6). Se agregó forma de marca por segmento en los visuales 16, 19 y 21 y en el dashboard.
2. **«5.431 títulos» de terror y suspenso era la suma de los dos géneros**, contando dos veces los títulos etiquetados con ambos. El real es **4.387 títulos distintos**. Lo mismo con «1.705» de documental, musical e histórico: el real es **1.546**. Corregido en informe, láminas y guion, con una nota que explica por qué los géneros no suman.
3. **«por debajo de siete países más»** era falso: son **catorce**. Corregido a «el último de los quince países con más de 150 títulos».
4. **El ROI por banda del dashboard no coincidía con el del informe** (241/533/954 contra 241/515/976): `pd.cut` cierra los intervalos por la derecha y el JavaScript los cerraba por la izquierda, y además la nota redondeada a dos decimales movía de banda a los títulos justo en el corte. La banda ahora viaja precalculada desde Python. Verificado: las cinco bandas dan idéntico.
5. **El ranking de géneros del dashboard mezclaba las dos taxonomías** cuando no había filtro de tipo. Ahora se limita a los 8 géneros comunes y lo dice en el propio gráfico.

---

## Lo único que queda pendiente

| Tarea | Quién |
|---|---|
| 32 · Repasar las 12 preguntas hasta que los dos respondan sin dudar | ustedes |
| 33 · Ensayo cruzado según el reparto del guion | ustedes |
| 34 · Ensayo con cronómetro, 10 minutos reales | ustedes |

Todo lo demás está hecho, verificado y empujado.
