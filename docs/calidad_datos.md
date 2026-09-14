# Calidad y limitaciones de los datos

> Esta sección va íntegra en el informe ejecutivo, antes del análisis exploratorio.
> Responsable: Matías. Estado: **completa**. Todas las cifras de este documento provienen de la ejecución de `notebooks/01_auditoria_datos.ipynb`.

## 1. Qué prometía el brief vs qué llegó

| Fuente mencionada en el enunciado | ¿Está en el dataset? |
|---|---|
| Usuarios | No |
| Reproducciones | No |
| Suscripciones | No |
| Dispositivos | No |
| Interacciones | No |
| Contenidos (catálogo) | Sí |
| Calificaciones | Sí, agregadas por título (no por usuario) |

**Consecuencia:** el proyecto se acota a desempeño de catálogo. Retención y engagement quedan fuera de alcance y así se declara.

## 2. Tabla de nulos por columna

**Películas (`netflix_movies_detailed_up_to_2025.csv`, 16.000 filas)**

| Columna | % nulos |
|---|---|
| director | 0.82 |
| cast | 1.27 |
| country | 2.91 |
| genres | 0.67 |
| description | 0.82 |
| duration | 100.00 |
| resto de columnas | 0.00 |

**Series (`netflix_tv_shows_detailed_up_to_2025.csv`, 16.000 filas)**

| Columna | % nulos |
|---|---|
| director | 68.53 |
| cast | 7.23 |
| country | 11.23 |
| genres | 6.09 |
| description | 20.04 |
| resto de columnas (incluida duration) | 0.00 |

Fuente: `notebooks/01_auditoria_datos.ipynb`.

## 3. Análisis descartados y por qué

| Análisis sugerido | Motivo del descarte | Evidencia |
|---|---|---|
| Duración vs popularidad | `duration` 100% nula en películas y constante ("1 Seasons") en las 16.000 series | notebook 01, sección "Hallazgo 2" |
| Clasificación por edad | La columna `rating` es copia exacta de `vote_average` (100% de coincidencia en ambos archivos); no hay clasificación etaria | notebook 01, sección "Hallazgo 1" |
| Evolución del volumen en el tiempo | 1.000 títulos exactos por año (2010–2025) en ambos archivos: artefacto del muestreo | notebook 01, sección "Hallazgo 3" |
| Antigüedad del contenido al incorporarse | `release_year` coincide con el año de `date_added` en el 100% de las filas | notebook 01, sección "Hallazgo adicional" |
| Ranking de géneros mezclando películas y series | Los dos tipos usan taxonomías distintas: solo 8 de 28 etiquetas son comunes | notebook 01, sección "Hallazgo 8" |

## 4. Decisiones de limpieza

| Decisión | Justificación |
|---|---|
| Prefijo `MOV_` / `TV_` en el ID | 397 IDs colisionan entre archivos, 9 duplicados dentro de series |
| Eliminar `rating` | Redundante con `vote_average` |
| Umbral mínimo de `vote_count`: **≥30 en películas, ≥5 en series** (por tipo, no un valor único) | El umbral existe para sacar de los rankings la cola de votación anecdótica: el 5,6% de las películas y el 23% de las series tienen `vote_count` = 0, lo que arrastra su `vote_average` a 0.0 y ensucia cualquier orden por nota. El umbral es **por tipo** porque las dos distribuciones no son comparables — mediana de 138 votos en películas contra 4 en series: un umbral único de 30 excluiría el 17,4% de las películas pero el 75,0% de las series, vaciando la muestra. Con el umbral por tipo quedan **13.217 películas (82,6%) y 7.763 series (48,5%)** con votación suficiente para ranking. |
| ROI solo sobre 3.540 películas | 70% tiene `budget` = 0 y 65% `revenue` = 0 |
| Análisis por director solo en películas | 68,5% de nulos en series |
| Análisis por género **separado por tipo**; comparación película vs serie solo sobre los 8 géneros comunes | Películas y series usan vocabularios de género distintos (`Action` + `Adventure` en películas contra `Action & Adventure` en series; `Science Fiction` + `Fantasy` contra `Sci-Fi & Fantasy`; `War` contra `War & Politics`). De 28 etiquetas solo 8 son comunes. Mezclarlas en un mismo ranking compara dos taxonomías y sugiere ausencias falsas — parecería que el catálogo no tiene series de thriller cuando la taxonomía de TV simplemente no usa esa etiqueta. Los 8 géneros comunes cubren 12.952 películas y 13.126 series |
| `Unknown` en `genres` se trata como nulo | Aparece en 99 series como si fuera un género. Es un marcador de dato faltante: contarlo como categoría inventaría un género inexistente en los rankings |

## 5. Impacto en las conclusiones

**Qué se puede afirmar con este dataset:** composición y desempeño relativo del catálogo por género, país, idioma y tipo (película/serie), usando `popularity`, `vote_count` y `vote_average` como proxies declarados de recepción de audiencia; y retorno financiero (ROI) sobre el subconjunto de 3.540 películas con `budget` y `revenue` positivos.

**Qué NO se puede afirmar:** nada sobre duración óptima de contenido, nada sobre clasificación por edad, nada sobre evolución del volumen del catálogo en el tiempo, nada sobre comportamiento real de audiencia (retención, engagement, reproducciones) — el dataset es de catálogo, no de consumo — y nada que compare la presencia de un género entre películas y series fuera de los 8 comunes, porque ahí la diferencia es de vocabulario y no de catálogo. Cualquier recomendación final debe apoyarse solo en lo primero.
