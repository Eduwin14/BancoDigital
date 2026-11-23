
// ========================================
// BANCO DIGITAL
// Sistema de demostración académica
// Accesibilidad ARIA
// ========================================

// SALDO INICIAL DE DEMOSTRACIÓN

let saldoActual = 2500000;

// ELEMENTOS PRINCIPALES

const loginForm = document.getElementById("loginForm");
const mensaje = document.getElementById("mensaje");

const dashboard = document.getElementById("dashboard");
const loginSection = document.getElementById("acceso");
const hero = document.getElementById("inicio");
const servicios = document.getElementById("servicios");

const logoutBtn = document.getElementById("logoutBtn");

const saldo = document.getElementById("saldo");
const profileName = document.getElementById("profileName");

const transferForm = document.getElementById("transferForm");
const transferMessage = document.getElementById("transferMessage");

const movementList = document.getElementById("movementList");

// MENÚ DE NAVEGACIÓN

const menu = document.getElementById("menu");
const menuButton = document.querySelector(".navbar-toggler");

// Actualizar el estado ARIA del menú

if (menu && menuButton) {

    menu.addEventListener("shown.bs.collapse", function () {
        menuButton.setAttribute("aria-expanded", "true");
        menuButton.setAttribute("aria-label", "Cerrar menú de navegación");
    });

    menu.addEventListener("hidden.bs.collapse", function () {
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Abrir menú de navegación");
    });

}

// ========================================
// FORMATO DE DINERO COLOMBIANO
// ========================================

function formatoDinero(valor) {
    return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0
    }).format(valor);
}

// ========================================
// ACTUALIZAR SALDO
// ========================================

function actualizarSaldo() {
    saldo.textContent = formatoDinero(saldoActual);
}

// ========================================
// MOSTRAR MENSAJES ACCESIBLES
// ========================================

function mostrarMensaje(elemento, texto, color) {
    elemento.textContent = "";
    elemento.style.color = color;

    // Permite que el lector de pantalla detecte el nuevo mensaje
    requestAnimationFrame(function () {
        elemento.textContent = texto;
    });
}

// ========================================
// INICIAR SESIÓN
// ========================================

loginForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const usuario = document.getElementById("usuario").value.trim();
    const clave = document.getElementById("clave").value;

    if (usuario === "" || clave.length < 4) {

        mostrarMensaje(
            mensaje,
            "Verifica tus datos e intenta nuevamente.",
            "#c62828"
        );

        return;
    }

    // Mostrar nombre del usuario

    profileName.textContent = usuario;

    // Actualizar saldo

    actualizarSaldo();

    // Ocultar pantalla inicial

    hero.hidden = true;
    servicios.hidden = true;
    loginSection.hidden = true;

    // Mostrar panel bancario

    dashboard.hidden = false;

    // Limpiar formulario y mensaje

    loginForm.reset();
    mensaje.textContent = "";

    // Mostrar panel

    dashboard.scrollIntoView({
        behavior: "smooth"
    });

});

// ========================================
// CERRAR SESIÓN
// ========================================

logoutBtn.addEventListener("click", function() {

    dashboard.hidden = true;

    hero.hidden = false;
    servicios.hidden = false;
    loginSection.hidden = false;

    transferForm.reset();
    transferMessage.textContent = "";

    document.getElementById("inicio").scrollIntoView({
        behavior: "smooth"
    });

});

// ========================================
// REGISTRAR MOVIMIENTOS
// ========================================

function agregarMovimiento(descripcion, valor, tipo) {

    const fila = document.createElement("tr");

    const celdaDescripcion = document.createElement("td");
    const celdaFecha = document.createElement("td");
    const celdaValor = document.createElement("td");

    celdaDescripcion.textContent = descripcion;

    celdaFecha.textContent = new Date().toLocaleDateString("es-CO");

    celdaValor.textContent =
        (tipo === "ingreso" ? "+" : "-") + formatoDinero(valor);

    celdaValor.classList.add(
        tipo === "ingreso" ? "text-success" : "text-danger"
    );

    fila.appendChild(celdaDescripcion);
    fila.appendChild(celdaFecha);
    fila.appendChild(celdaValor);

    movementList.prepend(fila);

}

// ========================================
// REALIZAR TRANSFERENCIAS DE PRUEBA
// ========================================

transferForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const destino = document.getElementById("destino").value.trim();

    const valor = Number(document.getElementById("valor").value);

    // VALIDAR NÚMERO DE CUENTA

    if (!/^[0-9]{6,20}$/.test(destino)) {

        mostrarMensaje(
            transferMessage,
            "Ingresa un número de cuenta válido.",
            "#c62828"
        );

        return;
    }

    // VALIDAR CANTIDAD

    if (!Number.isSafeInteger(valor) || valor <= 0) {

        mostrarMensaje(
            transferMessage,
            "Ingresa un valor válido para transferir.",
            "#c62828"
        );

        return;
    }

    // COMPROBAR SALDO DISPONIBLE

    if (valor > saldoActual) {

        mostrarMensaje(
            transferMessage,
            "No tienes saldo suficiente para esta operación.",
            "#c62828"
        );

        return;
    }

    // DESCONTAR SALDO

    saldoActual -= valor;

    // ACTUALIZAR PANTALLA

    actualizarSaldo();

    // REGISTRAR MOVIMIENTO

    agregarMovimiento(
        "Transferencia de prueba a cuenta " + destino.slice(-4),
        valor,
        "egreso"
    );

    // MOSTRAR CONFIRMACIÓN

    mostrarMensaje(
        transferMessage,
        "Transferencia de demostración realizada correctamente. Valor: " +
        formatoDinero(valor),
        "#16803c"
    );

    // LIMPIAR FORMULARIO

    transferForm.reset();

});
