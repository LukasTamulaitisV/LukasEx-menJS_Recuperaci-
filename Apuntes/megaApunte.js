/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                      MEGA APUNTE DEFINITIVO — DWEC                        ║
 * ║         Todas las variantes, todos los patrones, todas las salidas        ║
 * ║                                                                           ║
 * ║  CRITERIOS:                                                               ║
 * ║  1.Git  2.localStorage  3.JSON  4.DOM  5.Regex  6.checkValidity           ║
 * ║  7.Arrays  8.Eventos+ObjetosJS  9.Separación+main()  10.Funcionalidad     ║
 * ║                                                                           ║
 * ║  REGLAS DE ORO — NUNCA ROMPER:                                            ║
 * ║  ✗  innerHTML prohibido (ni para limpiar)                                 ║
 * ║  ✗  textContent prohibido                                                 ║
 * ║  ✓  Limpiar con limpiarNodos()  →  firstChild / removeChild               ║
 * ║  ✓  Texto con createTextNode()                                            ║
 * ║  ✓  Elementos: createElement + classList.add + appendChild                ║
 * ║  ✓  main() SIEMPRE async — datos desde fetch('bbdd.json')                 ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */


// ═══════════════════════════════════════════════════════════════════
// CRITERIO 9 — ESTRUCTURA BASE
// Todo arranca desde main(). Nada de código suelto fuera de funciones.
// ═══════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', main);

async function main() {

    // CRITERIO 3 — Cargar JSON (nunca variable global .js)
    const response = await fetch('bbdd.json');
    const json = await response.json();
    // Adaptar según el examen: json.pilotos / json.cars / json.movimientos

    // CRITERIO 2 — Inicializar localStorage si está vacío
    if (!localStorage.getItem('items')) {
        setItems(json.items);
    }
    const todosLosItems = getItems();

    // CRITERIO 4 — Construir DOM (llamar solo a las que el examen pida)
    crearSeccionFiltros();              // filtros construidos con JS
    crearBotonesOrdenacion();           // botones de ordenar
    pintarCards(todosLosItems);         // cards
    crearCabecera();                    // thead tabla
    pintarTabla(todosLosItems);         // tbody tabla
    rellenarTodosLosSelects(todosLosItems); // selects dinámicos

    // CRITERIO 8 — Todos los eventos en una función
    inicializarEventos(todosLosItems);

    // CRITERIO 8 — Autocomplete jQuery UI
    iniciarAutocomplete(todosLosItems);
}


// ═══════════════════════════════════════════════════════════════════
// UTILIDADES — Siempre extraídas, siempre disponibles
// ═══════════════════════════════════════════════════════════════════

// Limpiar nodos — OBLIGATORIA en todo examen
function limpiarNodos(elemento) {
    while (elemento.firstChild) {
        elemento.removeChild(elemento.firstChild);
    }
}

// Mostrar error individual en un párrafo
// ── Variante A: básica ─────────────────────────────────────────
function mostrarError(idElemento, mensaje) {
    const p = document.getElementById(idElemento);
    limpiarNodos(p);
    p.appendChild(document.createTextNode(mensaje));
}

// ── Variante B: con red de seguridad (si el id puede no existir) ──
function mostrarErrorSeguro(idElemento, mensaje) {
    const p = document.getElementById(idElemento);
    if (!p) return; // red de seguridad
    limpiarNodos(p);
    p.appendChild(document.createTextNode(mensaje));
    p.style.display = 'block'; // por si el CSS lo ocultaba
}

function ocultarError(idElemento) {
    limpiarNodos(document.getElementById(idElemento));
}

// Formatear número con separador de miles español
function formatearNumero(valor) {
    return parseInt(valor).toLocaleString('es-ES');
}
// Uso: formatearNumero(coche.precio) → "159.999"
// Uso en texto: formatearNumero(item.km) + ' Km.'


// ═══════════════════════════════════════════════════════════════════
// CRITERIO 2 — localStorage: todas las variantes
// ═══════════════════════════════════════════════════════════════════

// ── Variante A: array principal de datos ──────────────────────
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
    } catch (e) {
        return [];
    }
}
function setFavoritos(favoritos) {
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
}

// ── Variante C: objeto anidado (reserva = item + cliente) ──────
function guardarReserva(item, cliente) {
    localStorage.setItem('reserva', JSON.stringify({ item: item, cliente: cliente }));
}
function getReserva() {
    try {
        return JSON.parse(localStorage.getItem('reserva')) || null;
    } catch (e) { return null; }
}

// Borrar una clave
// localStorage.removeItem('items');


// ═══════════════════════════════════════════════════════════════════
// CRITERIO 4 — DOM: Imagen en card y sidebar
// ═══════════════════════════════════════════════════════════════════
// El campo img en el JSON contiene solo el nombre del archivo: "foto.jpg"
// Las imágenes van en una carpeta img/ junto al index.html

// ── Imagen en card con fallback de iniciales ───────────────────
// Llamar dentro de crearCard() antes del título.
function crearFotoCard(item) {
    const foto = document.createElement('div');
    foto.classList.add('card-foto'); // CSS: círculo, overflow:hidden

    if (item.img) {
        const img = document.createElement('img');
        img.src = 'img/' + item.img;        // carpeta img/
        img.alt = item.nombre;
        // Si la imagen falla → mostrar iniciales
        img.onerror = function () {
            limpiarNodos(foto);
            foto.appendChild(document.createTextNode(obtenerIniciales(item.nombre)));
        };
        foto.appendChild(img);
    } else {
        // Sin campo img → iniciales directamente
        foto.appendChild(document.createTextNode(obtenerIniciales(item.nombre)));
    }
    return foto;
}

// ── Imagen grande en sidebar ───────────────────────────────────
function crearFotoSidebar(item) {
    const foto = document.createElement('div');
    foto.classList.add('sidebar-foto');

    if (item.img) {
        const img = document.createElement('img');
        img.src = 'img/' + item.img;
        img.alt = item.nombre;
        img.onerror = function () {
            limpiarNodos(foto);
            foto.appendChild(document.createTextNode(obtenerIniciales(item.nombre)));
        };
        foto.appendChild(img);
    } else {
        foto.appendChild(document.createTextNode(obtenerIniciales(item.nombre)));
    }
    return foto;
}

// ── Iniciales a partir del nombre completo ─────────────────────
// "Marc Marquez" → "MM"   "Francesco Bagnaia" → "FB"
function obtenerIniciales(nombre) {
    return nombre
        .split(' ')
        .map(function (n) { return n[0]; })
        .join('')
        .slice(0, 2)
        .toUpperCase();
}


// ═══════════════════════════════════════════════════════════════════
// CRITERIO 4 — DOM: Sección de filtros construida con JS
// ═══════════════════════════════════════════════════════════════════

function crearSeccionFiltros() {
    const section = document.getElementById('seccionFiltros');

    const h2 = document.createElement('h2');
    h2.appendChild(document.createTextNode('Buscar'));
    section.appendChild(h2);

    const divFiltros = document.createElement('div');
    divFiltros.classList.add('fila-filtros');
    section.appendChild(divFiltros);

    // ── Inputs y selects en BUCLE ─────────────────────────────
    // tag puede ser 'input' o 'select' — el control se crea con createElement(c.tag)
    const campos = [
        { etiqueta: 'Buscar',       tag: 'input',  id: 'inputBuscar' },
        { etiqueta: 'Equipo',       tag: 'select', id: 'selectEquipo' },
        { etiqueta: 'Nacionalidad', tag: 'select', id: 'selectNacionalidad' },
        { etiqueta: 'Año desde',    tag: 'select', id: 'anyoDesde' },
        { etiqueta: 'Año hasta',    tag: 'select', id: 'anyoHasta' },
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

    // ── Botones en BUCLE ──────────────────────────────────────
    const botones = [
        { id: 'btnFiltrar',       texto: 'Filtrar',          clase: 'btn-primario' },
        { id: 'btnReiniciar',     texto: 'Reiniciar',        clase: 'btn-secundario' },
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

    // Párrafo de error validación
    const pError = document.createElement('p');
    pError.id = 'errorFiltro';
    section.appendChild(pError);
}


// ═══════════════════════════════════════════════════════════════════
// CRITERIO 4 — DOM: Botones de ordenación construidos con JS
// ═══════════════════════════════════════════════════════════════════

function crearBotonesOrdenacion() {
    const div = document.getElementById('botonesOrden');

    const botones = [
        { id: 'btnOrdenDefecto',   texto: 'Por defecto',   clase: 'btn-sort activo' },
        { id: 'btnOrdenPrecio',    texto: 'Mayor precio',  clase: 'btn-sort' },
        { id: 'btnOrdenNombre',    texto: 'A-Z',           clase: 'btn-sort' },
        { id: 'btnOrdenMundiales', texto: 'Más mundiales', clase: 'btn-sort' },
    ];
    botones.forEach(function (b) {
        const btn = document.createElement('button');
        btn.id = b.id;
        btn.className = b.clase; // className acepta múltiples clases separadas por espacio
        btn.appendChild(document.createTextNode(b.texto));
        div.appendChild(btn);
    });
}


// ═══════════════════════════════════════════════════════════════════
// CRITERIO 4 — DOM: Cards (con TODOS los patrones)
// ═══════════════════════════════════════════════════════════════════

function pintarCards(items) {
    const contenedor = document.getElementById('contenedor');
    limpiarNodos(contenedor);

    // Mostrar/ocultar mensaje sin resultados
    const msg = document.getElementById('mensajeSinResultados');
    if (msg) msg.style.display = items.length === 0 ? 'block' : 'none';

    items.forEach(function (item) {
        contenedor.appendChild(crearCard(item));
    });
}

function crearCard(item) {
    const col = document.createElement('div');
    col.classList.add('col');

    const card = document.createElement('div');
    card.classList.add('card');
    col.appendChild(card);

    // ── Favorito — UNA sola llamada a getFavoritos() ───────────
    const favoritos = getFavoritos();
    if (favoritos.includes(item.id)) card.classList.add('favorito');

    // ── IMAGEN con fallback de iniciales ──────────────────────
    card.appendChild(crearFotoCard(item));

    // ── Elemento decorativo (dorsal, badge de número...) ──────
    const spanDorsal = document.createElement('span');
    spanDorsal.classList.add('dorsal');
    spanDorsal.appendChild(document.createTextNode(item.dorsal));
    card.appendChild(spanDorsal);

    // ── Badge con CLASE DINÁMICA ───────────────────────────────
    // Variante 2 estados (ternario en classList.add):
    const badge = document.createElement('span');
    badge.classList.add('badge-estado',
        item.estado === 'Activo' ? 'estado-activo' : 'estado-retirado'
    );
    badge.appendChild(document.createTextNode(item.estado));
    card.appendChild(badge);

    // Variante 3 estados (variable intermedia):
    // const claseEstado = item.estado === 'Activa'      ? 'estado-activa'
    //                   : item.estado === 'Planificada' ? 'estado-planificada'
    //                   :                                'estado-completada';
    // badge.classList.add('badge-estado', claseEstado);

    // ── Título ────────────────────────────────────────────────
    const titulo = document.createElement('div');
    titulo.classList.add('card-title');
    titulo.appendChild(document.createTextNode(item.nombre));
    card.appendChild(titulo);

    // ── p > small en BUCLE ────────────────────────────────────
    // Usar cuando hay 2+ párrafos con el mismo patrón (p > small > texto)
    ['🏍 ' + item.moto, '🏁 ' + item.equipo].forEach(function (texto) {
        const p = document.createElement('p');
        p.classList.add('mb-1');
        const small = document.createElement('small');
        small.appendChild(document.createTextNode(texto));
        p.appendChild(small);
        card.appendChild(p);
    });

    // ── Campos en BUCLE con clases distintas ──────────────────
    // Cuando cada campo tiene sus propias clases CSS
    const camposCard = [
        { texto: item.equipo,       clases: ['mb-1', 'texto-dim'] },
        { texto: item.nacionalidad, clases: ['mb-1'] },
    ];
    camposCard.forEach(function (c) {
        const p = document.createElement('p');
        c.clases.forEach(function (cls) { p.classList.add(cls); });
        p.appendChild(document.createTextNode(c.texto));
        card.appendChild(p);
    });

    // ── Fila de chips (span > small) en BUCLE ─────────────────
    const dFila = document.createElement('div');
    dFila.classList.add('d-flex', 'gap-3', 'mt-2', 'mb-3');
    [
        item.nacionalidad,
        '#' + item.dorsal,
        item.mundiales + ' títulos',
    ].forEach(function (dato) {
        const span = document.createElement('span');
        const small = document.createElement('small');
        small.appendChild(document.createTextNode(dato));
        span.appendChild(small);
        dFila.appendChild(span);
    });
    card.appendChild(dFila); // ← NO olvidar este appendChild

    // ── Precio/puntos formateado ───────────────────────────────
    const precio = document.createElement('p');
    precio.classList.add('fw-bold');
    precio.appendChild(document.createTextNode(
        formatearNumero(item.precio) + ' €'  // o item.puntos + ' pts'
    ));
    card.appendChild(precio);

    // ── Botones de acción en BUCLE ────────────────────────────
    const dAcciones = document.createElement('div');
    dAcciones.classList.add('acciones');
    [
        { texto: 'Ver ficha', clase: 'btn-ficha',  data: item.id },
        { texto: '✎',         clase: 'btn-editar', data: item.id },
        { texto: '✕',         clase: 'btn-borrar', data: item.id },
    ].forEach(function (b) {
        const btn = document.createElement('button');
        btn.classList.add(b.clase);
        btn.dataset.id = b.data;
        btn.appendChild(document.createTextNode(b.texto));
        dAcciones.appendChild(btn);
    });
    card.appendChild(dAcciones);

    // ── Botón favorito con ternario ───────────────────────────
    const btnFav = document.createElement('button');
    btnFav.classList.add('btn-fav');
    btnFav.dataset.id = item.id;
    btnFav.appendChild(document.createTextNode(
        favoritos.includes(item.id) ? '★' : '☆'
    ));
    card.appendChild(btnFav);

    return col;
}


// ═══════════════════════════════════════════════════════════════════
// CRITERIO 4 — DOM: Tabla (todas las variantes)
// ═══════════════════════════════════════════════════════════════════

// ── Cabecera con BUCLE ────────────────────────────────────────
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

// ── Pintar tabla estándar (borrar por id) ─────────────────────
function pintarTabla(items) {
    const tbody = document.getElementById('cuerpoTabla');
    limpiarNodos(tbody);
    items.forEach(function (item) {
        const tr = document.createElement('tr');

        // Celda botón borrar (aparte porque tiene clase y dataset)
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

// ── Variante: tabla contable con saldo acumulado ──────────────
// Borrar por ÍNDICE (splice), no por id.
// El campo tipo puede ser 'H' (haber) o 'D' (debe).
function pintarTablaContable(apuntes) {
    const tbody = document.getElementById('cuerpoTbody'); // ← id puede variar
    limpiarNodos(tbody);
    let saldo = 0;

    apuntes.forEach(function (apunte, indice) {
        // parseFloat con fallback a 0 — por si el importe viene como string
        const importeNumerico = parseFloat(apunte.importe) || 0;
        saldo += apunte.tipo === 'H' ? importeNumerico : -importeNumerico;
        // Nota: algunos exámenes usan apunte.dh en vez de apunte.tipo

        const tr = document.createElement('tr');

        // Botón borrar por ÍNDICE (no por id)
        const tdBtn = document.createElement('td');
        const btn = document.createElement('button');
        btn.classList.add('btn-borrar');
        btn.dataset.indice = indice; // dataset.indice en lugar de dataset.id
        btn.appendChild(document.createTextNode('Borrar'));
        tdBtn.appendChild(btn);
        tr.appendChild(tdBtn);

        // Celdas en BUCLE — incluye saldo calculado
        [apunte.fecha, apunte.concepto, apunte.tipo,
         importeNumerico.toFixed(2), saldo.toFixed(2)]
            .forEach(function (dato) {
                const td = document.createElement('td');
                td.appendChild(document.createTextNode(dato));
                tr.appendChild(td);
            });

        tbody.appendChild(tr);
    });

    // Actualizar saldo total visible
    const saldoEl = document.getElementById('saldoActual');
    limpiarNodos(saldoEl);
    saldoEl.appendChild(document.createTextNode(saldo.toFixed(2)));
}

// ── Botón dentro de tabla construido con JS (ej: btnGrabar) ───
// Cuando el botón forma parte de un tfoot y hay que añadirlo con prepend
function crearBotonEnTabla(idFila, idBtn, textoBtn, claseBtn) {
    const tr = document.getElementById(idFila);
    const tdBtn = document.createElement('td');
    const btn = document.createElement('button');
    btn.id = idBtn;
    btn.classList.add(claseBtn);
    btn.appendChild(document.createTextNode(textoBtn));
    tdBtn.appendChild(btn);
    tr.prepend(tdBtn); // prepend = insertar como PRIMER hijo
    // Alternativa sin prepend: tr.insertBefore(tdBtn, tr.firstChild)
}


// ═══════════════════════════════════════════════════════════════════
// CRITERIO 4 — DOM: Sidebar / panel lateral
// ═══════════════════════════════════════════════════════════════════

function mostrarPanel(item) {
    const sidebar = document.getElementById('sidebar');
    const contenido = document.getElementById('contenidoSidebar');
    limpiarNodos(contenido);

    // Foto grande (con fallback de iniciales)
    contenido.appendChild(crearFotoSidebar(item));

    // Título
    const h2 = document.createElement('h2');
    h2.appendChild(document.createTextNode(item.nombre));
    contenido.appendChild(h2);

    // Campos en BUCLE — patrón: div.campo > span(label) + texto(valor)
    const campos = [
        { label: 'Equipo:',       valor: item.equipo },
        { label: 'Nacionalidad:', valor: item.nacionalidad },
        { label: 'Dorsal:',       valor: item.dorsal },
        { label: 'Mundiales:',    valor: item.mundiales },
        { label: 'Puntos:',       valor: item.puntos },
        { label: 'Email:',        valor: item.email },
        { label: 'Teléfono:',     valor: item.telefono },
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

    // Bio / descripción
    const bio = document.createElement('div');
    bio.classList.add('bio');
    bio.appendChild(document.createTextNode(item.bio || item.descripcion || ''));
    contenido.appendChild(bio);

    sidebar.style.display = 'block'; // ← siempre necesario
}


// ═══════════════════════════════════════════════════════════════════
// CRITERIO 8 — Eventos centralizados (inicializarEventos)
// ═══════════════════════════════════════════════════════════════════

function inicializarEventos(todosLosItems) {

    // ── Delegación de eventos — contenedor de cards ────────────
    document.getElementById('contenedor').addEventListener('click', function (e) {

        if (e.target.classList.contains('btn-ficha')) {
            const id = parseInt(e.target.dataset.id);
            const item = todosLosItems.find(i => i.id === id);
            mostrarPanel(item);
        }

        if (e.target.classList.contains('btn-borrar')) {
            const id = parseInt(e.target.dataset.id);
            borrarItem(id, todosLosItems);
        }

        if (e.target.classList.contains('btn-fav')) {
            const id = parseInt(e.target.dataset.id);
            toggleFavorito(id);
            pintarCards(todosLosItems);
        }

        // Botón editar desde la card
        if (e.target.classList.contains('btn-editar')) {
            const id = parseInt(e.target.dataset.id);
            const item = todosLosItems.find(i => i.id === id);
            activarModoEdicion(item);
        }
    });

    // ── Delegación de eventos — tabla ──────────────────────────
    document.getElementById('cuerpoTabla').addEventListener('click', function (e) {
        if (e.target.classList.contains('btn-borrar')) {
            const id = parseInt(e.target.dataset.id);
            borrarItem(id, todosLosItems);
        }
        if (e.target.classList.contains('btn-ficha')) {
            const id = parseInt(e.target.dataset.id);
            const item = todosLosItems.find(i => i.id === id);
            mostrarPanel(item);
        }
    });

    // ── Delegación tabla contable (borrar por ÍNDICE) ──────────
    // Usar cuando el borrado es por splice con indice, no por id
    // document.getElementById('cuerpoTbody').addEventListener('click', function (e) {
    //     if (e.target.classList.contains('btn-borrar')) {
    //         const indice = parseInt(e.target.dataset.indice);
    //         borrarPorIndice(indice, todosLosItems);
    //     }
    // });

    // ── Cerrar sidebar ─────────────────────────────────────────
    document.getElementById('btnCerrarSidebar').addEventListener('click', function () {
        document.getElementById('sidebar').style.display = 'none';
        limpiarNodos(document.getElementById('contenidoSidebar'));
    });

    // ── Botones de ordenación en BUCLE con clase activo ────────
    const ordenaciones = [
        { id: 'btnOrdenDefecto',   fn: () => [...todosLosItems].sort((a, b) => a.id - b.id) },
        { id: 'btnOrdenPrecio',    fn: () => [...todosLosItems].sort((a, b) => b.precio - a.precio) },
        { id: 'btnOrdenNombre',    fn: () => [...todosLosItems].sort((a, b) => a.nombre.localeCompare(b.nombre)) },
        { id: 'btnOrdenMundiales', fn: () => [...todosLosItems].sort((a, b) => b.mundiales - a.mundiales) },
    ];
    ordenaciones.forEach(function (o) {
        document.getElementById(o.id).addEventListener('click', function () {
            document.querySelectorAll('.btn-sort').forEach(b => b.classList.remove('activo'));
            this.classList.add('activo');
            pintarCards(o.fn());
        });
    });

    // ── Botón toggle solo favoritos ────────────────────────────
    // Estado local dentro de la función — no necesita variable global
    let soloFavoritos = false;
    document.getElementById('btnSoloFavoritos').addEventListener('click', function () {
        soloFavoritos = !soloFavoritos;

        // Cambiar texto del botón sin innerHTML
        limpiarNodos(this);
        this.appendChild(document.createTextNode(soloFavoritos ? '★ Todos' : '★ Solo favoritos'));
        this.classList.toggle('activo', soloFavoritos); // activo = true/false

        if (soloFavoritos) {
            const ids = getFavoritos();
            const resultado = todosLosItems.filter(i => ids.includes(i.id));
            pintarCards(resultado);
            pintarTabla(resultado);
        } else {
            pintarCards(todosLosItems);
            pintarTabla(todosLosItems);
        }
    });

    // ── Filtrar ────────────────────────────────────────────────
    document.getElementById('btnFiltrar').addEventListener('click', function (e) {
        e.preventDefault();
        aplicarFiltros(todosLosItems);
    });

    // ── Reiniciar ──────────────────────────────────────────────
    document.getElementById('btnReiniciar').addEventListener('click', function () {
        reiniciarFiltros(todosLosItems);
    });

    // ── Submit formulario — distingue alta de edición ──────────
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

    // ── Botón cancelar edición ─────────────────────────────────
    document.getElementById('btnCancelarEdicion').addEventListener('click', function () {
        desactivarModoEdicion();
    });

    // ── Botón grabar (tabla contable) ──────────────────────────
    // document.getElementById('btnGrabar').addEventListener('click', function (e) {
    //     e.preventDefault();
    //     if (validarFormulario()) guardarItem(todosLosItems);
    // });
}


// ═══════════════════════════════════════════════════════════════════
// CRITERIO 7 + 8 — Selects dinámicos
// ═══════════════════════════════════════════════════════════════════

// ── Función reutilizable para poblar cualquier select ──────────
function rellenarSelect(items, campoValor, idSelect, textoDefault) {
    const valores = [...new Set(items.map(function (i) {
        return i[campoValor];
    }))].sort();

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
// Uso: rellenarSelect(items, 'equipo',  'selectEquipo',  'Todos')
// Uso: rellenarSelect(items, 'equipo',  'inputEquipo',   '-- Selecciona --') ← formulario
// Uso: rellenarSelect(items, 'anyo',    'anyoDesde',     'Desde')

// ── Variante: sort numérico para dorsales/km/años ─────────────
// El sort() por defecto es alfabético → "10" < "9". Para números usar:
function rellenarSelectNumerico(items, campoValor, idSelect, textoDefault) {
    const valores = [...new Set(items.map(i => i[campoValor]))]
        .sort((a, b) => a - b); // sort numérico

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

// ── Variante: select con valores FIJOS (no dinámicos) ─────────
// Usar cuando los valores son siempre los mismos (D/H, Activo/Retirado...)
// NO usar rellenarSelect() — los valores son constantes, no del JSON
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
// Uso: rellenarSelectFijo('selectEstado', ['Activo','Retirado'], 'Todos')

// ── Función que agrupa todos los selects del proyecto ─────────
function rellenarTodosLosSelects(items) {
    rellenarSelect(items, 'equipo',        'selectEquipo',       'Todos');
    rellenarSelect(items, 'nacionalidad',  'selectNacionalidad', 'Todas');
    rellenarSelect(items, 'anyo',          'anyoDesde',          'Desde');
    rellenarSelect(items, 'anyo',          'anyoHasta',          'Hasta');
    // Select del formulario (mismo campo, opción por defecto distinta)
    rellenarSelect(items, 'equipo',        'inputEquipo',        '-- Selecciona --');
}


// ═══════════════════════════════════════════════════════════════════
// CRITERIO 7 — Filtros (todas las variantes)
// ═══════════════════════════════════════════════════════════════════

function aplicarFiltros(todosLosItems) {
    const errorEl = document.getElementById('errorFiltro');
    limpiarNodos(errorEl);

    // Leer controles
    const texto  = document.getElementById('inputBuscar').value.toLowerCase().trim();
    const equipo = document.getElementById('selectEquipo').value;
    const nacion = document.getElementById('selectNacionalidad').value;
    const desde  = document.getElementById('anyoDesde').value;
    const hasta  = document.getElementById('anyoHasta').value;
    // Checkbox: const soloActivos = document.getElementById('chkActivos').checked;

    // Validación rango
    if (desde !== '' && hasta !== '' && parseInt(desde) > parseInt(hasta)) {
        errorEl.appendChild(document.createTextNode('El valor Desde no puede ser mayor que el Hasta.'));
        return; // cortar sin pintar
    }

    // CRITERIO 7 — filter encadenado
    const resultado = todosLosItems.filter(function (item) {
        // Texto en nombre O en equipo
        if (texto  !== '' && !item.nombre.toLowerCase().includes(texto) &&
                             !item.equipo.toLowerCase().includes(texto)) return false;
        // Selects de coincidencia exacta
        if (equipo !== '' && item.equipo       !== equipo) return false;
        if (nacion !== '' && item.nacionalidad !== nacion) return false;
        // Rango numérico
        if (desde  !== '' && item.anyo < parseInt(desde)) return false;
        if (hasta  !== '' && item.anyo > parseInt(hasta)) return false;
        // Checkbox: if (soloActivos && item.estado !== 'Activo') return false;
        return true;
    });

    // Mensaje sin resultados
    const msg = document.getElementById('mensajeSinResultados');
    if (msg) msg.style.display = resultado.length === 0 ? 'block' : 'none';

    pintarCards(resultado);
    pintarTabla(resultado);
}

function reiniciarFiltros(todosLosItems) {
    document.getElementById('inputBuscar').value        = '';
    document.getElementById('selectEquipo').value       = '';
    document.getElementById('selectNacionalidad').value = '';
    document.getElementById('anyoDesde').value          = '';
    document.getElementById('anyoHasta').value          = '';
    limpiarNodos(document.getElementById('errorFiltro'));
    const msg = document.getElementById('mensajeSinResultados');
    if (msg) msg.style.display = 'none';
    pintarCards(todosLosItems);
    pintarTabla(todosLosItems);
}


// ═══════════════════════════════════════════════════════════════════
// CRITERIO 8 — jQuery UI Autocomplete (3 variantes)
// ═══════════════════════════════════════════════════════════════════

// ── Variante A: nombre + equipo (objeto vistos para deduplicar) ─
function iniciarAutocomplete(items) {
    const sugerencias = [];
    const vistos = {};

    items.forEach(function (item) {
        [item.nombre, item.equipo].forEach(function (valor) {
            if (!vistos[valor]) {
                vistos[valor] = true;
                sugerencias.push(valor);
            }
        });
    });

    $('#inputBuscar').autocomplete({
        source: sugerencias,
        select: function (event, ui) {
            $('#inputBuscar').val(ui.item.value); // OBLIGATORIO asignar manualmente
            aplicarFiltros(items);
            return false;                         // OBLIGATORIO evitar sobreescritura
        }
    });

    // Filtrar también al escribir manualmente
    $('#inputBuscar').on('input', function () {
        aplicarFiltros(items);
    });
}

// ── Variante B: marca + "marca modelo" compuesto ──────────────
function iniciarAutocompleteCompuesto(items, idInput, callbackFiltrar) {
    const sugerencias = [];
    const vistos = {};

    items.forEach(function (item) {
        if (!vistos[item.marca]) {
            vistos[item.marca] = true;
            sugerencias.push(item.marca);
        }
        const marcaModelo = item.marca + ' ' + item.modelo;
        if (!vistos[marcaModelo]) {
            vistos[marcaModelo] = true;
            sugerencias.push(marcaModelo);
        }
    });

    $('#' + idInput).autocomplete({
        source: sugerencias,
        select: function (event, ui) {
            $('#' + idInput).val(ui.item.value);
            callbackFiltrar();
            return false;
        }
    });
    $('#' + idInput).on('input', callbackFiltrar);
}

// ── Variante C: dos campos separados ──────────────────────────
function iniciarAutocompleteDoble(items) {
    const marcas  = [...new Set(items.map(i => i.marca))];
    const modelos = [...new Set(items.map(i => i.modelo))];

    $('#inputMarca').autocomplete({
        source: marcas,
        select: function (e, ui) { $('#inputMarca').val(ui.item.value); return false; }
    });
    $('#inputModelo').autocomplete({
        source: modelos,
        select: function (e, ui) { $('#inputModelo').val(ui.item.value); return false; }
    });
}


// ═══════════════════════════════════════════════════════════════════
// CRITERIO 2 + 7 — CRUD completo en localStorage
// ═══════════════════════════════════════════════════════════════════

// ── Añadir item nuevo ─────────────────────────────────────────
function guardarItem(todosLosItems) {
    const nuevoItem = {
        id:           Date.now(),  // CRITERIO 8: objeto Date → id único
        nombre:       document.getElementById('inputNombre').value.trim(),
        email:        document.getElementById('inputEmail').value.trim(),
        telefono:     document.getElementById('inputTelefono').value.trim(),
        dorsal:       parseInt(document.getElementById('inputDorsal').value),
        equipo:       document.getElementById('inputEquipo').value,
        anyo:         parseInt(document.getElementById('inputAnyo').value),
        // Valores por defecto para campos no incluidos en el formulario:
        mundiales:    0,
        puntos:       0,
        estado:       'Activo',
        nacionalidad: 'N/D',
        bio:          '',
        img:          '',
    };

    todosLosItems.push(nuevoItem);
    setItems(todosLosItems);
    rellenarTodosLosSelects(todosLosItems); // actualizar selects con el nuevo equipo
    pintarCards(todosLosItems);
    pintarTabla(todosLosItems);
    document.getElementById('formulario').reset();
}

// ── Guardar en tabla contable (sin id, solo datos del formulario) ─
function guardarMovimiento(todosLosMovimientos) {
    const nuevoMovimiento = {
        fecha:    document.getElementById('inputFecha').value.trim(),
        concepto: document.getElementById('inputConcepto').value.trim(),
        tipo:     document.getElementById('inputDH').value,       // 'D' o 'H'
        importe:  parseFloat(document.getElementById('inputImporte').value) || 0,
    };

    todosLosMovimientos.push(nuevoMovimiento);
    setItems(todosLosMovimientos);
    pintarTablaContable(todosLosMovimientos);

    // Limpiar campos manualmente (no hay form.reset() si son inputs sueltos)
    document.getElementById('inputFecha').value    = '';
    document.getElementById('inputConcepto').value = '';
    document.getElementById('inputImporte').value  = '';
    document.getElementById('inputDH').value       = '';
}

// ── Borrar item por id ────────────────────────────────────────
function borrarItem(id, todosLosItems) {
    if (!confirm('¿Seguro que quieres eliminar este elemento?')) return;

    const nuevos = todosLosItems.filter(i => i.id !== id);

    // Mutar el array ORIGINAL para que inicializarEventos() no pierda la referencia
    todosLosItems.length = 0;
    nuevos.forEach(i => todosLosItems.push(i));

    setItems(todosLosItems);
    pintarCards(todosLosItems);
    pintarTabla(todosLosItems);
}

// ── Borrar por índice (tabla contable — splice) ────────────────
function borrarPorIndice(indice, apuntes) {
    if (!confirm('¿Seguro?')) return;
    apuntes.splice(indice, 1);
    setItems(apuntes);
    pintarTablaContable(apuntes);
}

// ── Toggle favorito ───────────────────────────────────────────
function toggleFavorito(id) {
    const favoritos = getFavoritos();
    const indice = favoritos.indexOf(id);
    if (indice === -1) {
        favoritos.push(id);       // añadir
    } else {
        favoritos.splice(indice, 1); // quitar
    }
    setFavoritos(favoritos);
}

// ── Editar: activar modo edición ─────────────────────────────
function activarModoEdicion(item) {
    const form  = document.getElementById('formulario');
    const titulo = document.getElementById('tituloFormulario');

    // Cambiar título del formulario
    limpiarNodos(titulo);
    titulo.appendChild(document.createTextNode('Editar'));

    // Guardar el id en el dataset del form → submit sabrá que es edición
    form.dataset.modoEdicion = item.id;

    // Precargar campos con los datos del item
    document.getElementById('inputNombre').value    = item.nombre;
    document.getElementById('inputEmail').value     = item.email     || '';
    document.getElementById('inputTelefono').value  = item.telefono  || '';
    document.getElementById('inputDorsal').value    = item.dorsal;
    document.getElementById('inputEquipo').value    = item.equipo;
    document.getElementById('inputAnyo').value      = item.anyo;

    // Mostrar botón cancelar
    document.getElementById('btnCancelarEdicion').style.display = 'inline-block';

    // Scroll suave al formulario
    document.getElementById('seccionFormulario').scrollIntoView({ behavior: 'smooth' });
}

// ── Editar: guardar cambios ───────────────────────────────────
function editarItem(id, todosLosItems) {
    const indice = todosLosItems.findIndex(i => i.id === id);
    if (indice === -1) return;

    // Spread: conserva los campos que no están en el formulario (mundiales, bio, img...)
    todosLosItems[indice] = {
        ...todosLosItems[indice],
        nombre:   document.getElementById('inputNombre').value.trim(),
        email:    document.getElementById('inputEmail').value.trim(),
        telefono: document.getElementById('inputTelefono').value.trim(),
        dorsal:   parseInt(document.getElementById('inputDorsal').value),
        equipo:   document.getElementById('inputEquipo').value,
        anyo:     parseInt(document.getElementById('inputAnyo').value),
    };

    setItems(todosLosItems);
    pintarCards(todosLosItems);
    pintarTabla(todosLosItems);
    desactivarModoEdicion();
}

// ── Editar: volver a modo alta ────────────────────────────────
function desactivarModoEdicion() {
    const form  = document.getElementById('formulario');
    const titulo = document.getElementById('tituloFormulario');

    limpiarNodos(titulo);
    titulo.appendChild(document.createTextNode('Registrar'));

    delete form.dataset.modoEdicion; // eliminar el marcador de edición
    form.reset();

    document.getElementById('btnCancelarEdicion').style.display = 'none';
}

// ── idCounter autoincremental (alternativa a Date.now) ────────
// Usar cuando el examen pide ids consecutivos tipo 1, 2, 3...
// CRITERIO 8: Math.max
// const idCounter = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;


// ═══════════════════════════════════════════════════════════════════
// CRITERIO 5 — Expresiones regulares (todas)
// ═══════════════════════════════════════════════════════════════════

const REGEX = {
    // Texto con letras, acentos y espacios
    nombre:    /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/,
    // Texto con letras, números, espacios y guión
    nombreExt: /^[\w\s\-]{3,40}$/,
    // Email (compatible con todos los navegadores)
    email:     /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/,
    // Teléfono (999) 999-999
    telefono:  /^\(\d{3}\)\s\d{3}-\d{3}$/,
    // DNI: 8 dígitos + letra mayúscula
    dni:       /^\d{8}[A-Z]$/,
    // CIF: letra mayúscula + 8 dígitos
    cif:       /^[A-Z]\d{8}$/,
    // NIE: X + 7 dígitos + letra mayúscula
    nie:       /^X\d{7}[A-Z]$/,
    // Código 3 letras mayúsculas (ESP, ITA, FRA...)
    codigo3:   /^[A-Z]{3}$/,
    // Fecha dd/mm/aaaa
    fecha:     /^\d{2}\/\d{2}\/\d{4}$/,
    // URL de imagen
    urlImg:    /^(https?:\/\/.+|.+\.(jpg|jpeg|png|webp|gif))$/i,
    // Entero positivo
    enteroPos: /^\d+$/,
    // Decimal positivo (hasta 2 decimales)
    decimal:   /^\d+(\.\d{1,2})?$/,
};

// Validar DNI O CIF O NIE (al menos uno válido)
function validarDocumento(valor) {
    return REGEX.dni.test(valor) || REGEX.cif.test(valor) || REGEX.nie.test(valor);
}

// Validar fecha real (no solo formato, también que el día exista)
function validarFechaReal(fecha) {
    if (!REGEX.fecha.test(fecha)) return false;
    const [dia, mes, anyo] = fecha.split('/').map(Number);
    const d = new Date(anyo, mes - 1, dia);
    return d.getFullYear() === anyo && d.getMonth() === mes - 1 && d.getDate() === dia;
}


// ═══════════════════════════════════════════════════════════════════
// CRITERIO 5 + 6 — Validación del formulario (todas las variantes)
// ═══════════════════════════════════════════════════════════════════
// PATRÓN: setCustomValidity('') → test regex → setCustomValidity('error') → checkValidity()

// ── Variante A: error campo a campo (el más completo) ─────────
function validarFormulario() {
    let valido = true;

    // Campo texto con regex + checkValidity
    const inputNombre = document.getElementById('inputNombre');
    inputNombre.setCustomValidity('');
    if (!REGEX.nombre.test(inputNombre.value.trim())) {
        inputNombre.setCustomValidity('Formato incorrecto');
    }
    if (!inputNombre.checkValidity()) {
        mostrarError('errorNombre', 'El nombre solo puede contener letras (2-50 caracteres).');
        valido = false;
    } else {
        ocultarError('errorNombre');
    }

    // Email con regex + checkValidity
    const inputEmail = document.getElementById('inputEmail');
    inputEmail.setCustomValidity('');
    if (!REGEX.email.test(inputEmail.value.trim())) {
        inputEmail.setCustomValidity('Formato incorrecto');
    }
    if (!inputEmail.checkValidity()) {
        mostrarError('errorEmail', 'Introduce un email válido.');
        valido = false;
    } else {
        ocultarError('errorEmail');
    }

    // Teléfono con regex + checkValidity
    const inputTelefono = document.getElementById('inputTelefono');
    inputTelefono.setCustomValidity('');
    if (!REGEX.telefono.test(inputTelefono.value.trim())) {
        inputTelefono.setCustomValidity('Formato incorrecto');
    }
    if (!inputTelefono.checkValidity()) {
        mostrarError('errorTelefono', 'El formato debe ser (999) 999-999.');
        valido = false;
    } else {
        ocultarError('errorTelefono');
    }

    // Número: solo checkValidity (min/max/required en el HTML)
    const inputDorsal = document.getElementById('inputDorsal');
    inputDorsal.setCustomValidity('');
    if (!inputDorsal.checkValidity()) {
        mostrarError('errorDorsal', 'El dorsal debe ser un número entre 1 y 99.');
        valido = false;
    } else {
        ocultarError('errorDorsal');
    }

    // Select obligatorio (value vacío = no seleccionado)
    const inputEquipo = document.getElementById('inputEquipo');
    inputEquipo.setCustomValidity('');
    if (inputEquipo.value === '') {
        inputEquipo.setCustomValidity('Selección obligatoria');
    }
    if (!inputEquipo.checkValidity()) {
        mostrarError('errorEquipo', 'Debes seleccionar un equipo.');
        valido = false;
    } else {
        ocultarError('errorEquipo');
    }

    // Año: solo checkValidity (min/max/required en el HTML)
    const inputAnyo = document.getElementById('inputAnyo');
    inputAnyo.setCustomValidity('');
    if (!inputAnyo.checkValidity()) {
        mostrarError('errorAnyo', 'El año debe estar entre 2000 y 2030.');
        valido = false;
    } else {
        ocultarError('errorAnyo');
    }

    // Checkbox obligatorio
    const aceptar = document.getElementById('aceptar');
    if (!aceptar.checked) {
        mostrarError('errorAceptar', 'Debes aceptar las condiciones.');
        valido = false;
    } else {
        ocultarError('errorAceptar');
    }

    // En modo edición el checkbox no es obligatorio:
    // const esEdicion = document.getElementById('formulario').dataset.modoEdicion;
    // if (!esEdicion) { validar checkbox... }

    return valido;
}

// ── Variante B: validar primero vacíos, luego formato ─────────
// Útil en tabla contable donde no hay ids de error por campo
function validarFormularioContable() {
    let valido = true;

    const inputConcepto = document.getElementById('inputConcepto');
    const inputFecha    = document.getElementById('inputFecha');
    const inputDH       = document.getElementById('inputDH');
    const inputImporte  = document.getElementById('inputImporte');

    // Limpiar estados anteriores
    [inputConcepto, inputFecha, inputDH, inputImporte]
        .forEach(function (el) { el.setCustomValidity(''); });

    // Paso 1: comprobar si algún campo está vacío
    if (inputConcepto.value.trim() === '' || inputFecha.value.trim() === '' ||
        inputDH.value.trim() === ''       || inputImporte.value.trim() === '') {
        mostrarError('msgError', 'Todos los campos son obligatorios.');
        return false; // cortar aquí
    }

    // Paso 2: validar formato con regex
    if (!REGEX.nombre.test(inputConcepto.value.trim())) {
        inputConcepto.setCustomValidity('Formato incorrecto');
    }
    if (!REGEX.fecha.test(inputFecha.value.trim())) {
        inputFecha.setCustomValidity('Formato incorrecto');
    }

    // Paso 3: checkValidity general
    if (!inputConcepto.checkValidity() || !inputFecha.checkValidity()) {
        mostrarError('msgError', 'Revisa el concepto (solo letras) y la fecha (dd/mm/aaaa).');
        valido = false;
    } else {
        ocultarError('msgError');
    }

    return valido;
}

// ── Variante C: acumular errores en array (todos a la vez) ────
function validarFormularioAcumulado() {
    const errores = [];

    const nombre   = document.getElementById('inputNombre').value.trim();
    const email    = document.getElementById('inputEmail').value.trim();
    const telefono = document.getElementById('inputTelefono').value.trim();

    if (!REGEX.nombre.test(nombre))    errores.push('El nombre solo puede contener letras (2-50 caracteres).');
    if (!REGEX.email.test(email))      errores.push('El formato del email no es válido.');
    if (!REGEX.telefono.test(telefono)) errores.push('El teléfono debe tener el formato (999) 999-999.');
    if (!document.getElementById('aceptar').checked) errores.push('Debes aceptar las condiciones.');

    // Mostrar todos los errores en un contenedor
    const contenedor = document.getElementById('mensajesError');
    limpiarNodos(contenedor);
    errores.forEach(function (msg) {
        const p = document.createElement('p');
        p.appendChild(document.createTextNode(msg));
        contenedor.appendChild(p);
    });

    return errores.length === 0;
}


// ═══════════════════════════════════════════════════════════════════
// CRITERIO 7 — Métodos de Array (referencia rápida)
// ═══════════════════════════════════════════════════════════════════

// filter  → quedarse con los que cumplen
// items.filter(i => i.estado === 'Activo')
// items.filter(i => i.nombre.toLowerCase().includes(texto))

// find  → primer elemento que cumple (buscar por id)
// items.find(i => i.id === parseInt(id))

// findIndex  → posición (para editar)
// items.findIndex(i => i.id === parseInt(id))

// map  → transformar array (para selects)
// items.map(i => i.equipo)

// sort  → SIEMPRE sobre copia [...items] para NO mutar el original
// [...items].sort((a, b) => a.nombre.localeCompare(b.nombre))  // A-Z
// [...items].sort((a, b) => b.precio - a.precio)               // numérico desc
// [...items].sort((a, b) => a.id - b.id)                       // por id asc

// reduce  → acumular (saldo, suma)
// items.reduce((acc, i) => acc + i.importe, 0)

// push    → añadir al final
// splice  → borrar por índice: items.splice(indice, 1)
// indexOf → encontrar posición en array plano: favoritos.indexOf(id)

// Set  → valores únicos: [...new Set(items.map(i => i.campo))].sort()


// ═══════════════════════════════════════════════════════════════════
// CRITERIO 8 — Objetos propios del lenguaje JS (referencia rápida)
// ═══════════════════════════════════════════════════════════════════

// Date.now()  → id único
// item.id = Date.now();

// Math.max  → id autoincremental
// items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1

// URLSearchParams  → leer URL
// const params = new URLSearchParams(window.location.search);
// const id     = params.get('id'); // string o null

// Set  → sin duplicados
// [...new Set(items.map(i => i.campo))]

// confirm()  → confirmación antes de borrar
// if (!confirm('¿Seguro?')) return;

// parseFloat(valor) || 0  → número con fallback a 0
// parseInt(valor)         → entero

// querySelectorAll  → todos los elementos (NodeList, iterar con forEach)
// document.querySelectorAll('.btn-sort').forEach(b => b.classList.remove('activo'));

// scrollIntoView  → scroll suave al formulario
// document.getElementById('seccionFormulario').scrollIntoView({ behavior: 'smooth' });


// ═══════════════════════════════════════════════════════════════════
// REFERENCIA RÁPIDA — Selectores, dataset, classList, style
// ═══════════════════════════════════════════════════════════════════

// ── Selectores ────────────────────────────────────────────────
// getElementById('id')
// querySelector('.clase')
// querySelector('input[name="cambio"]:checked').value  → radio button
// querySelectorAll('.clase')  → NodeList → iterar con forEach
// e.target.closest('.card')  → ancestro más cercano con esa clase

// ── dataset ───────────────────────────────────────────────────
// btn.dataset.id = item.id          → escribir (se guarda como string)
// parseInt(e.target.dataset.id)     → leer y parsear a número
// btn.dataset.indice = indice        → para tabla contable
// delete form.dataset.modoEdicion   → eliminar dataset

// ── classList ─────────────────────────────────────────────────
// el.classList.add('activo')
// el.classList.remove('activo')
// el.classList.contains('activo')   → boolean
// el.classList.toggle('activo')     → añade si no está, quita si está
// el.classList.toggle('activo', condicion) → activa según boolean

// ── className vs classList ────────────────────────────────────
// btn.className = 'btn-sort activo'  → reemplaza TODAS las clases (útil en bucle)
// btn.classList.add('btn-sort')      → añade sin borrar las existentes

// ── style ─────────────────────────────────────────────────────
// el.style.display = 'block'   → mostrar
// el.style.display = 'none'    → ocultar
// el.style.display = 'inline-block'

// ── Formulario ────────────────────────────────────────────────
// form.reset()                          → limpiar todos los campos
// input.value.trim()                    → leer y quitar espacios
// parseInt(input.value) || 0            → número con fallback a 0
// parseFloat(input.value) || 0          → decimal con fallback a 0
// checkbox.checked                      → boolean true/false
// select.value === ''                   → no seleccionado

// ── DOM: insertar al principio ────────────────────────────────
// padre.prepend(hijo)                   → inserta como primer hijo
// padre.insertBefore(hijo, padre.firstChild)  → equivalente sin prepend

// ── Cambiar texto de un botón (sin innerHTML) ─────────────────
// limpiarNodos(btn);
// btn.appendChild(document.createTextNode('Nuevo texto'));
