# Estado del proyecto

> **Lee esto primero.** Documento de traspaso: dónde está cada cosa, qué falta y cómo se presenta.
> Sirve para los dos del equipo, y para retomar el trabajo en otra sesión sin reconstruir el contexto.
>
> Última actualización: septiembre 2026 · rama `claude/relaxed-ride-h19xgd`

---

## En una línea

**El trabajo está terminado.** Las 34 tareas del plan están hechas salvo tres, y esas tres son ensayos: nadie las puede hacer por ustedes. Los seis entregables existen, están verificados y están subidos.

| | |
|---|---|
| Tareas completadas | **31 de 34** |
| Pendientes | **32, 33 y 34** — los ensayos |
| Indicadores de rúbrica con evidencia | **11 de 12** (IE11 queda abierto hasta ensayar) |
| Cambios sin subir a git | **ninguno** |

---

## Los seis entregables

| # | Entregable | Formato | Archivo | Estado |
|---|---|---|---|---|
| 1 | Informe ejecutivo | PDF, 14 páginas | `docs/informe_ejecutivo.pdf` | ✅ |
| 2 | Dashboard interactivo | App HTML | `dashboard/streamview_dashboard.html` | ✅ |
| 3 | Presentación ejecutiva | PDF, 10 láminas 16:9 | `docs/presentacion.pdf` | ✅ |
| 4 | Archivos del proyecto documentados | — | todo el repositorio | ✅ |
| 5 | Dataset y complementarios | CSV | `data/raw/` y `data/processed/` | ✅ |
| 6 | Carpeta con estructura profesional | — | `README.md` | ✅ |

**Sobre el formato PDF del informe:** lo pide así el enunciado. Está escrito en el `README.md` desde el primer commit del proyecto, antes de cualquier trabajo: *«Informe ejecutivo · PDF»*. La presentación admite PDF o PPTX y se entregó en PDF.

---

## Lo único que falta: tareas 32, 33 y 34

Las tres son de ensayo. **El material está listo; lo que falta es hacerlo en voz alta.** Todo lo que necesitan está en `docs/guion_defensa.md`.

Conviene hacerlas en este orden, en una sola sesión de unas dos horas.

### Tarea 32 · El banco de preguntas

Son **doce preguntas** al final de `CLAUDE.md`, con su respuesta.

**Cómo se hace:** se turnan. Uno pregunta, el otro responde **sin mirar**, y cambian. Se repite hasta que las doce salgan sin dudar.

**La regla que importa:** no vale responder *«eso lo hizo el otro»*. EP2 se evalúa **individualmente y con preguntas cruzadas** — el profe le puede preguntar a cualquiera de los dos sobre cualquier parte, y ahí es donde se pierde la nota grande.

**Ojo con la 11 y la 12.** Son las únicas dos que no tienen una lámina que las responda: van de memoria. Y son las más probables si el profe entró al repositorio, porque son las técnicas. Están transcritas completas en `docs/guion_defensa.md`, en la sección *«Preguntas que pueden caer»*.

### Tarea 33 · Ensayo cruzado

**Cada uno presenta la mitad que NO redactó.** El reparto está fijado en el guion:

- **Claudio** presenta las láminas **1 a 5** (portada, propósito, auditoría, KPIs, el hallazgo)
- **Matías** presenta las láminas **6 a 10** (la corrección, ROI, mercados, recomendaciones, debilidad)

**Para qué sirve:** si alguno se traba, esa parte no está entendida — no es un problema de memoria, es que falta comprenderla. Se repasa y se vuelve a ensayar entera antes de seguir.

### Tarea 34 · Ensayo con cronómetro

**10 minutos reales, cronómetro corriendo.** Los tiempos por lámina del guion suman 10:00 exactos.

**Si se pasan, se cortan láminas — no se habla más rápido.** El orden de corte ya está decidido para que no tengan que improvisarlo con los nervios encima:

1. Primero sale la **lámina 4** (los KPIs). Es contexto, no argumento.
2. Después la **lámina 8** (países). La recomendación 2 sobrevive citando el dato desde la lámina 9.
3. Después se funde la **lámina 2** con la 1: el propósito se dice mientras está la portada.

**Nunca se cortan la 3, la 5, la 6, la 9 ni la 10.** Esas cinco son el argumento completo.

### Dos cosas más antes de la defensa

- **La prueba de la lámina apagada.** Uno presenta una lámina sin que el otro vea la proyección. Si el que escucha entiende igual, la voz está cargando el peso — que es exactamente lo que evalúa IE11 (14%).
- **Abrir el dashboard y filtrar una vez.** Para que si el profe pide verlo en vivo no sea la primera vez que lo usan delante de él.

---

## Cómo vamos a presentar

**10 minutos, 10 láminas, una idea por lámina.** La secuencia es la misma del informe: **contexto → hallazgo → implicancia → recomendación**.

| # | Lámina | Presenta | Tiempo |
|---|---|---|---|
| 1 | Portada | Claudio | 0:20 |
| 2 | Audiencia y propósito | Claudio | 0:50 |
| 3 | Auditamos los datos primero | Claudio | 1:15 |
| 4 | 31.991 títulos | Claudio | 0:45 |
| 5 | Lo que más se produce no es lo que mejor se recibe | Claudio | 1:10 |
| 6 | Terror no es un error: es una apuesta de costo | Matías | 1:15 |
| 7 | La recepción predice el retorno | Matías | 1:10 |
| 8 | Japón y Corea | Matías | 0:50 |
| 9 | Las tres recomendaciones | Matías | 1:35 |
| 10 | La mayor debilidad de nuestra solución | Matías | 0:50 |

**Lo que se dice en cada lámina está escrito palabra por palabra en `docs/guion_defensa.md`.** No es lo que la lámina muestra: es lo que se dice *encima* de lo que la lámina muestra. Esa distinción es IE11.

### El argumento, en cuatro frases

Si tuvieran que resumir los diez minutos a cuatro frases, son estas:

1. **Auditamos los datos antes de graficar, y eso cambió el proyecto:** cuatro de los análisis que el enunciado pedía no se pueden hacer con estos datos, y lo decimos en vez de fingir que sí.
2. **Lo que el catálogo más produce no es lo que mejor se recibe:** terror y suspenso son un tercio del catálogo de películas y tienen las dos peores notas.
3. **Pero terror no es un error — es barato:** 7 millones de presupuesto mediano contra 50 de animación. La nota baja es el precio de una apuesta de costo deliberada. Lo que sí importa es que **la nota predice el retorno y el presupuesto no**.
4. **Tres recomendaciones medibles**, y cerramos diciendo qué *no* sabemos: sin datos de consumo, esto es sobre composición del catálogo, no sobre comportamiento de audiencia.

---

## Los tres hallazgos que nos diferencian del resto del curso

Estos no estaban en el enunciado. Salieron de auditar, y son los que hacen que el trabajo se sostenga bajo preguntas.

1. **`duration` y `rating` son inservibles.** La infografía pedía «duración vs popularidad» y análisis por clasificación de edad. `duration` viene 100% nula en películas y constante en las 16.000 series; `rating` resultó ser copia exacta de `vote_average`, o sea que **no hay clasificación etaria en el dataset**. El resto del curso probablemente va a entregar esos dos análisis sin darse cuenta.

2. **Películas y series usan taxonomías de género distintas.** De 28 etiquetas, solo 8 son comunes: las películas tienen `Action` y `Adventure` por separado y las series las agrupan en `Action & Adventure`. Un ranking que mezcle ambos tipos compara dos vocabularios y sugiere ausencias falsas.

3. **Terror no está sobreinvertido, es barato.** Tiene el presupuesto mediano más bajo del catálogo y un ROI sobre la mediana. Si hubiéramos recomendado «producir menos terror» —que es la lectura obvia del gráfico de brecha— la recomendación habría estado mal fundada. Por eso existe el visual 21.

---

## Mapa del repositorio

```
├── data/
│   ├── raw/                     los dos CSV originales — NUNCA se modifican
│   └── processed/               generado por código, se puede borrar y rehacer
│
├── notebooks/
│   ├── 01_auditoria_datos       los 10 hallazgos verificados en código
│   ├── 02_limpieza_integracion  el pipeline paso a paso
│   └── 03_analisis_exploratorio los 6 visuales
│
├── src/
│   ├── limpieza.py              carga, limpieza, integración, métricas
│   ├── analisis.py              todas las agregaciones
│   ├── graficos.py              paleta, tipografía, helpers  ← el sistema visual
│   ├── etiquetas.py             traducción de géneros/países/idiomas
│   ├── dashboard_datos.py       genera el payload del dashboard
│   └── informe/                 fuente del informe y la presentación
│
├── dashboard/
│   └── streamview_dashboard.html  ← se abre de un doble clic
│
├── docs/
│   ├── informe_ejecutivo.pdf    ENTREGABLE
│   ├── presentacion.pdf         ENTREGABLE
│   ├── calidad_datos.md         la auditoría — el diferencial del proyecto
│   ├── decisiones_diseno.md     por qué cada gráfico es ese gráfico (IE7, IE8)
│   ├── dashboard_spec.md        qué muestra el dashboard y por qué
│   ├── guion_defensa.md         qué dice cada uno en cada lámina  ← PARA ENSAYAR
│   └── auditoria_rubrica.md     los 12 indicadores con su evidencia verificada
│
├── images/
│   ├── exploratorio/            salida de los notebooks
│   └── finales/                 los que van al informe y las láminas
│
├── CLAUDE.md                    el plan de 34 tareas y el banco de preguntas
├── ESTADO.md                    este archivo
└── README.md                    presentación del proyecto
```

### Cuál es cuál, si hay que elegir uno

- **¿Qué hicimos y qué recomendamos?** → `docs/informe_ejecutivo.pdf`
- **¿Cómo lo presentamos?** → `docs/presentacion.pdf` + `docs/guion_defensa.md`
- **¿Por qué este gráfico y no otro?** → `docs/decisiones_diseno.md`
- **¿Por qué no analizaron X?** → `docs/calidad_datos.md`
- **¿Está cubierta la rúbrica?** → `docs/auditoria_rubrica.md`

---

## Cómo regenerar todo

El proyecto corre de punta a punta desde los CSV originales. Verificado borrando `data/processed/`, `images/` y el payload del dashboard.

```bash
pip install -r requirements.txt

python src/limpieza.py          # data/raw/ → data/processed/
# luego los tres notebooks en orden, o directamente:
python src/dashboard_datos.py   # regenera dashboard/datos.js
python src/informe/generar.py   # regenera los DOS PDF
```

**Si cambia una cifra, no se edita el PDF a mano:** se corrige en el HTML de `src/informe/` y se vuelve a generar. Por eso el informe está hecho en HTML + CSS y no en Word — para que una cifra corregida se propague sola y el informe no pueda quedar diciendo algo distinto a los gráficos.

**El dashboard necesita sus cuatro archivos juntos** (`streamview_dashboard.html`, `estilo.css`, `graficos.js`, `datos.js`). El HTML suelto no funciona.

---

## Decisiones que hay que poder defender

Si preguntan «¿por qué hicieron esto así?», estas son las respuestas. Las cuatro salen en `decisiones_diseno.md` con más detalle.

| Decisión | Por qué |
|---|---|
| **Gráficos de puntos y no de barras** para las notas | El rango va de 5,89 a 7,01. Una barra codifica magnitud desde cero: habría que truncar el eje —prohibido— o dibujar barras indistinguibles. El punto codifica por posición y no necesita origen en cero |
| **Umbral de votos por tipo** (30 películas / 5 series) | La mediana de votos es 138 en películas y 4 en series. Un umbral común de 30 dejaría fuera el 75% de las series |
| **Nota ponderada y no nota cruda** | Sin ponderar, el ranking lo encabezan títulos con un voto y nota 10,0 |
| **Mediana y no media en el ROI** | El ROI medio es 781× por unos pocos títulos de presupuesto mínimo. No describe a ninguna película real |
| **ROI solo sobre 3.540 películas** | El 70% tiene presupuesto en cero. Está declarado en el subtítulo del propio gráfico |
| **Forma además de color** en los cuadrantes | El validador dio ΔE 4,1 entre el verde y el rojo bajo deuteranopía: para ese lector eran el mismo color |
| **Dashboard en HTML y no Power BI** | El profe nos dejó elegir. Comparte paleta y agregaciones con el informe, así que no se pueden desincronizar — y de hecho eso detectó una diferencia real en el ROI antes de la entrega |

---

## Para retomar esto en otra sesión

Si se retoma el trabajo con una IA, lo mínimo que hay que saber:

- **El plan completo está en `CLAUDE.md`** con las 34 tareas marcadas y el banco de preguntas.
- **Lo que falta son las tareas 32, 33 y 34**, y son ensayos presenciales. No hay nada de código ni de documento pendiente.
- **Las cifras del proyecto están calculadas, no inventadas.** Cualquier número que aparezca en el informe, las láminas o el dashboard sale de `src/analisis.py` y se puede recalcular.
- **Cuidado con tres errores que ya se cometieron una vez y se corrigieron:** sumar los conteos de géneros (un título puede tener varios y se contaría dos veces), mezclar las taxonomías de película y serie, y recalcular las bandas de nota en el navegador sobre la nota redondeada.
- **Antes de tocar un gráfico**, leer `src/graficos.py`: ahí están la paleta, las formas y las reglas que hacen que las tres piezas se vean iguales.
