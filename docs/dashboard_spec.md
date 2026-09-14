# Especificación del dashboard

> Documento de construcción. Define **qué** muestra el dashboard y **por qué**, sin depender de la herramienta.
> Escrito así a propósito: la tarea 22 (confirmar herramienta con el profesor) sigue abierta, y todo lo de aquí
> se implementa igual en Power BI, Tableau o una app. Cubre las tareas 23 a 27.

**Audiencia:** Gerente de Contenidos de StreamView Analytics.
**Fuente única:** `data/processed/catalogo_unificado.csv` (31.991 títulos) más las tres tablas largas.
**Propósito:** que responda en menos de un minuto y sin ayuda técnica — qué está funcionando, dónde hay una oportunidad desatendida, y qué se recomienda hacer.

---

## 1. KPIs de cabecera (tarea 23)

Cuatro, no más. Un quinto KPI compite con los otros cuatro y ninguno se lee.

| KPI | Valor sin filtros | Definición exacta | Por qué está |
|---|---|---|---|
| **Títulos en el catálogo** | 31.991 | Conteo distinto de `show_id`. 16.000 películas + 15.991 series | Da el tamaño del universo y reacciona a todos los filtros: es la manera de que el Gerente vea cuánto recorta cada filtro |
| **Nota media ponderada** | 6,71 | Promedio de `score_ponderado` sobre títulos con `votos_suficientes` (20.980 de 31.991) | Es la medida de recepción del proyecto. Ponderada para que los títulos con pocos votos no la inflen |
| **ROI mediano** | 1,70× | Mediana de `roi` sobre las 3.540 películas con `budget` y `revenue` > 0 | Único indicador financiero que el dataset soporta. **Debe mostrar su base al lado**, porque no aplica a series |
| **Género líder** | Drama · 46,2% | Género con más títulos, y su porcentaje sobre el total | Muestra de una la concentración del catálogo, que es el punto de partida del hallazgo |

**Reglas de los KPI.**
El ROI lleva siempre la leyenda *"sobre 3.540 películas con datos financieros"* pegada al número: un KPI financiero sin su base invita a leerlo como si aplicara a todo el catálogo. Cuando un filtro deja el ROI sin base suficiente, se muestra "sin datos" y no un cero — un cero es un valor, la ausencia de dato no lo es.

## 2. Filtros (tarea 24)

En una sola fila sobre los visuales, siempre visibles, en este orden:

| Filtro | Tipo | Valores | Nota de implementación |
|---|---|---|---|
| Tipo | Botones | Película / Serie | Dos valores: botones y no desplegable |
| Género | Desplegable múltiple | 27 | Desde `catalogo_genero.csv`. **Un título con varios géneros cuenta en cada uno**: el conteo filtrado no suma al total, y eso va dicho en la nota al pie |
| País | Desplegable múltiple con búsqueda | 147 | Desde `catalogo_pais.csv`. Mismo criterio de multivalor |
| Idioma | Desplegable múltiple | 83 | Desde el catálogo principal, valor único por título |
| Años | Deslizador de rango | 2010–2025 | **Solo para acotar el universo, nunca para graficar evolución**: hay 1.000 títulos exactos por año y cualquier serie de tiempo saldría plana por construcción |

Un botón *Limpiar filtros* visible. Sin él, el Gerente queda atrapado en una selección y concluye que el dashboard está roto.

## 3. Las tres páginas (tarea 25)

La navegación sigue la misma secuencia que el informe y la presentación: **contexto → hallazgo → implicancia → recomendación**. Máximo 5 visuales por página.

### Página 1 · Visión general — *qué hay en el catálogo*

1. Fila de los 4 KPIs.
2. Composición por tipo (película / serie).
3. Volumen por género — barras horizontales ordenadas.
4. Volumen por país — top 15, barras horizontales.
5. Nota al pie con el alcance declarado.

Responde: *¿qué tengo?* Sin juicio todavía.

### Página 2 · Desempeño por contenido — *qué funciona*

1. Nota ponderada por género (visual 16).
2. Nota ponderada por país (visual 17).
3. Película contra serie en los géneros comunes (visual 20).
4. ROI por nota y por presupuesto (visual 18), con su base declarada.

Responde: *¿qué se recibe bien y dónde el gasto vuelve?*

### Página 3 · Recomendaciones — *qué hacer*

1. **Brecha oferta / recepción (visual 19), a página casi completa.** Es el hallazgo; ocupa el espacio de un hallazgo.
2. Tarjeta con las tres recomendaciones, cada una nombrando el visual que la respalda.
3. Tabla de títulos del cuadrante de oportunidad, filtrable — para que el Gerente pase del diagnóstico a una lista concreta sin pedirle nada a nadie.

Responde: *¿qué hago distinto mañana?*

## 4. Estilo (tarea 26)

Los valores exactos salen de `src/graficos.py`. Se copian tal cual: el mismo hex en el dashboard que en el informe.

| Rol | Hex |
|---|---|
| Película | `#2a78d6` |
| Serie | `#eb6834` |
| Oportunidad | `#0ca30c` |
| Sobreinvertido | `#d03b3b` |
| Contexto / de-énfasis | `#c3c2b7` |
| Rampa secuencial | `#cde2fb` → `#104281` |
| Fondo | `#fcfcfb` |
| Tinta primaria | `#0b0b0b` |
| Tinta secundaria | `#52514e` |
| Grilla | `#e1e0d9` |

**Reglas que no se negocian:**

- Una categoría conserva su color en las tres páginas, en el informe y en la presentación. "Película" es azul en todas partes.
- Nada de 3D, ejes truncados, dobles ejes ni tortas de más de 5 categorías.
- Toda etiqueta numérica con coma decimal y punto de miles.
- Géneros, países e idiomas en español, según `src/etiquetas.py`.
- Tema claro. El informe se imprime y la presentación se proyecta: un tema oscuro se ve bien en pantalla y se pierde en las dos.

## 5. Nota al pie de alcance (tarea 27)

Visible en **las tres páginas**, no solo en la primera, porque el Gerente puede llegar a la página 3 desde un enlace directo:

> Datos de catálogo, no de usuarios. `popularity`, `vote_count` y `vote_average` se usan como proxies declarados de recepción de audiencia. Este dashboard no mide retención, engagement ni reproducciones. ROI calculado sobre 3.540 películas con datos financieros. Ver `docs/calidad_datos.md`.

## 6. Recomendación de herramienta (tarea 22, pendiente de confirmar)

Si el profesor deja elegir: **Power BI**. La rúbrica paga por filtros, KPIs y navegación entre páginas, y en Power BI eso sale casi gratis; en Streamlit o Dash se gastan horas programando interacciones que valen exactamente los mismos puntos.

Lo único que hay que cuidar en Power BI: aplicar la paleta de arriba como tema personalizado (`Ver → Temas → Personalizar`) antes de crear el primer visual. Si se deja para después, hay que repintar cada gráfico a mano y ahí es donde se rompe la consistencia de color que evalúa IE5.
