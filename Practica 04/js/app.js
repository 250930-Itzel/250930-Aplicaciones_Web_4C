"use strict";
document.addEventListener("DOMContentLoaded", () => {
  const $ = id => document.getElementById(id);
  const many = (selector, root=document) => Array.from(root.querySelectorAll(selector));
  const reg = $("formRegistro"), practice = $("formPractica");
  const regPanels = [1,2,3,4].map(n => $("panel-"+n)).filter(Boolean);
  const pracPanels = [1,2,3,4].map(n => $("prac-panel-"+n)).filter(Boolean);
  let regStep=0, pracStep=0;

  function show(panels, step, progressId) {
    panels.forEach((panel,index) => panel.hidden = index !== step);
    const progress=$(progressId);
    if(progress) progress.textContent = "Paso " + (step+1) + " de " + panels.length;
  }
  function switchView(view) {
    if($("vistaRegistro")) $("vistaRegistro").hidden = view !== "registro";
    if($("vistaPractica")) $("vistaPractica").hidden = view !== "practica";
    $("btnVistaRegistro")?.classList.toggle("btn-primary",view==="registro");
    $("btnVistaPractica")?.classList.toggle("btn-primary",view==="practica");
    window.scrollTo({top:0,behavior:"smooth"});
  }
  $("btnVistaRegistro")?.addEventListener("click",()=>switchView("registro"));
  $("btnVistaPractica")?.addEventListener("click",()=>switchView("practica"));
  show(regPanels,0,"wizardProgress"); show(pracPanels,0,"practicaProgress");

  function validate(panel) {
    let valid=true;
    many("input,select,textarea",panel).forEach(field=>{
      if(field.disabled || ["button","submit","reset","file"].includes(field.type)) return;
      let message="";
      if(field.required && (field.type==="checkbox" ? !field.checked : !field.value.trim())) message="Este campo es obligatorio.";
      if(!message && field.type==="email" && field.value && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(field.value)) message="Escribe un correo electrónico válido.";
      if(!message && field.id==="numTelefonico" && field.value && !/^\d{10}$/.test(field.value)) message="El teléfono debe contener 10 dígitos.";
      if(!message && field.id==="codigoPostal" && field.value && !/^\d{5}$/.test(field.value)) message="El código postal debe contener 5 dígitos.";
      if(!message && field.id==="password" && field.value.length<8) message="La contraseña debe tener al menos 8 caracteres.";
      if(!message && field.id==="confirmarPassword" && field.value!==$("password")?.value) message="Las contraseñas no coinciden.";
      if(!message && field.id==="fechaNacimiento" && field.value) {
        const date=new Date(field.value+"T00:00:00"), today=new Date();
        let age=today.getFullYear()-date.getFullYear();
        if(today.getMonth()<date.getMonth() || (today.getMonth()===date.getMonth() && today.getDate()<date.getDate())) age--;
        if(date>today || age<18) message="Debes indicar una fecha válida y ser mayor de edad.";
      }
      field.classList.toggle("invalid",!!message);
      field.setAttribute("aria-invalid",String(!!message));
      const error=$("error-"+field.id); if(error) error.textContent=message;
      if(message) valid=false;
    });
    if(!valid) panel.querySelector(".invalid")?.focus();
    return valid;
  }
  $("btnSiguiente")?.addEventListener("click",()=>{
    if(!validate(regPanels[regStep])) return;
    if(regStep<regPanels.length-1){regStep++;show(regPanels,regStep,"wizardProgress");}
    else reg?.requestSubmit();
  });
  $("btnAnterior")?.addEventListener("click",()=>{if(regStep>0){regStep--;show(regPanels,regStep,"wizardProgress");}});
  reg?.addEventListener("submit",event=>{
    event.preventDefault();
    const invalid=regPanels.findIndex(panel=>!validate(panel));
    if(invalid>=0){regStep=invalid;show(regPanels,regStep,"wizardProgress");return;}
    alert("¡Registro validado! La información está lista para enviarse.");
  });
  $("btnLimpiar")?.addEventListener("click",()=>{
    reg?.reset();regStep=0;show(regPanels,0,"wizardProgress");
    many(".invalid",reg).forEach(field=>field.classList.remove("invalid"));
  });

  $("fechaNacimiento")?.addEventListener("change",()=>{
    const value=$("fechaNacimiento").value, output=$("resultadoEdad"); if(!output)return;
    if(!value){output.textContent="";return;}
    const birth=new Date(value+"T00:00:00"),now=new Date();let age=now.getFullYear()-birth.getFullYear();
    if(now.getMonth()<birth.getMonth() || (now.getMonth()===birth.getMonth() && now.getDate()<birth.getDate())) age--;
    output.textContent=birth>now?"La fecha no puede ser futura.":"Edad calculada: "+age+" años.";
  });
  $("numTelefonico")?.addEventListener("input",event=>{event.target.value=event.target.value.replace(/\D/g,"").slice(0,10);});

  $("btnToggleInterfaz")?.addEventListener("click",()=>{if($("panelInterfaz"))$("panelInterfaz").hidden=!$("panelInterfaz").hidden;});
  $("btnTogglePerfil")?.addEventListener("click",()=>{if($("panelPerfil"))$("panelPerfil").hidden=!$("panelPerfil").hidden;});
  $("fontColor")?.addEventListener("input",event=>document.documentElement.style.setProperty("--mg-text",event.target.value));
  $("backgroundColor")?.addEventListener("input",event=>document.documentElement.style.setProperty("--mg-bg",event.target.value));
  $("resetTheme")?.addEventListener("click",()=>{
    document.documentElement.style.removeProperty("--mg-text");document.documentElement.style.removeProperty("--mg-bg");
    if($("fontColor"))$("fontColor").value="#24313b";if($("backgroundColor"))$("backgroundColor").value="#f3f6f8";
  });
  $("muteSounds")?.addEventListener("change",event=>{if($("soundsVolume"))$("soundsVolume").disabled=event.target.checked;});
  $("volumenTexto")?.addEventListener("input",event=>{if($("soundsVolume"))$("soundsVolume").value=event.target.value;});
  $("userPhoto")?.addEventListener("change",event=>{
    const file=event.target.files?.[0];if(!file)return;
    if(!file.type.startsWith("image/")){alert("Selecciona un archivo de imagen.");return;}
    const reader=new FileReader();reader.onload=()=>{if($("previewUserPhoto"))$("previewUserPhoto").src=reader.result;};reader.readAsDataURL(file);
    if($("nombreArchivoFoto"))$("nombreArchivoFoto").textContent=file.name;
  });

  $("btnPracSiguiente")?.addEventListener("click",()=>{
    if(pracStep<pracPanels.length-1){pracStep++;show(pracPanels,pracStep,"practicaProgress");}
    else alert("Has llegado al último módulo de práctica.");
  });
  $("btnPracAnterior")?.addEventListener("click",()=>{if(pracStep>0){pracStep--;show(pracPanels,pracStep,"practicaProgress");}});
  $("btnPracLimpiar")?.addEventListener("click",()=>{practice?.reset();});
  $("appoimentByMonth")?.addEventListener("change",()=>{if($("filtroMes"))$("filtroMes").disabled=false;if($("filtroSemana"))$("filtroSemana").disabled=true;});
  $("appoimentByWeek")?.addEventListener("change",()=>{if($("filtroMes"))$("filtroMes").disabled=true;if($("filtroSemana"))$("filtroSemana").disabled=false;});
  $("verCitas")?.addEventListener("click",()=>{if($("tituloTablaCitas"))$("tituloTablaCitas").textContent="Citas para el periodo seleccionado";});

  $("requestTool")?.addEventListener("click",()=>{
    const item=$("selectPieza"),quantity=$("toolQuantity"),body=$("tbodyHerramientas");
    if(!item||!quantity||!body)return;
    const amount=Number(quantity.value);
    if(!item.value||!Number.isInteger(amount)||amount<1){alert("Selecciona una herramienta e indica una cantidad válida.");return;}
    const row=document.createElement("tr");
    [String(body.rows.length+1),item.selectedOptions[0]?.textContent||item.value,String(amount)].forEach(value=>{
      const cell=document.createElement("td");cell.textContent=value;row.appendChild(cell);
    });
    body.appendChild(row);
    const total=$("totalUnidades");
    if(total)total.textContent=String(Array.from(body.rows).reduce((sum,current)=>sum+(Number(current.cells[2]?.textContent)||0),0));
  });

  $("qrFile")?.addEventListener("change",event=>{
    const file=event.target.files?.[0];if(!file)return;
    const reader=new FileReader();reader.onload=()=>{if($("qrImage"))$("qrImage").src=reader.result;if($("qrPreview"))$("qrPreview").hidden=false;if($("qrEmpty"))$("qrEmpty").hidden=true;};reader.readAsDataURL(file);
  });
  $("qrRemove")?.addEventListener("click",()=>{
    if($("qrImage"))$("qrImage").removeAttribute("src");if($("qrPreview"))$("qrPreview").hidden=true;if($("qrEmpty"))$("qrEmpty").hidden=false;if($("qrFile"))$("qrFile").value="";
  });
});
