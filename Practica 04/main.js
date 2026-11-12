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
  const campos = Array.from(formulario.querySelectorAll("input, select, textarea"))
    .filter(campo => campo.type !== "submit" && campo.type !== "reset" && campo.type !== "button" && campo.type !== "file" && campo.type !== "hidden");

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
      if (primero) primero.focus();
      return;
    }
    evento.preventDefault();
    alert("¡Validación correcta! El formulario está listo para enviarse.");
  });
}

if (fechaNacimiento) fechaNacimiento.addEventListener("change", actualizarEdad);
