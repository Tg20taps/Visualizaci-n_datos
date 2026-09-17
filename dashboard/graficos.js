/* Helpers de gráfico del dashboard.
   Mismas formas y mismas reglas que src/graficos.py: sin ejes truncados en
   barras, grilla solo en el eje del valor, etiqueta directa en vez de que el ojo
   viaje al eje, y color con función semántica fija. */

const NS = 'http://www.w3.org/2000/svg';
const C = {
  azul: '#2a78d6', naranja: '#eb6834', verde: '#0ca30c', rojo: '#d03b3b',
  ambar: '#eda100', tenue: '#898781', ctx: '#c3c2b7', fondo: '#fcfcfb',
  seq: ['#cde2fb', '#9ec5f4', '#6da7ec', '#3987e5', '#2a78d6', '#1c5cab', '#104281']
};
const COLOR_TIPO = { 'Película': C.azul, 'Serie': C.naranja };

/* Convención numérica chilena: coma decimal, punto de miles. Un eje que dice
   "6.5" se lee "seis mil quinientos" en el idioma de la audiencia. */
const num = (v, d = 0) =>
  v.toLocaleString('es-CL', { minimumFractionDigits: d, maximumFractionDigits: d });

const el = (t, attrs = {}) => {
  const n = document.createElementNS(NS, t);
  for (const k in attrs) n.setAttribute(k, attrs[k]);
  return n;
};
const texto = (x, y, s, cls, extra = {}) => {
  const n = el('text', { x, y, class: cls, ...extra });
  n.textContent = s;
  return n;
};

/* ── Tooltip ──────────────────────────────────────────────────────────────── */
const tip = () => document.getElementById('tooltip');
function conTooltip(nodo, html) {
  nodo.addEventListener('pointerenter', e => {
    const t = tip(); t.innerHTML = html; t.style.opacity = '1';
    mover(e);
  });
  nodo.addEventListener('pointermove', mover);
  nodo.addEventListener('pointerleave', () => { tip().style.opacity = '0'; });
  function mover(e) {
    const t = tip(), r = t.getBoundingClientRect();
    let x = e.clientX + 14, y = e.clientY + 14;
    if (x + r.width > innerWidth - 8) x = e.clientX - r.width - 14;
    if (y + r.height > innerHeight - 8) y = e.clientY - r.height - 14;
    t.style.left = x + 'px'; t.style.top = y + 'px';
  }
}

function lienzo(ancho, alto) {
  const svg = el('svg', { viewBox: `0 0 ${ancho} ${alto}`, role: 'img' });
  return svg;
}

function vaciar(cont, filas) {
  cont.innerHTML = '';
  if (!filas || !filas.length) {
    const d = document.createElement('div');
    d.className = 'vacio';
    d.textContent = 'Sin títulos que cumplan los filtros seleccionados.';
    cont.appendChild(d);
    return true;
  }
  return false;
}

/* ── Barras horizontales desde cero ───────────────────────────────────────────
   Se usan solo para CONTEOS, donde el cero es significativo y el eje parte en
   cero sin discusión. Para notas se usa el dot plot de más abajo. */
function barrasH(cont, datos, { color = C.azul, formato = v => num(v), unidad = '' } = {}) {
  if (vaciar(cont, datos)) return;
  const fila = 26, margenIzq = 122, margenDer = 58, alto = datos.length * fila + 8, ancho = 640;
  const max = Math.max(...datos.map(d => d.valor)) || 1;
  const svg = lienzo(ancho, alto);
  const escala = v => (v / max) * (ancho - margenIzq - margenDer);

  datos.forEach((d, i) => {
    const y = i * fila + 4, w = Math.max(escala(d.valor), 2);
    const g = el('g', { class: 'marca' });
    g.appendChild(el('rect', {
      x: margenIzq, y, width: w, height: fila - 10,
      fill: d.color || color, rx: 3
    }));
    g.appendChild(texto(margenIzq - 9, y + 12, d.etiqueta, 'cat-texto', { 'text-anchor': 'end' }));
    g.appendChild(texto(margenIzq + w + 7, y + 12, formato(d.valor), 'valor-texto'));
    conTooltip(g, `<b>${d.etiqueta}</b><br><span class="t-val">${formato(d.valor)}</span> ${unidad}`);
    svg.appendChild(g);
  });
  cont.appendChild(svg);
}

/* ── Dot plot ─────────────────────────────────────────────────────────────────
   Para notas. La barra codifica magnitud DESDE CERO: con notas entre 5,9 y 7,0
   habría que truncar el eje —prohibido— o dibujar barras indistinguibles. El
   punto codifica por posición y no necesita origen en cero. */
function puntos(cont, datos, { formato = v => num(v, 2), columnaDer = null, tituloDer = '' } = {}) {
  if (vaciar(cont, datos)) return;
  const fila = 25, margenIzq = 132, margenDer = columnaDer ? 108 : 62;
  const alto = datos.length * fila + 34, ancho = 640;
  const vals = datos.map(d => d.valor);
  let min = Math.min(...vals), max = Math.max(...vals);
  const pad = (max - min) * 0.14 || 0.25;
  min -= pad; max += pad;
  const svg = lienzo(ancho, alto);
  const x = v => margenIzq + ((v - min) / (max - min)) * (ancho - margenIzq - margenDer);

  // Grilla vertical recesiva
  const paso = (max - min) / 4;
  for (let i = 0; i <= 4; i++) {
    const v = min + paso * i;
    svg.appendChild(el('line', { x1: x(v), x2: x(v), y1: 0, y2: datos.length * fila, class: 'grilla-linea' }));
    svg.appendChild(texto(x(v), datos.length * fila + 15, num(v, 2), 'eje-texto', { 'text-anchor': 'middle' }));
  }
  if (columnaDer) {
    svg.appendChild(texto(ancho, -6, tituloDer, 'ctx-texto',
      { 'text-anchor': 'end', style: 'font-weight:700' }));
  }

  datos.forEach((d, i) => {
    const y = i * fila + 13, cx = x(d.valor);
    const g = el('g', { class: 'marca' });
    g.appendChild(el('line', { x1: margenIzq, x2: cx, y1: y, y2: y, class: 'grilla-linea', 'stroke-width': 1.2 }));
    g.appendChild(marca(d.forma || 'o', cx, y, 5.5, d.color || C.azul));
    g.appendChild(texto(margenIzq - 9, y + 4, d.etiqueta, 'cat-texto', { 'text-anchor': 'end' }));
    g.appendChild(texto(cx + 11, y + 4, formato(d.valor), 'valor-texto'));
    if (columnaDer) g.appendChild(texto(ancho, y + 4, columnaDer(d), 'ctx-texto', { 'text-anchor': 'end' }));
    conTooltip(g, d.tip || `<b>${d.etiqueta}</b><br><span class="t-val">${formato(d.valor)}</span>`);
    svg.appendChild(g);
  });
  cont.appendChild(svg);
}

/* Formas. El color nunca viaja solo: verde y rojo miden ΔE 4,1 bajo
   deuteranopía —para ese lector son el mismo color— así que cada segmento
   además tiene su propia forma. */
function marca(forma, cx, cy, r, color) {
  const comun = { fill: color, stroke: C.fondo, 'stroke-width': 1.5 };
  if (forma === 'v') {  // triángulo hacia abajo
    const k = r * 1.25;
    return el('polygon', { points: `${cx - k},${cy - k * 0.8} ${cx + k},${cy - k * 0.8} ${cx},${cy + k}`, ...comun });
  }
  if (forma === 's') return el('rect', { x: cx - r, y: cy - r, width: r * 2, height: r * 2, ...comun });
  if (forma === 'D') {
    const k = r * 1.2;
    return el('polygon', { points: `${cx},${cy - k} ${cx + k},${cy} ${cx},${cy + k} ${cx - k},${cy}`, ...comun });
  }
  return el('circle', { cx, cy, r, ...comun });
}

/* ── Barras verticales desde cero, con línea de referencia ────────────────── */
function barrasV(cont, datos, { referencia = null, etiquetaRef = '', formato = v => num(v, 2) + '×' } = {}) {
  if (vaciar(cont, datos)) return;
  const ancho = 620, alto = 268, margen = { arriba: 22, abajo: 46, izq: 46, der: 12 };
  const max = Math.max(...datos.map(d => d.valor), referencia || 0) * 1.22 || 1;
  const svg = lienzo(ancho, alto);
  const y = v => alto - margen.abajo - (v / max) * (alto - margen.arriba - margen.abajo);
  const paso = (ancho - margen.izq - margen.der) / datos.length;

  for (let i = 0; i <= 4; i++) {
    const v = (max / 4) * i;
    svg.appendChild(el('line', { x1: margen.izq, x2: ancho - margen.der, y1: y(v), y2: y(v), class: 'grilla-linea' }));
    svg.appendChild(texto(margen.izq - 7, y(v) + 4, num(v, 1), 'eje-texto', { 'text-anchor': 'end' }));
  }
  if (referencia != null) {
    svg.appendChild(el('line', {
      x1: margen.izq, x2: ancho - margen.der, y1: y(referencia), y2: y(referencia),
      stroke: C.rojo, 'stroke-width': 1.4, 'stroke-dasharray': '5 4'
    }));
    svg.appendChild(texto(margen.izq + 3, y(referencia) - 6, etiquetaRef, 'eje-texto',
      { style: `fill:${C.rojo};font-weight:700` }));
  }

  datos.forEach((d, i) => {
    const cx = margen.izq + paso * i + paso / 2, w = Math.min(paso * 0.6, 62);
    const g = el('g', { class: 'marca' });
    g.appendChild(el('rect', {
      x: cx - w / 2, y: y(d.valor), width: w, height: Math.max(alto - margen.abajo - y(d.valor), 1),
      fill: d.color || C.azul, rx: 3
    }));
    g.appendChild(texto(cx, y(d.valor) - 7, formato(d.valor), 'valor-texto', { 'text-anchor': 'middle' }));
    g.appendChild(texto(cx, alto - margen.abajo + 16, d.etiqueta, 'eje-texto', { 'text-anchor': 'middle' }));
    g.appendChild(texto(cx, alto - margen.abajo + 30, 'n = ' + num(d.n), 'ctx-texto', { 'text-anchor': 'middle' }));
    conTooltip(g, `<b>${d.etiqueta}</b><br><span class="t-val">${formato(d.valor)}</span> · ${num(d.n)} títulos`);
    svg.appendChild(g);
  });
  cont.appendChild(svg);
}

/* ── Dispersión con cuadrantes ────────────────────────────────────────────── */
function dispersion(cont, datos, opciones) {
  if (vaciar(cont, datos)) return;
  const { cortX, cortY, log = false, rotuloX, rotuloY, cuadrantes = [], fmtX = v => num(v), fmtY = v => num(v, 2) } = opciones;
  const ancho = 880, alto = 470, margen = { arriba: 34, abajo: 50, izq: 56, der: 20 };
  const svg = lienzo(ancho, alto);
  const tx = log ? Math.log10 : (v => v);
  const xs = datos.map(d => tx(d.x)), ys = datos.map(d => d.y);
  const pad = (a, f) => { const mn = Math.min(...a), mx = Math.max(...a), p = (mx - mn) * f || 1; return [mn - p, mx + p]; };
  const [x0, x1] = pad(xs, .11), [y0, y1] = pad(ys, .17);
  const X = v => margen.izq + ((tx(v) - x0) / (x1 - x0)) * (ancho - margen.izq - margen.der);
  const Y = v => alto - margen.abajo - ((v - y0) / (y1 - y0)) * (alto - margen.arriba - margen.abajo);

  for (let i = 0; i <= 4; i++) {
    const v = y0 + ((y1 - y0) / 4) * i;
    svg.appendChild(el('line', { x1: margen.izq, x2: ancho - margen.der, y1: Y(v), y2: Y(v), class: 'grilla-linea' }));
    svg.appendChild(texto(margen.izq - 7, Y(v) + 4, fmtY(v), 'eje-texto', { 'text-anchor': 'end' }));
  }
  // Cortes de cuadrante
  svg.appendChild(el('line', { x1: X(cortX), x2: X(cortX), y1: margen.arriba, y2: alto - margen.abajo, stroke: C.ctx, 'stroke-width': 1, 'stroke-dasharray': '5 4' }));
  svg.appendChild(el('line', { x1: margen.izq, x2: ancho - margen.der, y1: Y(cortY), y2: Y(cortY), stroke: C.ctx, 'stroke-width': 1, 'stroke-dasharray': '5 4' }));

  cuadrantes.forEach(q => {
    const px = q.ha === 'end' ? ancho - margen.der - 3 : margen.izq + 5;
    const py = q.arriba ? margen.arriba + 2 : alto - margen.abajo - 16;
    /* El color va como estilo inline: una regla CSS de clase le gana al atributo
       de presentación `fill` y los rótulos saldrían todos en gris. */
    svg.appendChild(texto(px, py, q.titulo, 'ctx-texto',
      { 'text-anchor': q.ha, style: `fill:${q.color};font-weight:700` }));
    svg.appendChild(texto(px, py + 13, q.sub, 'ctx-texto', { 'text-anchor': q.ha }));
  });

  svg.appendChild(texto(ancho / 2, alto - 6, rotuloX, 'eje-texto', { 'text-anchor': 'middle' }));
  svg.appendChild(texto(-(alto / 2), 13, rotuloY, 'eje-texto',
    { 'text-anchor': 'middle', transform: `rotate(-90)`, y: 13, x: -(alto / 2) }));

  datos.forEach(d => {
    const g = el('g', { class: 'marca' });
    g.appendChild(marca(d.forma || 'o', X(d.x), Y(d.y), d.r || 6, d.color));
    if (d.etiqueta) {
      g.appendChild(texto(X(d.x), Y(d.y) - (d.r || 6) - 6, d.etiqueta,
        d.destaca ? 'valor-texto' : 'ctx-texto', { 'text-anchor': 'middle' }));
    }
    conTooltip(g, d.tip);
    svg.appendChild(g);
  });
  cont.appendChild(svg);
}

/* ── Mancuerna ────────────────────────────────────────────────────────────── */
function mancuerna(cont, datos, { formato = v => num(v, 2) } = {}) {
  if (vaciar(cont, datos)) return;
  const fila = 27, margenIzq = 128, margenDer = 60, ancho = 640, alto = datos.length * fila + 34;
  const vals = datos.flatMap(d => [d.a, d.b]);
  let min = Math.min(...vals), max = Math.max(...vals);
  const pad = (max - min) * .16 || .3; min -= pad; max += pad;
  const svg = lienzo(ancho, alto);
  const X = v => margenIzq + ((v - min) / (max - min)) * (ancho - margenIzq - margenDer);

  for (let i = 0; i <= 4; i++) {
    const v = min + ((max - min) / 4) * i;
    svg.appendChild(el('line', { x1: X(v), x2: X(v), y1: 0, y2: datos.length * fila, class: 'grilla-linea' }));
    svg.appendChild(texto(X(v), datos.length * fila + 15, num(v, 2), 'eje-texto', { 'text-anchor': 'middle' }));
  }
  datos.forEach((d, i) => {
    const y = i * fila + 14;
    const g = el('g', { class: 'marca' });
    g.appendChild(el('line', { x1: X(d.a), x2: X(d.b), y1: y, y2: y, stroke: C.ctx, 'stroke-width': 2.5, 'stroke-linecap': 'round' }));
    // Círculo película, cuadrado serie: la forma repite lo que dice el color.
    g.appendChild(marca('o', X(d.a), y, 5.5, COLOR_TIPO['Película']));
    g.appendChild(marca('s', X(d.b), y, 5, COLOR_TIPO['Serie']));
    g.appendChild(texto(margenIzq - 9, y + 4, d.etiqueta, 'cat-texto', { 'text-anchor': 'end' }));
    const dif = d.b - d.a;
    g.appendChild(texto((X(d.a) + X(d.b)) / 2, y - 9,
      (dif >= 0 ? '+' : '−') + num(Math.abs(dif), 2), 'ctx-texto', { 'text-anchor': 'middle' }));
    conTooltip(g, `<b>${d.etiqueta}</b><br>Película <span class="t-val">${formato(d.a)}</span> · ${num(d.na)} títulos<br>Serie <span class="t-val">${formato(d.b)}</span> · ${num(d.nb)} títulos`);
    svg.appendChild(g);
  });
  cont.appendChild(svg);
}

/* ── Barra de composición (parte-todo de 2 categorías) ────────────────────── */
function composicion(cont, partes) {
  cont.innerHTML = '';
  const total = partes.reduce((s, p) => s + p.valor, 0);
  if (!total) { vaciar(cont, null); return; }
  const ancho = 620, alto = 58, svg = lienzo(ancho, alto);
  let x = 0;
  partes.forEach(p => {
    const w = (p.valor / total) * ancho;
    if (w <= 0) return;
    const g = el('g', { class: 'marca' });
    // 2px de aire entre segmentos: el borde del fondo separa los rellenos.
    g.appendChild(el('rect', { x, y: 0, width: Math.max(w - 2, 1), height: 26, fill: p.color, rx: 3 }));
    if (w > 74) {
      g.appendChild(texto(x + 9, 43, p.etiqueta, 'cat-texto'));
      g.appendChild(texto(x + 9, 57, `${num(p.valor)} · ${num(p.valor / total * 100, 1)}%`, 'ctx-texto'));
    }
    conTooltip(g, `<b>${p.etiqueta}</b><br><span class="t-val">${num(p.valor)}</span> títulos · ${num(p.valor / total * 100, 1)}%`);
    svg.appendChild(g);
    x += w;
  });
  cont.appendChild(svg);
}
