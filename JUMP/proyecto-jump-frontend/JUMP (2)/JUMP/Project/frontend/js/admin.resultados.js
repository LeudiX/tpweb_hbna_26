// admin.resultados.js — Controlador del tab Resultados.
// - Select de eventos en curso.
// - Tabla de participantes para asignar posiciones.
// - Previsualización del medallero (suma puntos del evento seleccionado).
// - Guardar resultado (POST /api/eventos/:id/resultado).
// - Medallero real desde /api/ranking.

window.adminResultados = (function () {
    let state = {
        eventos: [],
        ranking: [],
        eventoSeleccionado: null,
        posiciones: {},          // {equipo_id: posicion}
        onRecargar: async () => {}
    };

    function init(ctx) {
        state.onRecargar = (ctx && ctx.onRecargar) || (async () => {});
        enlazarBotones();
        cargarEventosYRanking();
    }

    async function cargarEventosYRanking() {
        try {
            const [eventos, ranking] = await Promise.all([
                window.eventosApi.getEventos(),
                window.rankingApi.getRanking()
            ]);
            // Solo mostrar eventos en curso o finalizados (no pendientes)
            state.eventos = (eventos || []).filter(e => e.estado === 'en curso' || e.estado === 'finalizado');
            state.ranking = ranking || [];
            poblarSelectEventos();
            renderMedallero();
        } catch (e) {
            if (e.status === 401) { return; }
            console.error('Error cargando eventos/ranking:', e);
        }
    }

    function poblarSelectEventos() {
        const $sel = document.getElementById('resultado-evento');
        if (!$sel) return;
        const valorActual = $sel.value;
        $sel.innerHTML = '<option value="">— Selecciona un evento —</option>';
        state.eventos.forEach(ev => {
            const opt = document.createElement('option');
            opt.value = ev.id;
            const estadoTxt = ev.estado === 'finalizado' ? ' [finalizado]' : '';
            opt.textContent = `#${ev.id} ${ev.deporte} — ${ev.fecha} ${ev.hora}${estadoTxt}`;
            $sel.appendChild(opt);
        });
        if (valorActual) $sel.value = valorActual;
    }

    function enlazarBotones() {
        const $sel = document.getElementById('resultado-evento');
        if ($sel) {
            $sel.addEventListener('change', () => {
                const id = parseInt($sel.value);
                state.eventoSeleccionado = state.eventos.find(e => e.id === id) || null;
                state.posiciones = {};
                // Si el evento ya tiene posiciones (finalizado), cargarlas
                if (state.eventoSeleccionado && Array.isArray(state.eventoSeleccionado.participantes)) {
                    state.eventoSeleccionado.participantes.forEach(p => {
                        if (p.posicion !== null && p.posicion !== undefined) {
                            state.posiciones[p.equipo_id] = p.posicion;
                        }
                    });
                }
                renderParticipantes();
                renderMedallero();
            });
        }
        const $btn = document.getElementById('btn-guardar-resultado');
        if ($btn) {
            $btn.addEventListener('click', guardarResultado);
        }

        const $btnActualizar = document.getElementById('btn-actualizar-resultados');
        if ($btnActualizar) {
            $btnActualizar.addEventListener('click', async () => {
                $btnActualizar.disabled = true;
                $btnActualizar.textContent = 'Actualizando...';
                try {
                    await cargarEventosYRanking();
                    window.adminToast.mostrar('Datos actualizados');
                } catch (e) {
                    if (e.status !== 401) {
                        window.adminToast.mostrar('Error al actualizar: ' + e.message, 'error');
                    }
                } finally {
                    $btnActualizar.disabled = false;
                    $btnActualizar.textContent = 'Actualizar';
                }
            });
        }
    }

    function renderParticipantes() {
        const $tabla = document.getElementById('resultado-participantes-tabla');
        const $tbody = document.getElementById('resultado-participantes-tbody');
        if (!$tabla || !$tbody) return;

        if (!state.eventoSeleccionado) {
            $tabla.style.display = 'none';
            $tbody.innerHTML = '';
            return;
        }
        $tabla.style.display = 'block';
        $tbody.innerHTML = '';

        const participantes = state.eventoSeleccionado.participantes || [];
        participantes.forEach(p => {
            const tr = document.createElement('tr');
            const posActual = state.posiciones[p.equipo_id] || '';
            const opts = [];
            for (let i = 1; i <= participantes.length; i++) {
                opts.push(`<option value="${i}" ${String(posActual) === String(i) ? 'selected' : ''}>${i}º</option>`);
            }
            tr.innerHTML = `
                <td>${p.facultad} ${p.deporte}</td>
                <td>
                    <select class="admin-form__input" data-equipo-id="${p.equipo_id}" data-pos-select>
                        <option value="">—</option>
                        ${opts.join('')}
                    </select>
                </td>
                <td data-puntos>0</td>
            `;
            $tbody.appendChild(tr);
        });

        // Listener para recalcular puntos + previsualización
        $tbody.querySelectorAll('select[data-pos-select]').forEach(sel => {
            sel.addEventListener('change', () => {
                const equipoId = parseInt(sel.dataset.equipoId);
                const pos = parseInt(sel.value);
                if (!isNaN(pos)) state.posiciones[equipoId] = pos;
                else delete state.posiciones[equipoId];
                actualizarPuntosFilas();
                renderMedallero();
            });
        });
        actualizarPuntosFilas();
    }

    function puntosPorPosicion(posicion) {
        const puntosPorPuesto = { 1: 31, 2: 15, 3: 7, 4: 2, 5: 1 };
        return puntosPorPuesto[posicion] || 0;
    }

    function actualizarPuntosFilas() {
        const $tbody = document.getElementById('resultado-participantes-tbody');
        if (!$tbody) return;
        $tbody.querySelectorAll('tr').forEach(tr => {
            const sel = tr.querySelector('select[data-pos-select]');
            const ptsCell = tr.querySelector('[data-puntos]');
            if (!sel || !ptsCell) return;
            const pos = parseInt(sel.value);
            ptsCell.textContent = isNaN(pos) ? '0' : String(puntosPorPosicion(pos));
        });
    }

    // ============================================================
    // MEDALLERO (con previsualización del evento seleccionado)
    // ============================================================
    function ajustarResultadoPreview(ranking, facultad, posicion, delta, puntosAnteriores) {
        const row = ranking.find(item => item.nombre === facultad);
        if (!row) return;

        const puntos = puntosAnteriores === undefined
            ? puntosPorPosicion(posicion)
            : puntosAnteriores;
        row.puntos_eventos = (Number(row.puntos_eventos) || 0) + (delta * puntos);

        const campoMedalla = {
            1: 'oros',
            2: 'platas',
            3: 'bronces',
            4: 'cuarto',
            5: 'quinto'
        }[posicion];
        if (campoMedalla) {
            row[campoMedalla] = Math.max(
                0,
                (Number(row[campoMedalla]) || 0) + delta
            );
        }
        row.puntos = row.puntos_eventos + (Number(row.puntos_sanciones) || 0);
    }

    function renderMedallero() {
        const $tbody = document.getElementById('medallero-tbody');
        if (!$tbody) return;

        // Copia del ranking con previsualización
        const rankingPreview = state.ranking.map(r => ({ ...r }));

        if (state.eventoSeleccionado) {
            const participantes = state.eventoSeleccionado.participantes || [];

            // Quitar primero el resultado guardado del evento para no duplicarlo
            // cuando se consulta o se recalcula un evento ya finalizado.
            participantes.forEach(p => {
                if (p.posicion === null || p.posicion === undefined) return;
                ajustarResultadoPreview(
                    rankingPreview,
                    p.facultad,
                    p.posicion,
                    -1,
                    Number(p.puntos) || 0
                );
            });

            // Aplicar las posiciones que se ven ahora en el formulario.
            participantes.forEach(p => {
                const posicion = state.posiciones[p.equipo_id];
                if (!posicion) return;
                ajustarResultadoPreview(
                    rankingPreview,
                    p.facultad,
                    posicion,
                    1
                );
            });
        }

        // Ordenar por puntos DESC
        rankingPreview.sort((a, b) =>
            (b.puntos || 0) - (a.puntos || 0) || a.nombre.localeCompare(b.nombre)
        );

        $tbody.innerHTML = '';
        rankingPreview.forEach((r, i) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${i + 1}</td>
                <td>${r.nombre}</td>
                <td>${r.oros || 0}</td>
                <td>${r.platas || 0}</td>
                <td>${r.bronces || 0}</td>
                <td>${r.cuarto || 0}</td>
                <td>${r.quinto || 0}</td>
                <td>${r.puntos_eventos || 0}</td>
                <td>${r.puntos_sanciones || 0}</td>
                <td><strong>${r.puntos || 0}</strong></td>
            `;
            $tbody.appendChild(tr);
        });
    }

    async function guardarResultado() {
        if (!state.eventoSeleccionado) {
            window.adminToast.mostrar('Selecciona un evento', 'error');
            return;
        }
        const participantes = state.eventoSeleccionado.participantes || [];
        // Validar que todas las posiciones estén asignadas y únicas
        const resultados = [];
        const setPos = new Set();
        let ok = true;
        for (const p of participantes) {
            const pos = state.posiciones[p.equipo_id];
            if (!pos) { ok = false; break; }
            if (setPos.has(pos)) { ok = false; break; }
            setPos.add(pos);
            resultados.push({ equipo_id: p.equipo_id, posicion: pos });
        }
        if (!ok || resultados.length !== participantes.length) {
            window.adminToast.mostrar('Asigna una posición única a cada equipo', 'error');
            return;
        }
        const esFinalizado = state.eventoSeleccionado.estado === 'finalizado';
        const okGuardar = await window.adminConfirm.mostrar({
            titulo: 'Guardar resultado',
            mensaje: esFinalizado
                ? 'Este evento ya está finalizado. ¿Recalcular el resultado? El ranking se actualizará.'
                : '¿Guardar resultado? El evento pasará a finalizado.',
            textoAceptar: 'Guardar'
        });
        if (!okGuardar) return;
        try {
            await window.apiClient.post('/eventos/' + state.eventoSeleccionado.id + '/resultado', { resultados });
            window.adminToast.mostrar('Resultado guardado correctamente');
            state.eventoSeleccionado = null;
            state.posiciones = {};
            renderParticipantes();
            await cargarEventosYRanking();
            await state.onRecargar();
        } catch (e) {
            if (e.status === 401) { return; }
            window.adminToast.mostrar('Error al guardar: ' + (e.data?.error || e.message), 'error');
        }
    }

    return { init, recargar: cargarEventosYRanking };
})();
