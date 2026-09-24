"""
Genera los tres documentos del proyecto:

- `docs/informe_ejecutivo.pdf` y `docs/presentacion.pdf`, desde HTML + CSS.
- `docs/informe_narrativo.html`, desde `notebooks/04_informe_narrativo.ipynb`:
  el notebook se ejecuta, se exporta sin código y se le agrega el estilo de página.
- `data/processed/cifras_clave.json` y, si hay Node con `pptxgenjs` instalado,
  `docs/presentacion.pptx`: la misma presentación en formato editable, armada
  por `src/informe/presentacion_pptx.js` a partir de ese JSON.

Las dos piezas se arman en HTML + CSS y no a mano en un procesador de texto por dos
razones: es reproducible (se regenera con un comando cuando cambia una cifra) y
la paleta es la misma de `src/graficos.py`, de modo que informe, presentación y
gráficos no pueden desincronizarse de color.

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
SALIDA_PRESENTACION = RAIZ / "docs" / "presentacion.pdf"
NOTEBOOK_NARRATIVO = RAIZ / "notebooks" / "04_informe_narrativo.ipynb"
SALIDA_NARRATIVA = RAIZ / "docs" / "informe_narrativo.html"
SALIDA_CIFRAS = RAIZ / "data" / "processed" / "cifras_clave.json"
SALIDA_PPTX = RAIZ / "docs" / "presentacion.pptx"

# Estilo de página para el HTML exportado. Los componentes ya traen el suyo; esto
# ajusta lo que nbconvert pone alrededor: las celdas de texto quedan con la misma
# tipografía y el mismo ancho de columna que los componentes, y arriba aparece una
# barra de progreso de lectura (solo CSS, atada al scroll de la página).
ESTILO_PAGINA = """
<style>
:root { color-scheme: light; }
html { scroll-behavior: smooth; }
body { background: #fcfcfb !important; margin: 0; }
body::before { content: ""; position: fixed; inset: 0 0 auto 0; height: 3px; z-index: 999;
  background: #2a78d6; transform-origin: left; transform: scaleX(0);
  animation: sv-progreso linear both; animation-timeline: scroll(root); }
@keyframes sv-progreso { to { transform: scaleX(1); } }
@supports not (animation-timeline: scroll()) { body::before { display: none; } }
.jp-Notebook { padding: 0 28px 140px !important; background: transparent !important; }
.jp-Cell { max-width: 920px; margin: 0 auto !important; padding: 0 !important; }
.jp-Cell-inputWrapper, .jp-Cell-outputWrapper { padding: 0 !important; }
.jp-OutputArea-output, .jp-RenderedHTMLCommon { padding: 0 !important; overflow: visible !important; }
.jp-OutputArea-child { display: block !important; }
/* nbconvert deja las salidas como table-cell, que se encoge al ancho mínimo del
   contenido: las tarjetas de KPI caían a 2×2 en media columna. */
.jp-OutputArea-output { display: block !important; width: 100% !important; }
.jp-RenderedMarkdown { font-family: Inter, system-ui, -apple-system, "Segoe UI", sans-serif !important;
  font-size: 18px !important; line-height: 1.65 !important; color: #52514e !important;
  font-feature-settings: "cv11", "ss01"; -webkit-font-smoothing: antialiased; }
.jp-RenderedMarkdown p { margin: 20px 0 !important; max-width: 760px; }
.jp-RenderedMarkdown strong { color: #0b0b0b; font-weight: 650; }
.jp-RenderedMarkdown h2 { font-size: 30px !important; letter-spacing: -.02em; font-weight: 800 !important;
  color: #0b0b0b !important; margin: 20px 0 8px !important; border: none !important; }
.jp-RenderedMarkdown hr { border: none; border-top: 1px solid #e1e0d9; margin: 64px 0 32px; }
.jp-RenderedMarkdown table { font-size: 15px !important; border-collapse: collapse; margin: 18px 0; }
.jp-RenderedMarkdown th { text-align: left; color: #0b0b0b; border-bottom: 1.5px solid #52514e !important; padding: 8px 14px 8px 0 !important; }
.jp-RenderedMarkdown td { border: none !important; border-bottom: 1px solid #e1e0d9 !important; padding: 8px 14px 8px 0 !important; }
.jp-RenderedMarkdown code { font-size: .86em; background: #f2f1ec; padding: 2px 6px; border-radius: 5px; color: #52514e; }
.jp-InternalAnchorLink { display: none !important; }
</style>
"""


def exportar_narrativo() -> None:
    """
    Ejecuta el notebook narrativo, guarda sus salidas y lo exporta a HTML sin código.

    Se ejecuta antes de exportar para que el HTML nunca quede con cifras viejas:
    todas salen de `cifras_clave()` en el momento de generar.
    """
    import nbformat
    from nbconvert import HTMLExporter
    from nbconvert.preprocessors import ExecutePreprocessor

    nb = nbformat.read(NOTEBOOK_NARRATIVO, as_version=4)
    ExecutePreprocessor(timeout=180, kernel_name="python3").preprocess(
        nb, {"metadata": {"path": str(NOTEBOOK_NARRATIVO.parent)}}
    )
    nbformat.write(nb, NOTEBOOK_NARRATIVO)

    exportador = HTMLExporter(template_name="lab")
    exportador.exclude_input = True
    exportador.exclude_input_prompt = True
    exportador.exclude_output_prompt = True
    html, _ = exportador.from_notebook_node(nb)
    from narrativa import CSS_SCROLL

    html = html.replace("</head>", ESTILO_PAGINA + f"<style>{CSS_SCROLL}</style></head>", 1)
    SALIDA_NARRATIVA.write_text(html, encoding="utf-8")
    print(f"→ {SALIDA_NARRATIVA.relative_to(RAIZ)}  ({SALIDA_NARRATIVA.stat().st_size / 1024 / 1024:.1f} MB)")


def exportar_cifras() -> None:
    """
    Escribe las cifras de `cifras_clave()` a JSON para la versión .pptx.

    La .pptx se arma en JavaScript (pptxgenjs); este archivo es el puente para
    que tampoco ahí haya una sola cifra escrita a mano. Se agregan las tres que
    solo citan las láminas: las dos correlaciones de Spearman con el ROI y la
    participación de Estados Unidos en el catálogo de películas.
    """
    import json

    from analisis import cargar_procesado, cifras_clave

    cat, largos = cargar_procesado()
    k = cifras_clave(cat, largos)
    con_roi = cat[cat["roi"].notna()]
    pais = largos["pais"]
    pel_pais = pais[pais["tipo"] == "Película"]
    # Spearman = Pearson sobre rangos. Se calcula así para no depender de scipy.
    rangos = con_roi[["roi", "score_ponderado", "budget"]].rank()
    k["spearman_nota"] = rangos["roi"].corr(rangos["score_ponderado"])
    k["spearman_presupuesto"] = rangos["roi"].corr(rangos["budget"])
    k["eeuu_pct_peliculas"] = (
        pel_pais.loc[pel_pais["pais"] == "United States of America", "show_id"].nunique()
        / k["peliculas"] * 100
    )
    SALIDA_CIFRAS.write_text(
        json.dumps(k, ensure_ascii=False, indent=1, default=float), encoding="utf-8"
    )
    print(f"→ {SALIDA_CIFRAS.relative_to(RAIZ)}")


def exportar_pptx() -> None:
    """Arma la .pptx si hay Node y pptxgenjs; si no, avisa y sigue (es opcional)."""
    import shutil
    import subprocess

    if shutil.which("node") is None:
        print("· presentacion.pptx omitida: no hay Node instalado")
        return
    r = subprocess.run(
        ["node", str(DIR_INFORME / "presentacion_pptx.js")],
        cwd=RAIZ, capture_output=True, text=True,
    )
    if r.returncode != 0:
        print("· presentacion.pptx omitida: " + (r.stderr.strip().splitlines() or ["error"])[-1])
        print("  (instalar con: npm install pptxgenjs)")
        return
    print(f"→ {SALIDA_PPTX.relative_to(RAIZ)}  ({SALIDA_PPTX.stat().st_size / 1024:.0f} KB)")


def construir_html(archivo: str = "contenido.html") -> str:
    cuerpo = (DIR_INFORME / archivo).read_text(encoding="utf-8")
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

    for archivo_html, hoja, salida in (
        ("contenido.html", "estilo.css", SALIDA),
        ("presentacion.html", "estilo_presentacion.css", SALIDA_PRESENTACION),
    ):
        HTML(string=construir_html(archivo_html), base_url=str(DIR_INFORME)).write_pdf(
            salida, stylesheets=[CSS(filename=str(DIR_INFORME / hoja))]
        )
        print(f"→ {salida.relative_to(RAIZ)}  ({salida.stat().st_size / 1024:.0f} KB)")

    exportar_narrativo()
    exportar_cifras()
    exportar_pptx()


if __name__ == "__main__":
    main()
