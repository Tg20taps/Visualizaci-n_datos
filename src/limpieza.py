"""
Carga, limpieza e integración del catálogo de StreamView Analytics.

Este módulo es la única fuente de verdad de las transformaciones. Los notebooks
importan estas funciones: no se copia lógica dentro de los notebooks, para que
el pipeline sea reproducible de punta a punta (entregable 5).

Todas las decisiones implementadas aquí están justificadas en
`docs/calidad_datos.md`, sección 4, con la evidencia en
`notebooks/01_auditoria_datos.ipynb`.

Uso típico:

    from limpieza import construir_catalogo
    catalogo, largos = construir_catalogo()
"""

from __future__ import annotations

from pathlib import Path

import numpy as np
import pandas as pd

# Raíz del proyecto, resuelta desde la ubicación de este archivo. Así el módulo
# funciona igual desde `notebooks/`, desde la raíz o desde un script suelto:
# ninguna ruta se edita a mano (requisito de reproducibilidad del entregable 5).
RAIZ = Path(__file__).resolve().parent.parent
DIR_RAW = RAIZ / "data" / "raw"
DIR_PROCESSED = RAIZ / "data" / "processed"

ARCHIVO_PELICULAS = "netflix_movies_detailed_up_to_2025.csv"
ARCHIVO_SERIES = "netflix_tv_shows_detailed_up_to_2025.csv"

# Umbral mínimo de votos para que un título entre en un ranking por nota.
# Es POR TIPO, no un valor único: la mediana de votos es 138 en películas y 4 en
# series, así que un umbral común de 30 dejaría fuera el 75% de las series.
# Justificación completa en docs/calidad_datos.md, sección 4.
UMBRAL_VOTOS = {"Película": 30, "Serie": 5}

# Columnas que se eliminan en la limpieza. Se documenta el motivo aquí y no en
# un comentario suelto, para que la razón viaje junto al código.
COLUMNAS_ELIMINADAS = {
    # `rating` no es clasificación por edad: es una copia exacta de
    # `vote_average` en el 100% de las filas de ambos archivos. Mantenerla
    # invitaría a un análisis de clasificación etaria que el dataset no soporta.
    "rating": "copia exacta de vote_average (100% de coincidencia)",
    # `duration` es 100% nula en películas y constante ("1 Seasons") en las
    # 16.000 series: cero varianza en ambos casos, no es analizable.
    "duration": "100% nula en películas y constante en series",
}

SEPARADOR_MULTIVALOR = ", "

# Marcador de "sin dato" que el origen escribe como si fuera un género real.
# Se trata como nulo, no como categoría.
VALORES_NULOS = {"Unknown", "unknown", ""}

# Películas y series NO comparten vocabulario de géneros: el origen usa dos
# taxonomías distintas (28 etiquetas en total, solo 8 comunes). Las películas
# tienen `Action` y `Adventure` por separado; las series las agrupan en
# `Action & Adventure`. Lo mismo con `Science Fiction`/`Fantasy` contra
# `Sci-Fi & Fantasy`, y `War` contra `War & Politics`.
#
# Consecuencia: un gráfico de géneros que mezcle ambos tipos compara dos
# vocabularios y sugiere ausencias que no existen (parecería que no hay series
# de thriller, cuando en realidad la taxonomía de TV no usa esa etiqueta).
# Por eso: los análisis por género se hacen POR TIPO, y toda comparación
# película vs serie se restringe a estos 8 géneros comunes.
GENEROS_COMPARTIDOS = [
    "Animation",
    "Comedy",
    "Crime",
    "Documentary",
    "Drama",
    "Family",
    "Mystery",
    "Western",
]


def cargar_datos(dir_raw: Path | str = DIR_RAW) -> tuple[pd.DataFrame, pd.DataFrame]:
    """Lee los dos CSV crudos. No modifica `data/raw/` bajo ninguna circunstancia."""
    dir_raw = Path(dir_raw)
    peliculas = pd.read_csv(dir_raw / ARCHIVO_PELICULAS)
    series = pd.read_csv(dir_raw / ARCHIVO_SERIES)
    return peliculas, series


def prefijar_ids(df: pd.DataFrame, prefijo: str) -> pd.DataFrame:
    """
    Antepone `MOV_` / `TV_` a `show_id`.

    Sin esto, al concatenar se mezclan 397 registros: hay 397 `show_id` que
    existen en ambos archivos apuntando a títulos distintos, más 9 duplicados
    internos en series.
    """
    df = df.copy()
    df["show_id"] = prefijo + df["show_id"].astype(str)
    return df


def eliminar_columnas_inservibles(df: pd.DataFrame) -> pd.DataFrame:
    """Elimina `rating` y `duration`. El motivo de cada una está en COLUMNAS_ELIMINADAS."""
    presentes = [c for c in COLUMNAS_ELIMINADAS if c in df.columns]
    return df.drop(columns=presentes)


def agregar_tipo(df: pd.DataFrame) -> pd.DataFrame:
    """
    Normaliza la columna `type` (`Movie` / `TV Show`) a `tipo` en español.

    No crea información nueva: traduce la que ya existe, para que los ejes y
    leyendas de todos los visuales queden en el idioma de la audiencia.
    """
    df = df.copy()
    df["tipo"] = df["type"].map({"Movie": "Película", "TV Show": "Serie"})
    return df.drop(columns=["type"])


def unificar(peliculas: pd.DataFrame, series: pd.DataFrame) -> pd.DataFrame:
    """Aplica prefijo, limpieza y tipo a cada archivo y los concatena en una sola tabla."""
    partes = []
    for df, prefijo in ((peliculas, "MOV_"), (series, "TV_")):
        df = prefijar_ids(df, prefijo)
        df = eliminar_columnas_inservibles(df)
        df = agregar_tipo(df)
        partes.append(df)

    catalogo = pd.concat(partes, ignore_index=True, sort=False)

    # Los 9 duplicados internos de series sobreviven al prefijo (mismo id dentro
    # del mismo archivo), así que se resuelven aquí, después de concatenar.
    catalogo = catalogo.drop_duplicates(subset="show_id", keep="first").reset_index(drop=True)
    return catalogo


def explotar(df: pd.DataFrame, columna: str, nombre_salida: str | None = None) -> pd.DataFrame:
    """
    Pasa una columna multivalor a formato largo: una fila por título-valor.

    Necesario para agregar por género, país o reparto: el 26% de las películas
    lista más de un país y prácticamente todos los títulos listan varios géneros.
    Sumar sobre la columna cruda contaría "United States, France" como una
    categoría propia.

    Los marcadores de VALORES_NULOS (`Unknown`) se descartan: son ausencia de
    dato, no una categoría.

    Devuelve una tabla aparte; la tabla principal no se toca.
    """
    nombre_salida = nombre_salida or columna
    largo = (
        df[["show_id", "tipo", columna]]
        .dropna(subset=[columna])
        .assign(**{nombre_salida: lambda d: d[columna].str.split(SEPARADOR_MULTIVALOR)})
        .explode(nombre_salida)
    )
    largo[nombre_salida] = largo[nombre_salida].str.strip()
    largo = largo[~largo[nombre_salida].isin(VALORES_NULOS)]

    columnas = ["show_id", "tipo", nombre_salida]
    return largo[columnas].reset_index(drop=True)


def agregar_metricas(df: pd.DataFrame) -> pd.DataFrame:
    """
    Agrega `roi`, `votos_suficientes` y `score_ponderado`.

    - `roi = revenue / budget`, y solo donde ambos son > 0. Es un multiplicador
      de retorno: 1.0 es punto de equilibrio, 3.0 es triplicar lo invertido.
      Queda nulo en el 78% de las películas y en todas las series, que no traen
      datos financieros. Ese subconjunto (3.540 películas) se declara en el
      título de cualquier gráfico que lo use.

    - `score_ponderado` es la fórmula tipo IMDb:

          WR = (v / (v + m)) * R + (m / (v + m)) * C

      donde v son los votos del título, R su nota, m el umbral de su tipo y C la
      nota media de los títulos de ese tipo que superan el umbral. Arrastra hacia
      la media a los títulos con pocos votos, de modo que un 10.0 con 3 votos no
      le gane a un 8.4 con 12.000. Sin esto, todo ranking por nota queda
      encabezado por ruido.
    """
    df = df.copy()

    financiero_valido = (df.get("budget", pd.Series(0, index=df.index)) > 0) & (
        df.get("revenue", pd.Series(0, index=df.index)) > 0
    )
    df["roi"] = np.where(financiero_valido, df["revenue"] / df["budget"], np.nan)

    df["umbral_votos"] = df["tipo"].map(UMBRAL_VOTOS)
    df["votos_suficientes"] = df["vote_count"] >= df["umbral_votos"]

    # C se calcula solo sobre los títulos que superan el umbral de su tipo: si se
    # calculara sobre todo el catálogo, el 23% de series con 0 votos hundiría la
    # media hacia la que se arrastra a los demás.
    media_por_tipo = (
        df[df["votos_suficientes"]].groupby("tipo")["vote_average"].mean().rename("media_tipo")
    )
    df = df.join(media_por_tipo, on="tipo")

    v, m, R, C = df["vote_count"], df["umbral_votos"], df["vote_average"], df["media_tipo"]
    df["score_ponderado"] = (v / (v + m)) * R + (m / (v + m)) * C

    return df.drop(columns=["media_tipo"])


def construir_catalogo(
    dir_raw: Path | str = DIR_RAW,
) -> tuple[pd.DataFrame, dict[str, pd.DataFrame]]:
    """
    Pipeline completo: crudo → catálogo unificado + tablas largas.

    Devuelve `(catalogo, largos)`, donde `largos` tiene las claves
    `genero`, `pais` y `actor`.
    """
    peliculas, series = cargar_datos(dir_raw)
    catalogo = unificar(peliculas, series)
    catalogo = agregar_metricas(catalogo)

    largos = {
        "genero": explotar(catalogo, "genres", "genero"),
        "pais": explotar(catalogo, "country", "pais"),
        "actor": explotar(catalogo, "cast", "actor"),
    }
    return catalogo, largos


def exportar(
    catalogo: pd.DataFrame,
    largos: dict[str, pd.DataFrame],
    dir_processed: Path | str = DIR_PROCESSED,
) -> dict[str, Path]:
    """Escribe el catálogo unificado y las tablas largas en `data/processed/`."""
    dir_processed = Path(dir_processed)
    dir_processed.mkdir(parents=True, exist_ok=True)

    rutas = {"catalogo": dir_processed / "catalogo_unificado.csv"}
    catalogo.to_csv(rutas["catalogo"], index=False)

    for nombre, tabla in largos.items():
        ruta = dir_processed / f"catalogo_{nombre}.csv"
        tabla.to_csv(ruta, index=False)
        rutas[nombre] = ruta

    return rutas


if __name__ == "__main__":
    catalogo, largos = construir_catalogo()
    rutas = exportar(catalogo, largos)
    print(f"catálogo unificado: {catalogo.shape[0]:,} filas × {catalogo.shape[1]} columnas")
    for nombre, ruta in rutas.items():
        print(f"  {nombre:10s} → {ruta.relative_to(RAIZ)}")
