/*
 * Versión editable (.pptx) de la presentación de defensa.
 *
 * Mismas diez láminas y mismo orden que docs/presentacion.pdf. Existe para poder
 * retocar una lámina a mano en PowerPoint o Google Slides el día de la defensa
 * sin tener que regenerar nada. Las cifras NO están escritas aquí: se leen de
 * data/processed/cifras_clave.json, que escribe src/informe/generar.py a partir
 * de analisis.cifras_clave(). Las notas del orador traen el guion hablado de cada
 * lámina y quién la presenta: es el mismo texto del punto 8 de docs/guion_defensa.md.
 *
 * Paleta: la de src/graficos.py. Tipografía: Arial, porque la .pptx la abre el
 * PowerPoint de otra persona y Arial viene en todos; Inter no.
 *
 * Uso (desde la raíz del repo):
 *     npm install          # una sola vez, instala pptxgenjs
 *     node src/informe/presentacion_pptx.js
 * o simplemente `python src/informe/generar.py`, que lo llama al final.
 */

const path = require("path");
const fs = require("fs");
const pptxgen = require("pptxgenjs");

const RAIZ = path.resolve(__dirname, "..", "..");
const K = JSON.parse(
  fs.readFileSync(path.join(RAIZ, "data", "processed", "cifras_clave.json"), "utf8")
);
const IMG = (n) => path.join(RAIZ, "images", "finales", n);
const SALIDA = path.join(RAIZ, "docs", "presentacion.pptx");

// ── Paleta (src/graficos.py) ────────────────────────────────────────────────
const C = {
  fondo: "FCFCFB",
  oscuro: "141413",
  tinta: "0B0B0B",
  tinta2: "52514E",
  tenue: "6E6D68", // 5,05:1 sobre el fondo: pasa AA para texto chico
  grilla: "E1E0D9",
  azul: "2A78D6",
  azulClaro: "9EC5F4", // acento sobre fondo oscuro
  tinteAzul: "EEF4FC",
  verde: "0CA30C",
  rojo: "D03B3B",
  naranja: "EB6834",
  blanco: "FFFFFF",
  sobreOscuro: "D6D5CF",
  tenueOscuro: "A3A29C",
};
const FUENTE = "Arial";
const W = 13.333;
const M = 0.6; // margen lateral
const ANCHO = W - 2 * M;

// ── Formato de números en español ──────────────────────────────────────────
const num = (v, dec = 0) =>
  Number(v)
    .toFixed(dec)
    .replace(".", ",")
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const pct = (v, dec = 1) => `${num(v, dec)}%`;
const x = (v) => `${num(v, 2)}×`;
const millones = (v) => `${num(v / 1e6, 0)} millones`;

// ── Utilidades de maquetación ──────────────────────────────────────────────
const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.author = "Matías Retamal · Claudio González";
pres.title = "StreamView Analytics · Defensa";
pres.company = "Duoc UC · ADY1104";

const TOTAL = 10;

function texto(slide, contenido, opts) {
  slide.addText(contenido, { fontFace: FUENTE, margin: 0, isTextBox: true, ...opts });
}

function rotulo(slide, t, y = 0.55, oscuro = false) {
  texto(slide, t.toUpperCase(), {
    x: M, y, w: ANCHO, h: 0.3, fontSize: 11, bold: true, charSpacing: 1.5,
    color: oscuro ? C.azulClaro : C.azul,
  });
}

// Título con un tramo resaltado en azul: partes = [["normal"], ["azul", true]]
function titulo(slide, partes, { x: px = M, y = 0.95, w = ANCHO, h = 1.2, size = 32, oscuro = false } = {}) {
  const runs = partes.map(([t, resalte, salto]) => ({
    text: t,
    options: {
      color: resalte ? (oscuro ? C.azulClaro : C.azul) : oscuro ? C.blanco : C.tinta,
      breakLine: !!salto,
    },
  }));
  texto(slide, runs, { x: px, y, w, h, fontSize: size, bold: true, valign: "top", lineSpacingMultiple: 1.05 });
}

function pie(slide, t, oscuro = false) {
  if (t) {
    texto(slide, t, {
      x: M, y: 6.95, w: ANCHO - 1.2, h: 0.3, fontSize: 10,
      color: oscuro ? C.tenueOscuro : C.tenue,
    });
  }
}

function numero(slide, n, oscuro = false) {
  texto(slide, `${n} / ${TOTAL}`, {
    x: W - M - 1, y: 6.95, w: 1, h: 0.3, fontSize: 10, align: "right",
    color: oscuro ? C.tenueOscuro : C.tenue,
  });
}

function tarjeta(slide, px, py, w, h, relleno = C.blanco) {
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: px, y: py, w, h, rectRadius: 0.08,
    fill: { color: relleno }, line: { color: C.grilla, width: 0.75 },
    shadow: { type: "outer", color: "000000", opacity: 0.06, blur: 6, offset: 1.5, angle: 90 },
  });
}

function circulo(slide, px, py, d, color, t, size = 16) {
  slide.addShape(pres.shapes.OVAL, { x: px, y: py, w: d, h: d, fill: { color }, line: { color, width: 0 } });
  texto(slide, t, {
    x: px, y: py, w: d, h: d, fontSize: size, bold: true, color: C.blanco,
    align: "center", valign: "middle",
  });
}

function base(oscuro = false) {
  const s = pres.addSlide();
  s.background = { color: oscuro ? C.oscuro : C.fondo };
  return s;
}

// Imagen ajustada a una caja conservando proporción, centrada vertical.
function figura(slide, archivo, ancho, alto, caja) {
  const r = ancho / alto;
  let w = caja.w;
  let h = w / r;
  if (h > caja.h) {
    h = caja.h;
    w = h * r;
  }
  slide.addImage({
    path: IMG(archivo), x: caja.x + (caja.w - w) / 2, y: caja.y + (caja.h - h) / 2, w, h,
    altText: caja.alt,
  });
}

// ════════════════════════════════════════════════════════════════════════════
// 1 · Portada
// ════════════════════════════════════════════════════════════════════════════
{
  const s = base(true);
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: M, y: 0.6, w: 0.62, h: 0.62, rectRadius: 0.1, fill: { color: C.azul }, line: { color: C.azul, width: 0 },
  });
  texto(s, "SV", { x: M, y: 0.6, w: 0.62, h: 0.62, fontSize: 18, bold: true, color: C.blanco, align: "center", valign: "middle" });
  texto(s, "STREAMVIEW ANALYTICS · INFORME PARA EL GERENTE DE CONTENIDOS", {
    x: M + 0.85, y: 0.6, w: 10, h: 0.62, fontSize: 12, bold: true, charSpacing: 1.5,
    color: C.tenueOscuro, valign: "middle",
  });
  titulo(s, [["El catálogo produce", false, true], ["lo que menos se valora", true]], {
    y: 2.2, h: 2.1, size: 54, oscuro: true,
  });
  texto(s, `Diagnóstico de ${num(K.titulos)} títulos para decidir qué adquirir, producir y promocionar: qué está funcionando, dónde hay una oportunidad que hoy no se ve y qué hacer al respecto.`, {
    x: M, y: 4.45, w: 9.6, h: 1.0, fontSize: 18, color: C.sobreOscuro, lineSpacingMultiple: 1.15, valign: "top",
  });
  texto(s, [
    { text: "Matías Retamal · Claudio González", options: { bold: true, color: C.blanco, breakLine: true } },
    { text: "ADY1104 Visualización de Datos · Duoc UC", options: { color: C.tenueOscuro } },
  ], { x: M, y: 6.0, w: 8, h: 0.75, fontSize: 14, lineSpacingMultiple: 1.3 });
  numero(s, 1, true);
  s.addNotes("PRESENTA: Matías · 0:20 (0:00 → 0:20)\n\nEsperar dos segundos en silencio antes de hablar.\n\n\"Buenas. Somos Matías Retamal y Claudio González. Analizamos los casi treinta y dos mil títulos del catálogo de StreamView con una sola pregunta: ¿lo que más producimos es lo que la audiencia mejor recibe? La respuesta está en el título: no. Y esa diferencia tiene un costo que se puede medir.\"");
}

// ════════════════════════════════════════════════════════════════════════════
// 2 · Audiencia y propósito
// ════════════════════════════════════════════════════════════════════════════
{
  const s = base();
  rotulo(s, "Audiencia y propósito");
  titulo(s, [["Que el Gerente de Contenidos responda tres preguntas", false, true], ["en menos de un minuto y sin ayuda técnica", true]], { h: 1.3 });
  const preguntas = [
    ["¿Qué está funcionando", " hoy en el catálogo?"],
    ["¿Dónde hay una oportunidad", " que hoy no ve?"],
    ["¿Qué se recomienda hacer", " al respecto?"],
  ];
  const gap = 0.35;
  const w = (ANCHO - 2 * gap) / 3;
  preguntas.forEach(([fuerte, resto], i) => {
    const px = M + i * (w + gap);
    tarjeta(s, px, 2.55, w, 2.45);
    circulo(s, px + 0.35, 2.85, 0.62, C.azul, String(i + 1), 20);
    texto(s, [
      { text: fuerte, options: { bold: true, color: C.tinta } },
      { text: resto, options: { color: C.tinta2 } },
    ], { x: px + 0.35, y: 3.65, w: w - 0.7, h: 1.2, fontSize: 20, valign: "top" });
  });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: M, y: 5.4, w: ANCHO, h: 1.2, rectRadius: 0.08, fill: { color: C.tinteAzul }, line: { color: C.tinteAzul, width: 0 },
  });
  texto(s, [
    { text: "Quién es: ", options: { bold: true, color: C.tinta } },
    { text: "decide adquisiciones cada pocas semanas. Tiene criterio de negocio, no perfil técnico. Lo que necesita no es un dato: es una lista corta de decisiones que pueda defender ante su jefatura.", options: { color: C.tinta2 } },
  ], { x: M + 0.4, y: 5.4, w: ANCHO - 0.8, h: 1.2, fontSize: 16, valign: "middle", lineSpacingMultiple: 1.15 });
  numero(s, 2);
  s.addNotes("PRESENTA: Matías · 0:40 (0:20 → 1:00)\n\n\"Esto está hecho para una persona: el Gerente de Contenidos. Cada pocas semanas decide qué comprar, qué producir y qué promocionar. Tiene criterio de negocio, no perfil técnico, y hoy decide sin poder ver el catálogo completo. Nuestro objetivo fue que pueda responder estas tres preguntas en menos de un minuto. Por eso entregamos dos piezas: un informe, para defender la decisión ante su jefatura, y un dashboard, para revisarla cada semana. Claudio.\"");
}

// ════════════════════════════════════════════════════════════════════════════
// 3 · Auditoría
// ════════════════════════════════════════════════════════════════════════════
{
  const s = base();
  rotulo(s, "Antes de cualquier resultado");
  titulo(s, [["Auditamos los datos primero, y eso "], ["cambió el proyecto", true]], { h: 0.7 });
  texto(s, "El enunciado pedía cosas que estos datos no permiten responder. Decirlo es parte del trabajo.", {
    x: M, y: 1.75, w: ANCHO, h: 0.45, fontSize: 17, color: C.tinta2,
  });
  const items = [
    ["Duración óptima", `La columna duration viene 100% nula en películas y constante en las ${num(K.series)} series.`],
    ["Clasificación por edad", "La columna rating es copia exacta de vote_average. No hay clasificación etaria en el dataset."],
    ["Evolución del catálogo", "Hay exactamente 1.000 títulos por año: cualquier serie de tiempo sale plana por construcción del muestreo."],
    ["Retención y engagement", "Los datos de usuarios nunca llegaron. Usamos proxies de recepción y lo declaramos en el alcance."],
  ];
  const gap = 0.3;
  const w = (ANCHO - gap) / 2;
  const h = 1.95;
  items.forEach(([cab, cuerpo], i) => {
    const px = M + (i % 2) * (w + gap);
    const py = 2.5 + Math.floor(i / 2) * (h + gap);
    tarjeta(s, px, py, w, h);
    circulo(s, px + 0.35, py + 0.35, 0.5, C.naranja, "✕", 15);
    texto(s, cab, { x: px + 1.1, y: py + 0.35, w: w - 1.45, h: 0.5, fontSize: 19, bold: true, color: C.tinta, valign: "middle" });
    texto(s, cuerpo, { x: px + 1.1, y: py + 0.9, w: w - 1.45, h: 0.9, fontSize: 15, color: C.tinta2, valign: "top", lineSpacingMultiple: 1.1 });
  });
  pie(s, "Los diez hallazgos de la auditoría están verificados en código, celda por celda, en el notebook 01.");
  numero(s, 3);
  s.addNotes("PRESENTA: Claudio · 1:00 (1:00 → 2:00)\n\nLa lámina que nunca se corta.\n\n\"Antes de hacer un solo gráfico revisamos los datos, y eso cambió el proyecto. El encargo pedía cuatro análisis que estos datos no permiten hacer bien. La duración viene vacía en todas las películas. La clasificación por edad es, en realidad, una copia de la nota. Hay exactamente mil títulos por año, así que cualquier tendencia sería un efecto del muestreo. Y los datos de usuarios nunca llegaron. Podríamos haber hecho esos gráficos igual: se habrían visto bien y habrían estado mal. Preferimos responder menos preguntas, pero que cada respuesta se sostenga.\"");
}

// ════════════════════════════════════════════════════════════════════════════
// 4 · KPIs
// ════════════════════════════════════════════════════════════════════════════
{
  const s = base();
  rotulo(s, "Qué está pasando · el catálogo");
  titulo(s, [[`${num(K.titulos)} títulos, y casi la mitad del catálogo es `], ["drama", true]], { h: 0.7 });
  const kpis = [
    [num(K.titulos), "Títulos en el catálogo", `${num(K.peliculas)} películas · ${num(K.series)} series`],
    [num(K.nota_media, 2), "Nota media ponderada", `sobre ${num(K.con_votos)} con votación suficiente`],
    [x(K.roi_mediano), "ROI mediano", `sobre ${num(K.con_roi)} películas con datos financieros`],
    [pct(K.drama_pct), "Del catálogo es drama", `${num(K.drama_titulos)} títulos`],
  ];
  const gap = 0.3;
  const w = (ANCHO - 3 * gap) / 4;
  kpis.forEach(([valor, cab, sub], i) => {
    const px = M + i * (w + gap);
    tarjeta(s, px, 2.1, w, 2.85);
    texto(s, valor, { x: px + 0.3, y: 2.45, w: w - 0.6, h: 0.9, fontSize: 44, bold: true, color: C.tinta });
    texto(s, cab, { x: px + 0.3, y: 3.4, w: w - 0.6, h: 0.6, fontSize: 15, bold: true, color: C.tinta2, valign: "top" });
    texto(s, sub, { x: px + 0.3, y: 4.05, w: w - 0.6, h: 0.5, fontSize: 12, color: C.tenue, valign: "top" });
    if (i === 3) {
      // Barra de proporción: casi la mitad, a la vista.
      s.addShape(pres.shapes.RECTANGLE, { x: px + 0.3, y: 4.62, w: w - 0.6, h: 0.14, fill: { color: C.grilla }, line: { color: C.grilla, width: 0 } });
      s.addShape(pres.shapes.RECTANGLE, { x: px + 0.3, y: 4.62, w: (w - 0.6) * K.drama_pct / 100, h: 0.14, fill: { color: C.azul }, line: { color: C.azul, width: 0 } });
    }
  });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: M, y: 5.4, w: ANCHO, h: 1.05, rectRadius: 0.08, fill: { color: C.tinteAzul }, line: { color: C.tinteAzul, width: 0 },
  });
  texto(s, [
    { text: "Por qué ponderada: ", options: { bold: true, color: C.tinta } },
    { text: "sin ponderar por votos, el ranking del catálogo lo encabezan títulos con un solo voto y nota 10,0.", options: { color: C.tinta2 } },
  ], { x: M + 0.4, y: 5.4, w: ANCHO - 0.8, h: 1.05, fontSize: 16, valign: "middle" });
  numero(s, 4);
  s.addNotes("PRESENTA: Claudio · 0:30 (2:00 → 2:30)\n\nPrimera lámina que se corta si falta tiempo.\n\n\"El catálogo en cuatro números: casi treinta y dos mil títulos, mitad películas y mitad series. Nota media de seis coma siete, ponderada por votos, porque sin eso el primer lugar lo gana un título con un solo voto. Una película típica recauda uno coma siete veces lo que costó. Y casi la mitad del catálogo es drama. Matías.\"");
}

// ════════════════════════════════════════════════════════════════════════════
// 5 · El hallazgo (figura izquierda, texto derecha)
// ════════════════════════════════════════════════════════════════════════════
{
  const s = base();
  figura(s, "19_brecha_oferta_recepcion.png", 2384, 1523, { x: 0.45, y: 0.55, w: 7.75, h: 6.2, alt: "Volumen contra nota por género" });
  const tx = 8.6;
  const tw = W - M - tx;
  texto(s, "EL HALLAZGO", { x: tx, y: 0.75, w: tw, h: 0.3, fontSize: 11, bold: true, charSpacing: 1.5, color: C.azul });
  titulo(s, [["Lo que más se produce no es lo que mejor se recibe"]], { x: tx, y: 1.1, w: tw, h: 1.6, size: 28 });
  const bloques = [
    [C.rojo, num(K.terror_suspenso_titulos), `títulos de terror y suspenso: un tercio de las películas, con las dos notas más bajas (${num(K.terror_suspenso_nota, 2)})`],
    [C.verde, `+${num(K.brecha_nota_grupos, 2)}`, `puntos de nota en documental, musical e histórico, con solo ${num(K.doc_mus_hist_titulos)} títulos`],
  ];
  bloques.forEach(([color, valor, cuerpo], i) => {
    const py = 3.0 + i * 1.75;
    texto(s, valor, { x: tx, y: py, w: tw, h: 0.7, fontSize: 40, bold: true, color });
    texto(s, cuerpo, { x: tx, y: py + 0.72, w: tw, h: 0.85, fontSize: 15, color: C.tinta2, valign: "top" });
  });
  pie(s, "Cortes en las medianas del conjunto. Eje horizontal logarítmico. Datos de catálogo, no de usuarios.");
  numero(s, 5);
  s.addNotes("PRESENTA: Matías · 1:00 (2:30 → 3:30)\n\nSeñalar con la mano: primero abajo a la derecha, después arriba a la izquierda.\n\n\"Aquí está el hallazgo. Cada punto es un género: a la derecha, lo que más se produce; arriba, lo mejor evaluado. Aquí abajo, terror y suspenso: una de cada tres películas, y las dos peores notas. Aquí arriba, documental, musical e histórico: un tercio del volumen y casi ocho décimas más de nota. Es la oportunidad que hoy nadie está mirando. Con esto, la recomendación parecía obvia: producir menos terror. Casi la hacemos. Claudio.\"");
}

// ════════════════════════════════════════════════════════════════════════════
// 6 · Por qué ocurre (texto izquierda, figura derecha)
// ════════════════════════════════════════════════════════════════════════════
{
  const s = base();
  const tw = 4.4;
  texto(s, "POR QUÉ OCURRE", { x: M, y: 0.75, w: tw, h: 0.3, fontSize: 11, bold: true, charSpacing: 1.5, color: C.azul });
  titulo(s, [["Terror no es un error: es "], ["una apuesta de costo", true]], { y: 1.1, w: tw, h: 1.6, size: 28 });
  const filas = [
    [`${num(K.presupuesto_terror / 1e6)} M`, `presupuesto mediano de terror, contra ${millones(K.presupuesto_animacion)} de animación`],
    [x(K.roi_terror), "ROI mediano de terror: sobre la mediana del catálogo"],
    [x(K.roi_historico), "ROI de histórico: la mejor nota y el peor retorno de los géneros con datos financieros"],
    ["4", "géneros ganan en recepción y en retorno a la vez"],
  ];
  filas.forEach(([valor, cuerpo], i) => {
    const py = 2.95 + i * 0.95;
    texto(s, valor, { x: M, y: py, w: 1.45, h: 0.7, fontSize: 24, bold: true, color: i === 3 ? C.verde : C.tinta, valign: "top" });
    texto(s, cuerpo, { x: M + 1.55, y: py + 0.03, w: tw - 1.55, h: 0.8, fontSize: 14, color: C.tinta2, valign: "top" });
  });
  figura(s, "21_recepcion_vs_retorno.png", 2703, 1697, { x: 5.25, y: 0.55, w: W - 5.25 - 0.45, h: 6.2, alt: "Nota contra ROI mediano por género" });
  pie(s, `Sobre las ${num(K.con_roi)} películas con presupuesto y recaudación positivos.`);
  numero(s, 6);
  s.addNotes("PRESENTA: Claudio · 1:00 (3:30 → 4:30)\n\n\"Habría sido un error. Cruzamos la nota con la plata y apareció el giro. Terror es el género más barato de producir: siete millones de dólares la película típica, contra cincuenta de animación. Y aun así recauda dos veces lo que costó, más que el catálogo en general. No es un descuido: es una apuesta de costo. Al revés, histórico tiene muy buena nota y el peor retorno: eso es prestigio, no negocio. Lo que gana dos veces, en nota y en plata, son cuatro géneros: animación, familiar, aventura y musical. Arriba a la derecha.\"");
}

// ════════════════════════════════════════════════════════════════════════════
// 7 · La nota predice la plata (arreglos de íconos, frecuencias naturales)
// ════════════════════════════════════════════════════════════════════════════
{
  const s = base();
  rotulo(s, "Qué implica para el negocio");
  titulo(s, [["La recepción predice el retorno. "], ["El presupuesto no.", true]], { h: 0.7 });
  texto(s, "De cada 100 películas, cuántas no recuperan lo que costaron:", {
    x: M, y: 1.72, w: ANCHO, h: 0.4, fontSize: 17, color: C.tinta2,
  });
  // Frecuencias naturales: "53 de cada 100" se entiende sin saber estadística;
  // "53%" obliga a imaginarse la base. Se dibujan como 100 puntos nativos.
  const arreglos = [
    [Math.round(K.no_recupera_nota_baja), "Nota bajo 6,0"],
    [Math.round(K.no_recupera_nota_alta), "Nota sobre 7,0"],
  ];
  const d = 0.2;
  const paso = 0.265;
  arreglos.forEach(([n, cab], j) => {
    const ox = M + j * 4.35;
    const oy = 2.45;
    texto(s, cab, { x: ox, y: oy, w: 3.9, h: 0.35, fontSize: 15, bold: true, color: C.tinta });
    for (let i = 0; i < 100; i++) {
      const fila = Math.floor(i / 10);
      const col = i % 10;
      const lleno = i < n;
      s.addShape(pres.shapes.OVAL, {
        x: ox + col * paso, y: oy + 0.5 + fila * paso, w: d, h: d,
        fill: { color: lleno ? C.rojo : C.grilla }, line: { color: lleno ? C.rojo : C.grilla, width: 0 },
      });
    }
    texto(s, [
      { text: `${n} de cada 100`, options: { bold: true, color: C.rojo, fontSize: 26, breakLine: true } },
      { text: "no recupera lo invertido", options: { color: C.tinta2, fontSize: 14 } },
    ], { x: ox, y: oy + 0.5 + 10 * paso + 0.12, w: 3.9, h: 0.9, valign: "top" });
  });
  // Tercera columna: qué ordena el retorno y qué no.
  const cx = M + 8.75;
  const cw = W - M - cx;
  tarjeta(s, cx, 2.45, cw, 4.15);
  texto(s, "Qué tanto ordena el retorno", { x: cx + 0.3, y: 2.7, w: cw - 0.6, h: 0.4, fontSize: 15, bold: true, color: C.tinta });
  const barras = [
    ["La nota", K.spearman_nota, C.azul],
    ["El presupuesto", K.spearman_presupuesto, C.tenue],
  ];
  const bw = cw - 0.6;
  barras.forEach(([cab, v, color], i) => {
    const py = 3.35 + i * 1.05;
    texto(s, [
      { text: cab, options: { color: C.tinta2 } },
      { text: `  ${num(v, 2)}`, options: { bold: true, color: C.tinta } },
    ], { x: cx + 0.3, y: py, w: bw, h: 0.35, fontSize: 14 });
    s.addShape(pres.shapes.RECTANGLE, { x: cx + 0.3, y: py + 0.42, w: bw, h: 0.2, fill: { color: C.grilla }, line: { color: C.grilla, width: 0 } });
    s.addShape(pres.shapes.RECTANGLE, { x: cx + 0.3, y: py + 0.42, w: Math.max(bw * v, 0.03), h: 0.2, fill: { color }, line: { color, width: 0 } });
  });
  texto(s, "Correlación de Spearman con el ROI: 0 no ordena nada, 1 lo ordena todo. Invertir más no compra retorno.", {
    x: cx + 0.3, y: 5.5, w: bw, h: 1.0, fontSize: 12, color: C.tenue, valign: "top",
  });
  pie(s, `Sobre las ${num(K.con_roi)} películas con datos financieros válidos. Gráfico completo en la figura 18 del informe.`);
  numero(s, 7);
  s.addNotes("PRESENTA: Claudio · 1:00 (4:30 → 5:30)\n\nPausa de un segundo después de cada cifra.\n\n\"Y este es el dato que sostiene todo. De cada cien películas mal evaluadas, cincuenta y tres no recuperan lo que costaron: más de la mitad pierde plata. De cada cien bien evaluadas, solo veintiuna. A la derecha, lo que nadie espera: cuánto se gastó casi no dice nada sobre cuánto se recupera. En una frase: la nota predice la plata; el presupuesto, no. Gastar más no garantiza nada; producir lo que la audiencia valora, sí. Matías.\"");
}

// ════════════════════════════════════════════════════════════════════════════
// 8 · Mercados
// ════════════════════════════════════════════════════════════════════════════
{
  const s = base();
  figura(s, "17_paises_nota.png", 1855, 1547, { x: 0.45, y: 0.5, w: 6.9, h: 6.3, alt: "Nota por país de origen" });
  const tx = 7.75;
  const tw = W - M - tx;
  texto(s, "QUÉ IMPLICA · MERCADOS", { x: tx, y: 0.75, w: tw, h: 0.3, fontSize: 11, bold: true, charSpacing: 1.5, color: C.azul });
  titulo(s, [["Japón y Corea reciben mejor nota con una fracción del catálogo"]], { x: tx, y: 1.1, w: tw, h: 1.6, size: 28 });
  const chips = [
    ["Japón", num(K.japon_nota, 2), C.verde],
    ["Corea del Sur", num(K.corea_nota, 2), C.verde],
    ["Estados Unidos", num(K.eeuu_nota, 2), C.tinta2],
  ];
  const gap = 0.2;
  const cw = (tw - 2 * gap) / 3;
  chips.forEach(([pais, nota, color], i) => {
    const px = tx + i * (cw + gap);
    tarjeta(s, px, 3.0, cw, 1.3);
    texto(s, nota, { x: px, y: 3.12, w: cw, h: 0.65, fontSize: 30, bold: true, color, align: "center" });
    texto(s, pais, { x: px, y: 3.78, w: cw, h: 0.35, fontSize: 12, color: C.tinta2, align: "center" });
  });
  texto(s, [
    { text: `Estados Unidos aporta el ${pct(K.eeuu_pct_peliculas)} de las películas`, options: { bold: true, color: C.tinta } },
    { text: ` y queda en el puesto ${K.eeuu_puesto} de ${K.paises_ranking}.`, options: { color: C.tinta2, breakLine: true } },
    { text: " ", options: { fontSize: 8, breakLine: true } },
    { text: "El corte por idioma ordena igual: ", options: { bold: true, color: C.tinta } },
    { text: "es el mismo patrón visto dos veces, no una casualidad de un corte.", options: { color: C.tinta2 } },
  ], { x: tx, y: 4.65, w: tw, h: 1.9, fontSize: 15, valign: "top", lineSpacingMultiple: 1.1 });
  pie(s, "Países con ≥150 títulos con votación suficiente. Un título coproducido cuenta en cada país que lo lista.");
  numero(s, 8);
  s.addNotes("PRESENTA: Matías · 0:40 (5:30 → 6:10)\n\nSegunda lámina que se corta si falta tiempo.\n\n\"Lo mismo pasa por país. Japón es el país mejor evaluado del catálogo, y Corea del Sur está entre los tres primeros. Estados Unidos aporta casi la mitad de las películas y queda en el puesto quince de veinticuatro. Ojo: no decimos que el contenido asiático sea mejor. Decimos que, dentro de este catálogo, está subrepresentado respecto de cómo se recibe.\"");
}

// ════════════════════════════════════════════════════════════════════════════
// 9 · Recomendaciones
// ════════════════════════════════════════════════════════════════════════════
{
  const s = base();
  rotulo(s, "Qué recomendamos");
  titulo(s, [["Tres decisiones, cada una con su meta y su evidencia"]], { h: 0.7 });
  const recos = [
    [
      "Reequilibrar hacia los géneros que ganan dos veces",
      "Animación, familiar, aventura y musical: los únicos sobre la mediana en recepción y en retorno. No es dejar de producir terror: es mover el margen de crecimiento.",
      `${pct(K.meta1_actual)} → 30%`, "de las adquisiciones en 12 meses", "Evidencia: láminas 5 y 6",
    ],
    [
      "Abrir línea de adquisición en Japón y Corea del Sur",
      `Encabezan la recepción y hoy son el ${pct(K.meta2_actual)} de las películas. No es una conclusión sobre calidad nacional: es subrepresentación relativa.`,
      `${pct(K.meta2_actual)} → 18%`, "del catálogo de películas en 12 meses", "Evidencia: lámina 8",
    ],
    [
      "Condicionar el presupuesto a la recepción esperada",
      "Ningún proyecto del cuartil superior de presupuesto sin evidencia de recepción comparable. El presupuesto por sí solo no compra retorno.",
      `${pct(K.no_recupera_total)} → 30%`, "de películas que no recupera lo invertido", "Evidencia: lámina 7",
    ],
  ];
  const gap = 0.3;
  const w = (ANCHO - 2 * gap) / 3;
  recos.forEach(([cab, cuerpo, meta, metaSub, evid], i) => {
    const px = M + i * (w + gap);
    const py = 1.85;
    const h = 4.85;
    tarjeta(s, px, py, w, h);
    circulo(s, px + 0.3, py + 0.3, 0.55, C.verde, String(i + 1), 18);
    texto(s, cab, { x: px + 0.3, y: py + 1.0, w: w - 0.6, h: 0.95, fontSize: 16, bold: true, color: C.tinta, valign: "top" });
    texto(s, cuerpo, { x: px + 0.3, y: py + 2.02, w: w - 0.6, h: 1.3, fontSize: 13, color: C.tinta2, valign: "top", lineSpacingMultiple: 1.1 });
    s.addShape(pres.shapes.LINE, { x: px + 0.3, y: py + 3.4, w: w - 0.6, h: 0, line: { color: C.grilla, width: 0.75 } });
    texto(s, meta, { x: px + 0.3, y: py + 3.52, w: w - 0.6, h: 0.55, fontSize: 24, bold: true, color: C.tinta });
    texto(s, metaSub, { x: px + 0.3, y: py + 4.05, w: w - 0.6, h: 0.3, fontSize: 12, color: C.tinta2 });
    texto(s, evid, { x: px + 0.3, y: py + 4.38, w: w - 0.6, h: 0.3, fontSize: 11, color: C.tenue });
  });
  numero(s, 9);
  s.addNotes("PRESENTA: Matías · 1:20 (6:10 → 7:30)\n\nLas tres de memoria, con su número. Al terminar, Claudio cambia al dashboard.\n\n\"Tres decisiones, cada una con una meta que se puede comprobar en doce meses. Uno: mover la compra hacia los cuatro géneros que ganan dos veces. Hoy son el veintidós por ciento de las películas; la meta es treinta. Y no es dejar de producir terror: es decidir hacia dónde crece el catálogo. Dos: abrir una línea de compra en Japón y Corea del Sur. Hoy son menos del doce por ciento; la meta es dieciocho. Tres: que el presupuesto siga a la recepción esperada, y no al revés. Ningún proyecto de los más caros sin evidencia de que se va a recibir bien. Hoy treinta y siete de cada cien películas no recuperan lo que costaron; la meta es bajar a treinta. Estas decisiones se revisan cada semana, y para eso construimos una herramienta. Claudio.\"\n\n── DEMO DEL DASHBOARD · Claudio · 1:50 (7:30 → 9:20) ──\nCambiar a la pestaña del dashboard y presionar F. Paso 1: filtro País → Japón. Paso 2: limpiar el filtro, ir a «3 · decisión» y poner Tipo → Películas. Paso 3: bajar a la tabla.\n\n\"Este es el dashboard que usaría el Gerente. Tiene tres páginas, en el mismo orden que la presentación: contexto, hallazgo y decisión. Supongamos que llega una propuesta: comprar películas japonesas. ¿Encaja? Filtro por Japón. La nota sube a siete coma dos, medio punto sobre el catálogo, y el retorno a dos coma setenta y siete, más de un punto por encima. En diez segundos, la recomendación dos se comprueba sin nosotros. Y aquí se pasa a la acción: es el mismo gráfico de la lámina cinco, pero vivo. Cambia con cada filtro, y el título se reescribe solo con la conclusión. Abajo está la lista corta: los títulos mejor evaluados de los géneros en oportunidad. Es, literalmente, una lista de compras. Matías.\"");
}

// ════════════════════════════════════════════════════════════════════════════
// 10 · La mayor debilidad (cierre oscuro)
// ════════════════════════════════════════════════════════════════════════════
{
  const s = base(true);
  rotulo(s, "La mayor debilidad de nuestra solución", 0.75, true);
  titulo(s, [["Sabemos qué se recibe bien.", false, true], ["No sabemos qué se ve.", true]], { y: 1.2, h: 1.9, size: 44, oscuro: true });
  texto(s, [
    { text: "Sin datos de consumo real, nuestras conclusiones son sobre ", options: { color: C.sobreOscuro } },
    { text: "composición del catálogo", options: { color: C.blanco, bold: true } },
    { text: ", no sobre comportamiento de audiencia. Un género puede recibir notas altas de un público pequeño y fiel y aportar poco a la retención, y estos datos no permiten distinguir ese caso.", options: { color: C.sobreOscuro } },
  ], { x: M, y: 3.5, w: 10.5, h: 1.6, fontSize: 19, valign: "top", lineSpacingMultiple: 1.2 });
  texto(s, "Con reproducciones y suscripciones se podría medir si la recepción alta se traduce en retención. Nada de eso está en estos datos, y por eso nada de eso afirmamos.", {
    x: M, y: 5.25, w: 10.5, h: 0.9, fontSize: 15, color: C.tenueOscuro, valign: "top", lineSpacingMultiple: 1.2,
  });
  texto(s, "Gracias · Matías Retamal · Claudio González", {
    x: M, y: 6.9, w: 8, h: 0.35, fontSize: 12, bold: true, color: C.blanco,
  });
  numero(s, 10, true);
  s.addNotes("PRESENTA: Matías · 0:40 (9:20 → 10:00)\n\nVolver a la pestaña de la presentación, lámina 10.\n\n\"Cerramos con lo que no sabemos. Sabemos qué títulos se reciben bien; no sabemos cuántas personas los vieron ni cuántas se quedaron por ellos. Sin datos de consumo, todo esto es sobre la composición del catálogo, no sobre el comportamiento de la audiencia. Si se quedan con una sola idea, que sea esta: la nota predice la plata; el presupuesto, no. Gracias.\"");
}

pres.writeFile({ fileName: SALIDA }).then((f) => console.log(`→ ${path.relative(RAIZ, f)}`));
