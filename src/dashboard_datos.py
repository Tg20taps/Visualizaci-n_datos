"""
Genera el payload de datos que consume `dashboard/streamview_dashboard.html`.

El dashboard filtra **en el navegador**, así que necesita los títulos a nivel de
fila y no agregados: un agregado precalculado no se puede volver a cortar por
país sin volver al origen. Para que eso quepa en un archivo que se abre de un
doble clic, los datos van en columnas paralelas y con índices en vez de texto
repetido — 31.991 títulos ocupan así una fracción de lo que ocuparían como lista
de objetos JSON.

Uso:
    python src/dashboard_datos.py
"""

from __future__ import annotations

import json
from pathlib import Path

import pandas as pd

RAIZ = Path(__file__).resolve().parent.parent
SALIDA = RAIZ / "dashboard" / "datos.js"

import sys

sys.path.insert(0, str(RAIZ / "src"))

from analisis import cargar_procesado, roi_por_banda_de_nota  # noqa: E402
from etiquetas import GENEROS, IDIOMAS, PAISES  # noqa: E402
from limpieza import GENEROS_COMPARTIDOS, UMBRAL_VOTOS  # noqa: E402


def _indexar(valores: list[str]) -> tuple[list[str], dict[str, int]]:
    """Diccionario de etiquetas ordenado, más el mapa valor → índice."""
    unicos = sorted(set(valores))
    return unicos, {v: i for i, v in enumerate(unicos)}


def construir() -> dict:
    catalogo, largos = cargar_procesado()
    catalogo = catalogo.sort_values("show_id").reset_index(drop=True)

    # Diccionarios: el dashboard muestra la etiqueta en español y guarda el índice.
    generos_crudos, idx_genero = _indexar(largos["genero"]["genero"].tolist())
    paises_crudos, idx_pais = _indexar(largos["pais"]["pais"].tolist())
    idiomas_crudos, idx_idioma = _indexar(catalogo["language"].dropna().tolist())

    por_titulo_genero = largos["genero"].groupby("show_id")["genero"].apply(list)
    por_titulo_pais = largos["pais"].groupby("show_id")["pais"].apply(list)

    # La banda de nota se calcula AQUÍ, con el mismo pd.cut que usa el informe, y
    # viaja precalculada. Si el navegador la recalculara sobre la nota redondeada
    # a dos decimales, los títulos que caen justo en un corte cambiarían de banda
    # y el dashboard mostraría un ROI distinto al del informe por unos pocos
    # títulos: exactamente el tipo de discrepancia que este proyecto no se puede
    # permitir.
    bandas = pd.cut(
        catalogo["score_ponderado"],
        [0, 5.5, 6, 6.5, 7, 10],
        labels=["< 5,5", "5,5 – 6,0", "6,0 – 6,5", "6,5 – 7,0", "> 7,0"],
    )
    codigos = bandas.cat.codes.tolist()

    filas = []
    for pos, fila in enumerate(catalogo.itertuples(index=False)):
        generos = [idx_genero[g] for g in por_titulo_genero.get(fila.show_id, [])]
        paises = [idx_pais[p] for p in por_titulo_pais.get(fila.show_id, [])]
        filas.append(
            {
                "t": fila.title,
                "p": 0 if fila.tipo == "Película" else 1,
                "a": int(fila.release_year) - 2010,
                "i": idx_idioma.get(fila.language, -1),
                "g": generos,
                "c": paises,
                # Nota ponderada con dos decimales: el dashboard no necesita más
                # precisión de la que muestra.
                "n": round(float(fila.score_ponderado), 2),
                "v": 1 if bool(fila.votos_suficientes) else 0,
                "r": None if pd.isna(fila.roi) else round(float(fila.roi), 3),
                "b": None if pd.isna(fila.budget) or fila.budget <= 0 else int(fila.budget),
                "z": int(codigos[pos]),  # banda de nota, precalculada
            }
        )

    return {
        "generado": "catálogo unificado 2010–2025",
        "etiquetas": {
            "genero": [GENEROS.get(g, g) for g in generos_crudos],
            "pais": [PAISES.get(p, p) for p in paises_crudos],
            "idioma": [IDIOMAS.get(i, i) for i in idiomas_crudos],
            "tipo": ["Película", "Serie"],
        },
        "generosCompartidos": [
            idx_genero[g] for g in GENEROS_COMPARTIDOS if g in idx_genero
        ],
        "umbralVotos": {"Película": UMBRAL_VOTOS["Película"], "Serie": UMBRAL_VOTOS["Serie"]},
        "bandasNota": list(bandas.cat.categories),
        "anioBase": 2010,
        "titulos": filas,
    }


def main() -> None:
    datos = construir()
    SALIDA.parent.mkdir(parents=True, exist_ok=True)
    # Se emite como .js y no .json para que el dashboard funcione abriéndolo de un
    # doble clic: un fetch() a un archivo local lo bloquea la política de origen
    # del navegador, una etiqueta <script> no.
    texto = json.dumps(datos, ensure_ascii=False, separators=(",", ":"))
    SALIDA.write_text(f"window.DATOS = {texto};\n", encoding="utf-8")
    print(f"→ {SALIDA.relative_to(RAIZ)}  ({SALIDA.stat().st_size / 1024 / 1024:.1f} MB)")
    print(f"   {len(datos['titulos']):,} títulos · "
          f"{len(datos['etiquetas']['genero'])} géneros · "
          f"{len(datos['etiquetas']['pais'])} países · "
          f"{len(datos['etiquetas']['idioma'])} idiomas")


if __name__ == "__main__":
    main()
