"""
Sistema visual del proyecto: paleta, tipografía y helpers de gráfico.

Un solo lugar define cómo se ve todo. Los notebooks no fijan colores ni tamaños
a mano: importan de aquí. Los mismos valores se replican en el dashboard, de
modo que una categoría conserva su color en el informe, en la presentación y en
Power BI (evidencia de IE5 y de IE9).

Los criterios que hay detrás de cada decisión están en `docs/decisiones_diseno.md`.

Reglas que este módulo hace cumplir por construcción:
  - Sin 3D, sin ejes truncados, sin doble eje, sin torta de más de 5 categorías.
  - El color nunca es el único canal: todo gráfico lleva etiqueta directa.
  - Grillas y ejes recesivos; el dato es lo único con contraste alto.
  - El título se redacta como conclusión, no como descripción.
"""

from __future__ import annotations

from pathlib import Path

import matplotlib as mpl
import matplotlib.pyplot as plt

RAIZ = Path(__file__).resolve().parent.parent
DIR_EXPLORATORIO = RAIZ / "images" / "exploratorio"
DIR_FINALES = RAIZ / "images" / "finales"

# ──────────────────────────────────────────────────────────────────────────────
# Paleta
#
# Paleta categórica validada: banda de luminosidad, piso de croma, separación
# bajo daltonismo (protanopía, deuteranopía, tritanopía) y contraste contra el
# fondo. El peor par adyacente da ΔE 9,1 bajo protanopía y 19,6 en visión normal,
# sobre un objetivo de 8 y un piso de 15 respectivamente.
#
# El orden de los slots es el mecanismo de seguridad, no decoración: se asignan
# SIEMPRE en este orden y nunca se ciclan. Un noveno color no se inventa — la
# cola se agrupa en "Otros".
# ──────────────────────────────────────────────────────────────────────────────

CATEGORICA = [
    "#2a78d6",  # 1 azul
    "#eb6834",  # 2 naranja
    "#1baf7a",  # 3 verde agua
    "#eda100",  # 4 amarillo
    "#e87ba4",  # 5 magenta
    "#008300",  # 6 verde
    "#4a3aa7",  # 7 violeta
    "#e34948",  # 8 rojo
]

# Color semántico fijo: Película siempre azul, Serie siempre naranja, en todos
# los visuales del proyecto. No se reasigna aunque cambie el orden de las barras.
COLOR_TIPO = {"Película": CATEGORICA[0], "Serie": CATEGORICA[1]}

# Rampa secuencial de un solo tono (claro → oscuro) para magnitud continua.
SECUENCIAL = ["#cde2fb", "#9ec5f4", "#6da7ec", "#3987e5", "#2a78d6", "#1c5cab", "#104281"]

# Acentos de lectura para los gráficos de cuadrantes (visuales 19 y 21).
# Son colores de ESTADO (bueno / malo), no "un color más" de una serie, y por eso
# no entran nunca en la rotación categórica.
ACENTO = {
    "oportunidad": "#0ca30c",  # poco volumen, buena nota → invertir
    "sobreinvertido": "#d03b3b",  # mucho volumen, nota baja → revisar
    "neutro": "#898781",  # el resto, en gris: contexto, no protagonista
}

# El verde y el rojo de arriba miden ΔE 4,1 bajo deuteranopía: para un lector con
# esa condición son el mismo color. Es el resultado del validador, no una
# sospecha. Como el par verde/rojo comunica "bueno / malo" mejor que cualquier
# alternativa que sí pase, se conserva el color Y se agrega un segundo canal:
# cada segmento tiene su propia FORMA de marca. Quien no distinga los tonos
# sigue leyendo el gráfico por la forma, por la posición en el cuadrante y por
# la etiqueta directa.
MARCA = {
    "oportunidad": "o",  # círculo
    "priorizar": "o",
    "sobreinvertido": "v",  # triángulo hacia abajo
    "revisar": "v",
    "prestigio": "D",  # rombo
    "eficiencia": "s",  # cuadrado
    "neutro": "o",
}

# Tinta y cromo del gráfico. El dato lleva el contraste; el andamiaje se apaga.
FONDO = "#fcfcfb"
TINTA = "#0b0b0b"
TINTA_SECUNDARIA = "#52514e"
# Gris de texto secundario. Era #898781, que da 3,5:1 sobre el fondo: bajo el
# 4,5:1 que WCAG AA exige para texto chico, y justo se usaba en ejes, notas y
# pies. #6e6d68 da 5,05:1. El gris claro sigue existiendo, pero solo para
# MARCAS (ACENTO["neutro"]), donde el mínimo para objetos gráficos es 3:1.
TINTA_TENUE = "#6e6d68"
GRILLA = "#e1e0d9"
EJE = "#c3c2b7"

# Gris de de-énfasis: el resto de las categorías cuando una es el punto.
GRIS_CONTEXTO = "#c3c2b7"

# Inter: diseñada para pantallas y cifras, con dígitos tabulares y una x alta
# que se lee bien en tamaños chicos. Es la misma familia del dashboard y del
# informe. DejaVu queda de respaldo si Inter no está instalada.
TIPOGRAFIA = ["Inter", "DejaVu Sans", "Liberation Sans", "Helvetica", "Arial", "sans-serif"]


def aplicar_estilo() -> None:
    """
    Fija el estilo del proyecto en matplotlib. Llamar una vez por notebook.

    Todo lo que apaga andamiaje (bordes, grilla, ticks) está aquí y no repetido
    gráfico a gráfico: así ningún visual se sale del sistema por descuido.
    """
    mpl.rcParams.update(
        {
            "figure.facecolor": FONDO,
            "figure.dpi": 110,
            "savefig.dpi": 200,
            "savefig.facecolor": FONDO,
            "savefig.bbox": "tight",
            "savefig.pad_inches": 0.3,
            "font.family": "sans-serif",
            "font.sans-serif": TIPOGRAFIA,
            "font.size": 10,
            "text.color": TINTA,
            "axes.facecolor": FONDO,
            "axes.edgecolor": EJE,
            "axes.labelcolor": TINTA_SECUNDARIA,
            "axes.labelsize": 10,
            "axes.titlesize": 13,
            "axes.titleweight": "bold",
            "axes.titlecolor": TINTA,
            "axes.spines.top": False,
            "axes.spines.right": False,
            "axes.spines.left": False,
            "axes.grid": True,
            "axes.axisbelow": True,
            "grid.color": GRILLA,
            "grid.linewidth": 0.8,
            "xtick.color": TINTA_TENUE,
            "ytick.color": TINTA_SECUNDARIA,
            "xtick.labelsize": 9,
            "ytick.labelsize": 9.5,
            "xtick.bottom": False,
            "ytick.left": False,
            "legend.frameon": False,
            "legend.fontsize": 9.5,
            "lines.linewidth": 2,
            "lines.markersize": 8,
        }
    )


def num_es(valor, decimales: int = 0) -> str:
    """
    Formatea un número a la convención chilena: coma decimal y punto de miles.

    Un eje que dice `6.5` se lee como "seis mil quinientos" en el idioma de la
    audiencia. Es un detalle, pero es exactamente el tipo de fricción que el
    lector paga con atención.
    """
    texto = f"{valor:,.{decimales}f}"
    return texto.replace(",", "\x00").replace(".", ",").replace("\x00", ".")


def eje_es(ax, eje: str = "x", decimales: int = 1) -> None:
    """Aplica la convención numérica en español a las marcas de un eje."""
    from matplotlib.ticker import FuncFormatter

    formateador = FuncFormatter(lambda v, _: num_es(v, decimales))
    (ax.xaxis if eje == "x" else ax.yaxis).set_major_formatter(formateador)


def titular(ax, conclusion: str, subtitulo: str | None = None, aire: int = 0) -> None:
    """
    Escribe el título como conclusión y el subtítulo como alcance.

    El título dice lo que el lector debe concluir ("Drama lidera en volumen pero
    no en nota"), no lo que el gráfico contiene ("Géneros por cantidad"). El
    subtítulo lleva el alcance: qué subconjunto, qué umbral, qué unidad. Es la
    manera de que un gráfico se explique solo cuando el Gerente lo mira sin
    nosotros al lado.
    """
    ax.set_title(conclusion, loc="left", pad=(26 if subtitulo else 14) + aire)
    if subtitulo:
        ax.annotate(
            subtitulo,
            xy=(0, 1),
            xycoords="axes fraction",
            xytext=(0, 12),
            textcoords="offset points",
            ha="left",
            va="bottom",
            fontsize=9.5,
            color=TINTA_SECUNDARIA,
        )


def pie_de_fuente(ax, texto: str = "", desplazamiento: int = -42) -> None:
    """Nota al pie con la fuente y el alcance declarado. Va en todos los visuales."""
    base = "Fuente: catálogo Netflix 2010–2025 (31.991 títulos). Datos de catálogo, no de usuarios."
    ax.annotate(
        f"{base} {texto}".strip(),
        xy=(0, 0),
        xycoords="axes fraction",
        xytext=(0, desplazamiento),
        textcoords="offset points",
        ha="left",
        va="top",
        fontsize=8,
        color=TINTA_TENUE,
    )


def colores_enfasis(etiquetas, destacadas: dict[str, str]) -> list[str]:
    """
    Pinta solo lo que es el punto del gráfico y manda el resto al gris de contexto.

    El énfasis es la forma más desaprovechada: cuando la historia es "estas dos
    categorías", usar ocho colores entierra el hallazgo en decoración.
    `destacadas` mapea etiqueta → color.
    """
    return [destacadas.get(e, GRIS_CONTEXTO) for e in etiquetas]


def etiquetar_barras(ax, barras, valores, formato="{:.0f}", dentro_desde=0.75) -> None:
    """
    Etiqueta directa sobre cada barra: el valor exacto sin que el ojo viaje al eje.

    Las barras largas llevan la etiqueta dentro en blanco y las cortas fuera en
    tinta, para que nunca quede texto ilegible sobre un fondo de color. Esto es
    también lo que da el segundo canal de lectura: el color deja de ser el único
    portador de información.
    """
    limite = max(valores) if len(valores) else 0
    for barra, valor in zip(barras, valores):
        ancho = barra.get_width()
        adentro = limite and (ancho / limite) >= dentro_desde
        ax.annotate(
            formato.format(valor),
            xy=(ancho, barra.get_y() + barra.get_height() / 2),
            xytext=(-6 if adentro else 6, 0),
            textcoords="offset points",
            ha="right" if adentro else "left",
            va="center",
            fontsize=9,
            fontweight="bold",
            color="#ffffff" if adentro else TINTA_SECUNDARIA,
        )


def puntos_ordenados(
    ax,
    etiquetas,
    valores,
    colores,
    formato="{:.2f}",
    marcas=None,
    etiqueta_derecha=None,
    titulo_derecha="",
) -> None:
    """
    Gráfico de puntos (dot plot) horizontal, ordenado por valor.

    **Por qué puntos y no barras.** La longitud de una barra codifica magnitud
    desde cero: si el eje no parte en cero, la barra miente — un 6,5 se ve el
    doble que un 6,2. Cuando el rango útil es estrecho (todas las notas viven
    entre 5,9 y 7,0), o se trunca el eje, que está prohibido, o las barras se
    vuelven indistinguibles.

    El punto codifica con **posición**, no con longitud, y la posición no
    necesita origen en cero: es legítimo acercar el eje al rango de los datos.
    Por eso todo ranking de notas del proyecto es un dot plot y no un gráfico
    de barras. La línea guía tenue solo conduce el ojo de la etiqueta al punto.

    `etiqueta_derecha` agrega una segunda columna de contexto (el volumen), de
    modo que el lector vea nota y cantidad sin cambiar de gráfico.

    `marcas` da a cada punto su propia forma. Es obligatorio cuando los colores
    vienen de `ACENTO`: verde y rojo son indistinguibles bajo deuteranopía y la
    forma es lo que sostiene la lectura en ese caso.
    """
    posiciones = range(len(etiquetas))
    minimo = min(valores)

    marcas = list(marcas) if marcas is not None else ["o"] * len(valores)

    for y, valor, color, marca in zip(posiciones, valores, colores, marcas):
        ax.plot([minimo, valor], [y, y], color=GRILLA, lw=1.2, zorder=1, solid_capstyle="round")
        ax.plot([valor], [y], marca, color=color, markersize=11, zorder=3,
                markeredgecolor=FONDO, markeredgewidth=1.5)
        ax.annotate(formato(valor) if callable(formato) else formato.format(valor),
                    xy=(valor, y), xytext=(13, 0),
                    textcoords="offset points", ha="left", va="center",
                    fontsize=9.5, fontweight="bold", color=TINTA)

    ax.set_yticks(list(posiciones), list(etiquetas))
    ax.set_ylim(-0.7, len(etiquetas) - 0.3)

    if etiqueta_derecha is not None:
        for y, texto in zip(posiciones, etiqueta_derecha):
            ax.annotate(texto, xy=(1, y), xycoords=("axes fraction", "data"),
                        xytext=(12, 0), textcoords="offset points",
                        ha="right", va="center", fontsize=8.5, color=TINTA_TENUE)
        ax.annotate(titulo_derecha, xy=(1, 1), xycoords="axes fraction",
                    xytext=(12, 8), textcoords="offset points", ha="right", va="bottom",
                    fontsize=8.5, fontweight="bold", color=TINTA_TENUE)


def leyenda_segmentos(ax, entradas: dict[str, str], **kwargs) -> None:
    """
    Leyenda con marcador de color y texto: el color nunca viaja solo.

    Con `abajo=True` se ubica bajo el área de datos, para no tapar marcas.
    `marcadores` permite que el símbolo de la leyenda sea el mismo que el del
    gráfico (círculo, cuadrado): si no coinciden, la leyenda deja de ser leyenda.
    Es obligatorio pasarlo cuando el gráfico usa los colores de `ACENTO`, porque
    ahí la forma es la que carga la distinción para un lector con daltonismo.
    """
    from matplotlib.lines import Line2D

    marcadores = kwargs.pop("marcadores", {})
    handles = [
        Line2D([], [], marker=marcadores.get(texto, "o"), linestyle="", markersize=9,
               color=color, label=texto)
        for texto, color in entradas.items()
    ]
    kwargs.setdefault("handletextpad", 0.4)
    if kwargs.pop("abajo", False):
        # Anclada en PUNTOS bajo el eje, no en fracción de los ejes: la fracción
        # depende del alto de la figura, así que un mismo valor deja la leyenda
        # encima de las marcas en un gráfico y flotando en otro. En puntos, la
        # distancia al rótulo del eje es siempre la misma.
        from matplotlib.transforms import offset_copy

        puntos = kwargs.pop("altura", 46)
        transformacion = offset_copy(
            ax.transAxes, fig=ax.figure, y=-puntos / 72, units="inches"
        )
        kwargs.update(
            loc="upper left",
            bbox_to_anchor=(0, 0, 1, 0),
            bbox_transform=transformacion,
            mode="expand",
            borderaxespad=0,
        )
        kwargs.setdefault("ncol", len(entradas))
    else:
        kwargs.setdefault("loc", "lower right")
    ax.legend(handles=handles, labelcolor=TINTA_SECUNDARIA, **kwargs)


def limpiar_ejes(ax, eje_valor: str = "x") -> None:
    """Deja la grilla solo en el eje del valor. Una grilla cruzada es ruido."""
    ax.grid(axis=eje_valor, visible=True)
    ax.grid(axis="y" if eje_valor == "x" else "x", visible=False)
    ax.set_axisbelow(True)


def guardar(fig, nombre: str, carpeta: Path = DIR_EXPLORATORIO, mostrar: bool = True) -> Path:
    """
    Guarda el gráfico como PNG y, dentro de un notebook, lo muestra.

    Muestra el ARCHIVO guardado y no la figura en memoria: lo que se ve en el
    notebook es exactamente lo que va al informe. Antes la figura se cerraba sin
    mostrarse, y el notebook de análisis quedaba sin un solo gráfico visible.
    """
    carpeta.mkdir(parents=True, exist_ok=True)
    ruta = carpeta / (nombre if nombre.endswith(".png") else f"{nombre}.png")
    fig.savefig(ruta)
    plt.close(fig)
    if mostrar:
        try:
            from IPython import get_ipython
            from IPython.display import Image, display

            if get_ipython() is not None:
                display(Image(filename=str(ruta), width=920))
        except ImportError:
            pass
    return ruta
