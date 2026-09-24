# Estado del proyecto

> **Lee esto primero.** Es el documento de traspaso: dónde está cada cosa, qué falta y cómo se presenta.
> Sirve para los dos del equipo y para retomar el trabajo en otra sesión sin tener que reconstruir el contexto.
>
> Última actualización: septiembre 2026 · rama `main` (idéntica a `claude/relaxed-ride-h19xgd`)

---

## En una línea

**El trabajo está terminado.** De las 34 tareas del plan, 31 están hechas. Las tres que faltan son ensayos, y esos solo los pueden hacer ustedes. Todos los entregables existen, están verificados y están en `main`.

| | |
|---|---|
| Tareas completadas | **31 de 34** |
| Pendientes | **32, 33 y 34** (los ensayos) |
| Indicadores de rúbrica con evidencia | **11 de 12** (IE11 queda abierto hasta ensayar) |
| Auditorías de rúbrica hechas | **2** (ver `docs/auditoria_rubrica.md`) |

---

## Cómo se presenta (formato actual)

**10 minutos en dos partes: primero el informe narrativo y después la demo del dashboard.**

1. **Informe narrativo:** `docs/informe_narrativo.html`, abierto en Chrome a pantalla completa y recorrido con scroll. Es el notebook 04 exportado sin código. Cuenta la historia en cinco capítulos: la pregunta → lo que revisamos primero → el desajuste → el giro (dónde está la plata) → tres decisiones. Las cifras aparecen animadas al llegar a cada sección. Dura unos 7 minutos.
2. **Demo del dashboard:** `dashboard/streamview_dashboard.html`. Tiene tres movimientos: la vista general, el filtro Japón (la nota y el retorno suben, con flechas contra el catálogo) y la página 3 con Películas (cuadrantes y lista de títulos en oportunidad). Dura unos 2 minutos y 15 segundos.
3. **Cierre** en la frase ancla: *«La nota predice la plata. El presupuesto, no.»*

**Los diálogos, palabra por palabra, están en `docs/guion_defensa.md`.** Ahí también están el reparto (Matías abre y cierra y hace los capítulos 1, 3 y 5; Claudio hace los capítulos 2 y 4 y la demo), los tiempos, el orden de corte, el plan B, la tarjeta de cifras y la tabla de técnicas de persuasión con sus referencias. Esa tabla es la evidencia para IE3, el indicador que más pesa.

**Plan B**, si falla el navegador o el proyector: `docs/presentacion.pdf`, o su versión editable `docs/presentacion.pptx`. Son las mismas 10 láminas, y la .pptx trae el guion de cada una en las notas del orador.

---

## Los entregables

| # | Entregable | Formato | Archivo | Estado |
|---|---|---|---|---|
| 1 | Informe ejecutivo | PDF, 14 páginas | `docs/informe_ejecutivo.pdf` | ✅ |
| 1b | Informe narrativo (con el que se presenta) | HTML animado, sin código | `docs/informe_narrativo.html` ← `notebooks/04_informe_narrativo.ipynb` | ✅ |
| 2 | Dashboard interactivo | App HTML | `dashboard/streamview_dashboard.html` | ✅ |
| 3 | Presentación ejecutiva | PDF + PPTX editable, 10 láminas 16:9 | `docs/presentacion.pdf` · `docs/presentacion.pptx` | ✅ |
| 4 | Archivos del proyecto documentados | — | todo el repositorio | ✅ |
| 5 | Dataset y complementarios | CSV | `data/raw/` y `data/processed/` | ✅ |
| 6 | Carpeta con estructura profesional | — | `README.md` | ✅ |

**Por qué el informe es PDF y no Word:** así lo pide el enunciado. Está en el `README.md` desde el primer commit: *«Informe ejecutivo · PDF»*. La presentación admite PDF o PPTX, así que se entregan las dos.

---

## Lo único que falta: tareas 32, 33 y 34

El material está listo. Lo que falta es decirlo en voz alta. Conviene hacerlo en una sola sesión de unas dos horas.

- **Tarea 32 · Banco de preguntas.** Son las doce preguntas al final de `CLAUDE.md`. Se turnan: uno pregunta, el otro responde sin mirar, y cambian, hasta que las doce salgan sin dudar. **No vale responder «eso lo hizo el otro»:** EP2 es individual y con preguntas cruzadas. La tabla del punto 6 del guion dice quién responde cada una y qué se muestra en pantalla.
- **Tarea 33 · Ensayo cruzado.** Una pasada completa con los roles invertidos: Claudio hace los bloques A, C, E y G, y Matías hace B, D y F. Si alguno se traba, esa parte no está entendida.
- **Tarea 34 · Ensayo final con cronómetro,** en el computador de la presentación, con el HTML y el dashboard reales. Si pasa de 10:00, se aplica el orden de corte del guion. No se habla más rápido.

---

## Sobre la versión paralela del compañero (y por qué no se usó)

Durante el trabajo, Claudio armó en paralelo una versión propia a partir de `main`, sin haber visto la rama de desarrollo donde estaba casi todo el avance. Esa versión llegó como un `.rar` y **nunca se subió al repositorio**. Se revisó completa y se decidió conservar esta rama como base, por razones verificables:

| Problema en la versión paralela | Por qué importa |
|---|---|
| Mezcla las taxonomías de género de películas y series | De 28 etiquetas solo 8 son comunes. Mezclarlas compara dos vocabularios distintos (pregunta 12 del banco) |
| Recomienda «Sci-Fi & Fantasy» | Esa etiqueta solo existe en series: no se puede adquirir como género de película |
| Uno de sus títulos dice «Documentales… alta nota», pero su propio z-score es −0,44 | El título contradice el dato que muestra |
| Trabaja con 32.000 filas | No elimina los 9 duplicados internos de series |
| Incluye 4.568 títulos con cero votos en los promedios | Sin umbral ni ponderación, el ranking lo dominan títulos con 1 voto |
| Ejes en z-score, géneros en inglés | Un gerente no técnico no puede leer ninguno de los dos |
| El PDF es solo imágenes | No se puede buscar texto, y un lector de pantalla no lo puede leer |

**Lo que sí se aprovechó:** la idea de entregar la presentación también en **.pptx editable**. Por eso existe `docs/presentacion.pptx`, que se genera con código desde las mismas cifras (`src/informe/presentacion_pptx.js`).

---

## El argumento, en cuatro frases

1. **Auditamos los datos antes de graficar, y eso cambió el proyecto:** cuatro de los análisis que pedía el enunciado no se pueden hacer con estos datos, y lo decimos en vez de fingir que sí.
2. **Lo que el catálogo más produce no es lo que mejor se recibe:** terror y suspenso son una de cada tres películas y tienen las dos peores notas.
3. **Pero terror no es un error, es barato:** 7 millones de presupuesto mediano contra 50 de animación. Lo que sí importa es que **la nota predice la plata y el presupuesto no**: de cada 100 películas mal evaluadas, 53 no recuperan lo que costaron; de cada 100 bien evaluadas, solo 21.
4. **Tres decisiones medibles a 12 meses.** Y cerramos diciendo lo que *no* sabemos: sin datos de consumo, esto es sobre composición del catálogo, no sobre comportamiento de la audiencia.

---

## Mapa del repositorio

```
├── data/
│   ├── raw/                     los dos CSV originales. NUNCA se modifican
│   └── processed/               generado por código (incluye cifras_clave.json)
│
├── notebooks/                   narrados como historia: portadilla, mapa de pasos y cierre
│   ├── 01_auditoria_datos       los 10 hallazgos verificados en código
│   ├── 02_limpieza_integracion  el pipeline paso a paso
│   ├── 03_analisis_exploratorio los 6 visuales y por qué cada uno
│   └── 04_informe_narrativo     EL INFORME CON EL QUE SE PRESENTA (sin código)
│
├── src/
│   ├── limpieza.py              carga, limpieza, integración, métricas
│   ├── analisis.py              agregaciones + cifras_clave(): fuente única de cifras
│   ├── graficos.py              paleta, tipografía (Inter), formas  ← sistema visual
│   ├── narrativa.py             componentes HTML/CSS animados del notebook 04
│   ├── etiquetas.py             traducción de géneros, países e idiomas
│   ├── dashboard_datos.py       genera el payload del dashboard
│   └── informe/                 fuente del informe, las láminas y la .pptx
│
├── dashboard/
│   └── streamview_dashboard.html  ← se abre con doble clic (necesita su carpeta)
│
├── assets/fuentes/              Inter en woff2 (la usan los gráficos y los notebooks)
│
├── docs/
│   ├── informe_narrativo.html   CON ESTO SE PRESENTA
│   ├── informe_ejecutivo.pdf    ENTREGABLE
│   ├── presentacion.pdf / .pptx ENTREGABLE (y plan B)
│   ├── guion_defensa.md         diálogos, tiempos, técnicas, cifras  ← PARA ENSAYAR
│   ├── calidad_datos.md         la auditoría de datos, el diferencial del proyecto
│   ├── decisiones_diseno.md     por qué cada gráfico es ese gráfico (IE7, IE8)
│   ├── dashboard_spec.md        qué muestra el dashboard y por qué
│   └── auditoria_rubrica.md     los 12 indicadores con su evidencia verificada
│
├── images/finales/              los 6 gráficos del informe y las láminas
├── CLAUDE.md                    el plan de 34 tareas y el banco de preguntas
├── ESTADO.md                    este archivo
└── README.md                    presentación del proyecto
```

---

## Cómo regenerar todo

El proyecto corre de punta a punta a partir de los CSV originales.

```bash
pip install -r requirements.txt
npm install                     # opcional: solo para generar la .pptx

python src/limpieza.py          # data/raw/ → data/processed/
jupyter nbconvert --to notebook --execute --inplace notebooks/0[123]*.ipynb
python src/dashboard_datos.py   # regenera dashboard/datos.js
python src/informe/generar.py   # los dos PDF, el informe narrativo HTML y la .pptx
```

- **Si cambia una cifra, no se edita un documento a mano.** Se corrige en `src/analisis.py` o en el HTML de `src/informe/` y se vuelve a generar. Así el informe no puede quedar diciendo algo distinto de los gráficos.
- **Los gráficos usan la fuente Inter.** Si no está instalada, matplotlib usa DejaVu Sans y los PNG cambian levemente. Los archivos woff2 están en `assets/fuentes/`.
- **Para compartir el dashboard, usar `dashboard/streamview_dashboard_un_archivo.html`:** trae todo adentro y funciona suelto. Se regenera con `python src/empaquetar_dashboard.py` cada vez que cambia el dashboard.
- **La versión de desarrollo sí necesita sus archivos juntos** (`streamview_dashboard.html`, `estilo.css`, `graficos.js`, `app.js`, `datos.js` y la carpeta `fuentes/`).

---

## Decisiones que hay que poder defender

| Decisión | Por qué |
|---|---|
| **Presentar primero el informe narrativo y después el dashboard** | Primero un solo mensaje y después la prueba de que se sostiene. Abrir con el dashboard reparte la atención entre botones |
| **Gráficos de puntos y no de barras** para las notas | El rango va de 5,89 a 7,01. Con barras habría que truncar el eje, y eso está prohibido. El punto codifica por posición y no necesita partir en cero |
| **Umbral de votos por tipo** (30 películas / 5 series) | La mediana de votos es 138 en películas y 4 en series. Un umbral común de 30 dejaría fuera el 75 % de las series |
| **Nota ponderada y no nota cruda** | Sin ponderar, el ranking lo encabezan títulos con un voto y nota 10,0 |
| **Mediana y no media en el ROI** | El ROI medio es 781× por unos pocos títulos de presupuesto mínimo. No describe a ninguna película real |
| **ROI solo sobre 3.540 películas** | El 70 % tiene presupuesto en cero. Está declarado en el subtítulo del gráfico |
| **Forma además de color** en los cuadrantes | El verde y el rojo tienen ΔE 4,1 bajo deuteranopía: para ese lector son el mismo color |
| **«53 de cada 100» con 100 íconos, y no «53 %»** | Las frecuencias naturales se entienden sin estadística (Gigerenzer y Hoffrage, 1995) |
| **Dashboard en HTML y no Power BI** | El profe nos dejó elegir. Comparte paleta y agregaciones con el informe, así que no se pueden desincronizar |

---

## Para retomar esto en otra sesión

- **El plan completo está en `CLAUDE.md`,** con las 34 tareas marcadas y el banco de preguntas.
- **Lo que falta son las tareas 32, 33 y 34,** y son ensayos presenciales. No queda código ni documento pendiente.
- **Ninguna cifra está escrita a mano:** todas salen de `cifras_clave()` en `src/analisis.py`. El notebook 04 y la .pptx las leen de ahí.
- **Errores que ya se cometieron una vez y se corrigieron:**
  - Sumar conteos de géneros: un título puede tener varios géneros y se cuenta dos veces.
  - Mezclar las taxonomías de películas y series.
  - Recalcular bandas de nota en el navegador sobre la nota redondeada.
  - Decir «la mejor nota del catálogo» para histórico, cuando lo es solo entre las películas con datos financieros.
  - Escribir animaciones atadas al scroll dentro de un contenedor con `overflow`, lo que las congela a medio camino.
- **Antes de tocar un gráfico, leer `src/graficos.py`.** Ahí están la paleta, las formas y las reglas que hacen que todas las piezas se vean iguales.
