/* Lógica del dashboard: filtros, agregaciones, conclusiones y render.
   Las agregaciones replican las de src/analisis.py —umbral de votos por tipo,
   medianas como cortes, bandas de nota precalculadas en Python— para que el
   dashboard y el informe nunca muestren cifras distintas. */

const D = window.DATOS;
const ET = D.etiquetas;
const COMPARTIDOS = new Set(D.generosCompartidos);
const IDX_PAIS = n => ET.pais.indexOf(n);
const estado = { tipo: null, generos: [], paises: [], idiomas: [], anioMin: 0, anioMax: 15 };
const MOVIMIENTO = !matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── Filtrado y agregación ────────────────────────────────────────────────── */
function filtrar() {
  const { tipo, generos, paises, idiomas, anioMin, anioMax } = estado;
  const gs = generos.length ? new Set(generos) : null, ps = paises.length ? new Set(paises) : null,
        is = idiomas.length ? new Set(idiomas) : null;
  return D.titulos.filter(t => (tipo === null || t.p === tipo) && t.a >= anioMin && t.a <= anioMax &&
    (!is || is.has(t.i)) && (!gs || t.g.some(g => gs.has(g))) && (!ps || t.c.some(c => ps.has(c))));
}
const mediana = a => { if (!a.length) return null; const s = [...a].sort((x, y) => x - y), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const promedio = a => a.length ? a.reduce((s, v) => s + v, 0) / a.length : null;
/* Solo títulos con votación suficiente entran a un ranking por nota. */
const conVotos = f => f.filter(t => t.v === 1);
const hayFiltros = () => estado.tipo !== null || estado.generos.length || estado.paises.length || estado.idiomas.length || estado.anioMin > 0 || estado.anioMax < 15;

function porDimension(filas, campo, minimo) {
  const acc = new Map();
  conVotos(filas).forEach(t => new Set(t[campo]).forEach(i => { if (!acc.has(i)) acc.set(i, []); acc.get(i).push(t.n); }));
  return [...acc].filter(([, n]) => n.length >= minimo).map(([idx, n]) => ({ idx, titulos: n.length, nota: promedio(n) }))
    .sort((a, b) => b.nota - a.nota);
}
function volumenPor(filas, campo) {
  const acc = new Map();
  filas.forEach(t => new Set(campo === 'i' ? (t.i < 0 ? [] : [t.i]) : t[campo]).forEach(i => acc.set(i, (acc.get(i) || 0) + 1)));
  return [...acc].map(([idx, valor]) => ({ idx, valor })).sort((a, b) => b.valor - a.valor);
}
const minimoGenero = f => Math.max(20, Math.round(conVotos(f).length * .012));
const minimoPais = f => Math.max(20, Math.round(conVotos(f).length * .008));
const pct = (a, b) => b ? num(a / b * 100, 0) + '%' : '—';
const titulo = (id, txt) => { const h = document.getElementById(id); if (h) h.textContent = txt; };
const bajo = s => s.charAt(0).toLowerCase() + s.slice(1);

/* Línea base: el catálogo completo. Los KPIs muestran cuánto se aleja la
   selección de ahí, que es lo que hace útil filtrar. */
const BASE = { nota: promedio(conVotos(D.titulos).map(t => t.n)), roi: mediana(D.titulos.filter(t => t.r != null).map(t => t.r)) };

/* ── KPIs ─────────────────────────────────────────────────────────────────── */
function contar(nodo, destino, formato) {
  const desde = parseFloat(nodo.dataset.v || 0);
  nodo.dataset.v = destino;
  if (!MOVIMIENTO || desde === destino) { nodo.textContent = formato(destino); return; }
  const t0 = performance.now(), dur = 550;
  const paso = ahora => {
    const p = Math.min((ahora - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
    nodo.textContent = formato(desde + (destino - desde) * e);
    if (p < 1 && nodo.dataset.v == destino) requestAnimationFrame(paso);
    else if (p >= 1) nodo.textContent = formato(destino);   // siempre termina en el valor exacto
  };
  requestAnimationFrame(paso);
}
function kpi(id, valor, formato, base, delta) {
  const caja = document.getElementById(id), v = caja.querySelector('.valor');
  caja.classList.toggle('sin-datos', valor == null);
  /* Sin datos se dice "sin datos", nunca cero: un cero es un valor. */
  if (valor == null) { v.dataset.v = ''; v.textContent = 'sin datos'; }
  else if (typeof valor === 'number') contar(v, valor, formato); else v.textContent = valor;
  caja.querySelector('.base').textContent = base || '';
  const d = caja.querySelector('.delta');
  if (!d) return;
  if (delta == null || valor == null || !hayFiltros()) {
    d.hidden = false; d.className = 'delta igual'; d.textContent = 'catálogo completo';
    if (valor == null) d.hidden = true; return;
  }
  const { dif, fmt } = delta, cero = Math.abs(dif) < 0.005;
  d.hidden = false;
  d.className = 'delta ' + (cero ? 'igual' : dif > 0 ? 'sube' : 'baja');
  /* Flecha además de color: el cambio se lee sin distinguir verde de rojo. */
  d.textContent = cero ? '= igual al catálogo' : `${dif > 0 ? '▲ +' : '▼ −'}${fmt(Math.abs(dif))} vs catálogo`;
}
function kpis(filas) {
  const pel = filas.filter(t => t.p === 0).length, ser = filas.length - pel;
  kpi('kpi-total', filas.length, v => num(Math.round(v)), `de ${num(D.titulos.length)} en el catálogo`);
  document.getElementById('mb-pel').style.width = filas.length ? pel / filas.length * 100 + '%' : '0';
  document.getElementById('mb-ser').style.width = filas.length ? ser / filas.length * 100 + '%' : '0';
  document.getElementById('ml-pel').textContent = `${num(pel)} películas`;
  document.getElementById('ml-ser').textContent = `${num(ser)} series`;

  const suf = conVotos(filas), nota = promedio(suf.map(t => t.n));
  kpi('kpi-nota', nota, v => num(v, 2), `sobre ${num(suf.length)} títulos con votos suficientes`,
    nota == null ? null : { dif: nota - BASE.nota, fmt: v => num(v, 2) });

  const rois = filas.filter(t => t.r != null).map(t => t.r), roi = mediana(rois);
  kpi('kpi-roi', roi, v => num(v, 2) + '×', rois.length ? `recauda por cada dólar invertido · ${num(rois.length)} películas con datos` : 'ningún título del filtro tiene datos financieros',
    roi == null ? null : { dif: roi - BASE.roi, fmt: v => num(v, 2) + '×' });

  const lider = volumenPor(filas, 'g')[0];
  kpi('kpi-genero', lider ? ET.genero[lider.idx] : null, null, lider ? `presente en el ${pct(lider.valor, filas.length)} de la selección · ${num(lider.valor)} títulos` : '');
}

/* ── Página 1 · contexto ──────────────────────────────────────────────────── */
function pagina1(filas) {
  const gen = volumenPor(filas, 'g').slice(0, 12);
  barrasH(document.getElementById('g-vol-genero'), gen.map(d => ({ etiqueta: ET.genero[d.idx], valor: d.valor })), { unidad: 'títulos' });
  titulo('t-vol-genero', gen.length ? `${ET.genero[gen[0].idx]} aparece en el ${pct(gen[0].valor, filas.length)} de los títulos` : 'Sin títulos en la selección');

  const pais = volumenPor(filas, 'c').slice(0, 12);
  barrasH(document.getElementById('g-vol-pais'), pais.map(d => ({ etiqueta: ET.pais[d.idx], valor: d.valor })), { unidad: 'títulos' });
  titulo('t-vol-pais', !pais.length ? 'Sin títulos en la selección' : pais.length === 1 ? `${ET.pais[pais[0].idx]} es el único país de la selección`
    : `${ET.pais[pais[0].idx]} aporta ${num(pais[0].valor / pais[1].valor, 1)} veces lo que ${ET.pais[pais[1].idx]}, el segundo`);

  const idi = volumenPor(filas, 'i').slice(0, 10);
  barrasH(document.getElementById('g-vol-idioma'), idi.map(d => ({ etiqueta: ET.idioma[d.idx], valor: d.valor })), { unidad: 'títulos' });
  titulo('t-vol-idioma', idi.length ? `El ${bajo(ET.idioma[idi[0].idx])} es el ${pct(idi[0].valor, filas.length)} de la selección` : 'Sin títulos en la selección');
}

/* ── Página 2 · hallazgo ──────────────────────────────────────────────────── */
function pagina2(filas) {
  /* Sin filtro de tipo, el ranking de géneros usa solo los 8 comunes: mezclar
     taxonomías pondría "Ciencia ficción y fantasía" (solo series) a competir
     con "Comedia" y parecería el mejor género cuando lo que se ve es que las
     series puntúan más alto en general. */
  const mezclado = estado.tipo === null, minG = minimoGenero(filas);
  /* Sin recortar: cortar a los N mejores escondía justamente a los peores, y el
     título declaraba "el peor" a uno que no lo era (acción en vez de terror). */
  const gen = porDimension(filas, 'g', minG).filter(d => !mezclado || COMPARTIDOS.has(d.idx));
  puntos(document.getElementById('g-nota-genero'), gen.map(d => ({
    etiqueta: ET.genero[d.idx], valor: d.nota, tip: `<b>${ET.genero[d.idx]}</b><br>Nota ${num(d.nota, 2)} · ${num(d.titulos)} títulos` })));
  titulo('t-nota-genero', gen.length > 1 ? `${ET.genero[gen[0].idx]} es el mejor evaluado (${num(gen[0].nota, 2)}); ${bajo(ET.genero[gen.at(-1).idx])}, el peor (${num(gen.at(-1).nota, 2)})` : 'Muy pocos títulos para comparar géneros');
  document.getElementById('nota-genero-min').textContent = mezclado
    ? `Solo los 8 géneros comunes a películas y series. Filtra por tipo para ver la taxonomía completa. Mínimo ${num(minG)} títulos.`
    : `Taxonomía de ${ET.tipo[estado.tipo].toLowerCase()}s · géneros con al menos ${num(minG)} títulos con votos suficientes.`;

  /* Los 15 países con más títulos, ordenados por nota: el mismo criterio del
     informe, donde Estados Unidos es el último de los quince. */
  const minP = minimoPais(filas);
  const pais = porDimension(filas, 'c', minP).sort((a, b) => b.titulos - a.titulos).slice(0, 15).sort((a, b) => b.nota - a.nota);
  const eeuu = IDX_PAIS('Estados Unidos');
  const todos = porDimension(filas, 'c', minP), posEeuu = todos.findIndex(d => d.idx === eeuu);
  puntos(document.getElementById('g-nota-pais'), pais.map(d => ({
    etiqueta: ET.pais[d.idx], valor: d.nota, color: d.idx === eeuu ? C.naranja : C.azul,
    tip: `<b>${ET.pais[d.idx]}</b><br>Nota ${num(d.nota, 2)} · ${num(d.titulos)} títulos` })));
  titulo('t-nota-pais', !pais.length ? 'Muy pocos títulos para comparar países'
    : `${ET.pais[pais[0].idx]} lidera la recepción (${num(pais[0].nota, 2)})` + (posEeuu > 0 ? `; ${posEeuu} ${posEeuu === 1 ? 'país supera' : 'países superan'} a Estados Unidos` : ''));
  document.getElementById('nota-pais-min').textContent = `Los ${pais.length} países con más títulos, ordenados por nota. Estados Unidos, en naranja, como referencia.`;

  const acc = new Map();
  conVotos(filas).forEach(t => new Set(t.g).forEach(g => {
    if (!COMPARTIDOS.has(g)) return;
    if (!acc.has(g)) acc.set(g, [[], []]); acc.get(g)[t.p].push(t.n);
  }));
  const comp = [...acc].filter(([, [a, b]]) => a.length >= 30 && b.length >= 30)
    .map(([g, [a, b]]) => ({ etiqueta: ET.genero[g], a: promedio(a), b: promedio(b), na: a.length, nb: b.length }))
    .sort((x, y) => (y.b - y.a) - (x.b - x.a));
  mancuerna(document.getElementById('g-tipo'), comp);
  const ganan = comp.filter(d => d.b > d.a).length;
  titulo('t-tipo', comp.length ? `Las series superan a las películas en ${ganan} de ${comp.length} géneros comparables` : 'Se necesitan películas y series para comparar');

  /* Bandas de nota precalculadas en Python con el mismo pd.cut del informe. */
  const conRoi = filas.filter(t => t.r != null);
  const bandas = D.bandasNota.map((etiqueta, i) => {
    const sub = conRoi.filter(t => t.z === i).map(t => t.r);
    return { etiqueta, valor: mediana(sub) || 0, n: sub.length, color: C.seq[i + 1] };
  }).filter(b => b.n > 0);
  barrasV(document.getElementById('g-roi'), bandas, { referencia: 1, etiquetaRef: 'punto de equilibrio' });
  const alta = bandas.find(b => b.etiqueta.startsWith('>')), baja = bandas[0];
  titulo('t-roi', !bandas.length ? 'Sin películas con datos financieros en la selección'
    : alta && baja && alta !== baja ? `Sobre nota 7, la película típica recauda ${num(alta.valor, 2)}×; bajo ${baja.etiqueta.replace('< ', '')}, ${num(baja.valor, 2)}×`
    : `La película típica recauda ${num(bandas[0].valor, 2)}× lo invertido`);
  document.getElementById('roi-base').textContent = conRoi.length ? `${num(conRoi.length)} películas con presupuesto y recaudación positivos.` : '';
}

/* ── Página 3 · decisión ──────────────────────────────────────────────────── */
function pagina3(filas) {
  const mezclado = estado.tipo === null;
  const gen = porDimension(filas, 'g', minimoGenero(filas)).filter(d => !mezclado || COMPARTIDOS.has(d.idx));
  const cuerpo = document.querySelector('#tabla-oportunidad tbody');
  if (gen.length < 3) {
    document.getElementById('g-brecha').innerHTML = '<div class="vacio">Muy pocos géneros con títulos suficientes para el cruce.</div>';
    titulo('t-brecha', 'Selección demasiado acotada para el cruce'); cuerpo.innerHTML = ''; titulo('t-tabla', ''); return;
  }
  const cortV = mediana(gen.map(d => d.titulos)), cortN = mediana(gen.map(d => d.nota));
  const SEG = { oportunidad: [C.verde, 'o'], sobreinvertido: [C.rojo, 'v'], neutro: [C.gris, 'o'] };
  const seg = d => d.titulos > cortV && d.nota < cortN ? 'sobreinvertido' : d.titulos < cortV && d.nota > cortN ? 'oportunidad' : 'neutro';
  const marcados = gen.map(d => ({ ...d, seg: seg(d) }));
  dispersion(document.getElementById('g-brecha'), marcados.map(d => ({
    x: d.titulos, y: d.nota, etiqueta: ET.genero[d.idx], color: SEG[d.seg][0], forma: SEG[d.seg][1],
    r: d.seg === 'neutro' ? 5 : 7, destaca: d.seg !== 'neutro',
    tip: `<b>${ET.genero[d.idx]}</b><br>${num(d.titulos)} títulos · nota ${num(d.nota, 2)}` })), {
    cortX: cortV, cortY: cortN, log: true, rotuloX: 'Títulos en el catálogo (escala logarítmica)', rotuloY: 'Nota media ponderada',
    cuadrantes: [
      { titulo: 'OPORTUNIDAD DESATENDIDA', sub: 'buena recepción, poco catálogo', ha: 'start', arriba: true, color: C.verde },
      { titulo: 'SOBREINVERTIDO', sub: 'mucho catálogo, recepción baja', ha: 'end', arriba: false, color: C.rojo }] });
  const opo = marcados.filter(d => d.seg === 'oportunidad').sort((a, b) => b.nota - a.nota);
  const sob = marcados.filter(d => d.seg === 'sobreinvertido');
  const nSob = sob.length === 1 ? '1 género sobreinvertido' : `${sob.length} géneros sobreinvertidos`;
  titulo('t-brecha', !opo.length ? `Ningún género en oportunidad con esta selección; ${nSob}`
    : opo.length === 1 ? `${ET.genero[opo[0].idx]} es la oportunidad desatendida: buena nota con poco catálogo. Del otro lado, ${nSob}`
    : `${opo.length} géneros en oportunidad desatendida, encabezados por ${bajo(ET.genero[opo[0].idx])}; ${nSob}`);
  document.getElementById('brecha-cortes').textContent = `Cortes en las medianas de la selección: ${num(cortV)} títulos y nota ${num(cortN, 2)}.` +
    (mezclado ? ' Solo los 8 géneros comunes; filtra por tipo para ver la taxonomía completa.' : '');

  /* Del diagnóstico a una lista: los títulos concretos del cuadrante verde. */
  const ids = new Set(opo.map(d => d.idx));
  const lista = conVotos(filas).filter(t => t.g.some(g => ids.has(g))).sort((a, b) => b.n - a.n).slice(0, 150);
  cuerpo.innerHTML = lista.length ? lista.map(t => `<tr><td>${escapar(t.t)}</td><td>${ET.tipo[t.p]}</td>
    <td>${t.g.filter(g => ids.has(g)).map(g => escapar(ET.genero[g])).join(', ')}</td><td class="num">${D.anioBase + t.a}</td>
    <td class="num">${num(t.n, 2)}</td><td class="num">${t.r == null ? '—' : num(t.r, 2) + '×'}</td></tr>`).join('')
    : '<tr><td colspan="6" class="vacio">Con estos filtros no hay géneros en el cuadrante de oportunidad.</td></tr>';
  titulo('t-tabla', lista.length ? `Los ${num(lista.length)} títulos mejor evaluados de ${opo.map(d => bajo(ET.genero[d.idx])).join(', ')}` : 'Sin títulos de oportunidad en la selección');
  document.getElementById('tabla-resumen').textContent = lista.length ? 'La lista con la que se pasa del diagnóstico a una decisión concreta. Ordenada por nota ponderada.' : '';
}
const escapar = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* ── Orquestación ─────────────────────────────────────────────────────────── */
/* Se dibuja solo la página visible: una página oculta mide 0 px de ancho y sus
   gráficos quedarían mal dimensionados. Al cambiar de página se dibuja esa. */
const PAGINAS = { p1: pagina1, p2: pagina2, p3: pagina3 };
let paginaActual = 'p1';
function render() {
  const filas = filtrar();
  document.getElementById('recuento').innerHTML = `<b>${num(filas.length)}</b> de ${num(D.titulos.length)} títulos`;
  ['f-genero', 'f-pais', 'f-idioma'].forEach(id => document.getElementById(id).actualizar?.());
  kpis(filas);
  PAGINAS[paginaActual](filas);
}

/* ── Controles ────────────────────────────────────────────────────────────── */
function cuentasPor(campo, propio) {
  const guardado = estado[propio]; estado[propio] = [];
  const filas = filtrar(); estado[propio] = guardado;
  const acc = new Map();
  filas.forEach(t => new Set(campo === 'i' ? (t.i < 0 ? [] : [t.i]) : t[campo]).forEach(i => acc.set(i, (acc.get(i) || 0) + 1)));
  return acc;
}
function llenarMenu(id, etiquetas, campo, cuentas) {
  const menu = document.getElementById(id), panel = menu.querySelector('.panel'), resumen = menu.querySelector('summary');
  panel.innerHTML = etiquetas.map((e, i) => [e, i]).sort((a, b) => a[0].localeCompare(b[0], 'es'))
    .map(([e, i]) => `<label><input type="checkbox" value="${i}"><span>${escapar(e)}</span><span class="cuenta" data-idx="${i}"></span></label>`).join('');
  panel.addEventListener('change', () => { estado[campo] = [...panel.querySelectorAll('input:checked')].map(i => +i.value); render(); });
  menu.actualizar = () => {
    const n = estado[campo].length;
    resumen.textContent = n === 0 ? 'Todos' : n === 1 ? etiquetas[estado[campo][0]] : `${n} seleccionados`;
    resumen.classList.toggle('activo', n > 0);
    const c = cuentas();
    panel.querySelectorAll('.cuenta').forEach(s => { const v = c.get(+s.dataset.idx) || 0; s.textContent = num(v); s.style.opacity = v ? '.9' : '.4'; });
  };
  menu.limpiar = () => panel.querySelectorAll('input').forEach(i => (i.checked = false));
}
document.addEventListener('click', e => document.querySelectorAll('details.menu[open]').forEach(m => { if (!m.contains(e.target)) m.open = false; }));

function iniciar() {
  llenarMenu('f-genero', ET.genero, 'generos', () => cuentasPor('g', 'generos'));
  llenarMenu('f-pais', ET.pais, 'paises', () => cuentasPor('c', 'paises'));
  llenarMenu('f-idioma', ET.idioma, 'idiomas', () => cuentasPor('i', 'idiomas'));

  document.querySelectorAll('#f-tipo button').forEach(b => b.addEventListener('click', () => {
    document.querySelectorAll('#f-tipo button').forEach(o => o.setAttribute('aria-pressed', String(o === b)));
    estado.tipo = b.dataset.tipo === '' ? null : +b.dataset.tipo; render();
  }));

  const min = document.getElementById('f-anio-min'), max = document.getElementById('f-anio-max');
  const anios = () => {
    if (+min.value > +max.value) [min.value, max.value] = [max.value, min.value];  // nunca un rango vacío
    estado.anioMin = +min.value; estado.anioMax = +max.value;
    document.getElementById('sal-min').textContent = D.anioBase + estado.anioMin;
    document.getElementById('sal-max').textContent = D.anioBase + estado.anioMax;
    render();
  };
  min.addEventListener('input', anios); max.addEventListener('input', anios);

  document.getElementById('limpiar').addEventListener('click', () => {
    Object.assign(estado, { tipo: null, generos: [], paises: [], idiomas: [] });
    ['f-genero', 'f-pais', 'f-idioma'].forEach(id => document.getElementById(id).limpiar());
    document.querySelectorAll('#f-tipo button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.tipo === '')));
    min.value = 0; max.value = 15; anios();
  });

  document.querySelectorAll('nav button').forEach(b => b.addEventListener('click', () => {
    document.querySelectorAll('nav button').forEach(o => o.removeAttribute('aria-current'));
    b.setAttribute('aria-current', 'page');
    paginaActual = b.dataset.pagina;
    document.querySelectorAll('.pagina').forEach(p => (p.hidden = p.id !== paginaActual));
    render(); scrollTo({ top: 0, behavior: MOVIMIENTO ? 'smooth' : 'auto' });
  }));

  /* Pantalla completa: para presentar sin barras del navegador. Tecla F. */
  const pc = document.getElementById('pantalla');
  if (!document.fullscreenEnabled) pc.hidden = true;
  const alternar = () => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
  pc.addEventListener('click', alternar);
  document.addEventListener('keydown', e => { if (e.key.toLowerCase() === 'f' && !e.target.closest('input,summary')) alternar(); });

  let espera; addEventListener('resize', () => { clearTimeout(espera); espera = setTimeout(render, 160); });
  render();
}
document.addEventListener('DOMContentLoaded', iniciar);
