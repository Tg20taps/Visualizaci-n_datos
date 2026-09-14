"""
Traducción de las categorías del dataset al idioma de la audiencia.

El Gerente de Contenidos lee en español: un eje que dice `Horror`, `Sci-Fi &
Fantasy` o `ko` le cuesta más de leer que uno que dice `Terror`, `Ciencia
ficción y fantasía` o `Coreano`. Reducir esa fricción es carga cognitiva menos
(IE6), y no cuesta nada más que mantener este diccionario.

Regla: se traduce la ETIQUETA que se muestra, nunca el valor del dato. El
catálogo procesado conserva los valores originales para que el pipeline sea
verificable contra la fuente; la traducción se aplica solo al dibujar.
"""

from __future__ import annotations

GENEROS = {
    "Action": "Acción",
    "Action & Adventure": "Acción y aventura",
    "Adventure": "Aventura",
    "Animation": "Animación",
    "Comedy": "Comedia",
    "Crime": "Policial",
    "Documentary": "Documental",
    "Drama": "Drama",
    "Family": "Familiar",
    "Fantasy": "Fantasía",
    "History": "Histórico",
    "Horror": "Terror",
    "Kids": "Infantil",
    "Music": "Musical",
    "Mystery": "Misterio",
    "News": "Noticias",
    "Reality": "Telerrealidad",
    "Romance": "Romance",
    "Sci-Fi & Fantasy": "Ciencia ficción y fantasía",
    "Science Fiction": "Ciencia ficción",
    "Soap": "Telenovela",
    "TV Movie": "Película para TV",
    "Thriller": "Suspenso",
    "Talk": "Conversación",
    "War": "Bélico",
    "War & Politics": "Bélico y político",
    "Western": "Western",
}

PAISES = {
    "United States of America": "Estados Unidos",
    "United Kingdom": "Reino Unido",
    "Japan": "Japón",
    "South Korea": "Corea del Sur",
    "China": "China",
    "France": "Francia",
    "Canada": "Canadá",
    "Germany": "Alemania",
    "India": "India",
    "Spain": "España",
    "Belgium": "Bélgica",
    "Italy": "Italia",
    "Mexico": "México",
    "Philippines": "Filipinas",
    "Hong Kong": "Hong Kong",
    "Australia": "Australia",
    "Brazil": "Brasil",
    "Russia": "Rusia",
    "Turkey": "Turquía",
    "Sweden": "Suecia",
    "Thailand": "Tailandia",
    "Denmark": "Dinamarca",
    "Egypt": "Egipto",
    "Netherlands": "Países Bajos",
    "Poland": "Polonia",
    "Ireland": "Irlanda",
    "Norway": "Noruega",
    "Argentina": "Argentina",
    "Taiwan": "Taiwán",
    "Indonesia": "Indonesia",
    "Chile": "Chile",
    "Colombia": "Colombia",
}

IDIOMAS = {
    "en": "Inglés",
    "ja": "Japonés",
    "ko": "Coreano",
    "zh": "Chino (mandarín)",
    "cn": "Chino (cantonés)",
    "es": "Español",
    "fr": "Francés",
    "de": "Alemán",
    "hi": "Hindi",
    "tl": "Tagalo",
    "pt": "Portugués",
    "ru": "Ruso",
    "it": "Italiano",
    "tr": "Turco",
    "ar": "Árabe",
    "nl": "Neerlandés",
    "th": "Tailandés",
    "pl": "Polaco",
    "sv": "Sueco",
    "da": "Danés",
    "no": "Noruego",
    "id": "Indonesio",
    "he": "Hebreo",
    "fa": "Persa",
}


def traducir(valores, diccionario: dict[str, str]):
    """Traduce una secuencia de etiquetas; deja intacto lo que no esté mapeado."""
    return [diccionario.get(v, v) for v in valores]
