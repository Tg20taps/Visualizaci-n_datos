"""
Agregaciones del análisis exploratorio.

Viven aquí y no dentro del notebook para que cada cifra que aparece en un
gráfico se pueda recalcular y auditar sin abrir Jupyter, y para que el informe y
el dashboard partan exactamente de los mismos números.

Todas las funciones aplican el umbral de votos por tipo (`votos_suficientes`):
ningún ranking por nota incluye títulos con votación insuficiente.
"""

from __future__ import annotations

from pathlib import Path

import pandas as pd

from limpieza import DIR_PROCESSED, GENEROS_COMPARTIDOS


def cargar_procesado(dir_processed: Path | str = DIR_PROCESSED):
    """Lee el catálogo unificado y las tablas largas ya generadas por el notebook 02."""
    dir_processed = Path(dir_processed)
    catalogo = pd.read_csv(dir_processed / "catalogo_unificado.csv")
    largos = {
        nombre: pd.read_csv(dir_processed / f"catalogo_{nombre}.csv")
        for nombre in ("genero", "pais", "actor")
    }
    return catalogo, largos


def _unir(tabla_larga: pd.DataFrame, catalogo: pd.DataFrame) -> pd.DataFrame:
    metricas = ["show_id", "score_ponderado", "votos_suficientes", "popularity", "roi", "budget"]
    return tabla_larga.merge(catalogo[metricas], on="show_id")


def desempeno_por_dimension(
    tabla_larga: pd.DataFrame,
    catalogo: pd.DataFrame,
    columna: str,
    tipo: str | None = None,
    minimo_titulos: int = 200,
) -> pd.DataFrame:
    """
    Volumen y nota media ponderada por género o país.

    `minimo_titulos` evita el ranking engañoso: una categoría con 12 títulos
    puede encabezar cualquier promedio por azar. Es el mismo criterio que el
    umbral de votos, un nivel más arriba.
    """
    datos = _unir(tabla_larga, catalogo)
    datos = datos[datos["votos_suficientes"]]
    if tipo:
        datos = datos[datos["tipo"] == tipo]

    resumen = (
        datos.groupby(columna)
        .agg(titulos=("show_id", "nunique"), nota=("score_ponderado", "mean"))
        .query("titulos >= @minimo_titulos")
        .sort_values("nota", ascending=False)
    )
    return resumen


def clasificar_brecha(resumen: pd.DataFrame) -> pd.DataFrame:
    """
    Marca cada categoría según el cruce volumen × nota, cortando por la mediana.

    La mediana y no la media: con Drama en 5.737 títulos, la media de volumen se
    desplaza y casi todo cae del mismo lado. La mediana parte el conjunto en dos
    mitades reales.

    - `sobreinvertido`: volumen por encima de la mediana, nota por debajo.
    - `oportunidad`:    volumen por debajo de la mediana, nota por encima.
    """
    resumen = resumen.copy()
    corte_volumen = resumen["titulos"].median()
    corte_nota = resumen["nota"].median()

    def etiqueta(fila):
        if fila["titulos"] > corte_volumen and fila["nota"] < corte_nota:
            return "sobreinvertido"
        if fila["titulos"] < corte_volumen and fila["nota"] > corte_nota:
            return "oportunidad"
        return "neutro"

    resumen["segmento"] = resumen.apply(etiqueta, axis=1)
    resumen.attrs["corte_volumen"] = corte_volumen
    resumen.attrs["corte_nota"] = corte_nota
    return resumen


def roi_por_banda_de_nota(catalogo: pd.DataFrame) -> pd.DataFrame:
    """
    ROI mediano por tramo de nota, sobre las 3.540 películas con datos financieros.

    Mediano y no medio: el ROI tiene una cola larguísima (hay títulos que
    multiplican por miles una inversión mínima) y la media queda en 781, una
    cifra que no describe a ninguna película real.
    """
    roi = catalogo[catalogo["roi"].notna()].copy()
    roi["banda"] = pd.cut(
        roi["score_ponderado"],
        [0, 5.5, 6.0, 6.5, 7.0, 10],
        labels=["< 5,5", "5,5 – 6,0", "6,0 – 6,5", "6,5 – 7,0", "> 7,0"],
    )
    return (
        roi.groupby("banda", observed=True)
        .agg(titulos=("roi", "size"), roi_mediano=("roi", "median"))
        .reset_index()
    )


def roi_por_cuartil_de_presupuesto(catalogo: pd.DataFrame) -> pd.DataFrame:
    """
    ROI mediano por cuartil de presupuesto, mismo subconjunto y misma unidad.

    Es el control del gráfico anterior: si el retorno subiera también con el
    presupuesto, la recomendación sería "gastar más", no "apuntar a la nota".
    """
    roi = catalogo[catalogo["roi"].notna()].copy()
    roi["cuartil"] = pd.qcut(roi["budget"], 4, labels=["Q1 (menor)", "Q2", "Q3", "Q4 (mayor)"])
    return (
        roi.groupby("cuartil", observed=True)
        .agg(titulos=("roi", "size"), roi_mediano=("roi", "median"))
        .reset_index()
    )


def comparar_tipos_en_generos_comunes(
    genero_largo: pd.DataFrame, catalogo: pd.DataFrame, minimo_por_tipo: int = 100
) -> pd.DataFrame:
    """
    Nota media por género, película contra serie, SOLO sobre los géneros comunes.

    Restringido a `GENEROS_COMPARTIDOS` porque los dos tipos usan taxonomías
    distintas: comparar `Thriller` (solo películas) con `Action & Adventure`
    (solo series) sería comparar dos vocabularios, no dos catálogos.

    `minimo_por_tipo` exige un mínimo de títulos **en ambos lados**: sin él,
    Western entra a la comparación con 26 series, y una diferencia calculada
    sobre 26 títulos no se distingue del ruido. Con el corte en 100 quedan 7 de
    los 8 géneros comunes.
    """
    datos = _unir(genero_largo, catalogo)
    datos = datos[datos["votos_suficientes"] & datos["genero"].isin(GENEROS_COMPARTIDOS)]

    tabla = (
        datos.groupby(["genero", "tipo"])
        .agg(titulos=("show_id", "nunique"), nota=("score_ponderado", "mean"))
        .unstack("tipo")
    )
    tabla.columns = [f"{a}_{b}" for a, b in tabla.columns]
    tabla = tabla[
        (tabla["titulos_Película"] >= minimo_por_tipo) & (tabla["titulos_Serie"] >= minimo_por_tipo)
    ]
    tabla["brecha"] = tabla["nota_Serie"] - tabla["nota_Película"]
    return tabla.sort_values("brecha")


def retorno_y_nota_por_genero(
    genero_largo: pd.DataFrame, catalogo: pd.DataFrame, minimo_titulos: int = 80
) -> pd.DataFrame:
    """
    Cruce de recepción y retorno por género, sobre las películas con datos financieros.

    Es el cruce que decide inversión: el volumen dice qué se produce y la nota
    qué se recibe bien, pero solo aquí se ve si un género además devuelve la
    plata. Los cuatro cuadrantes tienen lectura de negocio propia:

      - nota alta + ROI alto → priorizar
      - nota alta + ROI bajo → prestigio de catálogo, no caso financiero
      - nota baja + ROI alto → eficiencia de costo (género barato de producir)
      - nota baja + ROI bajo → revisar

    `minimo_titulos` es más bajo que en el resto del proyecto (80 y no 200)
    porque el subconjunto financiero es de 3.540 películas y no de 13.217:
    exigir 200 dejaría fuera géneros que sí tienen una mediana informativa.
    """
    datos = _unir(genero_largo, catalogo)
    datos = datos[(datos["tipo"] == "Película") & datos["votos_suficientes"] & datos["roi"].notna()]

    resumen = (
        datos.groupby("genero")
        .agg(
            titulos=("show_id", "nunique"),
            nota=("score_ponderado", "mean"),
            roi=("roi", "median"),
            presupuesto=("budget", "median"),
        )
        .query("titulos >= @minimo_titulos")
    )

    corte_roi, corte_nota = resumen["roi"].median(), resumen["nota"].median()

    def segmento(fila):
        if fila["nota"] >= corte_nota:
            return "priorizar" if fila["roi"] >= corte_roi else "prestigio"
        return "eficiencia" if fila["roi"] >= corte_roi else "revisar"

    resumen["segmento"] = resumen.apply(segmento, axis=1)
    resumen.attrs["corte_roi"] = corte_roi
    resumen.attrs["corte_nota"] = corte_nota
    return resumen.sort_values("roi", ascending=False)
