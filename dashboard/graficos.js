/* Helpers de gráfico del dashboard.
   Mismas formas y reglas que src/graficos.py: barras solo donde el cero es
   significativo, puntos para las notas, grilla recesiva, etiqueta directa y
   forma además de color.

   Cada gráfico se dibuja al ANCHO REAL de su contenedor. Antes el SVG tenía un
   viewBox fijo y el navegador lo escalaba: en una tarjeta ancha el texto de los
   ejes quedaba el doble de grande que el de la página. */

const NS = 'http://www.w3.org/2000/svg';
const C = {
  azul: '#2a78d6', naranja: '#eb6834', verde: '#0ca30c', rojo: '#d03b3b', ambar: '#eda100',
  gris: '#898781',        // gris de MARCA (puntos "resto"); el texto usa --tenue
  ctx: '#c3c2b7', fondo: '#fcfcfb',
  seq: ['#cde2fb', '#9ec5f4', '#6da7ec', '#3987e5', '#2a78d6', '#1c5cab', '#104281']
};
const COLOR_TIPO = { 'Película': C.azul, 'Serie': C.naranja };

/* Convención chilena: coma decimal y punto de miles. */
const num = (v, d = 0) => v.toLocaleString('es-CL', { minimumFractionDigits: d, maximumFractionDigits: d });

const el = (t, attrs = {}) => {
  const n = document.createElementNS(NS, t);
  for (const k in attrs) n.setAttribute(k, attrs[k]);
  return n;
};
const texto = (x, y, s, cls, extra = {}) => { const n = el('text', { x, y, class: cls, ...extra }); n.textContent = s; return n; };
/* Marcas de eje en valores redondos (1-2-2,5-5 × 10^k). Un eje que marca
   6,65 · 6,79 · 6,94 obliga a leer cada número; uno que marca 6,7 · 6,8 · 6,9
   se entiende de un vistazo. */
function marcasEje(min, max, n = 5) {
  const bruto = (max - min) / n, pot = Math.pow(10, Math.floor(Math.log10(bruto)));
  const paso = [1, 2, 2.5, 5, 10].map(f => f * pot).find(p => p >= bruto);
  const out = [];
  for (let v = Math.ceil(min / paso - 1e-9) * paso; v <= max + 1e-9; v += paso) out.push(+v.toFixed(6));
  return { valores: out, dec: Math.max(0, -Math.floor(Math.log10(paso) + 1e-9)) + (paso / pot === 2.5 ? 1 : 0) };
}
const retraso = i => `animation-delay:${Math.min(i * 28, 400)}ms`;

/* ── Tooltip ──────────────────────────────────────────────────────────────── */
const tip = () => document.getElementById('tooltip');
function conTooltip(nodo, html) {
  const mover = e => {
    const t = tip(), r = t.getBoundingClientRect();
    let x = e.clientX + 14, y = e.clientY + 14;
    if (x + r.width > innerWidth - 8) x = e.clientX - r.width - 14;
    if (y + r.height > innerHeight - 8) y = e.clientY - r.height - 14;
    t.style.left = x + 'px'; t.style.top = y + 'px';
  };
  nodo.addEventListener('pointerenter', e => { const t = tip(); t.innerHTML = html; t.style.opacity = '1'; mover(e); });
  nodo.addEventListener('pointermove', mover);
  nodo.addEventListener('pointerleave', () => { tip().style.opacity = '0'; });
}

function lienzo(cont, alto) {
  const ancho = Math.max(Math.floor(cont.clientWidth), 300);
  const svg = el('svg', { width: ancho, height: alto, viewBox: `0 0 ${ancho} ${alto}`, role: 'img' });
  return [svg, ancho];
}
function vaciar(cont, filas, mensaje) {
  cont.innerHTML = '';
  if (!filas || !filas.length) {
    const d = document.createElement('div');
    d.className = 'vacio';
    d.textContent = mensaje || 'Sin títulos que cumplan los filtros seleccionados.';
    cont.appendChild(d);
    return true;
  }
  return false;
}

/* Formas: verde y rojo miden ΔE 4,1 bajo deuteranopía, así que cada segmento
   lleva además su propia forma. */
function marca(forma, cx, cy, r, color, i = 0) {
  const comun = { fill: color, stroke: C.fondo, 'stroke-width': 1.5, class: 'aparece', style: retraso(i) };
  if (forma === 'v') { const k = r * 1.25; return el('polygon', { points: `${cx - k},${cy - k * .8} ${cx + k},${cy - k * .8} ${cx},${cy + k}`, ...comun }); }
  if (forma === 's') return el('rect', { x: cx - r, y: cy - r, width: r * 2, height: r * 2, rx: 1.5, ...comun });
  if (forma === 'D') { const k = r * 1.2; return el('polygon', { points: `${cx},${cy - k} ${cx + k},${cy} ${cx},${cy + k} ${cx - k},${cy}`, ...comun }); }
  return el('circle', { cx, cy, r, ...comun });
}

/* ── Barras horizontales desde cero (solo conteos) ────────────────────────── */
function barrasH(cont, datos, { color = C.azul, formato = v => num(v), unidad = '' } = {}) {
  if (vaciar(cont, datos)) return;
  const fila = 27, izq = Math.min(150, Math.max(96, ...datos.map(d => d.etiqueta.length * 6.6 + 14)));
  const [svg, ancho] = lienzo(cont, datos.length * fila + 4);
  const der = 62, max = Math.max(...datos.map(d => d.valor)) || 1;
  datos.forEach((d, i) => {
    const y = i * fila + 3, w = Math.max((d.valor / max) * (ancho - izq - der), 2);
    const g = el('g', { class: 'marca-g' });
    g.appendChild(el('rect', { x: izq, y, width: w, height: fila - 10, fill: d.color || color, rx: 4, class: 'crece-x', style: retraso(i) }));
    g.appendChild(texto(izq - 10, y + 12.5, d.etiqueta, 'cat-texto', { 'text-anchor': 'end' }));
    g.appendChild(texto(izq + w + 8, y + 12.5, formato(d.valor), 'valor-texto'));
    conTooltip(g, `<b>${d.etiqueta}</b><br>${formato(d.valor)} ${unidad}`);
    svg.appendChild(g);
  });
  cont.appendChild(svg);
}

/* ── Dot plot (notas): la posición no necesita origen en cero ─────────────── */
function puntos(cont, datos, { formato = v => num(v, 2), resaltar = {} } = {}) {
  if (vaciar(cont, datos)) return;
  const fila = 26, izq = Math.min(190, Math.max(110, ...datos.map(d => d.etiqueta.length * 6.6 + 16))), der = 58;
  const [svg, ancho] = lienzo(cont, datos.length * fila + 30);
  let min = Math.min(...datos.map(d => d.valor)), max = Math.max(...datos.map(d => d.valor));
  const pad = (max - min) * .15 || .25; min -= pad; max += pad;
  const x = v => izq + ((v - min) / (max - min)) * (ancho - izq - der);
  const mp = marcasEje(min, max, 6);
  mp.valores.forEach(v => {
    svg.appendChild(el('line', { x1: x(v), x2: x(v), y1: 0, y2: datos.length * fila, class: 'grilla-linea' }));
    svg.appendChild(texto(x(v), datos.length * fila + 17, num(v, mp.dec), 'eje-texto', { 'text-anchor': 'middle' }));
  });
  datos.forEach((d, i) => {
    const y = i * fila + 13, cx = x(d.valor), col = resaltar[d.etiqueta] || d.color || C.azul;
    const g = el('g', { class: 'marca-g' });
    g.appendChild(el('line', { x1: izq, x2: cx, y1: y, y2: y, stroke: '#e8e7e1', 'stroke-width': 1.3, class: 'crece-x', style: retraso(i) }));
    g.appendChild(marca(d.forma || 'o', cx, y, 6, col, i));
    g.appendChild(texto(izq - 10, y + 4, d.etiqueta, 'cat-texto', { 'text-anchor': 'end' }));
    g.appendChild(texto(cx + 12, y + 4, formato(d.valor), 'valor-texto'));
    conTooltip(g, d.tip || `<b>${d.etiqueta}</b><br>${formato(d.valor)}`);
    svg.appendChild(g);
  });
  cont.appendChild(svg);
}

/* ── Barras verticales desde cero, con línea de referencia ────────────────── */
function barrasV(cont, datos, { referencia = null, etiquetaRef = '', formato = v => num(v, 2) + '×' } = {}) {
  if (vaciar(cont, datos)) return;
  const alto = 272, m = { arriba: 24, abajo: 46, izq: 44, der: 12 };
  const [svg, ancho] = lienzo(cont, alto);
  const mp = marcasEje(0, Math.max(...datos.map(d => d.valor), referencia || 0) * 1.12, 4);
  const max = mp.valores.at(-1) < Math.max(...datos.map(d => d.valor)) * 1.1 ? Math.max(...datos.map(d => d.valor)) * 1.15 : mp.valores.at(-1);
  const y = v => alto - m.abajo - (v / max) * (alto - m.arriba - m.abajo);
  const paso = (ancho - m.izq - m.der) / datos.length;
  mp.valores.filter(v => v <= max).forEach(v => {
    svg.appendChild(el('line', { x1: m.izq, x2: ancho - m.der, y1: y(v), y2: y(v), class: 'grilla-linea' }));
    svg.appendChild(texto(m.izq - 8, y(v) + 4, num(v, mp.dec), 'eje-texto', { 'text-anchor': 'end' }));
  });
  /* La línea de equilibrio va encima de las barras para que se vea cruzarlas, y
     su rótulo vive en la leyenda: dentro del gráfico chocaba con la barra más alta. */
  const capa = el('g');
  datos.forEach((d, i) => {
    const cx = m.izq + paso * i + paso / 2, w = Math.min(paso * .58, 70);
    const g = el('g', { class: 'marca-g' });
    g.appendChild(el('rect', { x: cx - w / 2, y: y(d.valor), width: w, height: Math.max(alto - m.abajo - y(d.valor), 1),
      fill: d.color || C.azul, rx: 4, class: 'crece-y', style: retraso(i * 2) }));
    g.appendChild(texto(cx, y(d.valor) - 8, formato(d.valor), 'valor-texto', { 'text-anchor': 'middle' }));
    g.appendChild(texto(cx, alto - m.abajo + 17, d.etiqueta, 'eje-texto', { 'text-anchor': 'middle' }));
    g.appendChild(texto(cx, alto - m.abajo + 32, 'n = ' + num(d.n), 'ctx-texto', { 'text-anchor': 'middle' }));
    conTooltip(g, `<b>Nota ${d.etiqueta}</b><br>La película típica recauda ${formato(d.valor)} lo invertido<br>${num(d.n)} películas`);
    capa.appendChild(g);
  });
  svg.appendChild(capa);
  if (referencia != null)
    svg.appendChild(el('line', { x1: m.izq, x2: ancho - m.der, y1: y(referencia), y2: y(referencia),
      stroke: C.rojo, 'stroke-width': 1.5, 'stroke-dasharray': '5 4', 'pointer-events': 'none' }));
  cont.appendChild(svg);
}

/* ── Dispersión con cuadrantes ────────────────────────────────────────────── */
function dispersion(cont, datos, o) {
  if (vaciar(cont, datos)) return;
  const alto = 430, m = { arriba: 40, abajo: 50, izq: 58, der: 24 };
  const [svg, ancho] = lienzo(cont, alto);
  const tx = o.log ? Math.log10 : (v => v);
  const rango = (a, f) => { const mn = Math.min(...a), mx = Math.max(...a), p = (mx - mn) * f || 1; return [mn - p, mx + p]; };
  const [x0, x1] = rango(datos.map(d => tx(d.x)), .12), [y0, y1] = rango(datos.map(d => d.y), .2);
  const X = v => m.izq + ((tx(v) - x0) / (x1 - x0)) * (ancho - m.izq - m.der);
  const Y = v => alto - m.abajo - ((v - y0) / (y1 - y0)) * (alto - m.arriba - m.abajo);
  const my = marcasEje(y0, y1, 5);
  my.valores.forEach(v => {
    svg.appendChild(el('line', { x1: m.izq, x2: ancho - m.der, y1: Y(v), y2: Y(v), class: 'grilla-linea' }));
    svg.appendChild(texto(m.izq - 8, Y(v) + 4, num(v, my.dec), 'eje-texto', { 'text-anchor': 'end' }));
  });
  [300, 500, 1000, 2000, 3000, 5000, 10000].filter(v => tx(v) > x0 && tx(v) < x1).forEach(v =>
    svg.appendChild(texto(X(v), alto - m.abajo + 16, num(v), 'eje-texto', { 'text-anchor': 'middle' })));
  const corte = { stroke: C.ctx, 'stroke-width': 1, 'stroke-dasharray': '5 4' };
  svg.appendChild(el('line', { x1: X(o.cortX), x2: X(o.cortX), y1: m.arriba - 10, y2: alto - m.abajo, ...corte }));
  svg.appendChild(el('line', { x1: m.izq, x2: ancho - m.der, y1: Y(o.cortY), y2: Y(o.cortY), ...corte }));
  (o.cuadrantes || []).forEach(q => {
    const px = q.ha === 'end' ? ancho - m.der : m.izq + 6, py = q.arriba ? m.arriba - 14 : alto - m.abajo - 22;
    svg.appendChild(texto(px, py, q.titulo, 'ctx-texto', { 'text-anchor': q.ha, style: `fill:${q.color};font-weight:700;letter-spacing:.06em` }));
    svg.appendChild(texto(px, py + 14, q.sub, 'ctx-texto', { 'text-anchor': q.ha }));
  });
  svg.appendChild(texto((m.izq + ancho - m.der) / 2, alto - 8, o.rotuloX, 'eje-texto', { 'text-anchor': 'middle' }));
  svg.appendChild(texto(-(alto - m.abajo + m.arriba) / 2, 14, o.rotuloY, 'eje-texto', { 'text-anchor': 'middle', transform: 'rotate(-90)' }));
  datos.forEach((d, i) => {
    const g = el('g', { class: 'marca-g' }), r = d.r || 6;
    g.appendChild(marca(d.forma || 'o', X(d.x), Y(d.y), r, d.color, i));
    if (d.etiqueta) g.appendChild(texto(X(d.x), Y(d.y) - r - 7, d.etiqueta, d.destaca ? 'valor-texto' : 'ctx-texto', { 'text-anchor': 'middle' }));
    conTooltip(g, d.tip);
    svg.appendChild(g);
  });
  cont.appendChild(svg);
}

/* ── Mancuerna (película contra serie) ────────────────────────────────────── */
function mancuerna(cont, datos, { formato = v => num(v, 2) } = {}) {
  if (vaciar(cont, datos, 'La comparación necesita películas y series: quita el filtro de tipo para verla.')) return;
  const fila = 30, izq = 104, der = 24;
  const [svg, ancho] = lienzo(cont, datos.length * fila + 32);
  let min = Math.min(...datos.flatMap(d => [d.a, d.b])), max = Math.max(...datos.flatMap(d => [d.a, d.b]));
  const pad = (max - min) * .16 || .3; min -= pad; max += pad;
  const X = v => izq + ((v - min) / (max - min)) * (ancho - izq - der);
  const mp = marcasEje(min, max, 6);
  mp.valores.forEach(v => {
    svg.appendChild(el('line', { x1: X(v), x2: X(v), y1: 0, y2: datos.length * fila, class: 'grilla-linea' }));
    svg.appendChild(texto(X(v), datos.length * fila + 17, num(v, mp.dec), 'eje-texto', { 'text-anchor': 'middle' }));
  });
  datos.forEach((d, i) => {
    const y = i * fila + 16, g = el('g', { class: 'marca-g' });
    g.appendChild(el('line', { x1: X(d.a), x2: X(d.b), y1: y, y2: y, stroke: C.ctx, 'stroke-width': 2.5, 'stroke-linecap': 'round', class: 'crece-x', style: retraso(i) }));
    g.appendChild(marca('o', X(d.a), y, 6, COLOR_TIPO['Película'], i));
    g.appendChild(marca('s', X(d.b), y, 5.5, COLOR_TIPO['Serie'], i));
    g.appendChild(texto(izq - 10, y + 4, d.etiqueta, 'cat-texto', { 'text-anchor': 'end' }));
    const dif = d.b - d.a;
    g.appendChild(texto((X(d.a) + X(d.b)) / 2, y - 9, (dif >= 0 ? '+' : '−') + num(Math.abs(dif), 2), 'ctx-texto', { 'text-anchor': 'middle' }));
    conTooltip(g, `<b>${d.etiqueta}</b><br>Película ${formato(d.a)} · ${num(d.na)} títulos<br>Serie ${formato(d.b)} · ${num(d.nb)} títulos`);
    svg.appendChild(g);
  });
  cont.appendChild(svg);
}
