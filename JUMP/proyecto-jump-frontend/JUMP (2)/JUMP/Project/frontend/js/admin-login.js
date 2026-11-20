// admin-login.js — Submit del modal de login (form-admin).
// Depende de auth.api.js (window.authApi) y api-client.js (window.apiClient).
// NO toca el botón ni el modal (eso lo hace formulario.js).
// Muestra el error de credenciales inline dentro del modal (no alert).

document.addEventListener('DOMContentLoaded', () => {
    const formAdmin = document.getElementById('form-admin');
    if (!formAdmin) return;

    const errorBox = document.getElementById('login-error');
    const userInput = document.getElementById('admin-user');
    const passInput = document.getElementById('admin-pass');
    const inputs = [userInput, passInput].filter(Boolean);

    const limpiarErrorCampo = (campo) => {
        if (!campo) return;
        campo.parentElement.classList.remove('modal-admin__grupo--credenciales-error');
        campo.removeAttribute('aria-invalid');
    };
    const limpiarErroresCampos = () => inputs.forEach(limpiarErrorCampo);
    const marcarErrorCampo = (campo) => {
        if (!campo) return;
        campo.parentElement.classList.add('modal-admin__grupo--credenciales-error');
        campo.setAttribute('aria-invalid', 'true');
    };

    const mostrarError = (msg) => {
        if (!errorBox) return;
        errorBox.textContent = msg;
        errorBox.style.display = 'block';
        errorBox.classList.add('modal-admin__error--visible');
    };
    const ocultarError = () => {
        if (!errorBox) return;
        errorBox.textContent = '';
        errorBox.style.display = 'none';
        errorBox.classList.remove('modal-admin__error--visible');
    };

    inputs.forEach((campo) => campo.addEventListener('input', () => {
        limpiarErroresCampos();
        ocultarError();
    }));

    formAdmin.addEventListener('submit', async (e) => {
        e.preventDefault();
        ocultarError();
        limpiarErroresCampos();

        if (!userInput || !passInput) return;

        const username = userInput.value.trim();
        const password = passInput.value;

        if (!username || !password) {
            if (!username) marcarErrorCampo(userInput);
            if (!password) marcarErrorCampo(passInput);
            mostrarError('Ingresa usuario y contraseña');
            return;
        }

        try {
            const res = await window.authApi.login(username, password);
            if (res && res.token) {
                window.authApi.setSession(res.token, res.user);
                window.location.href = '/jump/frontend/html/admin.html';
            } else {
                mostrarError('Respuesta inválida del servidor');
            }
        } catch (err) {
            // err.status === 401 en credenciales incorrectas
            const mensaje = (err.data && err.data.error) ? err.data.error : 'Credenciales incorrectas';
            if (err.status === 401) {
                marcarErrorCampo(userInput);
                marcarErrorCampo(passInput);
            }
            mostrarError(mensaje);
            // Limpiar el campo de contraseña
            passInput.value = '';
            passInput.focus();
        }
    });
});
