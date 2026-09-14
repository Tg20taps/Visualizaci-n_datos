# Calidad y limitaciones de los datos

> Esta sección va íntegra en el informe ejecutivo, antes del análisis exploratorio.
> Responsable: Matías. Estado: pendiente de completar con la salida de `01_auditoria_datos.ipynb`.

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

## 4. Decisiones de limpieza

| Decisión | Justificación |
|---|---|
| Prefijo `MOV_` / `TV_` en el ID | 397 IDs colisionan entre archivos, 9 duplicados dentro de series |
| Eliminar `rating` | Redundante con `vote_average` |
| Umbral mínimo de `vote_count`: **≥30 en películas, ≥5 en series** (por tipo, no un valor único) | La distribución de votos es muy distinta entre archivos: mediana de 138 en películas vs. mediana de 4 en series. Un umbral único de 30 excluiría 17,4% de las películas pero 75% de las series, vaciando la muestra de series. Se fija un umbral por tipo, cercano al percentil 25 de cada distribución: quedan 13.148 películas y 6.719 series con votación suficiente para ranking. |
| ROI solo sobre 3.540 películas | 70% tiene `budget` = 0 y 65% `revenue` = 0 |
| Análisis por director solo en películas | 68,5% de nulos en series |

## 5. Impacto en las conclusiones

**Qué se puede afirmar con este dataset:** composición y desempeño relativo del catálogo por género, país, idioma y tipo (película/serie), usando `popularity`, `vote_count` y `vote_average` como proxies declarados de recepción de audiencia; y retorno financiero (ROI) sobre el subconjunto de 3.540 películas con `budget` y `revenue` positivos.

**Qué NO se puede afirmar:** nada sobre duración óptima de contenido, nada sobre clasificación por edad, nada sobre evolución del volumen del catálogo en el tiempo, y nada sobre comportamiento real de audiencia (retención, engagement, reproducciones) — el dataset es de catálogo, no de consumo. Cualquier recomendación final debe apoyarse solo en lo primero.
