(function () {
    'use strict';

    const CLASE_ABIERTA = 'mini-ranking__item--abierta';
    const MINIMO_CELDAS = 3; // posición, facultad y puntos
    const PRIMERA_CELDA_DATOS = 2; // tras la posición y la facultad

    // Orden de las columnas de la tabla. Solo se usa si la cabecera del HTML no tiene un nombre
    // por cada celda de la fila. Ajústalo al orden real: posición, facultad, …, puntos totales.
    const COLUMNAS_POR_DEFECTO = ['#', 'Facultad', 'Oro', 'Plata', 'Bronce', '4to', '5to', 'Pts. Eventos', 'Pts. Sanciones', 'Total'];

    const cuerpo = document.getElementById('ranking-table-body');
    const tabla = cuerpo && cuerpo.closest('table');
    const contenedor = cuerpo && cuerpo.closest('.ranking__tabla-contenedor');
    if (!tabla || !contenedor) return;

    const seccion = document.createElement('div');
    seccion.className = 'mini-ranking ranking__lista';

    const lista = document.createElement('ol');
    lista.className = 'mini-ranking__lista';

    seccion.appendChild(lista);
    contenedor.after(seccion);

    function crear(etiqueta, clase, texto) {
        const elemento = document.createElement(etiqueta);
        elemento.className = clase;
        if (texto !== undefined) elemento.textContent = texto;
        return elemento;
    }

    function esFilaDeDatos(fila) {
        return fila.cells.length >= MINIMO_CELDAS;
    }

    function esNegativo(texto) {
        return /^[-\u2212]\s*0*[1-9]/.test(texto);
    }

    // Nombres de las columnas: los de la cabecera si hay uno por celda; si no, los por defecto
    function leerEtiquetasCabecera() {
        const cabecera = tabla.tHead && tabla.tHead.rows[0];
        return cabecera ? Array.from(cabecera.cells, function (celda) { return celda.textContent.trim(); }) : [];
    }

    function elegirEtiquetas(fila, etiquetasCabecera) {
        if (etiquetasCabecera.length === fila.cells.length) return etiquetasCabecera;
        if (COLUMNAS_POR_DEFECTO.length === fila.cells.length) return COLUMNAS_POR_DEFECTO;
        return [];
    }

    // Cabecera de columnas (solo se ve en PC). Se oculta a los lectores de pantalla porque
    // cada dato ya lleva su nombre dentro de la fila.
    function crearCabecera(etiquetas) {
        const ultima = etiquetas.length - 1;
        const datos = crear('span', 'ranking__cabecera-datos');
        for (let i = PRIMERA_CELDA_DATOS; i < ultima; i++) {
            datos.appendChild(crear('span', 'ranking__cabecera-dato', etiquetas[i]));
        }

        const cabecera = crear('div', 'ranking__cabecera');
        cabecera.setAttribute('aria-hidden', 'true');
        cabecera.append(
            crear('span', 'ranking__cabecera-pos', etiquetas[0]),
            crear('span', 'ranking__cabecera-nombre', etiquetas[1]),
            datos,
            crear('span', 'ranking__cabecera-puntos', etiquetas[ultima])
        );
        return cabecera;
    }

    // Datos de las columnas intermedias. Solo se crean si se conoce el nombre de cada
    // celda de la fila; así nunca se muestra un dato sin etiqueta o mal etiquetado.
    function crearDatos(fila, etiquetas, id) {
        const ultima = fila.cells.length - 1; // la última celda son los puntos
        if (!etiquetas.length || ultima <= PRIMERA_CELDA_DATOS) return null;

        const datos = crear('dl', 'ranking__mini');
        datos.id = id;
        for (let i = PRIMERA_CELDA_DATOS; i < ultima; i++) {
            const valor = fila.cells[i].textContent.trim();
            const dato = crear('dd', '', valor);
            if (esNegativo(valor)) dato.classList.add('ranking__mini-valor--negativo');

            const item = crear('div', 'ranking__mini-item');
            item.append(crear('dt', '', etiquetas[i]), dato);
            datos.appendChild(item);
        }
        return datos;
    }

    function crearItem(fila, indice, etiquetas) {
        const item = crear('li', 'mini-ranking__item');
        if (indice === 0) item.classList.add('mini-ranking__item--primero');

        const nombre = fila.cells[1].textContent.trim();
        const contenido = crear('div', 'ranking__fila');

        contenido.appendChild(crear('span', 'mini-ranking__posicion', fila.cells[0].textContent.trim()));

        const imagen = fila.cells[1].querySelector('img');
        if (imagen) {
            const logo = crear('img', 'mini-ranking__logo');
            logo.src = imagen.currentSrc || imagen.src;
            logo.alt = '';
            contenido.appendChild(logo);
        }

        contenido.appendChild(crear('span', 'mini-ranking__nombre', nombre));

        const datos = crearDatos(fila, etiquetas, 'ranking-datos-' + indice);
        if (datos) contenido.appendChild(datos);

        contenido.appendChild(crear('span', 'mini-ranking__puntos', fila.cells[fila.cells.length - 1].textContent.trim()));
        item.appendChild(contenido);

        // Botón que cubre la fila para abrir los datos en tablet y móvil (oculto en PC)
        if (datos) {
            const boton = crear('button', 'ranking__alternar');
            boton.type = 'button';
            boton.setAttribute('aria-label', 'Detalle de ' + nombre);
            boton.setAttribute('aria-expanded', 'false');
            boton.setAttribute('aria-controls', datos.id);
            item.appendChild(boton);
        }
        return item;
    }

    // Las filas las pinta ranking.controller.js después de consultar la API
    function pintarLista() {
        const filas = Array.from(cuerpo.rows).filter(esFilaDeDatos);
        const etiquetas = filas.length ? elegirEtiquetas(filas[0], leerEtiquetasCabecera()) : [];

        const anterior = seccion.querySelector('.ranking__cabecera');
        if (anterior) anterior.remove();
        if (etiquetas.length > PRIMERA_CELDA_DATOS + 1) lista.before(crearCabecera(etiquetas));

        lista.replaceChildren(...filas.map(function (fila, indice) { return crearItem(fila, indice, etiquetas); }));
    }

    lista.addEventListener('click', function (e) {
        const boton = e.target.closest('.ranking__alternar');
        if (!boton) return;

        const abierta = boton.getAttribute('aria-expanded') !== 'true';
        boton.setAttribute('aria-expanded', String(abierta));
        boton.parentElement.classList.toggle(CLASE_ABIERTA, abierta);
    });

    new MutationObserver(pintarLista).observe(cuerpo, { childList: true });
    pintarLista();
})();
