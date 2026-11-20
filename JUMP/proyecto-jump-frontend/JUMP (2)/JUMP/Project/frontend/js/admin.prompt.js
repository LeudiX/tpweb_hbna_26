// admin.prompt.js — Modal de edición genérico (reemplaza prompt() nativo).
// Uso:
//   const data = await window.adminPrompt.mostrar({
//     titulo: 'Editar facultad',
//     campos: [{ name: 'nombre', label: 'Nombre', value: 'FTL', type: 'text' }],
//     textoAceptar: 'Guardar'
//   });
//   if (!data) return; // cancelado
//   data.nombre // valor ingresado

window.adminPrompt = (function () {
    let resolverActual = null;
    let opcionesActuales = {};

    function init() {
        const $modal = document.getElementById('prompt-modal');
        const $aceptar = document.getElementById('prompt-aceptar');
        const $cancelar = document.getElementById('prompt-cancelar');
        const $cerrar = document.getElementById('prompt-cerrar');
        const $error = document.getElementById('prompt-error');
        if (!$modal || !$aceptar || !$cancelar) return;

        $aceptar.addEventListener('click', () => {
            const campos = document.querySelectorAll('#prompt-campos [data-prompt-field]');
            const data = {};
            campos.forEach(input => { data[input.dataset.promptField] = input.value.trim(); });
            const mensajeError = typeof opcionesActuales.validar === 'function'
                ? opcionesActuales.validar(data)
                : '';
            if (mensajeError) {
                if ($error) {
                    $error.textContent = mensajeError;
                    $error.style.display = 'block';
                }
                return;
            }
            cerrar(data);
        });
        $cancelar.addEventListener('click', () => cerrar(null));
        $cerrar?.addEventListener('click', () => cerrar(null));
        $modal.addEventListener('click', (e) => { if (e.target === $modal) cerrar(null); });
        document.getElementById('prompt-campos')?.addEventListener('input', () => {
            if ($error) {
                $error.textContent = '';
                $error.style.display = 'none';
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && $modal.style.display !== 'none') cerrar(null);
        });
    }

    function cerrar(resultado) {
        const $modal = document.getElementById('prompt-modal');
        if ($modal) $modal.style.display = 'none';
        if (typeof resolverActual === 'function') {
            const r = resolverActual;
            resolverActual = null;
            opcionesActuales = {};
            r(resultado);
        }
    }

    function mostrar(opciones) {
        const opt = opciones || {};
        const $modal = document.getElementById('prompt-modal');
        const $titulo = document.getElementById('prompt-titulo');
        const $campos = document.getElementById('prompt-campos');
        const $aceptar = document.getElementById('prompt-aceptar');
        const $cancelar = document.getElementById('prompt-cancelar');
        const $error = document.getElementById('prompt-error');
        if (!$modal || !$campos) return Promise.resolve(null);

        opcionesActuales = opt;
        if ($titulo) $titulo.textContent = opt.titulo || 'Editar';
        if ($aceptar) $aceptar.textContent = opt.textoAceptar || 'Guardar';
        if ($cancelar) $cancelar.textContent = opt.textoCancelar || 'Cancelar';
        if ($error) {
            $error.textContent = '';
            $error.style.display = 'none';
        }

        $campos.innerHTML = '';
        const lista = opt.campos || [{ name: 'valor', label: 'Valor', value: '' }];
        lista.forEach(c => {
            const div = document.createElement('div');
            div.className = 'admin-form__grupo';
            div.innerHTML = `
                <label class="admin-form__label">${c.label || c.name}</label>
                <input type="${c.type || 'text'}" class="admin-form__input" data-prompt-field="${c.name}" value="${(c.value || '').replace(/"/g, '&quot;')}" placeholder="${c.placeholder || ''}">
            `;
            $campos.appendChild(div);
        });

        $modal.style.display = 'flex';
        return new Promise((resolve) => {
            resolverActual = resolve;
        });
    }

    return { init, mostrar };
})();
