/* Lógica del dashboard: filtros, agregaciones y render.
   Las agregaciones replican exactamente las de src/analisis.py — mismo umbral de
   votos por tipo, mismas medianas como cortes, mismo mínimo de títulos — para
   que el dashboard y el informe nunca muestren cifras distintas. */

const D = window.DATOS;
const ET = D.etiquetas;
const UMBRAL = [D.umbralVotos['Película'], D.umbralVotos['Serie']];
const COMPARTIDOS = new Set(D.generosCompartidos);

const estado = { tipo: null, generos: [], paises: [], idiomas: [], anioMin: 0, anioMax: 15 };

/* ── Filtrado ─────────────────────────────────────────────────────────────── */
function filtrar() {
  const { tipo, generos, paises, idiomas, anioMin, anioMax } = estado;
  const gs = generos.length ? new Set(generos) : null;
  const ps = paises.length ? new Set(paises) : null;
  const is = idiomas.length ? new Set(idiomas) : null;
  return D.titulos.filter(t =>
    (tipo === null || t.p === tipo) &&
    t.a >= anioMin && t.a <= anioMax &&
    (!is || is.has(t.i)) &&
    (!gs || t.g.some(g => gs.has(g))) &&
    (!ps || t.c.some(c => ps.has(c)))
  );
}

const mediana = a => {
  if (!a.length) return null;
  const s = [...a].sort((x, y) => x - y), m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
const promedio = a => a.length ? a.reduce((s, v) => s + v, 0) / a.length : null;

/* Solo los títulos con votación suficiente entran a cualquier ranking por nota:
   el 5,6% de las películas y el 23% de las series tienen cero votos, y su nota
   de 0,0 ensuciaría todo promedio. */
const conVotos = filas => filas.filter(t => t.v === 1);

function porDimension(filas, campo, minimo) {
  const acc = new Map();
  conVotos(filas).forEach(t => {
    new Set(t[campo]).forEach(idx => {
      if (!acc.has(idx)) acc.set(idx, []);
      acc.get(idx).push(t.n);
    });
  });
  return [...acc.entries()]
    .filter(([, notas]) => notas.length >= minimo)
    .map(([idx, notas]) => ({ idx, titulos: notas.length, nota: promedio(notas) }))
    .sort((a, b) => b.nota - a.nota);
}

function volumenPor(filas, campo) {
  const acc = new Map();
  filas.forEach(t => new Set(t[campo]).forEach(i => acc.set(i, (acc.get(i) || 0) + 1)));
  return [...acc.entries()].map(([idx, valor]) => ({ idx, valor })).sort((a, b) => b.valor - a.valor);
}

/* ── KPIs ─────────────────────────────────────────────────────────────────── */
function kpis(filas) {
  const sufic = conVotos(filas);
  const rois = filas.filter(t => t.r != null).map(t => t.r);
  const vol = volumenPor(filas, 'g');
  const totalTitulos = filas.length;

  poner('kpi-total', num(totalTitulos), `${num(filas.filter(t => t.p === 0).length)} películas · ${num(filas.filter(t => t.p === 1).length)} series`);

  const notaMedia = promedio(sufic.map(t => t.n));
  poner('kpi-nota', notaMedia == null ? null : num(notaMedia, 2),
    `sobre ${num(sufic.length)} con votación suficiente`);

  /* El ROI lleva su base pegada al número: un indicador financiero sin base
     invita a leerlo como si aplicara a todo el catálogo, series incluidas. */
  const roiMed = mediana(rois);
  poner('kpi-roi', roiMed == null ? null : num(roiMed, 2) + '×',
    rois.length ? `sobre ${num(rois.length)} películas con datos financieros` : 'ningún título del filtro tiene datos financieros');

  const lider = vol[0];
  poner('kpi-genero', lider ? ET.genero[lider.idx] : null,
    lider ? `${num(lider.valor)} títulos · ${num(lider.valor / totalTitulos * 100, 1)}% de la selección` : '');
}

function poner(id, valor, base) {
  const caja = document.getElementById(id);
  const v = caja.querySelector('.valor'), b = caja.querySelector('.base');
  /* Sin datos se dice "sin datos", nunca cero: un cero es un valor, la ausencia
     de dato no lo es. */
  caja.classList.toggle('sin-datos', valor == null);
  v.textContent = valor == null ? 'sin datos' : valor;
  b.textContent = base || '';
}

/* ── Página 1 ─────────────────────────────────────────────────────────────── */
function pagina1(filas) {
  composicion(document.getElementById('g-composicion'), [
    { etiqueta: 'Películas', valor: filas.filter(t => t.p === 0).length, color: COLOR_TIPO['Película'] },
    { etiqueta: 'Series', valor: filas.filter(t => t.p === 1).length, color: COLOR_TIPO['Serie'] }
  ]);
  barrasH(document.getElementById('g-vol-genero'),
    volumenPor(filas, 'g').slice(0, 12).map(d => ({ etiqueta: ET.genero[d.idx], valor: d.valor })),
    { unidad: 'títulos' });
  barrasH(document.getElementById('g-vol-pais'),
    volumenPor(filas, 'c').slice(0, 12).map(d => ({ etiqueta: ET.pais[d.idx], valor: d.valor })),
    { unidad: 'títulos' });
  barrasH(document.getElementById('g-vol-idioma'),
    volumenPor(filas.map(t => ({ ...t, i2: t.i < 0 ? [] : [t.i] })), 'i2').slice(0, 10)
      .map(d => ({ etiqueta: ET.idioma[d.idx], valor: d.valor })),
    { unidad: 'títulos' });
}

/* ── Página 2 ─────────────────────────────────────────────────────────────── */
function pagina2(filas) {
  const minG = Math.max(20, Math.round(conVotos(filas).length * 0.012));
  /* Sin filtro de tipo, el ranking de géneros se limita a los 8 comunes. Las
     películas y las series usan taxonomías distintas: mezclarlas pondría
     "Ciencia ficción y fantasía" —etiqueta que solo existe en series— a competir
     con "Comedia", y el lector concluiría que es el mejor género del catálogo
     cuando lo que está viendo es que las series puntúan más alto en general. */
  const mezclado = estado.tipo === null;
  const gen = porDimension(filas, 'g', minG)
    .filter(d => !mezclado || COMPARTIDOS.has(d.idx))
    .slice(0, 14);
  puntos(document.getElementById('g-nota-genero'),
    gen.map(d => ({
      etiqueta: ET.genero[d.idx], valor: d.nota,
      tip: `<b>${ET.genero[d.idx]}</b><br>Nota <span class="t-val">${num(d.nota, 2)}</span><br>${num(d.titulos)} títulos`
    })),
    { columnaDer: d => '', tituloDer: '' });
  document.getElementById('nota-genero-min').textContent = mezclado
    ? `Solo los 8 géneros comunes a películas y series: los dos tipos usan taxonomías distintas y mezclarlas compararía dos vocabularios. Filtra por tipo para ver la taxonomía completa. Mínimo ${num(minG)} títulos.`
    : `Taxonomía de ${ET.tipo[estado.tipo].toLowerCase()}s. Géneros con al menos ${num(minG)} títulos con votación suficiente.`;

  const minP = Math.max(20, Math.round(conVotos(filas).length * 0.008));
  const pais = porDimension(filas, 'c', minP).slice(0, 14);
  puntos(document.getElementById('g-nota-pais'),
    pais.map(d => ({
      etiqueta: ET.pais[d.idx], valor: d.nota,
      tip: `<b>${ET.pais[d.idx]}</b><br>Nota <span class="t-val">${num(d.nota, 2)}</span><br>${num(d.titulos)} títulos`
    })));
  document.getElementById('nota-pais-min').textContent =
    `Países con al menos ${num(minP)} títulos con votación suficiente.`;

  /* Comparación película vs serie SOLO en los géneros comunes: los dos tipos
     usan taxonomías distintas y de 28 etiquetas solo 8 coinciden. */
  const acc = new Map();
  conVotos(filas).forEach(t => new Set(t.g).forEach(g => {
    if (!COMPARTIDOS.has(g)) return;
    if (!acc.has(g)) acc.set(g, [[], []]);
    acc.get(g)[t.p].push(t.n);
  }));
  const comp = [...acc.entries()]
    .filter(([, [a, b]]) => a.length >= 30 && b.length >= 30)
    .map(([g, [a, b]]) => ({
      etiqueta: ET.genero[g], a: promedio(a), b: promedio(b), na: a.length, nb: b.length
    }))
    .sort((x, y) => (y.b - y.a) - (x.b - x.a));
  mancuerna(document.getElementById('g-tipo'), comp);

  /* ROI por banda de nota, sobre las películas con datos financieros.
     La banda viene precalculada desde Python con el mismo pd.cut del informe:
     recalcularla aquí sobre la nota redondeada movería de banda a los títulos
     que caen justo en un corte. */
  const conRoi = filas.filter(t => t.r != null);
  const bandas = D.bandasNota.map((etiqueta, i) => {
    const sub = conRoi.filter(t => t.z === i).map(t => t.r);
    return { etiqueta, valor: mediana(sub) || 0, n: sub.length, color: C.seq[i + 1] };
  }).filter(b => b.n > 0);
  barrasV(document.getElementById('g-roi'), bandas,
    { referencia: 1, etiquetaRef: 'punto de equilibrio' });
  document.getElementById('roi-base').textContent = conRoi.length
    ? `${num(conRoi.length)} películas con presupuesto y recaudación positivos.`
    : 'Ningún título de la selección tiene datos financieros.';
}

/* ── Página 3 ─────────────────────────────────────────────────────────────── */
function pagina3(filas) {
  const minG = Math.max(20, Math.round(conVotos(filas).length * 0.012));
  const mezclado = estado.tipo === null;
  const gen = porDimension(filas, 'g', minG)
    .filter(d => !mezclado || COMPARTIDOS.has(d.idx));
  if (!gen.length) {
    document.getElementById('g-brecha').innerHTML = '<div class="vacio">Sin géneros con títulos suficientes para el cruce.</div>';
    document.querySelector('#tabla-oportunidad tbody').innerHTML = '';
    return;
  }
  const cortV = mediana(gen.map(d => d.titulos));
  const cortN = mediana(gen.map(d => d.nota));
  const SEG = {
    oportunidad: { color: C.verde, forma: 'o' },
    sobreinvertido: { color: C.rojo, forma: 'v' },
    neutro: { color: C.tenue, forma: 'o' }
  };
  const clasificar = d =>
    d.titulos > cortV && d.nota < cortN ? 'sobreinvertido' :
    d.titulos < cortV && d.nota > cortN ? 'oportunidad' : 'neutro';

  const marcados = gen.map(d => ({ ...d, seg: clasificar(d) }));
  dispersion(document.getElementById('g-brecha'), marcados.map(d => ({
    x: d.titulos, y: d.nota, etiqueta: ET.genero[d.idx],
    color: SEG[d.seg].color, forma: SEG[d.seg].forma,
    r: d.seg === 'neutro' ? 5 : 7, destaca: d.seg !== 'neutro',
    tip: `<b>${ET.genero[d.idx]}</b><br>${num(d.titulos)} títulos<br>Nota <span class="t-val">${num(d.nota, 2)}</span>`
  })), {
    cortX: cortV, cortY: cortN, log: true,
    rotuloX: 'Títulos en el catálogo (escala logarítmica)',
    rotuloY: 'Nota media ponderada',
    cuadrantes: [
      { titulo: 'OPORTUNIDAD DESATENDIDA', sub: 'buena recepción, poco catálogo', ha: 'start', arriba: true, color: C.verde },
      { titulo: 'SOBREINVERTIDO', sub: 'mucho catálogo, recepción baja', ha: 'end', arriba: false, color: C.rojo }
    ]
  });
  document.getElementById('brecha-cortes').textContent =
    `Cortes en las medianas de la selección: ${num(cortV)} títulos y nota ${num(cortN, 2)}.` +
    (mezclado ? ' Solo los 8 géneros comunes; filtra por tipo para ver la taxonomía completa.' : '');

  /* Tabla: los títulos concretos del cuadrante de oportunidad, para que el
     Gerente pase del diagnóstico a una lista sin pedirle nada a nadie. */
  const opor = new Set(marcados.filter(d => d.seg === 'oportunidad').map(d => d.idx));
  const cuerpo = document.querySelector('#tabla-oportunidad tbody');
  const lista = conVotos(filas)
    .filter(t => t.g.some(g => opor.has(g)))
    .sort((a, b) => b.n - a.n)
    .slice(0, 150);
  cuerpo.innerHTML = lista.length ? lista.map(t => `
    <tr>
      <td>${escapar(t.t)}</td>
      <td>${ET.tipo[t.p]}</td>
      <td>${t.g.filter(g => opor.has(g)).map(g => escapar(ET.genero[g])).join(', ')}</td>
      <td class="num">${D.anioBase + t.a}</td>
      <td class="num">${num(t.n, 2)}</td>
      <td class="num">${t.r == null ? '—' : num(t.r, 2) + '×'}</td>
    </tr>`).join('')
    : '<tr><td colspan="6" class="vacio">Con estos filtros no hay géneros en el cuadrante de oportunidad.</td></tr>';
  document.getElementById('tabla-resumen').textContent = lista.length
    ? `${num(lista.length)} títulos mejor evaluados de los géneros del cuadrante verde${lista.length === 150 ? ' (se muestran los primeros 150)' : ''}.`
    : '';
}

const escapar = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* ── Orquestación ─────────────────────────────────────────────────────────── */
/* Conteo por opción ignorando el propio filtro: si el filtro de género se
   contara a sí mismo, al marcar "Drama" todos los demás géneros mostrarían 0. */
function cuentasPor(campo, propio) {
  const guardado = estado[propio];
  estado[propio] = [];
  const filas = filtrar();
  estado[propio] = guardado;
  const acc = new Map();
  filas.forEach(t => {
    const vals = campo === 'i' ? (t.i < 0 ? [] : [t.i]) : t[campo];
    new Set(vals).forEach(i => acc.set(i, (acc.get(i) || 0) + 1));
  });
  return acc;
}

function render() {
  const filas = filtrar();
  ['f-genero', 'f-pais', 'f-idioma'].forEach(id => {
    const m = document.getElementById(id);
    if (m && m.actualizar) m.actualizar();
  });
  document.getElementById('recuento').innerHTML =
    `<b>${num(filas.length)}</b> de ${num(D.titulos.length)} títulos`;
  kpis(filas);
  pagina1(filas); pagina2(filas); pagina3(filas);
}

/* ── Controles ────────────────────────────────────────────────────────────── */
/* Menú de casillas. Muestra cuántos títulos tiene cada opción con los OTROS
   filtros ya aplicados, para que el usuario vea antes de hacer clic si una
   opción va a dejar la selección vacía. */
function llenarMenu(id, etiquetas, campo, contar) {
  const menu = document.getElementById(id);
  const panel = menu.querySelector('.panel');
  const resumen = menu.querySelector('summary');

  const orden = etiquetas.map((e, i) => [e, i])
    .sort((a, b) => a[0].localeCompare(b[0], 'es'));
  panel.innerHTML = orden.map(([e, i]) =>
    `<label><input type="checkbox" value="${i}"><span>${escapar(e)}</span><span class="cuenta" data-idx="${i}"></span></label>`
  ).join('');

  panel.addEventListener('change', () => {
    estado[campo] = [...panel.querySelectorAll('input:checked')].map(i => +i.value);
    actualizarResumen();
    render();
  });

  function actualizarResumen() {
    const n = estado[campo].length;
    resumen.textContent = n === 0 ? 'Todos'
      : n === 1 ? etiquetas[estado[campo][0]]
      : `${n} seleccionados`;
    resumen.title = n ? estado[campo].map(i => etiquetas[i]).join(', ') : 'Sin filtrar';
  }

  menu.actualizar = () => {
    actualizarResumen();
    const cuentas = contar();
    panel.querySelectorAll('.cuenta').forEach(c => {
      const v = cuentas.get(+c.dataset.idx) || 0;
      c.textContent = v ? num(v) : '0';
      c.style.opacity = v ? '.85' : '.4';
    });
  };
  menu.limpiar = () => {
    panel.querySelectorAll('input').forEach(i => (i.checked = false));
    actualizarResumen();
  };
  menu.actualizar();
}

/* Cierra el menú abierto al hacer clic fuera. */
document.addEventListener('click', e => {
  document.querySelectorAll('details.menu[open]').forEach(m => {
    if (!m.contains(e.target)) m.open = false;
  });
});

function iniciar() {
  llenarMenu('f-genero', ET.genero, 'generos',
    () => cuentasPor('g', 'generos'));
  llenarMenu('f-pais', ET.pais, 'paises',
    () => cuentasPor('c', 'paises'));
  llenarMenu('f-idioma', ET.idioma, 'idiomas',
    () => cuentasPor('i', 'idiomas'));

  document.querySelectorAll('#f-tipo button').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('#f-tipo button').forEach(o => o.setAttribute('aria-pressed', String(o === b)));
      estado.tipo = b.dataset.tipo === '' ? null : +b.dataset.tipo;
      render();
    });
  });

  const min = document.getElementById('f-anio-min'), max = document.getElementById('f-anio-max');
  const sincronizar = () => {
    // Cruzarlos dejaría un rango vacío y el dashboard parecería roto.
    if (+min.value > +max.value) { const v = min.value; min.value = max.value; max.value = v; }
    estado.anioMin = +min.value; estado.anioMax = +max.value;
    document.getElementById('sal-min').textContent = D.anioBase + estado.anioMin;
    document.getElementById('sal-max').textContent = D.anioBase + estado.anioMax;
    render();
  };
  min.addEventListener('input', sincronizar);
  max.addEventListener('input', sincronizar);

  document.getElementById('limpiar').addEventListener('click', () => {
    Object.assign(estado, { tipo: null, generos: [], paises: [], idiomas: [], anioMin: 0, anioMax: 15 });
    ['f-genero', 'f-pais', 'f-idioma'].forEach(id => document.getElementById(id).limpiar());
    document.querySelectorAll('#f-tipo button').forEach(b =>
      b.setAttribute('aria-pressed', String(b.dataset.tipo === '')));
    min.value = 0; max.value = 15;
    sincronizar();
  });

  document.querySelectorAll('nav button').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('nav button').forEach(o => o.removeAttribute('aria-current'));
      b.setAttribute('aria-current', 'page');
      document.querySelectorAll('.pagina').forEach(p => (p.hidden = p.id !== b.dataset.pagina));
      scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  render();
}

document.addEventListener('DOMContentLoaded', iniciar);
