# StreamView Analytics — Solución de Visualización de Datos

**Asignatura:** ADY1104 Visualización de Datos — Duoc UC
**Evaluaciones:** EP1 (Encargo grupal, 9%) + EP2 (Presentación con defensa individual, 21%) — semana 5
**Equipo:** Matías Retamal · Claudio González
**Audiencia objetivo:** Gerente de Contenidos de StreamView Analytics

---

## 1. Problema de negocio

El Gerente de Contenidos necesita decidir **qué contenidos adquirir, producir y promocionar**. Hoy toma esas decisiones sin una vista consolidada del desempeño del catálogo: no sabe qué combinaciones de género, país e idioma concentran mejor recepción de audiencia, ni dónde el gasto en producción se traduce en retorno.

**Objetivo del análisis:** entregar una visión accionable sobre el desempeño del catálogo para apoyar decisiones de adquisición, producción y promoción de contenidos.

**Propósito comunicacional:** el dashboard debe permitirle al Gerente responder, en menos de un minuto y sin ayuda técnica, tres preguntas: qué está funcionando, dónde hay una oportunidad desatendida, y qué se recomienda hacer.

> ⚠️ **Alcance declarado.** El enunciado original menciona fuentes de usuarios, reproducciones, suscripciones y dispositivos. **Esas fuentes no fueron entregadas.** El dataset disponible es exclusivamente de catálogo. Por lo tanto este proyecto **no analiza retención ni engagement de usuarios**: analiza composición y desempeño del catálogo, usando `popularity`, `vote_count` y `vote_average` como *proxies declarados* de recepción de audiencia. Ver `docs/calidad_datos.md`.

---

## 2. Estructura del proyecto

```
streamview-analytics/
├── data/
│   ├── raw/                 # CSV originales, NUNCA se modifican
│   └── processed/           # catalogo_unificado.csv + subconjuntos
├── notebooks/
│   ├── 01_auditoria_datos.ipynb
│   ├── 02_limpieza_integracion.ipynb
│   └── 03_analisis_exploratorio.ipynb
├── src/
│   ├── limpieza.py          # carga, limpieza e integración (pipeline completo)
│   ├── analisis.py          # agregaciones del exploratorio
│   ├── graficos.py          # paleta, tipografía y helpers de estilo
│   └── etiquetas.py         # traducción de géneros, países e idiomas al español
├── dashboard/               # archivo .pbix / .twb / app
├── images/
│   ├── exploratorio/        # gráficos de trabajo
│   └── finales/             # los que van al informe y a la presentación
├── docs/
│   ├── calidad_datos.md     # auditoría y limitaciones (sección clave)
│   ├── decisiones_diseno.md # por qué cada gráfico es ese gráfico
│   ├── informe_ejecutivo.pdf
│   └── presentacion.pdf
├── CLAUDE.md                # plan de trabajo y checklist de rúbrica
└── README.md
```

---

## 3. Fuentes de datos

Dos archivos CSV, 16.000 filas cada uno.

| Archivo | Filas | Columnas | Contenido |
|---|---|---|---|
| `netflix_movies_detailed_up_to_2025.csv` | 16.000 | 18 | Películas: ficha + popularidad + votos + presupuesto y recaudación |
| `netflix_tv_shows_detailed_up_to_2025.csv` | 16.000 | 16 | Series: ficha + popularidad + votos (sin presupuesto ni recaudación) |

**Columnas útiles:** `title`, `director`, `cast`, `country`, `date_added`, `release_year`, `genres`, `language`, `description`, `popularity`, `vote_count`, `vote_average`, y solo en películas `budget` y `revenue`.

### Hallazgos de la auditoría (resumen)

| Hallazgo | Impacto | Decisión |
|---|---|---|
| Exactamente 1.000 títulos por año (2010–2025) en ambos archivos | La serie de tiempo es plana **por construcción del muestreo** | No se grafica evolución del volumen del catálogo. Si se usa el eje temporal, es para % de composición, nunca para conteo |
| `release_year` == año de `date_added` en el 100% de las filas | No se puede medir antigüedad del contenido al incorporarse | Se descarta ese análisis |
| `rating` es copia exacta de `vote_average` | No hay clasificación por edad (TV-MA, PG-13…) pese a que la infografía la sugiere | Se elimina `rating`. El análisis por clasificación etaria se descarta explícitamente |
| `duration` 100% nula en películas; "1 Seasons" en las 16.000 series | El análisis duración vs popularidad es imposible | Se descarta. **No se puede recomendar "contenidos de 90–120 min"** |
| `budget`=0 en 70%, `revenue`=0 en 65% | Solo 3.540 películas (22%) sirven para ROI | El análisis financiero se hace sobre ese subconjunto, declarado como tal |
| `show_id` repetido: 9 dentro de series, 397 entre ambos archivos | Al concatenar se mezclan registros | Se prefija `MOV_` / `TV_` antes de unir |
| `vote_count`=0 en 5,6% de películas y 23% de series | `vote_average` baja hasta 0.0 y ensucia rankings | Umbral mínimo de votos en todo ranking, justificado en `docs/calidad_datos.md` |
| Nulos en series: director 68,5%, description 20%, country 11,2% | Limita análisis por director en series | Análisis de director solo sobre películas |
| Películas y series usan taxonomías de género distintas: solo 8 de 28 etiquetas son comunes | Un ranking de géneros que mezcle ambos tipos compara dos vocabularios y sugiere ausencias falsas | Análisis por género separado por tipo; comparación película vs serie solo sobre los 8 géneros comunes |
| `Unknown` aparece como si fuera un género en 99 series | Inventaría una categoría inexistente en los rankings | Se trata como nulo en la limpieza |

Detalle completo en `docs/calidad_datos.md`.

---

## 4. Cómo reproducir

```bash
# 1. Dejar los CSV originales en data/raw/
# 2. Instalar dependencias
pip install -r requirements.txt

# 3. Ejecutar en orden
jupyter notebook notebooks/01_auditoria_datos.ipynb
jupyter notebook notebooks/02_limpieza_integracion.ipynb   # genera data/processed/catalogo_unificado.csv
jupyter notebook notebooks/03_analisis_exploratorio.ipynb  # exporta a images/

# 4. Abrir dashboard/streamview_dashboard.pbix y refrescar la fuente
#    apuntando a data/processed/catalogo_unificado.csv
```

También se puede regenerar el catálogo sin abrir Jupyter:

```bash
python src/limpieza.py   # escribe data/processed/ desde data/raw/
```

Todo notebook corre de arriba a abajo sin intervención manual. Si uno requiere editar una ruta a mano, está mal y hay que arreglarlo: el entregable 5 exige que el proyecto se pueda ejecutar de nuevo sin modificaciones adicionales.

---

## 5. Entregables de la evaluación

| # | Entregable | Formato | Ubicación |
|---|---|---|---|
| 1 | Informe ejecutivo | PDF | `docs/informe_ejecutivo.pdf` |
| 2 | Dashboard interactivo | .pbix / .twb / app | `dashboard/` |
| 3 | Resumen / presentación ejecutiva | PDF o PPTX | `docs/presentacion.pdf` |
| 4 | Archivos del proyecto documentados | — | todo el repo |
| 5 | Dataset y complementarios | CSV | `data/` |
| 6 | Carpeta con estructura profesional | — | este README |

El plan de trabajo paso a paso y el checklist contra la rúbrica están en **`CLAUDE.md`**.
