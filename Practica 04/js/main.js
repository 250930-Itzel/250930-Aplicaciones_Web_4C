"use strict";

/* Validación del formulario de registro MecaGest.
   Los patrones se aplican únicamente a los campos donde corresponden. */
const formulario = document.getElementById("registroForm");
const fechaNacimiento = document.getElementById("fechaNacimiento");
const resultadoEdad = document.getElementById("resultadoEdad");

const reglas = {
  nombre: { pattern: /^[\p{L}]+(?:[ '-][\p{L}]+)*$/u, mensaje: "Escribe solo letras, acentos y espacios." },
  apPaterno: { pattern: /^[\p{L}]+(?:[ '-][\p{L}]+)*$/u, mensaje: "Escribe solo letras, acentos y espacios." },
  apMaterno: { pattern: /^[\p{L}]+(?:[ '-][\p{L}]+)*$/u, mensaje: "Escribe solo letras, acentos y espacios." },
  pais: { pattern: /^[\p{L}]+(?:[ '-][\p{L}]+)*$/u, mensaje: "Escribe un país válido, usando letras y espacios." },
  ciudad: { pattern: /^[\p{L}]+(?:[ '-][\p{L}]+)*$/u, mensaje: "Escribe una ciudad válida, usando letras y espacios." },
  estado: { pattern: /^[\p{L}]+(?:[ '-][\p{L}]+)*$/u, mensaje: "Escribe un estado válido, usando letras y espacios." },
  calle: { pattern: /^[\p{L}\p{N} .,'#°/-]+$/u, mensaje: "Usa letras, números, espacios o los signos . , ' # ° / -." },
  direccion: { pattern: /^[\p{L}\p{N} .,'#°/()-]+$/u, mensaje: "La dirección contiene caracteres no permitidos." },
  numero: { pattern: /^[\p{L}\p{N} -]+$/u, mensaje: "Usa números y, si corresponde, letras o guion (ej. 12-A)." },
  colonia: { pattern: /^[\p{L}\p{N} .,'#°/-]+$/u, mensaje: "Usa letras, números, espacios y signos comunes de dirección." },
  numTelefonico: { pattern: /^\d{10}$/, mensaje: "El teléfono debe contener exactamente 10 números." },
  codigoPostal: { pattern: /^\d{5}$/, mensaje: "El código postal debe contener exactamente 5 números." },
  user: { pattern: /^[A-Za-z0-9._-]{4,20}$/, mensaje: "Usa de 4 a 20 caracteres: letras, números, punto, guion o guion bajo." },
  rfc: { pattern: /^[A-Za-zÑ&]{3,4}\d{6}[A-Za-z0-9]{3}$/, mensaje: "Escribe un RFC válido de 12 o 13 caracteres." }
};

function mostrarError(campo, mensaje) {
  let aviso = campo.parentElement.querySelector('[data-error-for="' + campo.id + '"]');
  if (!aviso) {
    aviso = document.createElement("small");
    aviso.className = "mensaje-error";
    aviso.dataset.errorFor = campo.id;
    campo.insertAdjacentElement("afterend", aviso);
  }
  aviso.textContent = mensaje;
  campo.classList.add("campo-invalido");
  campo.setAttribute("aria-invalid", "true");
}

function limpiarError(campo) {
  const aviso = campo.parentElement.querySelector('[data-error-for="' + campo.id + '"]');
  if (aviso) aviso.remove();
  campo.classList.remove("campo-invalido");
  campo.removeAttribute("aria-invalid");
}

function validarCampo(campo) {
  limpiarError(campo);
  const valor = campo.value.trim();

  if (campo.required && (campo.type === "checkbox" ? !campo.checked : !valor)) {
    mostrarError(campo, campo.type === "checkbox" ? "Debes aceptar este requisito." : "Este campo es obligatorio.");
    return false;
  }
  if (!valor) return true;

  const regla = reglas[campo.id];
  if (regla && !regla.pattern.test(valor)) {
    mostrarError(campo, regla.mensaje);
    return false;
  }
  if (campo.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor)) {
    mostrarError(campo, "Ingresa un correo electrónico válido.");
    return false;
  }
  if (campo.id === "password" && valor.length < 8) {
    mostrarError(campo, "La contraseña debe tener al menos 8 caracteres.");
    return false;
  }
  if (campo.id === "confirmarPassword" && valor !== document.getElementById("password").value) {
    mostrarError(campo, "Las contraseñas no coinciden.");
    return false;
  }
  if (campo.id === "fechaNacimiento") {
    const fecha = new Date(valor + "T00:00:00");
    const hoy = new Date();
    hoy.setHours(0,0,0,0);
    if (fecha > hoy) {
      mostrarError(campo, "La fecha de nacimiento no puede ser futura.");
      return false;
    }
    let edad = hoy.getFullYear() - fecha.getFullYear();
    if (hoy.getMonth() < fecha.getMonth() || (hoy.getMonth() === fecha.getMonth() && hoy.getDate() < fecha.getDate())) edad--;
    if (edad < 18) {
      mostrarError(campo, "Debes ser mayor de edad para solicitar una cuenta.");
      return false;
    }
  }
  return true;
}

// Restringe los campos marcados a dígitos desde la captura y al pegar.
function aplicarSoloNumeros(campo) {
  if (!campo) return;
  const limpiar = () => {
    const max = Number(campo.getAttribute("maxlength")) || Infinity;
    const valor = campo.value.replace(/\\D/g, "").slice(0, max);
    if (campo.value !== valor) campo.value = valor;
  };
  campo.addEventListener("input", limpiar);
  campo.addEventListener("paste", () => requestAnimationFrame(limpiar));
  campo.addEventListener("drop", () => requestAnimationFrame(limpiar));
}

document.querySelectorAll("[data-solo-numeros]").forEach(aplicarSoloNumeros);

function actualizarEdad() {
  if (!fechaNacimiento || !resultadoEdad) return;
  resultadoEdad.classList.remove("edad-estado--mayor", "edad-estado--menor", "edad-estado--error");
  if (!fechaNacimiento.value) {
    resultadoEdad.textContent = "Selecciona una fecha para calcular tu edad.";
    return;
  }
  const fecha = new Date(fechaNacimiento.value + "T00:00:00");
  const hoy = new Date();
  hoy.setHours(0,0,0,0);
  if (fecha > hoy) {
    resultadoEdad.textContent = "La fecha seleccionada es futura.";
    resultadoEdad.classList.add("edad-estado--error");
    return;
  }
  let edad = hoy.getFullYear() - fecha.getFullYear();
  if (hoy.getMonth() < fecha.getMonth() || (hoy.getMonth() === fecha.getMonth() && hoy.getDate() < fecha.getDate())) edad--;
  resultadoEdad.textContent = "Edad calculada: " + edad + " años.";
  resultadoEdad.classList.add(edad >= 18 ? "edad-estado--mayor" : "edad-estado--menor");
}

if (formulario) {
  const pasos = Array.from(formulario.querySelectorAll(":scope > fieldset"));
  const navegacion = document.getElementById("navegacionSecciones");
  const progreso = document.getElementById("progresoFormulario");
  let pasoActual = 0;

  const campos = Array.from(formulario.querySelectorAll("input, select, textarea"))
    .filter(campo => campo.type !== "submit" && campo.type !== "reset" && campo.type !== "button" && campo.type !== "file" && campo.type !== "hidden");

  // Icono representativo para cada sección del registro.
  // Se utiliza el título del fieldset para que cada paso tenga su propio símbolo.
  const iconosPorSeccion = [
    { palabras: ["personal"], icono: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.5"></circle><path d="M5 20c.7-3.5 3.1-5.3 7-5.3s6.3 1.8 7 5.3"></path></svg>', nombre: "Datos personales" },
    { palabras: ["contacto"], icono: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="14" rx="2"></rect><path d="m4.5 7 7.5 6 7.5-6"></path></svg>', nombre: "Datos de contacto" },
    { palabras: ["acceso"], icono: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4.5" y="10" width="15" height="10" rx="2"></rect><path d="M8 10V7a4 4 0 0 1 8 0v3"></path><path d="M12 14v2"></path></svg>', nombre: "Datos de acceso" },
    { palabras: ["ubicación", "ubicacion"], icono: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"></path><circle cx="12" cy="10" r="2.3"></circle></svg>', nombre: "Datos de ubicación" },
    { palabras: ["confirmación", "confirmacion"], icono: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 19 6v5c0 4.5-2.8 7.8-7 10-4.2-2.2-7-5.5-7-10V6l7-3Z"></path><path d="m8.5 12 2.3 2.3 4.8-5"></path></svg>', nombre: "Confirmación" }
  ];

  const botonesPasos = pasos.map((paso, indice) => {
    paso.classList.add("paso-formulario");
    const titulo = paso.dataset.titulo || paso.querySelector("legend")?.textContent || "Sección";
    const tituloNormalizado = titulo.toLocaleLowerCase("es");
    const configuracionIcono = iconosPorSeccion.find(item =>
      item.palabras.some(palabra => tituloNormalizado.includes(palabra))
    );
    const icono = configuracionIcono?.icono || "•";
    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "boton-seccion";
    boton.setAttribute("aria-label", "Ir a " + titulo);
    boton.title = titulo;
    boton.innerHTML = '<span class="numero-paso icono-paso" aria-hidden="true">' + icono + '</span><span class="texto-paso">' + titulo + '</span>';
    boton.addEventListener("click", () => {
      if (indice > pasoActual) {
        for (let i = pasoActual; i < indice; i++) {
          if (!validarPaso(i)) return;
        }
      }
      mostrarPaso(indice);
    });
    navegacion.appendChild(boton);

    const controles = document.createElement("div");
    controles.className = "controles-pasos";
    controles.innerHTML = '<button type="button" class="paso-anterior">Anterior</button>' +
      (indice === pasos.length - 1
        ? '<span class="texto-final">Última sección</span>'
        : '<button type="button" class="paso-siguiente">Continuar</button>');
    paso.appendChild(controles);

    controles.querySelector(".paso-anterior").addEventListener("click", () => {
      if (pasoActual > 0) mostrarPaso(pasoActual - 1);
    });
    const siguiente = controles.querySelector(".paso-siguiente");
    if (siguiente) {
      siguiente.addEventListener("click", () => {
        if (validarPaso(pasoActual) && pasoActual < pasos.length - 1) {
          mostrarPaso(pasoActual + 1);
          pasos[pasoActual].querySelector("input:not([type=hidden]), select, textarea")?.focus();
        }
      });
    }
    return boton;
  });

  function validarPaso(indice) {
    let valido = true;
    campos.filter(campo => pasos[indice].contains(campo)).forEach(campo => {
      if (!validarCampo(campo)) valido = false;
    });
    if (!valido) {
      const primero = pasos[indice].querySelector(".campo-invalido");
      if (primero) primero.focus();
    }
    return valido;
  }

  function mostrarPaso(indice) {
    pasoActual = indice;
    pasos.forEach((paso, i) => {
      paso.hidden = i !== indice;
      paso.classList.toggle("paso-activo", i === indice);
    });
    botonesPasos.forEach((boton, i) => {
      boton.classList.toggle("activo", i === indice);
      boton.classList.toggle("completado", i < indice);
      boton.setAttribute("aria-current", i === indice ? "step" : "false");
    });
    const avance = pasos.length > 1 ? (indice / (pasos.length - 1)) * 100 : 0;
    navegacion.style.setProperty("--avance", avance + "%");
    progreso.textContent = "Sección " + (indice + 1) + " de " + pasos.length + ": " +
      (pasos[indice].dataset.titulo || pasos[indice].querySelector("legend")?.textContent || "");
    pasos.forEach((paso) => {
      const anterior = paso.querySelector(".paso-anterior");
      if (anterior) anterior.disabled = indice === 0;
    });
  }

  document.getElementById("pasoAnterior").addEventListener("click", () => {
    if (pasoActual > 0) mostrarPaso(pasoActual - 1);
  });
  document.getElementById("pasoSiguiente").addEventListener("click", () => {
    if (validarPaso(pasoActual) && pasoActual < pasos.length - 1) {
      mostrarPaso(pasoActual + 1);
      pasos[pasoActual].querySelector("input:not([type=hidden]), select, textarea")?.focus();
    }
  });
  mostrarPaso(0);

  campos.forEach(campo => {
    campo.addEventListener("input", () => {
      validarCampo(campo);
      if (campo.id === "password") validarCampo(document.getElementById("confirmarPassword"));
    });
    campo.addEventListener("change", () => validarCampo(campo));
    if (campo.required && campo.type !== "checkbox") {
      const etiqueta = formulario.querySelector('label[for="' + campo.id + '"]');
      if (etiqueta && !etiqueta.textContent.includes("*")) etiqueta.textContent += " *";
    }
  });

  formulario.addEventListener("submit", evento => {
    let valido = true;
    campos.forEach(campo => { if (!validarCampo(campo)) valido = false; });
    if (!valido) {
      evento.preventDefault();
      const primero = formulario.querySelector(".campo-invalido");
      if (primero) {
        const indice = pasos.findIndex(paso => paso.contains(primero));
        if (indice >= 0) mostrarPaso(indice);
        primero.focus();
      }
      return;
    }
    evento.preventDefault();
    alert("¡Validación correcta! El formulario está listo para enviarse.");
  });
}

if (fechaNacimiento) fechaNacimiento.addEventListener("change", actualizarEdad);

/* Generación automática de códigos QR para los perfiles sociales.
   Cada código se crea con el enlace que la persona escribe en el formulario. */
function configurarCodigoQR(idCampo, idContenedor, idEstado, mensajeVacio) {
  const campo = document.getElementById(idCampo);
  const contenedor = document.getElementById(idContenedor);
  const estado = document.getElementById(idEstado);
  if (!campo || !contenedor || !estado) return;

  let ultimoEnlace = "";

  function actualizarQR() {
    const enlace = campo.value.trim();
    contenedor.innerHTML = "";
    ultimoEnlace = "";

    if (!enlace) {
      estado.textContent = mensajeVacio;
      return;
    }

    let url;
    try {
      url = new URL(enlace);
    } catch {
      estado.textContent = "Escribe un enlace completo y válido (debe comenzar con https://).";
      return;
    }

    if (url.protocol !== "https:" && url.protocol !== "http:") {
      estado.textContent = "El enlace debe comenzar con https:// o http://.";
      return;
    }

    if (idCampo === "urlWhatsApp" && !/(^|\\.)wa\\.me$/i.test(url.hostname) && !/whatsapp\\.com$/i.test(url.hostname)) {
      estado.textContent = "Para WhatsApp utiliza un enlace https://wa.me/...";
      return;
    }

    if (typeof QRCode === "undefined") {
      estado.textContent = "No se pudo cargar el generador QR. Revisa tu conexión a internet.";
      return;
    }

    new QRCode(contenedor, {
      text: url.href,
      width: 150,
      height: 150,
      colorDark: "#392d42",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H
    });
    ultimoEnlace = url.href;
    estado.textContent = "QR listo. Escanéalo para abrir este perfil.";
  }

  campo.addEventListener("input", actualizarQR);
  campo.addEventListener("change", actualizarQR);
  actualizarQR();
}

configurarCodigoQR("urlFacebook", "qrFacebook", "estadoQrFacebook", "El QR aparecerá cuando ingreses un enlace válido.");
configurarCodigoQR("urlLinkedin", "qrLinkedin", "estadoQrLinkedin", "El QR aparecerá cuando ingreses un enlace válido.");
configurarCodigoQR("urlWhatsApp", "qrWhatsApp", "estadoQrWhatsApp", "Pega tu enlace de WhatsApp (wa.me) para generar el QR.");

