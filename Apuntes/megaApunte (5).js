/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                  MEGA APUNTE DEFINITIVO — DWEC                            ║
 * ║       Copia, pega y cambia solo las variables. Todas las variantes.       ║
 * ║                                                                           ║
 * ║  CRITERIOS:                                                               ║
 * ║  1.Git 2.localStorage 3.JSON 4.DOM 5.Regex 6.checkValidity                ║
 * ║  7.Arrays 8.Eventos+ObjetosJS 9.Separación+main() 10.Funcionalidad        ║
 * ║                                                                           ║
 * ║  REGLAS DE ORO — NUNCA ROMPER:                                           ║
 * ║  ✗ innerHTML prohibido (ni para limpiar)                                  ║
 * ║  ✗ textContent prohibido                                                  ║
 * ║  ✓ Limpiar con limpiarNodos() → firstChild / removeChild                  ║
 * ║  ✓ Texto con createTextNode()                                             ║
 * ║  ✓ createElement + classList.add + appendChild                            ║
 * ║  ✓ main() async — datos desde fetch('bbdd.json')                          ║
 * ║                                                                           ║
 * ║  ÍNDICE:                                                                  ║
 * ║  [0]  Estructura base main()                                              ║
 * ║  [1]  Utilidades (limpiarNodos, errores, formatear)                       ║
 * ║  [2]  localStorage (todas las variantes)                                  ║
 * ║  [3]  DOM construido con JS (filtros, botones ordenar)                    ║
 * ║  [4]  DOM Imágenes (5 variantes)                                          ║
 * ║  [5]  DOM Cards                                                           ║
 * ║  [6]  DOM Tabla (estándar + contable)                                     ║
 * ║  [7]  DOM Sidebar                                                         ║
 * ║  [8]  Rellenar selects (texto, numérico, fijo, rango)                     ║
 * ║  [9]  Eventos centralizados (inicializarEventos)                          ║
 * ║  [10] Ordenación                                                          ║
 * ║  [11] Filtros (todos los tipos: texto, select, rango, radio, checkbox)    ║
 * ║  [12] Autocomplete jQuery UI (3 variantes)                                ║
 * ║  [13] CRUD (alta, borrar, editar, favoritos)                              ║
 * ║  [14] Paso entre páginas (URL, índice)                                    ║
 * ║  [15] Página de detalle/reserva (querySelector sin ids)                   ║
 * ║  [16] Regex                                                               ║
 * ║  [17] Validación formulario (3 variantes)                                 ║
 * ║  [18] Referencia rápida                                                   ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */


// ═══════════════════════════════════════════════════════════════════
// [0] ESTRUCTURA BASE — main()
// ═══════════════════════════════════════════════════════════════════
// IMPORTANTE: si necesitas el array en varias funciones (pintarCards usa
// indexOf, etc.) declara la variable GLOBAL fuera de main y asígnala dentro.

document.addEventListener('DOMContentLoaded', main);

let todosLosItems = []; // GLOBAL — accesible desde pintarCards, filtros, etc.

async function main() {
    const response = await fetch('bbdd.json');
    const json = await response.json();

    // CRITERIO 2 — inicializar localStorage si está vacío
    if (!localStorage.getItem('items')) {
        setItems(json.items);  // cambiar 'items' por json.cars / json.pilotos
    }
    todosLosItems = getItems();

    // CRITERIO 4 — construir DOM (llamar solo a lo que el examen pida)
    pintarCards(todosLosItems);
    crearCabecera();
    pintarTabla(todosLosItems);
    rellenarSelect(todosLosItems, 'equipo', 'selectEquipo', 'Todos');

    // CRITERIO 8 — eventos y autocomplete
    inicializarEventos(todosLosItems);
    iniciarAutocomplete(todosLosItems);
}


// ═══════════════════════════════════════════════════════════════════
// [1] UTILIDADES
// ═══════════════════════════════════════════════════════════════════

// OBLIGATORIA en todo examen
function limpiarNodos(elemento) {
    while (elemento.firstChild) {
        elemento.removeChild(elemento.firstChild);
    }
}

// ── Error en párrafo por id ────────────────────────────────────
function mostrarError(idElemento, mensaje) {
    const p = document.getElementById(idElemento);
    limpiarNodos(p);
    p.appendChild(document.createTextNode(mensaje));
}

// ── Error con red de seguridad (si el id puede no existir) ──────
function mostrarErrorSeguro(idElemento, mensaje) {
    const p = document.getElementById(idElemento);
    if (!p) return;
    limpiarNodos(p);
    p.appendChild(document.createTextNode(mensaje));
    p.style.display = 'block';
}

function ocultarError(idElemento) {
    limpiarNodos(document.getElementById(idElemento));
}

// ── Formatear número con miles ─────────────────────────────────
// parseInt dentro → funciona aunque el JSON traiga el número como string
function formatearNumero(valor) {
    return parseInt(valor).toLocaleString('es-ES');
}
// Uso: formatearNumero(item.precio) + ' €'   → "159.999 €"
// Uso: formatearNumero(item.km) + ' Km.'     → "19.000 Km."

// ── Iniciales a partir del nombre (para avatar sin foto) ───────
function obtenerIniciales(nombre) {
    return nombre.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}
// "Marc Marquez" → "MM"


// ═══════════════════════════════════════════════════════════════════
// [2] localStorage — todas las variantes
// ═══════════════════════════════════════════════════════════════════

// ── Variante A: array principal de datos ───────────────────────
function getItems() {
    try {
        return JSON.parse(localStorage.getItem('items')) || [];
    } catch (e) {
        localStorage.removeItem('items');
        return [];
    }
}
function setItems(items) {
    localStorage.setItem('items', JSON.stringify(items));
}

// ── Variante B: clave separada (favoritos) ─────────────────────
function getFavoritos() {
    try {
        return JSON.parse(localStorage.getItem('favoritos')) || [];
    } catch (e) { return []; }
}
function setFavoritos(favoritos) {
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
}

// ── Variante C: GUARDAR UN SOLO objeto (sobreescribe) ──────────
// Para cuando el examen pide guardar solo la última reserva
function guardarReservaUnica(item, cliente) {
    const reserva = { item: item, cliente: cliente };
    localStorage.setItem('reserva', JSON.stringify(reserva)); // singular
}

// ── Variante D: GUARDAR EN ARRAY (acumula todas) ───────────────
// Para cuando el examen pide guardar TODAS las reservas
function guardarReservaEnArray(item, cliente) {
    const reservas = JSON.parse(localStorage.getItem('reservas')) || []; // leer array
    const reserva = { item: item, cliente: cliente };
    reservas.push(reserva);                                      // push del OBJETO
    localStorage.setItem('reservas', JSON.stringify(reservas));  // guardar el ARRAY
    // ⚠ ERROR TÍPICO: push(reservas) o setItem(reserva) → mezclas array y objeto
}


// ═══════════════════════════════════════════════════════════════════
// [3] DOM construido con JS — filtros y botones de ordenar
// ═══════════════════════════════════════════════════════════════════
// Solo si el profesor pide construir los controles desde JS (no HTML estático)

function crearSeccionFiltros() {
    const section = document.getElementById('seccionFiltros');

    const h2 = document.createElement('h2');
    h2.appendChild(document.createTextNode('Buscar'));
    section.appendChild(h2);

    const divFiltros = document.createElement('div');
    divFiltros.classList.add('fila-filtros');
    section.appendChild(divFiltros);

    // Inputs y selects en BUCLE — tag = 'input' o 'select'
    const campos = [
        { etiqueta: 'Buscar', tag: 'input', id: 'inputBuscar' },
        { etiqueta: 'Equipo', tag: 'select', id: 'selectEquipo' },
        { etiqueta: 'Nacionalidad', tag: 'select', id: 'selectNacionalidad' },
        { etiqueta: 'Año desde', tag: 'select', id: 'anyoDesde' },
        { etiqueta: 'Año hasta', tag: 'select', id: 'anyoHasta' },
    ];
    campos.forEach(function (c) {
        const divGrupo = document.createElement('div');
        divGrupo.classList.add('grupo');
        const label = document.createElement('label');
        label.appendChild(document.createTextNode(c.etiqueta));
        divGrupo.appendChild(label);
        const control = document.createElement(c.tag);
        control.id = c.id;
        divGrupo.appendChild(control);
        divFiltros.appendChild(divGrupo);
    });

    // Botones en BUCLE
    const botones = [
        { id: 'btnFiltrar', texto: 'Filtrar', clase: 'btn-primario' },
        { id: 'btnReiniciar', texto: 'Reiniciar', clase: 'btn-secundario' },
        { id: 'btnSoloFavoritos', texto: '★ Solo favoritos', clase: 'btn-sort' },
    ];
    botones.forEach(function (b) {
        const divGrupo = document.createElement('div');
        divGrupo.classList.add('grupo');
        const btn = document.createElement('button');
        btn.id = b.id;
        btn.classList.add(b.clase);
        btn.appendChild(document.createTextNode(b.texto));
        divGrupo.appendChild(btn);
        divFiltros.appendChild(divGrupo);
    });

    const pError = document.createElement('p');
    pError.id = 'errorFiltro';
    section.appendChild(pError);
}

function crearBotonesOrdenacion() {
    const div = document.getElementById('botonesOrden');
    const botones = [
        { id: 'btnOrdenDefecto', texto: 'Por defecto', clase: 'btn-sort activo' },
        { id: 'btnOrdenPrecio', texto: 'Mayor precio', clase: 'btn-sort' },
        { id: 'btnOrdenNombre', texto: 'A-Z', clase: 'btn-sort' },
    ];
    botones.forEach(function (b) {
        const btn = document.createElement('button');
        btn.id = b.id;
        btn.className = b.clase; // className = varias clases separadas por espacio
        btn.appendChild(document.createTextNode(b.texto));
        div.appendChild(btn);
    });
}


// ═══════════════════════════════════════════════════════════════════
// [4] DOM — IMÁGENES (5 variantes)
// ═══════════════════════════════════════════════════════════════════
// El campo img del JSON trae solo el nombre: "foto.jpg" → src = 'img/' + item.img

// ── Variante A: div contenedor + img (avatar circular) ─────────
function imagenVarianteA(item, padre) {
    const divFoto = document.createElement('div');
    divFoto.classList.add('card-foto');
    const img = document.createElement('img');
    img.src = 'img/' + item.img;
    img.alt = item.nombre;
    divFoto.appendChild(img);
    padre.appendChild(divFoto);
}

// ── Variante B: img directa (estilo Bootstrap card-img-top) ────
function imagenVarianteB(item, padre) {
    const img = document.createElement('img');
    img.classList.add('card-img-top');
    img.src = 'img/' + item.img;
    img.alt = item.marca + ' ' + item.modelo;
    padre.appendChild(img);
}

// ── Variante C: img dentro de enlace (a > img) — estilo THU ─────
function imagenVarianteC(item, padre, index) {
    const enlace = document.createElement('a');
    enlace.href = 'reserva.html?id=' + index;  // o '#!' si no enlaza
    const img = document.createElement('img');
    img.classList.add('card-img-top');
    img.src = 'img/' + item.img;
    img.alt = item.marca + ' ' + item.modelo;
    enlace.appendChild(img);    // img → a
    padre.appendChild(enlace);  // a   → padre
}

// ── Variante D: img con FALLBACK de iniciales si falla ─────────
function imagenVarianteD(item, padre) {
    const divFoto = document.createElement('div');
    divFoto.classList.add('card-foto');
    if (item.img) {
        const img = document.createElement('img');
        img.src = 'img/' + item.img;
        img.alt = item.nombre;
        img.onerror = function () {
            limpiarNodos(divFoto);
            divFoto.appendChild(document.createTextNode(obtenerIniciales(item.nombre)));
        };
        divFoto.appendChild(img);
    } else {
        divFoto.appendChild(document.createTextNode(obtenerIniciales(item.nombre)));
    }
    padre.appendChild(divFoto);
}

// ── Variante E: rellenar img que YA EXISTE en el HTML ──────────
// Página de detalle: el <img> ya está en el HTML, solo cambias src/alt
function imagenVarianteE(item) {
    const img = document.querySelector('.card-img-top');
    img.src = 'img/' + item.img;
    img.alt = item.marca + ' ' + item.modelo;
}


// ═══════════════════════════════════════════════════════════════════
// [5] DOM — CARDS (todos los patrones)
// ═══════════════════════════════════════════════════════════════════

function pintarCards(items) {
    const contenedor = document.getElementById('contenedor'); // o 'listado'
    limpiarNodos(contenedor);

    // Mensaje sin resultados
    const msg = document.getElementById('mensajeSinResultados');
    if (msg) msg.style.display = items.length === 0 ? 'block' : 'none';

    // Pasar el ÍNDICE ORIGINAL o el ID según tenga el JSON
    items.forEach(function (item) {
        // Sin id en JSON → indexOf para obtener la posición original
        const indexOriginal = todosLosItems.indexOf(item);
        contenedor.appendChild(crearCard(item, indexOriginal));
        // Con id en JSON → no necesitas indexOf, crearCard usa item.id
        // contenedor.appendChild(crearCard(item));
    });
}

function crearCard(item, index) {
    // Wrapper / base de la card
    const col = document.createElement('div');
    col.classList.add('col');               // o 'card', 'mb-4' directamente

    const card = document.createElement('div');
    card.classList.add('card');
    col.appendChild(card);

    // ── Favorito (UNA sola llamada a getFavoritos) ─────────────
    const favoritos = getFavoritos();
    if (favoritos.includes(item.id)) card.classList.add('favorito');

    // ── Imagen (elige la variante de la sección [4]) ───────────
    imagenVarianteD(item, card);   // o A/B/C según el examen

    // ── Elemento decorativo (dorsal, número) ───────────────────
    const spanDorsal = document.createElement('span');
    spanDorsal.classList.add('dorsal');
    spanDorsal.appendChild(document.createTextNode(item.dorsal));
    card.appendChild(spanDorsal);

    // ── Badge con CLASE DINÁMICA (ternario) ────────────────────
    const badge = document.createElement('span');
    badge.classList.add('badge-estado',
        item.estado === 'Activo' ? 'estado-activo' : 'estado-retirado');
    badge.appendChild(document.createTextNode(item.estado));
    card.appendChild(badge);
    // 3 estados → variable intermedia:
    // const cls = item.estado === 'Activa' ? 'estado-activa'
    //           : item.estado === 'Planificada' ? 'estado-planificada'
    //           : 'estado-completada';
    // badge.classList.add('badge-estado', cls);

    // ── Título ──────────────────────────────────────────────────
    const titulo = document.createElement('h2');
    titulo.classList.add('card-title');
    titulo.appendChild(document.createTextNode(item.marca + ' ' + item.modelo));
    card.appendChild(titulo);

    // ── p > small en BUCLE ──────────────────────────────────────
    ['🏍 ' + item.moto, '🏁 ' + item.equipo].forEach(function (texto) {
        const p = document.createElement('p');
        p.classList.add('mb-1');
        const small = document.createElement('small');
        small.appendChild(document.createTextNode(texto));
        p.appendChild(small);
        card.appendChild(p);
    });

    // ── PRECIO ANIDADO (div > div > h2) — estilo THU ────────────
    const divRow = document.createElement('div');
    divRow.classList.add('row', 'justify-content-end');
    const divCol = document.createElement('div');
    divCol.classList.add('p-2', 'mb-1', 'col-md-3', 'offset-md-3', 'bg-warning', 'rounded', 'text-center');
    const h2Precio = document.createElement('h2');
    h2Precio.classList.add('font-weight-bold');
    h2Precio.appendChild(document.createTextNode(formatearNumero(item.precio) + ' €'));
    divCol.appendChild(h2Precio);  // h2 → divCol
    divRow.appendChild(divCol);    // divCol → divRow
    card.appendChild(divRow);      // divRow → card
    // Montaje de dentro hacia afuera: nieto → hijo → padre → card

    // ── Fila de cabeceras (texto fijo) en BUCLE ─────────────────
    const filaDatos = document.createElement('div');
    filaDatos.classList.add('row');
    ['Año', 'Kilómetros', 'Cambio', 'Combustible'].forEach(function (texto) {
        const div = document.createElement('div');
        div.classList.add('col', 'p-3', 'text-center', 'border-bottom', 'border-dark');
        div.appendChild(document.createTextNode(texto));
        filaDatos.appendChild(div);
    });

    // Separador Bootstrap (fuerza salto de fila)
    const separador = document.createElement('div');
    separador.classList.add('w-100');
    filaDatos.appendChild(separador);

    // ── Fila de valores (datos del item) en BUCLE ──────────────
    // ⚠ array con COMAS, no con +  → [a, b, c] no [a + b + c]
    [item.anyo, item.km, item.cambio, item.combustible].forEach(function (valor) {
        const div = document.createElement('div');
        div.classList.add('col', 'p-3', 'text-center', 'fw-bold');
        div.appendChild(document.createTextNode(valor));
        filaDatos.appendChild(div);
    });
    card.appendChild(filaDatos);

    // ── Chips de datos (span > small) en BUCLE ─────────────────
    const dChips = document.createElement('div');
    dChips.classList.add('d-flex', 'gap-3', 'mt-2', 'mb-3');
    [item.nacionalidad, '#' + item.dorsal, item.mundiales + ' títulos'].forEach(function (d) {
        const span = document.createElement('span');
        const small = document.createElement('small');
        small.appendChild(document.createTextNode(d));
        span.appendChild(small);
        dChips.appendChild(span);
    });
    card.appendChild(dChips);

    // ── Botones de acción en BUCLE ──────────────────────────────
    const dAcciones = document.createElement('div');
    dAcciones.classList.add('acciones');
    [
        { texto: 'Ver ficha', clase: 'btn-ficha', data: item.id },
        { texto: '✎', clase: 'btn-editar', data: item.id },
        { texto: '✕', clase: 'btn-borrar', data: item.id },
    ].forEach(function (b) {
        const btn = document.createElement('button');
        btn.classList.add(b.clase);
        btn.dataset.id = b.data;
        btn.appendChild(document.createTextNode(b.texto));
        dAcciones.appendChild(btn);
    });
    card.appendChild(dAcciones);

    // ── Botón favorito con ternario ─────────────────────────────
    const btnFav = document.createElement('button');
    btnFav.classList.add('btn-fav');
    btnFav.dataset.id = item.id;
    btnFav.appendChild(document.createTextNode(favoritos.includes(item.id) ? '★' : '☆'));
    card.appendChild(btnFav);

    // ── Botón enlace a otra página (Reservar) ──────────────────
    const botonEnlace = document.createElement('a');
    botonEnlace.classList.add('btn', 'btn-primary', 'm-3');
    // Sin id en JSON → usar index (viene de pintarCards con indexOf):
    botonEnlace.href = 'reserva.html?id=' + index;
    // Con id en JSON → usar item.id directamente:
    // botonEnlace.href = 'reserva.html?id=' + item.id;
    botonEnlace.appendChild(document.createTextNode('Reservar'));
    card.appendChild(botonEnlace);

    return col;
}


// ═══════════════════════════════════════════════════════════════════
// [6] DOM — TABLA (estándar + contable)
// ═══════════════════════════════════════════════════════════════════

// ── Cabecera con BUCLE ──────────────────────────────────────────
function crearCabecera() {
    const thead = document.getElementById('cabeceraThead');
    const tr = document.createElement('tr');
    ['', 'Nombre', 'Equipo', 'Nac.', 'Mundiales', 'Puntos'].forEach(function (texto) {
        const th = document.createElement('th');
        th.appendChild(document.createTextNode(texto));
        tr.appendChild(th);
    });
    thead.appendChild(tr); // ← no olvidar
}

// ── Tabla estándar (borrar por ID) ─────────────────────────────
function pintarTabla(items) {
    const tbody = document.getElementById('cuerpoTabla');
    limpiarNodos(tbody);
    items.forEach(function (item) {
        const tr = document.createElement('tr');

        // Botón borrar (aparte: tiene clase y dataset)
        const tdBtn = document.createElement('td');
        const btn = document.createElement('button');
        btn.classList.add('btn-borrar');
        btn.dataset.id = item.id;
        btn.appendChild(document.createTextNode('✕'));
        tdBtn.appendChild(btn);
        tr.appendChild(tdBtn);

        // Resto de celdas en BUCLE
        [item.nombre, item.equipo, item.nacionalidad, item.mundiales, item.puntos]
            .forEach(function (dato) {
                const td = document.createElement('td');
                td.appendChild(document.createTextNode(dato));
                tr.appendChild(td);
            });

        tbody.appendChild(tr);
    });
}

// ── Tabla CONTABLE con saldo acumulado (borrar por ÍNDICE) ─────
// tipo = 'H' (haber, suma) o 'D' (debe, resta)
function pintarTablaContable(movimientos) {
    const tbody = document.getElementById('cuerpoTbody'); // ← id puede variar
    limpiarNodos(tbody);
    let saldo = 0;

    movimientos.forEach(function (mov, indice) {
        const importe = parseFloat(mov.importe) || 0; // string → número
        saldo += mov.tipo === 'H' ? importe : -importe;

        const tr = document.createElement('tr');

        // Botón borrar por ÍNDICE (no por id)
        const tdBtn = document.createElement('td');
        const btn = document.createElement('button');
        btn.classList.add('btn-borrar');
        btn.dataset.indice = indice; // dataset.indice en lugar de id
        btn.appendChild(document.createTextNode('Borrar'));
        tdBtn.appendChild(btn);
        tr.appendChild(tdBtn);

        // Celdas en BUCLE (incluye saldo calculado)
        [mov.fecha, mov.concepto, mov.tipo, importe.toFixed(2), saldo.toFixed(2)]
            .forEach(function (dato) {
                const td = document.createElement('td');
                td.appendChild(document.createTextNode(dato));
                tr.appendChild(td);
            });

        tbody.appendChild(tr);
    });

    // Actualizar saldo total
    const saldoEl = document.getElementById('saldoActual');
    limpiarNodos(saldoEl);
    saldoEl.appendChild(document.createTextNode(saldo.toFixed(2)));
}

// ── Botón dentro de la tabla con prepend (ej: btnGrabar en tfoot) ─
function crearBotonEnFila(idFila, idBtn, texto, clase) {
    const tr = document.getElementById(idFila);
    const tdBtn = document.createElement('td');
    const btn = document.createElement('button');
    btn.id = idBtn;
    btn.classList.add(clase);
    btn.appendChild(document.createTextNode(texto));
    tdBtn.appendChild(btn);
    tr.prepend(tdBtn); // prepend = primer hijo
    // Alternativa: tr.insertBefore(tdBtn, tr.firstChild)
}


// ═══════════════════════════════════════════════════════════════════
// [7] DOM — SIDEBAR / panel lateral
// ═══════════════════════════════════════════════════════════════════

function mostrarPanel(item) {
    const sidebar = document.getElementById('sidebar');
    const contenido = document.getElementById('contenidoSidebar');
    limpiarNodos(contenido);

    // Foto grande con fallback (opcional)
    imagenVarianteD(item, contenido);

    // Título
    const h2 = document.createElement('h2');
    h2.appendChild(document.createTextNode(item.nombre));
    contenido.appendChild(h2);

    // Campos en BUCLE: div.campo > span(label) + texto(valor)
    const campos = [
        { label: 'Equipo:', valor: item.equipo },
        { label: 'Nacionalidad:', valor: item.nacionalidad },
        { label: 'Dorsal:', valor: item.dorsal },
        { label: 'Mundiales:', valor: item.mundiales },
        { label: 'Puntos:', valor: item.puntos },
        { label: 'Email:', valor: item.email },
        { label: 'Teléfono:', valor: item.telefono },
    ];
    campos.forEach(function (c) {
        const div = document.createElement('div');
        div.classList.add('campo');
        const span = document.createElement('span');
        span.appendChild(document.createTextNode(c.label));
        div.appendChild(span);
        div.appendChild(document.createTextNode(c.valor));
        contenido.appendChild(div);
    });

    // Bio
    const bio = document.createElement('div');
    bio.classList.add('bio');
    bio.appendChild(document.createTextNode(item.bio || item.descripcion || ''));
    contenido.appendChild(bio);

    sidebar.style.display = 'block'; // ← SIEMPRE necesario para mostrar
}


// ═══════════════════════════════════════════════════════════════════
// [8] RELLENAR SELECTS (todas las variantes)
// ═══════════════════════════════════════════════════════════════════

// ── Variante A: texto (sort alfabético) ────────────────────────
function rellenarSelect(items, campoValor, idSelect, textoDefault) {
    const valores = [...new Set(items.map(i => i[campoValor]))].sort();
    const select = document.getElementById(idSelect);
    limpiarNodos(select);

    const optDefault = document.createElement('option');
    optDefault.value = '';
    optDefault.appendChild(document.createTextNode(textoDefault || 'Todos'));
    select.appendChild(optDefault);

    valores.forEach(function (v) {
        const opt = document.createElement('option');
        opt.value = v;
        opt.appendChild(document.createTextNode(v));
        select.appendChild(opt);
    });
}
// Uso filtro:     rellenarSelect(items, 'equipo', 'selectEquipo', 'Todos')
// Uso formulario: rellenarSelect(items, 'equipo', 'inputEquipo', '-- Selecciona --')

// ── Variante B: NUMÉRICO (sort numérico — años, dorsales, km) ──
// El sort() normal ordena alfabético: "10" < "9". Para números usar (a,b)=>a-b
function rellenarSelectNumerico(items, campoValor, idSelect, textoDefault) {
    const valores = [...new Set(items.map(i => i[campoValor]))].sort((a, b) => a - b);
    const select = document.getElementById(idSelect);
    limpiarNodos(select);

    const optDefault = document.createElement('option');
    optDefault.value = '';
    optDefault.appendChild(document.createTextNode(textoDefault || 'Todos'));
    select.appendChild(optDefault);

    valores.forEach(function (v) {
        const opt = document.createElement('option');
        opt.value = v;
        opt.appendChild(document.createTextNode(v));
        select.appendChild(opt);
    });
}
// Para Desde/Hasta: llamar dos veces
// rellenarSelectNumerico(items, 'anyo', 'anyoDesde', 'Desde')
// rellenarSelectNumerico(items, 'anyo', 'anyoHasta', 'Hasta')

// ── Variante C: rango Desde/Hasta en UN solo forEach ───────────
function rellenarSelectsRango(items, campoValor, idDesde, idHasta) {
    const valores = [...new Set(items.map(i => i[campoValor]))].sort((a, b) => a - b);

    [{ id: idDesde, texto: 'Desde' }, { id: idHasta, texto: 'Hasta' }]
        .forEach(function (s) {
            const select = document.getElementById(s.id);
            limpiarNodos(select);
            const optDefault = document.createElement('option');
            optDefault.value = '';
            optDefault.appendChild(document.createTextNode(s.texto));
            select.appendChild(optDefault);
            valores.forEach(function (v) {
                const opt = document.createElement('option');
                opt.value = v;
                opt.appendChild(document.createTextNode(v));
                select.appendChild(opt);
            });
        });
}

// ── Variante D: valores FIJOS (no vienen del JSON) ─────────────
// Para D/H, Activo/Retirado... valores constantes, NO uses Set del JSON
function rellenarSelectFijo(idSelect, valores, textoDefault) {
    const select = document.getElementById(idSelect);
    limpiarNodos(select);
    const optDefault = document.createElement('option');
    optDefault.value = '';
    optDefault.appendChild(document.createTextNode(textoDefault));
    select.appendChild(optDefault);
    valores.forEach(function (v) {
        const opt = document.createElement('option');
        opt.value = v;
        opt.appendChild(document.createTextNode(v));
        select.appendChild(opt);
    });
}
// Uso: rellenarSelectFijo('inputDH', ['D', 'H'], 'Seleccione tipo')


// ═══════════════════════════════════════════════════════════════════
// [9] EVENTOS CENTRALIZADOS — inicializarEventos()
// ═══════════════════════════════════════════════════════════════════

function inicializarEventos(todosLosItems) {

    // ── Delegación cards ───────────────────────────────────────
    document.getElementById('contenedor').addEventListener('click', function (e) {
        if (e.target.classList.contains('btn-ficha')) {
            const id = parseInt(e.target.dataset.id);
            mostrarPanel(todosLosItems.find(i => i.id === id));
        }
        if (e.target.classList.contains('btn-borrar')) {
            borrarItem(parseInt(e.target.dataset.id), todosLosItems);
        }
        if (e.target.classList.contains('btn-fav')) {
            toggleFavorito(parseInt(e.target.dataset.id));
            pintarCards(todosLosItems);
        }
        if (e.target.classList.contains('btn-editar')) {
            const id = parseInt(e.target.dataset.id);
            activarModoEdicion(todosLosItems.find(i => i.id === id));
        }
    });

    // ── Delegación tabla (borrar por ID) ──────────────────────
    document.getElementById('cuerpoTabla').addEventListener('click', function (e) {
        if (e.target.classList.contains('btn-borrar')) {
            borrarItem(parseInt(e.target.dataset.id), todosLosItems);
        }
    });

    // ── Delegación tabla CONTABLE (borrar por ÍNDICE) ─────────
    // document.getElementById('cuerpoTbody').addEventListener('click', function (e) {
    //     if (e.target.classList.contains('btn-borrar')) {
    //         borrarPorIndice(parseInt(e.target.dataset.indice), todosLosItems);
    //     }
    // });

    // ── Cerrar sidebar ─────────────────────────────────────────
    document.getElementById('btnCerrarSidebar').addEventListener('click', function () {
        document.getElementById('sidebar').style.display = 'none';
        limpiarNodos(document.getElementById('contenidoSidebar'));
    });

    // ── Ordenación en BUCLE con clase activo ───────────────────
    const ordenaciones = [
        { id: 'btnOrdenDefecto', fn: () => [...todosLosItems].sort((a, b) => a.id - b.id) },
        { id: 'btnOrdenPrecio', fn: () => [...todosLosItems].sort((a, b) => parseInt(b.precio) - parseInt(a.precio)) },
        { id: 'btnOrdenNombre', fn: () => [...todosLosItems].sort((a, b) => a.nombre.localeCompare(b.nombre)) },
    ];
    ordenaciones.forEach(function (o) {
        document.getElementById(o.id).addEventListener('click', function () {
            document.querySelectorAll('.btn-sort').forEach(b => b.classList.remove('activo'));
            this.classList.add('activo');
            pintarCards(o.fn());
        });
    });

    // ── Toggle solo favoritos (estado local) ──────────────────
    let soloFavoritos = false;
    document.getElementById('btnSoloFavoritos').addEventListener('click', function () {
        soloFavoritos = !soloFavoritos;
        limpiarNodos(this);
        this.appendChild(document.createTextNode(soloFavoritos ? '★ Todos' : '★ Solo favoritos'));
        this.classList.toggle('activo', soloFavoritos);
        if (soloFavoritos) {
            const ids = getFavoritos();
            pintarCards(todosLosItems.filter(i => ids.includes(i.id)));
        } else {
            pintarCards(todosLosItems);
        }
    });

    // ── Filtrar / Reiniciar ────────────────────────────────────
    document.getElementById('btnFiltrar').addEventListener('click', function (e) {
        e.preventDefault();
        aplicarFiltros(todosLosItems);
    });
    document.getElementById('btnReiniciar').addEventListener('click', function () {
        reiniciarFiltros(todosLosItems);
    });

    // ── Submit formulario (distingue alta de edición) ─────────
    document.getElementById('formulario').addEventListener('submit', function (e) {
        e.preventDefault();
        if (validarFormulario()) {
            const idEdicion = this.dataset.modoEdicion;
            if (idEdicion) {
                editarItem(parseInt(idEdicion), todosLosItems);
            } else {
                guardarItem(todosLosItems);
            }
        }
    });

    // ── Cancelar edición ───────────────────────────────────────
    const btnCancelar = document.getElementById('btnCancelarEdicion');
    if (btnCancelar) btnCancelar.addEventListener('click', desactivarModoEdicion);
}

// ── Botones de ordenación en HTML ESTÁTICO (sin construir DOM) ─
// Mismo patrón pero los botones ya están en el HTML
function eventosOrdenacionEstatica(todosLosItems) {
    const ordenaciones = [
        { id: 'relevancia', fn: () => [...todosLosItems].sort((a, b) => a.id - b.id) },
        { id: 'precioAlto', fn: () => [...todosLosItems].sort((a, b) => parseInt(b.precio) - parseInt(a.precio)) },
        { id: 'precioBajo', fn: () => [...todosLosItems].sort((a, b) => parseInt(a.precio) - parseInt(b.precio)) },
    ];
    ordenaciones.forEach(function (o) {
        document.getElementById(o.id).addEventListener('click', function () {
            pintarCards(o.fn());
        });
    });
}


// ═══════════════════════════════════════════════════════════════════
// [11] FILTROS (todos los tipos juntos)
// ═══════════════════════════════════════════════════════════════════

// ── LOS 6 TIPOS DE CONTROL DE FILTRO ──────────────────────────
// Cualquier examen será una combinación de estos 6.
// El patrón es siempre: if (condición && no cumple) return false;
//
// TIPO 1 — Input texto (buscar por nombre, marca, modelo)
//   LEER:   const texto = document.getElementById('inputBuscar').value.toLowerCase().trim();
//   FILTER: if (texto !== '' && !item.nombre.toLowerCase().includes(texto) &&
//                                !item.equipo.toLowerCase().includes(texto)) return false;
//
// TIPO 2 — Select coincidencia exacta (equipo, nacionalidad, combustible)
//   LEER:   const equipo = document.getElementById('selectEquipo').value;
//   FILTER: if (equipo !== '' && item.equipo !== equipo) return false;
//
// TIPO 3 — Select rango numérico Desde / Hasta (años, km, dorsales, precio)
//   LEER:   const desde = document.getElementById('anyoDesde').value;
//           const hasta = document.getElementById('anyoHasta').value;
//   FILTER: if (desde !== '' && item.anyo < parseInt(desde)) return false;
//           if (hasta !== '' && item.anyo > parseInt(hasta)) return false;
//   ⚠ REGLA: parseInt al VALUE del select (siempre string), NO al campo del JSON
//
// TIPO 4 — Radio button (cambio: Todos / Automático / Manual)
//   LEER:   const cambio = document.querySelector('input[name="cambio"]:checked').value;
//   FILTER: if (cambio !== '' && item.cambio !== cambio) return false;
//
// TIPO 5 — Checkbox individual (solo activos, solo campeones)
//   LEER:   const soloActivos = document.getElementById('chkActivos').checked;
//   FILTER: if (soloActivos && item.estado !== 'Activo') return false;
//
// TIPO 6 — Checkbox favoritos (filtrar por array de ids de localStorage)
//   LEER:   const soloFavs = document.getElementById('chkFavoritos').checked;
//           const favs = getFavoritos();
//   FILTER: if (soloFavs && !favs.includes(item.id)) return false;


function aplicarFiltros(items) {
    const errorEl = document.getElementById('errorFiltro'); // o 'errorMensaje'
    limpiarNodos(errorEl);

    // ── Leer TODOS los controles ───────────────────────────────
    const texto = document.getElementById('inputBuscar').value.toLowerCase().trim();  // TIPO 1
    const equipo = document.getElementById('selectEquipo').value;                       // TIPO 2
    const combustible = document.getElementById('combustible').value;                         // TIPO 2
    const kmDesde = document.getElementById('kmDesde').value;                             // TIPO 3
    const kmHasta = document.getElementById('kmHasta').value;                             // TIPO 3
    const anyoDesde = document.getElementById('anyoDesde').value;                           // TIPO 3
    const anyoHasta = document.getElementById('anyoHasta').value;                           // TIPO 3
    const cambio = document.querySelector('input[name="cambio"]:checked').value;        // TIPO 4
    // const soloActivos = document.getElementById('chkActivos').checked;                     // TIPO 5
    // const soloFavs    = document.getElementById('chkFavoritos').checked;                   // TIPO 6
    // const favs        = getFavoritos();                                                    // TIPO 6

    // ── Validación de rangos — UN if SEPARADO por cada rango ───
    if (kmDesde !== '' && kmHasta !== '' && parseInt(kmDesde) > parseInt(kmHasta)) {
        errorEl.appendChild(document.createTextNode('Los km Desde no pueden ser mayores que los Hasta.'));
        return;
    }
    if (anyoDesde !== '' && anyoHasta !== '' && parseInt(anyoDesde) > parseInt(anyoHasta)) {
        errorEl.appendChild(document.createTextNode('El año Desde no puede ser mayor que el Hasta.'));
        return;
    }

    // ── filter encadenado (todos los tipos juntos) ─────────────
    const resultado = items.filter(function (item) {
        // TIPO 1 — texto en dos campos
        if (texto !== '' && !item.marca.toLowerCase().includes(texto) &&
            !item.modelo.toLowerCase().includes(texto)) return false;
        // TIPO 2 — selects coincidencia exacta
        if (equipo !== '' && item.equipo !== equipo) return false;
        if (combustible !== '' && item.combustible !== combustible) return false;
        // TIPO 3 — rangos numéricos (parseInt al select, NO al item)
        if (kmDesde !== '' && item.km < parseInt(kmDesde)) return false;
        if (kmHasta !== '' && item.km > parseInt(kmHasta)) return false;
        if (anyoDesde !== '' && item.anyo < parseInt(anyoDesde)) return false;
        if (anyoHasta !== '' && item.anyo > parseInt(anyoHasta)) return false;
        // TIPO 4 — radio button
        if (cambio !== '' && item.cambio !== cambio) return false;
        // TIPO 5 — checkbox individual
        // if (soloActivos && item.estado !== 'Activo') return false;
        // TIPO 6 — checkbox favoritos
        // if (soloFavs && !favs.includes(item.id)) return false;
        return true;
    });

    // Mensaje sin resultados
    const msg = document.getElementById('mensajeSinResultados');
    if (msg) msg.style.display = resultado.length === 0 ? 'block' : 'none';

    pintarCards(resultado);
    pintarTabla(resultado);
}

function reiniciarFiltros(items) {
    document.getElementById('inputBuscar').value = '';
    document.getElementById('selectEquipo').value = '';
    document.getElementById('kmDesde').value = '';
    document.getElementById('kmHasta').value = '';
    document.getElementById('anyoDesde').value = '';
    document.getElementById('anyoHasta').value = '';
    document.getElementById('combustible').value = '';
    // Radio: volver al primero (Todos)
    // document.querySelector('input[name="cambio"][value=""]').checked = true;
    limpiarNodos(document.getElementById('errorFiltro'));
    pintarCards(items);
    pintarTabla(items);
}


// ═══════════════════════════════════════════════════════════════════
// [12] jQuery UI AUTOCOMPLETE (3 variantes)
// ═══════════════════════════════════════════════════════════════════

// ── Variante A: dos campos (nombre/marca + modelo/equipo) ──────
// Filtra al seleccionar Y al escribir
function iniciarAutocomplete(items) {
    const sugerencias = [];
    const vistos = {};
    items.forEach(function (item) {
        [item.marca, item.modelo].forEach(function (v) {
            if (!vistos[v]) {
                vistos[v] = true;
                sugerencias.push(v);
            }
        });
    });

    $('#marcaModelo').autocomplete({
        source: sugerencias,
        select: function (event, ui) {
            $('#marcaModelo').val(ui.item.value); // OBLIGATORIO (ui.item, no ui.cars)
            aplicarFiltros(items);
            return false;                         // OBLIGATORIO evitar sobreescritura
        }
    });

    // Filtrar también al escribir manualmente
    $('#marcaModelo').on('input', function () {
        aplicarFiltros(items);
    });
}

// ── Variante B: SOLO al pulsar "Ir" (no al escribir) ───────────
function iniciarAutocompleteBotonIr(items) {
    const sugerencias = [];
    const vistos = {};
    items.forEach(function (item) {
        [item.marca, item.modelo].forEach(function (v) {
            if (!vistos[v]) { vistos[v] = true; sugerencias.push(v); }
        });
    });

    $('#marcaModelo').autocomplete({
        source: sugerencias,
        select: function (event, ui) {
            $('#marcaModelo').val(ui.item.value);
            aplicarFiltros(items);
            return false;
        }
    });
    // SIN evento 'input' — solo filtra con el botón:
    document.getElementById('ir').addEventListener('click', function () {
        aplicarFiltros(items);
    });
}

// ── Variante C: marca + "marca modelo" compuesto ───────────────
function iniciarAutocompleteCompuesto(items) {
    const sugerencias = [];
    const vistos = {};
    items.forEach(function (item) {
        if (!vistos[item.marca]) { vistos[item.marca] = true; sugerencias.push(item.marca); }
        const mm = item.marca + ' ' + item.modelo;
        if (!vistos[mm]) { vistos[mm] = true; sugerencias.push(mm); }
    });
    $('#marcaModelo').autocomplete({
        source: sugerencias,
        select: function (event, ui) {
            $('#marcaModelo').val(ui.item.value);
            aplicarFiltros(items);
            return false;
        }
    });
}


// ═══════════════════════════════════════════════════════════════════
// [13] CRUD — alta, borrar, editar, favoritos
// ═══════════════════════════════════════════════════════════════════

// ── Alta de item nuevo ──────────────────────────────────────────
function guardarItem(todosLosItems) {
    const nuevoItem = {
        id: Date.now(),  // id único
        nombre: document.getElementById('inputNombre').value.trim(),
        email: document.getElementById('inputEmail').value.trim(),
        telefono: document.getElementById('inputTelefono').value.trim(),
        dorsal: parseInt(document.getElementById('inputDorsal').value),
        equipo: document.getElementById('inputEquipo').value,
        anyo: parseInt(document.getElementById('inputAnyo').value),
        // Valores por defecto para campos no incluidos en el formulario:
        mundiales: 0, puntos: 0, estado: 'Activo', nacionalidad: 'N/D', bio: '', img: '',
    };
    todosLosItems.push(nuevoItem);
    setItems(todosLosItems);
    rellenarSelect(todosLosItems, 'equipo', 'inputEquipo', '-- Selecciona --'); // actualizar selects
    pintarCards(todosLosItems);
    pintarTabla(todosLosItems);
    document.getElementById('formulario').reset();
}

// ── Alta tabla contable (sin id, inputs sueltos) ───────────────
function guardarMovimiento(movimientos) {
    const nuevo = {
        fecha: document.getElementById('inputFecha').value.trim(),
        concepto: document.getElementById('inputConcepto').value.trim(),
        tipo: document.getElementById('inputDH').value,
        importe: parseFloat(document.getElementById('inputImporte').value) || 0,
    };
    movimientos.push(nuevo);
    setItems(movimientos);
    pintarTablaContable(movimientos);
    // Limpiar manualmente (no hay form.reset con inputs sueltos)
    document.getElementById('inputFecha').value = '';
    document.getElementById('inputConcepto').value = '';
    document.getElementById('inputImporte').value = '';
    document.getElementById('inputDH').value = '';
}

// ── Borrar por ID (mutando el array original) ──────────────────
function borrarItem(id, todosLosItems) {
    if (!confirm('¿Seguro que quieres eliminar este elemento?')) return;
    const nuevos = todosLosItems.filter(i => i.id !== id);
    // Mutar el array ORIGINAL para no perder la referencia en los listeners
    todosLosItems.length = 0;
    nuevos.forEach(i => todosLosItems.push(i));
    setItems(todosLosItems);
    pintarCards(todosLosItems);
    pintarTabla(todosLosItems);
}

// ── Borrar por ÍNDICE (tabla contable, splice) ─────────────────
function borrarPorIndice(indice, items) {
    if (!confirm('¿Seguro?')) return;
    items.splice(indice, 1);
    setItems(items);
    pintarTablaContable(items);
}

// ── Toggle favorito ─────────────────────────────────────────────
function toggleFavorito(id) {
    const favoritos = getFavoritos();
    const indice = favoritos.indexOf(id);
    if (indice === -1) favoritos.push(id);
    else favoritos.splice(indice, 1);
    setFavoritos(favoritos);
}

// ── Editar: activar modo edición ───────────────────────────────
function activarModoEdicion(item) {
    const form = document.getElementById('formulario');
    const titulo = document.getElementById('tituloFormulario');
    limpiarNodos(titulo);
    titulo.appendChild(document.createTextNode('Editar'));

    form.dataset.modoEdicion = item.id; // marcador para el submit

    // Precargar campos
    document.getElementById('inputNombre').value = item.nombre;
    document.getElementById('inputEmail').value = item.email || '';
    document.getElementById('inputTelefono').value = item.telefono || '';
    document.getElementById('inputDorsal').value = item.dorsal;
    document.getElementById('inputEquipo').value = item.equipo;
    document.getElementById('inputAnyo').value = item.anyo;

    document.getElementById('btnCancelarEdicion').style.display = 'inline-block';
    document.getElementById('seccionFormulario').scrollIntoView({ behavior: 'smooth' });
}

// ── Editar: guardar cambios (spread conserva campos no editados) ──
function editarItem(id, todosLosItems) {
    const indice = todosLosItems.findIndex(i => i.id === id);
    if (indice === -1) return;
    todosLosItems[indice] = {
        ...todosLosItems[indice], // conserva mundiales, puntos, bio, img...
        nombre: document.getElementById('inputNombre').value.trim(),
        email: document.getElementById('inputEmail').value.trim(),
        telefono: document.getElementById('inputTelefono').value.trim(),
        dorsal: parseInt(document.getElementById('inputDorsal').value),
        equipo: document.getElementById('inputEquipo').value,
        anyo: parseInt(document.getElementById('inputAnyo').value),
    };
    setItems(todosLosItems);
    pintarCards(todosLosItems);
    pintarTabla(todosLosItems);
    desactivarModoEdicion();
}

// ── Editar: volver a modo alta ─────────────────────────────────
function desactivarModoEdicion() {
    const form = document.getElementById('formulario');
    const titulo = document.getElementById('tituloFormulario');
    limpiarNodos(titulo);
    titulo.appendChild(document.createTextNode('Registrar'));
    delete form.dataset.modoEdicion;
    form.reset();
    document.getElementById('btnCancelarEdicion').style.display = 'none';
}

// ── idCounter autoincremental (alternativa a Date.now) ─────────
// const idCounter = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;


// ═══════════════════════════════════════════════════════════════════
// [14] PASO ENTRE PÁGINAS — URL e índice
// ═══════════════════════════════════════════════════════════════════

// ── VARIANTE A: por ÍNDICE del array (cuando el JSON NO tiene campo id) ──
// En crearCard — pintarCards pasa el índice original:
//   items.forEach(function (item) {
//       const indexOriginal = todosLosItems.indexOf(item);
//       contenedor.appendChild(crearCard(item, indexOriginal));
//   });
// En crearCard:
//   botonEnlace.href = 'reserva.html?id=' + index;
// En la otra página — acceder por posición:
//   const index = parseInt(leerParametroURL('id'));
//   const item  = json.cars[index];   // acceso por posición en el array

// ── VARIANTE B: por ID del JSON (cuando el JSON SÍ tiene campo id) ──
// En crearCard — no necesitas indexOf ni pasar index:
//   botonEnlace.href = 'detalle.html?id=' + item.id;
// En la otra página — buscar con find:
//   const id   = parseInt(leerParametroURL('id'));
//   const item = json.cars.find(c => c.id === id);   // busca por id

// ⚠ DIFERENCIA CLAVE:
// Sin id en JSON → indexOf + json.cars[index]  (posición, se rompe si filtras)
// Con id en JSON → item.id + find()            (siempre encuentra el correcto)

// Función para leer el parámetro
function leerParametroURL(nombre) {
    const params = new URLSearchParams(window.location.search);
    return params.get(nombre); // string o null
}


// ═══════════════════════════════════════════════════════════════════
// [15] PÁGINA DE DETALLE / RESERVA (querySelector SIN ids)
// ═══════════════════════════════════════════════════════════════════
// Cuando el profesor prohíbe añadir ids: usar name, clase, etiqueta, índice

document.addEventListener('DOMContentLoaded', mainReserva);

async function mainReserva() {
    const response = await fetch('bbdd.json');
    const json = await response.json();

    // ── VARIANTE A: leer por ÍNDICE (JSON sin campo id) ────────
    const index = parseInt(leerParametroURL('id'));
    const coche = json.cars[index];

    // ── VARIANTE B: leer por ID (JSON con campo id) ────────────
    // const id    = parseInt(leerParametroURL('id'));
    // const coche = json.cars.find(c => c.id === id);

    // Redirigir si no existe
    if (!coche) {
        window.location.href = 'index.html';
        return;
    }

    pintarDetalle(coche);
    inicializarEventosReserva(coche);
}

// ── Rellenar datos del item en HTML existente ──────────────────
function pintarDetalle(coche) {
    // Imagen ya existe en el HTML → cambiar src/alt
    const img = document.querySelector('.card-img-top');
    img.src = 'img/' + coche.img;
    img.alt = coche.marca + ' ' + coche.modelo;

    // Texto por clase
    const titulo = document.querySelector('.card-title');
    titulo.appendChild(document.createTextNode(coche.marca + ' ' + coche.modelo));

    const precio = document.querySelector('.font-weight-bold');
    precio.appendChild(document.createTextNode(formatearNumero(coche.precio) + ' €'));

    // Varios elementos iguales → querySelectorAll por ÍNDICE
    const strongs = document.querySelectorAll('strong');
    strongs[0].appendChild(document.createTextNode(coche.anyo));
    strongs[1].appendChild(document.createTextNode(coche.km));
    strongs[2].appendChild(document.createTextNode(coche.cambio));
    strongs[3].appendChild(document.createTextNode(coche.combustible));
}

// ── Eventos de la reserva ──────────────────────────────────────
function inicializarEventosReserva(coche) {
    document.querySelector('form').addEventListener('submit', function (e) {
        e.preventDefault();
        if (validarFormularioReserva()) {
            guardarReserva(coche);
        }
    });
}

// ── Guardar reserva (versión array — acumula todas) ────────────
function guardarReserva(coche) {
    const reservas = JSON.parse(localStorage.getItem('reservas')) || [];
    const reserva = {
        coche: coche,
        cliente: {
            nombreApellidos: document.querySelector('input[name="nombreApellidos"]').value.trim(),
            dniCifNia: document.querySelector('input[name="dniCifNia"]').value.trim(),
            email: document.querySelector('input[name="email"]').value.trim(),
            telefono: document.querySelector('input[name="telefono"]').value.trim(),
            nota: document.querySelector('textarea').value.trim(),
        }
    };
    reservas.push(reserva);                                      // push del OBJETO
    localStorage.setItem('reservas', JSON.stringify(reservas));  // guardar el ARRAY
    window.location.href = 'index.html';
}

// ── Guardar reserva (versión objeto único — sobreescribe) ──────
// localStorage.setItem('reserva', JSON.stringify(reserva)); // si solo guardas la última


// ═══════════════════════════════════════════════════════════════════
// [16] REGEX
// ═══════════════════════════════════════════════════════════════════
// IMPORTANTE: declarar REGEX en CADA archivo JS (no se comparten entre archivos)

const REGEX = {
    nombre: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/,   // letras, acentos, espacios
    nombre4a40: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{4,40}$/,   // variante 4-40 caracteres
    nombreExt: /^[\w\s\-]{3,40}$/,                  // letras, números, espacios, guión
    email: /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/,
    telefono: /^\(\d{3}\)\s\d{3}-\d{3}$/,          // (999) 666-333
    dni: /^\d{8}[A-Z]$/,                       // 8 dígitos + letra
    dni9: /^\d{9}[A-Z]$/,                       // variante 9 dígitos + letra
    cif: /^[A-Z]\d{8}$/,                       // letra + 8 dígitos
    nie: /^X\d{7}[A-Z]$/,                      // X + 7 dígitos + letra
    codigo3: /^[A-Z]{3}$/,                         // ESP, ITA, FRA
    fecha: /^\d{2}\/\d{2}\/\d{4}$/,             // dd/mm/aaaa
    urlImg: /^(https?:\/\/.+|.+\.(jpg|jpeg|png|webp|gif))$/i,
    enteroPos: /^\d+$/,
    decimal: /^\d+(\.\d{1,2})?$/,
};

// DNI O CIF O NIE (al menos uno válido)
function validarDocumento(valor) {
    return REGEX.dni.test(valor) || REGEX.cif.test(valor) || REGEX.nie.test(valor);
}

// Fecha real (formato + que el día exista de verdad)
function validarFechaReal(fecha) {
    if (!REGEX.fecha.test(fecha)) return false;
    const [dia, mes, anyo] = fecha.split('/').map(Number);
    const d = new Date(anyo, mes - 1, dia);
    return d.getFullYear() === anyo && d.getMonth() === mes - 1 && d.getDate() === dia;
}


// ═══════════════════════════════════════════════════════════════════
// [17] VALIDACIÓN DE FORMULARIO (3 variantes)
// ═══════════════════════════════════════════════════════════════════

// ── REGLA CLAVE sobre checkValidity ───────────────────────────
// checkValidity() solo detecta campo vacío SI el input tiene required en el HTML.
// SIN required → un campo vacío da checkValidity()=true aunque uses setCustomValidity.
// SOLUCIONES: (1) poner required en el HTML + novalidate en el form
//             (2) validar el vacío a mano  (3) confiar en la regex (rechaza vacío)

// ── Variante A: error campo a campo (con p.error por campo) ────
function validarFormulario() {
    let valido = true;

    // Texto con regex + checkValidity (input tiene required)
    const inputNombre = document.getElementById('inputNombre');
    inputNombre.setCustomValidity('');
    if (!REGEX.nombre.test(inputNombre.value.trim())) {
        inputNombre.setCustomValidity('Formato incorrecto');
    }
    if (!inputNombre.checkValidity()) {
        mostrarError('errorNombre', 'El nombre solo puede contener letras (2-50 caracteres).');
        valido = false;
    } else { ocultarError('errorNombre'); }

    // Número: solo checkValidity (min/max/required en el HTML)
    const inputDorsal = document.getElementById('inputDorsal');
    inputDorsal.setCustomValidity('');
    if (!inputDorsal.checkValidity()) {
        mostrarError('errorDorsal', 'El dorsal debe estar entre 1 y 99.');
        valido = false;
    } else { ocultarError('errorDorsal'); }

    // Select obligatorio (value vacío = no seleccionado)
    const inputEquipo = document.getElementById('inputEquipo');
    inputEquipo.setCustomValidity('');
    if (inputEquipo.value === '') inputEquipo.setCustomValidity('Selección obligatoria');
    if (!inputEquipo.checkValidity()) {
        mostrarError('errorEquipo', 'Debes seleccionar un equipo.');
        valido = false;
    } else { ocultarError('errorEquipo'); }

    // Checkbox
    const aceptar = document.getElementById('aceptar');
    if (!aceptar.checked) {
        mostrarError('errorAceptar', 'Debes aceptar las condiciones.');
        valido = false;
    } else { ocultarError('errorAceptar'); }

    return valido;
}

// ── Variante B: errores ACUMULADOS en un solo contenedor ───────
// Para reserva sin ids por campo (querySelector + un solo p de errores)
// Requiere required + novalidate en el HTML para que checkValidity detecte vacíos
function validarFormularioReserva() {
    const errores = [];

    const inputNombre = document.querySelector('input[name="nombreApellidos"]');
    inputNombre.setCustomValidity('');
    if (!REGEX.nombre4a40.test(inputNombre.value.trim())) inputNombre.setCustomValidity('Formato incorrecto');
    if (!inputNombre.checkValidity()) errores.push('El nombre es obligatorio (4-40 letras).');

    const inputDoc = document.querySelector('input[name="dniCifNia"]');
    inputDoc.setCustomValidity('');
    if (!validarDocumento(inputDoc.value.trim())) inputDoc.setCustomValidity('Formato incorrecto');
    if (!inputDoc.checkValidity()) errores.push('El DNI, CIF o NIE no es válido.');

    const inputEmail = document.querySelector('input[name="email"]');
    inputEmail.setCustomValidity('');
    if (!REGEX.email.test(inputEmail.value.trim())) inputEmail.setCustomValidity('Formato incorrecto');
    if (!inputEmail.checkValidity()) errores.push('El formato del email no es válido.');

    const inputTel = document.querySelector('input[name="telefono"]');
    inputTel.setCustomValidity('');
    if (!REGEX.telefono.test(inputTel.value.trim())) inputTel.setCustomValidity('Formato incorrecto');
    if (!inputTel.checkValidity()) errores.push('El teléfono debe tener el formato (999) 666-333.');

    const aceptar = document.querySelector('input[type="checkbox"]');
    if (!aceptar.checked) errores.push('Debes aceptar las condiciones de uso.');

    // Mostrar todos los errores juntos
    const contenedor = document.querySelector('.text-danger'); // o getElementById('errorMensaje')
    limpiarNodos(contenedor);
    errores.forEach(function (msg) {
        const p = document.createElement('p');
        p.appendChild(document.createTextNode(msg));
        contenedor.appendChild(p);
    });

    return errores.length === 0;
}

// ── Variante C: SOLO regex (sin checkValidity, la más simple) ──
// La regex ya rechaza el vacío (exige mínimo de caracteres). No necesita required.
function validarFormularioSoloRegex() {
    const errores = [];

    const nombre = document.querySelector('input[name="nombreApellidos"]').value.trim();
    const doc = document.querySelector('input[name="dniCifNia"]').value.trim();
    const email = document.querySelector('input[name="email"]').value.trim();
    const tel = document.querySelector('input[name="telefono"]').value.trim();
    const aceptar = document.querySelector('input[type="checkbox"]').checked;

    if (!REGEX.nombre4a40.test(nombre)) errores.push('El nombre es obligatorio (4-40 letras).');
    if (!validarDocumento(doc)) errores.push('El DNI, CIF o NIE no es válido.');
    if (!REGEX.email.test(email)) errores.push('El formato del email no es válido.');
    if (!REGEX.telefono.test(tel)) errores.push('El teléfono debe ser (999) 666-333.');
    if (!aceptar) errores.push('Debes aceptar las condiciones.');

    const contenedor = document.querySelector('.text-danger');
    limpiarNodos(contenedor);
    errores.forEach(function (msg) {
        const p = document.createElement('p');
        p.appendChild(document.createTextNode(msg));
        contenedor.appendChild(p);
    });

    return errores.length === 0;
}

// ── Variante D: vacíos primero, luego formato (tabla contable) ─
function validarFormularioContable() {
    const inputFecha = document.getElementById('inputFecha');
    const inputConcepto = document.getElementById('inputConcepto');
    const inputDH = document.getElementById('inputDH');
    const inputImporte = document.getElementById('inputImporte');

    // Paso 1: vacíos
    if (inputFecha.value.trim() === '' || inputConcepto.value.trim() === '' ||
        inputDH.value === '' || inputImporte.value.trim() === '') {
        mostrarError('msgError', 'Todos los campos son obligatorios.');
        return false;
    }
    // Paso 2: formato
    if (!validarFechaReal(inputFecha.value.trim())) {
        mostrarError('msgError', 'La fecha debe ser válida (dd/mm/aaaa).');
        return false;
    }
    if (parseFloat(inputImporte.value) <= 0) {
        mostrarError('msgError', 'El importe debe ser mayor que 0.');
        return false;
    }
    ocultarError('msgError');
    return true;
}


// ═══════════════════════════════════════════════════════════════════
// [18] REFERENCIA RÁPIDA
// ═══════════════════════════════════════════════════════════════════

// ── SELECTORES (sin ids: name, clase, etiqueta) ───────────────
// document.getElementById('id')
// document.querySelector('.clase')
// document.querySelector('input[name="campo"]')
// document.querySelector('input[name="grupo"]:checked').value   → radio seleccionado
// document.querySelector('input[type="checkbox"]').checked      → checkbox booleano
// document.querySelector('textarea').value
// document.querySelectorAll('strong')[0]                        → varios iguales por índice
// document.querySelectorAll('.clase').forEach(...)              → iterar NodeList
// e.target.closest('.card')                                     → ancestro más cercano

// ── REGLA parseInt ─────────────────────────────────────────────
// select.value SIEMPRE devuelve string → parseInt(select.value)
// item.campo del JSON: si trae número va sin parsear, si trae "string" → parseInt
// THU: "km":"19000" (string, parseInt) vs "anyo":2016 (número, directo)

// ── dataset ─────────────────────────────────────────────────────
// btn.dataset.id = item.id              → escribir (se guarda string)
// parseInt(e.target.dataset.id)         → leer y parsear
// btn.dataset.indice = indice           → tabla contable
// delete form.dataset.modoEdicion       → quitar marcador

// ── classList ───────────────────────────────────────────────────
// el.classList.add('a') / remove('a') / contains('a') / toggle('a')
// el.classList.toggle('activo', booleano)  → activa según true/false
// el.className = 'btn-sort activo'         → reemplaza TODAS (útil en bucle)

// ── style ───────────────────────────────────────────────────────
// el.style.display = 'block' / 'none' / 'inline-block'

// ── Formulario ──────────────────────────────────────────────────
// form.reset()                  → limpiar todos los campos
// input.value.trim()
// parseInt(v) || 0 / parseFloat(v) || 0   → fallback a 0
// checkbox.checked
// <form novalidate>             → desactiva tooltips del navegador (OBLIGATORIO si validas tú)

// ── DOM montaje ─────────────────────────────────────────────────
// Siempre de DENTRO hacia AFUERA: nieto → hijo → padre → contenedor
// padre.appendChild(hijo)
// padre.prepend(hijo)                       → primer hijo
// padre.insertBefore(hijo, padre.firstChild)

// ── Cambiar texto sin innerHTML ─────────────────────────────────
// limpiarNodos(el); el.appendChild(document.createTextNode('nuevo'));

// ── ERRORES TÍPICOS ─────────────────────────────────────────────
// [a + b + c] concatena en uno → usar [a, b, c] con comas
// olvidar appendChild del contenedor (dFila, thead...)
// ui.cars.value → es ui.item.value
// reservas.push(reservas) → push del objeto, no del array
// setItem(reserva) cuando quieres el array → setItem(reservas)
// filtro km usando c.anyo → usar c.km
// getElementById sin DOMContentLoaded → null
// localStorage corrupto → localStorage.clear() en consola