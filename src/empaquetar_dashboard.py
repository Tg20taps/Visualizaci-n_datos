"""
Empaqueta el dashboard en UN solo archivo HTML.

`dashboard/streamview_dashboard.html` necesita a su lado estilo.css, los tres
.js y la carpeta fuentes/. Eso es cómodo para desarrollar, pero frágil para
compartir: si alguien copia solo el .html, se abre en blanco. Este script mete
todo adentro (CSS, datos, código y las fuentes en base64) y escribe
`dashboard/streamview_dashboard_un_archivo.html`, que funciona suelto: se puede
mandar por correo o por chat y abrir con doble clic.

Uso:
    python src/empaquetar_dashboard.py
"""

from __future__ import annotations

import base64
import re
from pathlib import Path

DIR = Path(__file__).resolve().parent.parent / "dashboard"
SALIDA = DIR / "streamview_dashboard_un_archivo.html"


def _css() -> str:
    css = (DIR / "estilo.css").read_text(encoding="utf-8")

    def a_base64(m: re.Match) -> str:
        datos = base64.b64encode((DIR / m.group(1)).read_bytes()).decode()
        return f"url(data:font/woff2;base64,{datos})"

    return re.sub(r"url\((fuentes/[^)]+\.woff2)\)", a_base64, css)


def _js(nombre: str) -> str:
    # "</" dentro de un <script> en línea cerraría la etiqueta antes de tiempo.
    return (DIR / nombre).read_text(encoding="utf-8").replace("</", "<\\/")


def main() -> None:
    html = (DIR / "streamview_dashboard.html").read_text(encoding="utf-8")
    html = html.replace('<link rel="stylesheet" href="estilo.css">', f"<style>\n{_css()}\n</style>")
    for nombre in ("datos.js", "graficos.js", "app.js"):
        etiqueta = f'<script src="{nombre}"></script>'
        assert etiqueta in html, etiqueta
        html = html.replace(etiqueta, f"<script>\n{_js(nombre)}\n</script>")
    SALIDA.write_text(html, encoding="utf-8")
    print(f"→ dashboard/{SALIDA.name}  ({SALIDA.stat().st_size / 1024 / 1024:.1f} MB)")


if __name__ == "__main__":
    main()
