"""
Componentes visuales para contar la historia del proyecto en un notebook.

El notebook narrativo (`notebooks/04_informe_narrativo.ipynb`) es lo que se
presenta: tiene que leerse como un informe, no como código. Estos componentes
convierten cifras en momentos visuales —números que cuentan, conjuntos de íconos,
barras que crecen— y mantienen la misma paleta y tipografía que los gráficos, el
informe PDF y el dashboard.

Tres reglas de diseño que el módulo hace cumplir:

1. **Solo CSS, sin JavaScript.** Las animaciones funcionan igual en JupyterLab,
   VS Code y el HTML exportado, sin depender de que el entorno confíe en scripts.

2. **En el HTML exportado, las animaciones se disparan al hacer scroll**: un
   número cuenta cuando entra a la pantalla, que es cuando el público lo mira.
   Dentro de Jupyter animan por tiempo, que es lo seguro ahí (ver `CSS_SCROLL`).

3. **El valor final siempre es visible.** Cada número va escrito como texto
   real; la animación es una capa encima. Si el visor elimina los estilos (GitHub),
   se lee el número; si el usuario pidió reducir el movimiento, no se anima nada.

Uso típico, dentro del notebook:

    from narrativa import estilo, portada, capitulo, kpis, cifra
    estilo()                      # una vez, al principio: tipografía y estilos
    portada("Título", "Bajada")
"""

from __future__ import annotations

import base64
import re
from html import escape
from pathlib import Path

from graficos import ACENTO, CATEGORICA, FONDO, GRILLA, TINTA, TINTA_SECUNDARIA, TINTA_TENUE

RAIZ = Path(__file__).resolve().parent.parent
DIR_FUENTES = RAIZ / "assets" / "fuentes"

TONOS = {
    "azul": CATEGORICA[0],
    "naranja": CATEGORICA[1],
    "verde": ACENTO["oportunidad"],
    "rojo": ACENTO["sobreinvertido"],
    "gris": ACENTO["neutro"],
    "tinta": TINTA,
}

# ──────────────────────────────────────────────────────────────────────────────
# Hoja de estilo
# ──────────────────────────────────────────────────────────────────────────────

CSS = """
@property --sv-v { syntax: '<integer>'; initial-value: 0; inherits: false; }
@counter-style sv-pad2 { system: extends decimal; pad: 2 "0"; }
@counter-style sv-pad3 { system: extends decimal; pad: 3 "0"; }

.sv { --azul:%(azul)s; --naranja:%(naranja)s; --verde:%(verde)s; --rojo:%(rojo)s;
      --tinta:%(tinta)s; --tinta2:%(tinta2)s; --tenue:%(tenue)s; --grilla:%(grilla)s;
      --fondo:%(fondo)s; --plano:#f4f3ee;
      font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
      font-feature-settings: "cv11", "ss01"; color: var(--tinta2);
      font-size: 16px; line-height: 1.6; max-width: 920px; margin: 0 auto;
      -webkit-font-smoothing: antialiased; }
.sv * { box-sizing: border-box; }
.sv b, .sv strong { color: var(--tinta); font-weight: 650; }
.sv .num-t { font-variant-numeric: tabular-nums; }

/* ── Entrada al hacer scroll ─────────────────────────────────────────────── */
.sv .sv-rev { animation: sv-sube .9s cubic-bezier(.16,.8,.24,1) both;
              animation-delay: calc(var(--sv-i, 0) * 110ms); }
@keyframes sv-sube { from { opacity: 0; transform: translateY(18px); } }

/* ── Números que cuentan ─────────────────────────────────────────────────── */
.sv .sv-n { position: relative; display: inline-block; -webkit-text-fill-color: transparent;
            counter-reset: svv var(--sv-v); font-variant-numeric: tabular-nums;
            animation: sv-cuenta 1.8s cubic-bezier(.16,.8,.24,1) both;
            animation-delay: calc(var(--sv-i, 0) * 110ms); }
.sv .sv-n::after { content: counter(svv); position: absolute; right: 0; top: 0;
                   -webkit-text-fill-color: currentColor; }
.sv .sv-n.sv-n2::after { content: counter(svv, sv-pad2); }
.sv .sv-n.sv-n3::after { content: counter(svv, sv-pad3); }
@keyframes sv-cuenta { from { --sv-v: 0; } }

@media (prefers-reduced-motion: reduce) {
  .sv .sv-rev, .sv .sv-n, .sv .sv-ico i, .sv .sv-barra b, .sv .sv-rayita { animation: none !important; }
}

/* ── Portada ─────────────────────────────────────────────────────────────── */
.sv-portada { padding: 72px 0 56px; min-height: 72vh; display: flex; flex-direction: column; justify-content: center; }
.sv-ceja { font-size: 12.5px; letter-spacing: .18em; text-transform: uppercase; font-weight: 700; color: var(--azul); }
.sv-portada h1 { font-size: clamp(34px, 5.2vw, 56px); line-height: 1.06; letter-spacing: -.028em;
                 font-weight: 800; color: var(--tinta); margin: 18px 0 0; }
.sv-portada h1 em { font-style: normal; color: var(--azul); }
.sv-rayita { height: 4px; width: 88px; border-radius: 2px; background: var(--azul); margin: 30px 0 26px;
             transform-origin: left; animation: sv-raya 1.1s cubic-bezier(.16,.8,.24,1) both; }
@keyframes sv-raya { from { transform: scaleX(0); } }
.sv-portada .sv-bajada { font-size: 20px; line-height: 1.5; color: var(--tinta2); max-width: 680px; margin: 0; }
.sv-meta { display: flex; flex-wrap: wrap; gap: 8px 22px; margin-top: 38px; font-size: 14px; color: var(--tenue); }
.sv-meta b { color: var(--tinta); font-weight: 600; }
.sv-chip { display: inline-flex; align-items: center; gap: 7px; padding: 5px 12px; border-radius: 999px;
           background: #fff; border: 1px solid rgba(11,11,11,.09); font-size: 13px; color: var(--tinta2); }

/* ── Mapa de la historia ─────────────────────────────────────────────────── */
.sv-mapa { display: grid; grid-template-columns: repeat(var(--sv-cols), minmax(0,1fr)); gap: 0; margin: 8px 0 36px; counter-reset: paso; }
.sv-mapa div { position: relative; padding: 34px 10px 0 0; font-size: 13.5px; line-height: 1.35; color: var(--tenue); }
.sv-mapa div::before { content: ""; position: absolute; top: 12px; left: 0; right: 0; height: 2px; background: var(--grilla); }
.sv-mapa div::after { counter-increment: paso; content: counter(paso); position: absolute; top: 0; left: 0;
                      width: 26px; height: 26px; border-radius: 50%%; background: #fff; border: 2px solid var(--grilla);
                      font-size: 12px; font-weight: 700; display: grid; place-items: center; color: var(--tenue); }
.sv-mapa div.hecho::before, .sv-mapa div.actual::before { background: var(--azul); }
.sv-mapa div.hecho::after { border-color: var(--azul); color: var(--azul); }
.sv-mapa div.actual { color: var(--tinta); font-weight: 650; }
.sv-mapa div.actual::after { background: var(--azul); border-color: var(--azul); color: #fff;
                             box-shadow: 0 0 0 5px rgba(42,120,214,.16); }

/* ── Capítulo ────────────────────────────────────────────────────────────── */
.sv-cap { min-height: 46vh; display: flex; flex-direction: column; justify-content: center;
          padding: 64px 0 28px; border-top: 1px solid var(--grilla); margin-top: 40px; position: relative; }
.sv-cap .sv-cap-num { font-size: clamp(88px, 13vw, 150px); line-height: .8; font-weight: 800; letter-spacing: -.05em;
                      color: rgba(42,120,214,.10); position: absolute; right: 0; top: 46px; }
.sv-cap h2 { font-size: clamp(28px, 3.8vw, 40px); line-height: 1.12; letter-spacing: -.02em; font-weight: 800;
             color: var(--tinta); margin: 14px 0 16px; max-width: 760px; }
.sv-cap .sv-pregunta { font-size: 19px; color: var(--tinta2); max-width: 680px; margin: 0;
                       padding-left: 16px; border-left: 3px solid var(--azul); }

/* ── KPIs ────────────────────────────────────────────────────────────────── */
.sv-kpis { display: grid; grid-template-columns: repeat(auto-fit, minmax(188px, 1fr)); gap: 14px; margin: 26px 0; }
.sv-kpi { background: #fff; border-radius: 14px; padding: 20px 20px 18px; border: 1px solid rgba(11,11,11,.07);
          box-shadow: 0 1px 2px rgba(11,11,11,.04), 0 8px 24px -12px rgba(11,11,11,.12); border-top: 3px solid var(--k, var(--azul)); }
.sv-kpi .v { font-size: 38px; font-weight: 800; letter-spacing: -.03em; color: var(--tinta); line-height: 1; }
.sv-kpi .r { font-size: 14px; color: var(--tinta2); margin-top: 10px; font-weight: 550; }
.sv-kpi .b { font-size: 12.5px; color: var(--tenue); margin-top: 4px; line-height: 1.4; }

/* ── Cifra protagonista ──────────────────────────────────────────────────── */
.sv-cifra { display: grid; grid-template-columns: auto 1fr; gap: 28px; align-items: center; margin: 34px 0; }
.sv-cifra .v { font-size: clamp(60px, 9vw, 104px); font-weight: 800; letter-spacing: -.045em; line-height: .9; color: var(--c); }
.sv-cifra .t { font-size: 21px; line-height: 1.4; color: var(--tinta); font-weight: 600; margin: 0; }
.sv-cifra .x { font-size: 15px; color: var(--tenue); margin-top: 8px; }

/* ── Frase ───────────────────────────────────────────────────────────────── */
.sv-frase { font-size: clamp(24px, 3.3vw, 34px); line-height: 1.28; letter-spacing: -.015em; font-weight: 750;
            color: var(--tinta); margin: 42px 0; max-width: 800px; }
.sv-frase span { color: var(--c); }

/* ── Notas ───────────────────────────────────────────────────────────────── */
.sv-nota { background: #fff; border-radius: 12px; padding: 18px 22px; margin: 22px 0;
           border: 1px solid rgba(11,11,11,.07); border-left: 4px solid var(--c); }
.sv-nota .rt { font-size: 11.5px; letter-spacing: .16em; text-transform: uppercase; font-weight: 750; color: var(--c); margin-bottom: 6px; }
.sv-nota p { margin: 0; font-size: 16px; }

/* ── Descartes ───────────────────────────────────────────────────────────── */
.sv-desc { display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 12px; margin: 22px 0; }
.sv-desc div { background: #fff; border-radius: 12px; padding: 16px 18px; border: 1px solid rgba(11,11,11,.07); }
.sv-desc h4 { margin: 0 0 6px; font-size: 15px; color: var(--tinta); display: flex; gap: 9px; align-items: center; }
.sv-desc h4::before { content: "✕"; display: grid; place-items: center; width: 22px; height: 22px; border-radius: 50%%;
                      background: rgba(235,104,52,.13); color: var(--naranja); font-size: 11px; font-weight: 800; flex: none; }
.sv-desc p { margin: 0; font-size: 14px; color: var(--tinta2); line-height: 1.5; }
.sv-desc-h h4::before { content: "!"; background: rgba(42,120,214,.13); color: var(--azul); font-size: 12px; }

/* ── Íconos: frecuencias naturales ───────────────────────────────────────── */
.sv-iconos { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 26px; margin: 30px 0; }
.sv-ico-caja { background: #fff; border-radius: 14px; padding: 22px; border: 1px solid rgba(11,11,11,.07); }
.sv-ico-caja .tit { font-size: 14.5px; color: var(--tinta2); margin-bottom: 14px; font-weight: 550; }
.sv-ico { display: grid; grid-template-columns: repeat(10, 1fr); gap: 5px; max-width: 250px; }
.sv-ico i { display: block; aspect-ratio: 1; border-radius: 4px; background: var(--grilla); }
/* --sv-k escalona por tiempo (índice 0-99). No se usa --sv-i: en la versión por
   scroll esa variable desplaza el rango, y el ícono 99 nunca llegaría a pintarse.
   Por scroll no hace falta escalonar: las filas entran una tras otra solas. */
.sv-ico i.on { background: var(--c); animation: sv-pinta .7s ease-out both; animation-delay: calc(var(--sv-k, 0) * 9ms); }
@keyframes sv-pinta { from { background: var(--grilla); transform: scale(.55); } }
.sv-ico-caja .res { display: flex; align-items: baseline; gap: 10px; margin-top: 16px; }
.sv-ico-caja .res .v { font-size: 44px; font-weight: 800; letter-spacing: -.035em; color: var(--c); line-height: 1; }
.sv-ico-caja .res .t { font-size: 15px; color: var(--tinta); font-weight: 600; line-height: 1.35; }

/* ── Barras en duelo ─────────────────────────────────────────────────────── */
.sv-barras { margin: 26px 0; background: #fff; border-radius: 14px; padding: 22px 24px; border: 1px solid rgba(11,11,11,.07); }
.sv-barras .tit { font-size: 14.5px; color: var(--tinta2); margin-bottom: 14px; font-weight: 550; }
.sv-barra { display: grid; grid-template-columns: 150px 1fr 110px; align-items: center; gap: 14px; margin: 11px 0; }
.sv-barra .e { font-size: 15px; color: var(--tinta); font-weight: 600; text-align: right; }
.sv-barra .p { height: 26px; background: var(--plano); border-radius: 6px; overflow: clip; }
.sv-barra b { display: block; height: 100%%; border-radius: 6px; background: var(--c); width: var(--w);
              transform-origin: left; animation: sv-crece 1.2s cubic-bezier(.16,.8,.24,1) both; }
@keyframes sv-crece { from { transform: scaleX(0); } }
.sv-barra .v { font-size: 17px; font-weight: 750; color: var(--tinta); }

/* ── Figura ──────────────────────────────────────────────────────────────── */
.sv-fig { margin: 30px 0; }
.sv-fig img { width: 100%%; border-radius: 12px; border: 1px solid rgba(11,11,11,.07); background: var(--fondo);
              box-shadow: 0 1px 2px rgba(11,11,11,.04), 0 14px 34px -18px rgba(11,11,11,.18); }
.sv-fig figcaption { font-size: 14px; color: var(--tenue); margin-top: 10px; line-height: 1.5; }
.sv-fig figcaption b { color: var(--tinta2); }

/* ── Recomendaciones ─────────────────────────────────────────────────────── */
.sv-reco { background: #fff; border-radius: 14px; padding: 22px 24px; margin: 16px 0; display: grid;
           grid-template-columns: 52px 1fr; gap: 18px; border: 1px solid rgba(11,11,11,.07);
           box-shadow: 0 1px 2px rgba(11,11,11,.04), 0 10px 28px -16px rgba(11,11,11,.14); }
.sv-reco .n { width: 52px; height: 52px; border-radius: 14px; background: var(--verde); color: #fff;
              font-size: 24px; font-weight: 800; display: grid; place-items: center; }
.sv-reco h3 { margin: 2px 0 8px; font-size: 20px; line-height: 1.3; color: var(--tinta); letter-spacing: -.01em; }
.sv-reco p { margin: 0 0 8px; font-size: 15.5px; }
.sv-reco .meta { display: flex; flex-wrap: wrap; gap: 8px 18px; margin-top: 12px; padding-top: 12px;
                 border-top: 1px solid var(--grilla); font-size: 14px; color: var(--tinta2); }
.sv-reco .meta b { color: var(--verde); }

/* ── Cierre ──────────────────────────────────────────────────────────────── */
.sv-cierre { background: var(--tinta); color: #fff; border-radius: 20px; padding: 56px 48px; margin: 48px 0 24px; }
.sv-cierre .rt { font-size: 12.5px; letter-spacing: .18em; text-transform: uppercase; font-weight: 700; color: #86b6ef; }
.sv-cierre p { font-size: clamp(26px, 3.6vw, 38px); line-height: 1.22; letter-spacing: -.02em; font-weight: 800; margin: 16px 0 0; color: #fff; }
.sv-cierre p span { color: #86b6ef; }
.sv-cierre .f { font-size: 15px; font-weight: 500; color: #c3c2b7; margin-top: 22px; letter-spacing: 0; line-height: 1.5; }

@media (max-width: 640px) {
  .sv-cifra { grid-template-columns: 1fr; gap: 8px; }
  .sv-barra { grid-template-columns: 1fr; gap: 4px; } .sv-barra .e { text-align: left; }
  .sv-cierre { padding: 36px 26px; } .sv-reco { grid-template-columns: 1fr; }
}
""" % {
    "azul": CATEGORICA[0], "naranja": CATEGORICA[1], "verde": ACENTO["oportunidad"],
    "rojo": ACENTO["sobreinvertido"], "tinta": TINTA, "tinta2": TINTA_SECUNDARIA,
    "tenue": TINTA_TENUE, "grilla": GRILLA, "fondo": FONDO,
}


# Animación atada al scroll. NO va en los componentes: `view()` se ata al
# contenedor con scroll más cercano, y si alguno intermedio tiene `overflow`
# (JupyterLab y nbconvert los tienen) la animación queda congelada a medio camino
# y un número puede mostrar una cifra falsa —se midió: 52 en vez de 53—. Por eso
# los componentes solo animan por tiempo, que siempre termina en el valor final,
# y esta capa se inyecta únicamente en el HTML exportado, donde se liberan esos
# contenedores. La exportación verifica que todas las animaciones lleguen al 100%.
CSS_SCROLL = """
.jp-OutputArea-child, .jp-OutputArea, .jp-Cell-outputWrapper, .jp-Cell,
.jp-OutputArea-output, .jp-RenderedHTMLCommon { overflow: visible !important; }
/* Prefijo :root para ganar en especificidad: el CSS de cada componente aparece
   después en el documento y, con la misma especificidad, volvía a atar las
   animaciones al tiempo en vez de al scroll. */
@supports (animation-timeline: view()) {
  :root .sv .sv-rev, :root .sv .sv-ico i, :root .sv .sv-barra b, :root .sv .sv-rayita {
    animation-timeline: view(); animation-delay: 0s; animation-duration: auto;
    animation-range: entry calc(4% + var(--sv-i, 0) * 6%) entry 100%; }
  /* Los números cuentan en un tramo más largo, para que se vea el conteo. */
  :root .sv .sv-n { animation-timeline: view(); animation-delay: 0s; animation-duration: auto;
    animation-range: entry 0% cover calc(24% + var(--sv-i, 0) * 3%); }
}
@media (prefers-reduced-motion: reduce) {
  .sv .sv-rev, .sv .sv-n, .sv .sv-ico i, .sv .sv-barra b, .sv .sv-rayita { animation: none !important; }
}
"""


class Bloque:
    """Un fragmento de HTML que Jupyter muestra como salida enriquecida."""

    def __init__(self, html: str):
        self.html = html

    def _repr_html_(self) -> str:
        return f"<style>{CSS}</style>{self.html}"


def _t(texto: str) -> str:
    """Escapa texto pero deja pasar **negrita** y *énfasis* de estilo markdown."""
    t = escape(texto)
    t = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", t)
    t = re.sub(r"\*(.+?)\*", r"<em>\1</em>", t)
    return t


def num(texto: str, indice: int = 0) -> str:
    """
    Envuelve un número ya formateado («31.991», «6,71», «1,70×») para que cuente
    desde cero al entrar en pantalla.

    El número queda escrito como texto real y la animación va encima. Si un grupo
    posterior al primero empieza en cero («1,05») se devuelve estático: ahí el
    relleno con ceros es indispensable para mostrar bien el valor final, y un
    navegador sin `@counter-style` lo mostraría mal.
    """
    partes = re.split(r"(\d+)", texto)
    grupos = [p for p in partes if p.isdigit()]
    if not grupos or any(g.startswith("0") and len(g) > 1 for g in grupos[1:]):
        return f'<span class="num-t">{escape(texto)}</span>'
    out, primero = [], True
    for p in partes:
        if p.isdigit():
            ancho = "" if primero or len(p) == 1 else f" sv-n{min(len(p), 3)}"
            out.append(f'<span class="sv-n{ancho}" style="--sv-v:{int(p)};--sv-i:{indice}">{p}</span>')
            primero = False
        elif p:
            out.append(escape(p))
    return "".join(out)


# ──────────────────────────────────────────────────────────────────────────────
# Componentes
# ──────────────────────────────────────────────────────────────────────────────

def estilo() -> Bloque:
    """
    Carga la tipografía Inter embebida. Va una vez, al principio del notebook.

    Las fuentes viajan dentro del propio notebook (woff2, solo caracteres
    latinos, ~115 KB en total): el informe se ve igual en un computador que no
    tenga Inter instalada, que es lo normal en la sala donde se presenta.
    """
    caras = []
    for archivo, peso in (("Regular", 400), ("Medium", 500), ("SemiBold", 600),
                          ("Bold", 700), ("ExtraBold", 800)):
        ruta = DIR_FUENTES / f"Inter-{archivo}.woff2"
        if ruta.exists():
            datos = base64.b64encode(ruta.read_bytes()).decode()
            caras.append(
                f"@font-face{{font-family:Inter;font-weight:{peso};font-style:normal;"
                f"font-display:swap;src:url(data:font/woff2;base64,{datos}) format('woff2');}}"
            )
    return Bloque(f"<style>{''.join(caras)}</style><div class='sv'></div>")


def portada(titulo: str, bajada: str, ceja: str, autores: str, lectura: str) -> Bloque:
    """Portada. En el título, lo que va entre *asteriscos* se pinta en azul."""
    return Bloque(f"""
<div class="sv"><section class="sv-portada">
  <div class="sv-ceja sv-rev">{escape(ceja)}</div>
  <h1 class="sv-rev" style="--sv-i:1">{_t(titulo)}</h1>
  <div class="sv-rayita"></div>
  <p class="sv-bajada sv-rev" style="--sv-i:2">{_t(bajada)}</p>
  <div class="sv-meta sv-rev" style="--sv-i:3">
    <span>{_t(autores)}</span><span class="sv-chip">◷ {escape(lectura)}</span>
  </div>
</section></div>""")


def mapa(pasos: list[str], actual: int | None = None) -> Bloque:
    """
    Mapa de la historia: dónde estamos y qué falta.

    Es señalización (principio de Mayer): cuando el lector sabe cuántas partes
    tiene la historia y en cuál está, retiene más y se desorienta menos.
    """
    celdas = []
    for i, paso in enumerate(pasos, 1):
        clase = "" if actual is None else ("actual" if i == actual else ("hecho" if i < actual else ""))
        celdas.append(f'<div class="{clase}">{_t(paso)}</div>')
    return Bloque(f'<div class="sv"><div class="sv-mapa sv-rev" style="--sv-cols:{len(pasos)}">'
                  f'{"".join(celdas)}</div></div>')


def capitulo(numero: int, titulo: str, pregunta: str, ceja: str | None = None) -> Bloque:
    """Portadilla de capítulo: número de fondo, título y la pregunta que responde."""
    return Bloque(f"""
<div class="sv"><section class="sv-cap">
  <div class="sv-cap-num">{numero:02d}</div>
  <div class="sv-ceja sv-rev">{escape(ceja or f"Capítulo {numero}")}</div>
  <h2 class="sv-rev" style="--sv-i:1">{_t(titulo)}</h2>
  <p class="sv-pregunta sv-rev" style="--sv-i:2">{_t(pregunta)}</p>
</section></div>""")


def kpis(items: list[tuple[str, str, str]], tono: str = "azul") -> Bloque:
    """Fila de indicadores: (valor, rótulo, base). El valor cuenta al aparecer."""
    tarjetas = "".join(
        f'<div class="sv-kpi sv-rev" style="--sv-i:{i};--k:{TONOS[tono]}">'
        f'<div class="v">{num(v, i)}</div><div class="r">{_t(r)}</div><div class="b">{_t(b)}</div></div>'
        for i, (v, r, b) in enumerate(items)
    )
    return Bloque(f'<div class="sv"><div class="sv-kpis">{tarjetas}</div></div>')


def cifra(valor: str, texto: str, contexto: str = "", tono: str = "azul") -> Bloque:
    """Una sola cifra protagonista, enorme, con la frase que la explica."""
    x = f'<div class="x">{_t(contexto)}</div>' if contexto else ""
    return Bloque(f"""
<div class="sv"><div class="sv-cifra sv-rev" style="--c:{TONOS[tono]}">
  <div class="v">{num(valor)}</div>
  <div><p class="t">{_t(texto)}</p>{x}</div>
</div></div>""")


def frase(texto: str, tono: str = "azul") -> Bloque:
    """Afirmación grande. Lo que va entre [corchetes] se pinta en el tono."""
    t = re.sub(r"\[(.+?)\]", r"<span>\1</span>", _t(texto))
    return Bloque(f'<div class="sv"><p class="sv-frase sv-rev" style="--c:{TONOS[tono]}">{t}</p></div>')


def nota(texto: str, rotulo: str = "Hallazgo", tono: str = "azul") -> Bloque:
    """Recuadro de énfasis: hallazgo (azul), límite (naranja) o decisión (verde)."""
    return Bloque(f"""
<div class="sv"><div class="sv-nota sv-rev" style="--c:{TONOS[tono]}">
  <div class="rt">{escape(rotulo)}</div><p>{_t(texto)}</p>
</div></div>""")


def descartes(items: list[tuple[str, str]], variante: str = "descarte") -> Bloque:
    """
    Tarjetas de una línea: (título, explicación).

    `variante="descarte"` marca con ✕ lo que el dataset NO permite afirmar;
    `variante="hallazgo"` marca con ! un hallazgo de la auditoría.
    """
    clase = "sv-desc sv-desc-h" if variante == "hallazgo" else "sv-desc"
    tarjetas = "".join(
        f'<div class="sv-rev" style="--sv-i:{i % 4}"><h4>{_t(t)}</h4><p>{_t(m)}</p></div>'
        for i, (t, m) in enumerate(items)
    )
    return Bloque(f'<div class="sv"><div class="{clase}">{tarjetas}</div></div>')


def iconos(grupos: list[tuple[str, float, str, str]]) -> Bloque:
    """
    Conjuntos de 100 íconos, uno por grupo: (título, porcentaje, frase, tono).

    Es la forma que la investigación recomienda para comunicar proporciones a
    público no técnico: «53 de cada 100» dibujado se entiende mejor que «53%»
    escrito (Galesic, García-Retamero y Gigerenzer, 2009). Los íconos marcados
    van juntos y no dispersos, que es lo que maximiza la exactitud de la lectura.
    """
    cajas = []
    for i, (titulo, pct, texto, tono) in enumerate(grupos):
        marcados = round(pct)
        celdas = "".join(
            f'<i class="on" style="--sv-k:{k}"></i>' if k < marcados else "<i></i>" for k in range(100)
        )
        cajas.append(f"""
<div class="sv-ico-caja sv-rev" style="--sv-i:{i};--c:{TONOS[tono]}">
  <div class="tit">{_t(titulo)}</div>
  <div class="sv-ico" role="img" aria-label="{marcados} de cada 100">{celdas}</div>
  <div class="res"><span class="v">{num(str(marcados), i)}</span><span class="t">{_t(texto)}</span></div>
</div>""")
    return Bloque(f'<div class="sv"><div class="sv-iconos">{"".join(cajas)}</div></div>')


def barras(titulo: str, items: list[tuple[str, float, str, str]], maximo: float | None = None) -> Bloque:
    """Barras horizontales que crecen desde cero: (etiqueta, valor, texto, tono)."""
    tope = maximo or max(v for _, v, _, _ in items)
    filas = "".join(
        f'<div class="sv-barra"><div class="e">{_t(e)}</div>'
        f'<div class="p"><b style="--w:{v / tope * 100:.1f}%;--c:{TONOS[t]};--sv-i:{i}"></b></div>'
        f'<div class="v">{num(x, i)}</div></div>'
        for i, (e, v, x, t) in enumerate(items)
    )
    return Bloque(f'<div class="sv"><div class="sv-barras sv-rev"><div class="tit">{_t(titulo)}</div>{filas}</div></div>')


def grafico(ruta: str | Path, pie: str, alt: str = "") -> Bloque:
    """Gráfico del proyecto, embebido para que el HTML exportado no dependa de archivos."""
    ruta = Path(ruta)
    if not ruta.is_absolute():
        ruta = RAIZ / ruta
    datos = base64.b64encode(ruta.read_bytes()).decode()
    return Bloque(f"""
<div class="sv"><figure class="sv-fig sv-rev">
  <img src="data:image/png;base64,{datos}" alt="{escape(alt or pie)}">
  <figcaption>{_t(pie)}</figcaption>
</figure></div>""")


def recomendacion(n: int, titulo: str, cuerpo: str, meta: str, evidencia: str) -> Bloque:
    """Tarjeta de recomendación: qué hacer, por qué, cuánto y dónde está la prueba."""
    return Bloque(f"""
<div class="sv"><div class="sv-reco sv-rev">
  <div class="n">{n}</div>
  <div><h3>{_t(titulo)}</h3><p>{_t(cuerpo)}</p>
    <div class="meta"><span>Meta: <b>{_t(meta)}</b></span><span>Evidencia: {_t(evidencia)}</span></div>
  </div>
</div></div>""")


def cierre(texto: str, firma: str, rotulo: str = "Si se quedan con una sola idea") -> Bloque:
    """
    Bloque final oscuro con la frase que el público tiene que llevarse.

    Es la regla del pico y el final (Kahneman): de una experiencia se recuerda
    sobre todo su momento más intenso y cómo terminó. La última pantalla es la
    que más pesa en la memoria, así que lleva la idea más importante.
    """
    t = re.sub(r"\[(.+?)\]", r"<span>\1</span>", _t(texto))
    return Bloque(f"""
<div class="sv"><div class="sv-cierre sv-rev">
  <div class="rt">{escape(rotulo)}</div><p>{t}</p><div class="f">{_t(firma)}</div>
</div></div>""")
