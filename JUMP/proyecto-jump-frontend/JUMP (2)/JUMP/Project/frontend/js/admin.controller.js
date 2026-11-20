// admin.controller.js — Controlador delgado del admin.
// Orquesta: login, carga de datos, tabs, módulos por tab.
// No contiene lógica de CRUD (delegada a admin.eventos.js, etc.).

document.addEventListener('DOMContentLoaded', () => {
    // ============================================================
    // LOGIN
    // ============================================================
    const $loginModal = document.getElementById('login-modal');
    const $loginForm = document.getElementById('login-form');
    const $loginError = document.getElementById('login-error');
    const $loginUser = document.getElementById('login-username');
    const $loginPass = document.getElementById('login-password');
    const $loginInputs = [$loginUser, $loginPass].filter(Boolean);

    const limpiarErrorCredenciales = (campo) => {
        if (!campo) return;
        campo.parentElement.classList.remove('admin-form__grupo--credenciales-error');
        campo.removeAttribute('aria-invalid');
    };
    const limpiarErroresCredenciales = () => $loginInputs.forEach(limpiarErrorCredenciales);
    const marcarErrorCredenciales = (campo) => {
        if (!campo) return;
        campo.parentElement.classList.add('admin-form__grupo--credenciales-error');
        campo.setAttribute('aria-invalid', 'true');
    };
    const ocultarErrorLogin = () => {
        if ($loginError) {
            $loginError.style.display = 'none';
            $loginError.textContent = '';
        }
    };

    const mostrarLogin = () => {
        if ($loginModal) $loginModal.style.display = 'flex';
        ocultarErrorLogin();
        limpiarErroresCredenciales();
        [$loginUser, $loginPass].forEach(window.adminValidacion.limpiarError);
    };
    const ocultarLogin = () => {
        if ($loginModal) $loginModal.style.display = 'none';
    };

    if ($loginForm) {
        [$loginUser, $loginPass].forEach(window.adminValidacion.enlazarLimpiar);
        $loginInputs.forEach((campo) => campo.addEventListener('input', () => {
            limpiarErroresCredenciales();
            ocultarErrorLogin();
        }));
        $loginForm.addEventListener('submit', async (ev) => {
            ev.preventDefault();
            ocultarErrorLogin();
            limpiarErroresCredenciales();
            const username = $loginUser.value.trim();
            const password = $loginPass.value;
            if (!username || !password) {
                if (!username) window.adminValidacion.marcarError($loginUser, 'Ingresa usuario y contraseña');
                if (!password) window.adminValidacion.marcarError($loginPass, 'Ingresa usuario y contraseña');
                return;
            }
            try {
                const res = await window.authApi.login(username, password);
                if (res && res.token) {
                    window.authApi.setSession(res.token, res.user);
                    ocultarLogin();
                    await cargarTodo();
                } else {
                    throw new Error('Respuesta inválida');
                }
            } catch (e) {
                if ($loginError) {
                    $loginError.style.display = 'block';
                    $loginError.textContent = (e.data && e.data.error) || 'Credenciales incorrectas';
                }
                if (e.status === 401) {
                    marcarErrorCredenciales($loginUser);
                    marcarErrorCredenciales($loginPass);
                }
            }
        });
    }

    // ============================================================
    // CARGA DE DATOS
    // ============================================================
    let ctx = { eventos: [], deportes: [], equipos: [] };

    async function cargarTodo() {
        try {
            const [eventos, deportes, equipos] = await Promise.all([
                window.eventosApi.getEventos(),
                window.deportesApi.getDeportes(),
                window.equiposApi.getEquipos()
            ]);
            ctx = { eventos: eventos || [], deportes: deportes || [], equipos: equipos || [] };
            window.adminEventos.actualizar({
                eventos: ctx.eventos,
                deportes: ctx.deportes,
                equipos: ctx.equipos,
                onRecargar: cargarTodo,
                onLogin: mostrarLogin
            });
            if (window.adminResultados && typeof window.adminResultados.recargar === 'function') {
                window.adminResultados.recargar();
            }
        } catch (e) {
            if (e.status === 401) { mostrarLogin(); }
            else { console.error('Error cargando datos:', e); }
        }
    }

    // ============================================================
    // ARRANQUE
    // ============================================================
    window.adminTabs.init();
    window.adminEventos.init({
        eventos: [],
        deportes: [],
        equipos: [],
        onRecargar: cargarTodo,
        onLogin: mostrarLogin
    });

    window.adminEventosExport.init();

    window.adminResultados.init({
        onRecargar: cargarTodo
    });

    window.adminDisciplinas.init();
    window.adminParticipantes.init();
    window.adminSanciones.init();
    window.adminSistema.init();
    window.adminConfirm.init();
    window.adminPrompt.init();

    if (window.authApi.isLoggedIn()) {
        ocultarLogin();
        cargarTodo();
    } else {
        mostrarLogin();
    }
});
