"""
Genera `docs/informe_ejecutivo.pdf` desde el contenido HTML y la hoja de estilo.

El informe se arma en HTML + CSS y no a mano en un procesador de texto por dos
razones: es reproducible (se regenera con un comando cuando cambia una cifra) y
la paleta se importa de `src/graficos.py`, de modo que el informe y los gráficos
no pueden desincronizarse de color.

Uso:
    python src/informe/generar.py
"""

from __future__ import annotations

import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(RAIZ / "src"))

from weasyprint import CSS, HTML  # noqa: E402

DIR_INFORME = RAIZ / "src" / "informe"
DIR_IMAGENES = RAIZ / "images" / "finales"
SALIDA = RAIZ / "docs" / "informe_ejecutivo.pdf"


def construir_html() -> str:
    cuerpo = (DIR_INFORME / "contenido.html").read_text(encoding="utf-8")
    # Las rutas de imagen se resuelven contra images/finales/ en el momento de
    # generar: así el HTML fuente no depende de dónde se ejecute el script.
    cuerpo = cuerpo.replace('src="IMG/', f'src="{DIR_IMAGENES.as_uri()}/')
    return (
        "<!DOCTYPE html><html lang='es'><head><meta charset='utf-8'>"
        "<title>Informe ejecutivo · StreamView Analytics</title></head>"
        f"<body>{cuerpo}</body></html>"
    )


def main() -> None:
    faltantes = [
        nombre
        for nombre in (
            "16_genero_nota_peliculas.png",
            "17_paises_nota.png",
            "18_roi_nota_presupuesto.png",
            "19_brecha_oferta_recepcion.png",
            "20_peliculas_vs_series.png",
            "21_recepcion_vs_retorno.png",
        )
        if not (DIR_IMAGENES / nombre).exists()
    ]
    if faltantes:
        raise SystemExit(
            "Faltan gráficos en images/finales/: "
            + ", ".join(faltantes)
            + "\nEjecutar antes notebooks/03_analisis_exploratorio.ipynb."
        )

    SALIDA.parent.mkdir(parents=True, exist_ok=True)
    HTML(string=construir_html(), base_url=str(DIR_INFORME)).write_pdf(
        SALIDA, stylesheets=[CSS(filename=str(DIR_INFORME / "estilo.css"))]
    )
    print(f"→ {SALIDA.relative_to(RAIZ)}  ({SALIDA.stat().st_size / 1024:.0f} KB)")


if __name__ == "__main__":
    main()
