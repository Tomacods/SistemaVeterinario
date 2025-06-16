// -------------------- DATOS EN MEMORIA --------------------
let duenos = [
    { id: 1, nombre: "Mora", dni: "12345678", nacimiento: "2000-03-09", correo: "mora@mail.com", telefono: "351123456", avatar: 1 },
    { id: 2, nombre: "Juan", dni: "87654321", nacimiento: "1998-04-25", correo: "juan@mail.com", telefono: "351999888", avatar: 2 }
];
let mascotas = [
    { id: 1, nombre: "Benja", edad: 5, especie: "Gato", peso: "5", nacimiento: "2019-03-10", dueno: 1, historial: [], recetas: [] },
    { id: 2, nombre: "Luna", edad: 2, especie: "Perro", peso: "15", nacimiento: "2022-01-12", dueno: 2, historial: [], recetas: [] }
];
let productos = [
    { id: 1, nombre: "Antibiótico Oral", stock: 12, vencimiento: addDays(30), precio: 3500 },
    { id: 2, nombre: "Vacuna Rabia", stock: 6, vencimiento: addDays(90), precio: 1800 },
    { id: 3, nombre: "Desparasitante", stock: 5, vencimiento: addDays(-5), precio: 2200 }
];
let recetas = [];
let ventas = [];
let veterinarios = [
    { id: 1, nombre: "Dr. Martín", usuario: "martin", matricula: "VET3201" }
];
let nextDueno = 3, nextMascota = 3, nextProducto = 4, nextReceta = 1, nextVenta = 1;

// --------------------- NAVEGACIÓN ------------------------
const navBtns = {
    duenos: document.getElementById("nav-duenos"),
    mascotas: document.getElementById("nav-mascotas"),
    recetas: document.getElementById("nav-recetas"),
    ventas: document.getElementById("nav-ventas"),
    productos: document.getElementById("nav-productos"),
    usuario: document.getElementById("nav-usuario")
};
const secciones = {
    duenos: document.getElementById("seccion-duenos"),
    mascotas: document.getElementById("seccion-mascotas"),
    recetas: document.getElementById("seccion-recetas"),
    ventas: document.getElementById("seccion-ventas"),
    productos: document.getElementById("seccion-productos"),
    usuario: document.getElementById("seccion-usuario")
};
function mostrarSeccion(nombre) {
    Object.values(secciones).forEach(sec => sec.classList.remove("activa"));
    Object.values(navBtns).forEach(btn => btn.classList.remove("active"));
    secciones[nombre].classList.add("activa");
    navBtns[nombre].classList.add("active");
    if(nombre === "duenos") renderDuenos();
    if(nombre === "mascotas") renderMascotas();
    if(nombre === "recetas") renderRecetas();
    if(nombre === "ventas") renderVentas();
    if(nombre === "productos") renderProductos();
    if(nombre === "usuario") renderUsuario();
}
navBtns.duenos.onclick = ()=> mostrarSeccion("duenos");
navBtns.mascotas.onclick = ()=> mostrarSeccion("mascotas");
navBtns.recetas.onclick = ()=> mostrarSeccion("recetas");
navBtns.ventas.onclick = ()=> mostrarSeccion("ventas");
navBtns.productos.onclick = ()=> mostrarSeccion("productos");
navBtns.usuario.onclick = ()=> mostrarSeccion("usuario");

// ------------------ SECCIÓN DUEÑOS -----------------------
function renderDuenos() {
    const sec = secciones.duenos;
    if (!sec) return;
    sec.innerHTML = `
        <div id="vista-lista-duenos">
            <h2>Lista de Dueños</h2>
            <button id="btn-agregar-dueno">Agregar dueño</button>
            <div id="listado-duenos"></div>
        </div>
        <div id="vista-ficha-dueno" style="display:none"></div>
        <div id="vista-form-dueno" style="display:none"></div>
    `;
    renderListaDuenos();
    sec.querySelector("#btn-agregar-dueno").onclick = ()=> mostrarFormDueno();
}
function renderListaDuenos() {
    let cont = document.getElementById("listado-duenos");
    if (!cont) return;
    cont.innerHTML = "";
    let cards = document.createElement("div");
    cards.className = "lista-duenos-cards";
    duenos.forEach(d => {
        let div = document.createElement("div");
        div.className = "card-dueno-lista";
        div.onclick = (e)=>{ if(e.target.classList.contains('eliminar-dueno-btn')) return; mostrarFichaDueno(d.id); };
        div.innerHTML = `
            <div class="avatar-dueno-lista">${getAvatarDueno(d.avatar)}</div>
            <div>
                <div class="nombre-dueno">${d.nombre}</div>
                <div class="dni-dueno">DNI: ${d.dni}</div>
            </div>
            <button class="eliminar-dueno-btn" onclick="eliminarDueno(${d.id});event.stopPropagation();">Eliminar</button>
        `;
        cards.appendChild(div);
    });
    cont.appendChild(cards);
}
window.eliminarDueno = function(id) {
    if(mascotas.some(m=>m.dueno===id)) {
        alert("No puedes eliminar un dueño con mascotas a cargo.");
        return;
    }
    duenos = duenos.filter(d=>d.id!==id);
    renderListaDuenos();
};
function mostrarFichaDueno(id) {
    let d = duenos.find(dd=>dd.id===id);
    if(!d) return;
    document.getElementById("vista-lista-duenos").style.display = "none";
    document.getElementById("vista-ficha-dueno").style.display = "";
    document.getElementById("vista-form-dueno").style.display = "none";
    let cont = document.getElementById("vista-ficha-dueno");
    let mascotasDueno = mascotas.filter(m=>m.dueno===d.id);
    let tablaMascotas = `
        <table class="tabla-mascotas-dueno">
            <thead>
                <tr><th>Mascotas</th><th>Especie</th></tr>
            </thead>
            <tbody>
                ${
                    mascotasDueno.length
                    ? mascotasDueno.map(m=>`<tr><td>${m.nombre}</td><td>${m.especie}</td></tr>`).join("")
                    : `<tr><td colspan="2" style="color:#888">Sin mascotas</td></tr>`
                }
            </tbody>
        </table>
    `;
    cont.innerHTML = `
        <span class="flecha-volver" title="Volver" onclick="renderDuenos()">&#8592;</span>
        <div class="ficha-dueno">
            <div class="avatar-dueno">${getAvatarDueno(d.avatar, true)}</div>
            <div class="datos-dueno">
                <div style="display:flex;align-items:center">
                    <span style="font-size:2em;font-weight:600">${d.nombre}</span>
                    <button class="boton-editar-dueno" onclick="mostrarFormDueno(${d.id})">Editar</button>
                </div>
                <div style="display:flex;gap:2em;margin-top:.7em">
                    <div>
                        <b>Fecha de Nacimiento:</b><br>${d.nacimiento||'-'}
                        <br><b>DNI:</b><br>${d.dni||'-'}
                    </div>
                    <div>
                        <b>Correo electrónico:</b><br>${d.correo||'-'}
                        <br><b>Teléfono:</b><br>${d.telefono||'-'}
                    </div>
                </div>
            </div>
        </div>
        ${tablaMascotas}
        <button class="boton-modificar-mascotas" onclick="abrirModalMascotasDueno(${d.id})">Modificar mascotas</button>
    `;
}
function mostrarFormDueno(id=null) {
    let d = id ? duenos.find(dd=>dd.id===id) : {nombre:"",dni:"",nacimiento:"",correo:"",telefono:"",avatar:1};
    document.getElementById("vista-lista-duenos").style.display = "none";
    document.getElementById("vista-ficha-dueno").style.display = "none";
    document.getElementById("vista-form-dueno").style.display = "";
    let cont = document.getElementById("vista-form-dueno");
    cont.innerHTML = `
        <span class="flecha-volver" title="Volver" onclick="${id?'mostrarFichaDueno('+id+')':'renderDuenos()'}">&#8592;</span>
        <h2>${id?'Editar dueño':'Agregar dueño'}</h2>
        <form id="form-nuevo-dueno" style="flex-direction:column;max-width:400px;">
            <label>Nombre completo<input type="text" name="nombre" required value="${d.nombre||""}"></label>
            <label>DNI<input type="text" name="dni" required value="${d.dni||""}"></label>
            <label>Fecha de nacimiento<input type="date" name="nacimiento" value="${d.nacimiento||""}"></label>
            <label>Correo electrónico<input type="email" name="correo" value="${d.correo||""}"></label>
            <label>Teléfono<input type="text" name="telefono" value="${d.telefono||""}"></label>
            <label>Avatar
                <select name="avatar">
                    <option value="1" ${d.avatar==1?"selected":""}>Avatar 1</option>
                    <option value="2" ${d.avatar==2?"selected":""}>Avatar 2</option>
                    <option value="3" ${d.avatar==3?"selected":""}>Avatar 3</option>
                </select>
            </label>
            <button type="submit">${id?'Guardar cambios':'Agregar'}</button>
        </form>
    `;
    document.getElementById("form-nuevo-dueno").onsubmit = function(e) {
        e.preventDefault();
        let datos = Object.fromEntries(new FormData(this).entries());
        datos.avatar = parseInt(datos.avatar||1);
        if(id) {
            Object.assign(d, datos);
        } else {
            datos.id = nextDueno++;
            duenos.push(datos);
        }
        renderDuenos();
    };
}
window.abrirModalMascotasDueno = function(id) {
    let d = duenos.find(dd=>dd.id===id);
    if(!d) return;
    let cont = crearModalContenido(`
        <h3>Modificar mascotas del dueño</h3>
        <form id="form-mod-mascotas">
            ${mascotas.map(m=>
                `<label style="display:flex;align-items:center;gap:.7em;margin-bottom:.3em;">
                    <input type="checkbox" value="${m.id}" ${m.dueno==id?"checked":""}>
                    ${m.nombre} (${m.especie})
                </label>`
            ).join("") || "<p>No hay mascotas registradas.</p>"}
            <button type="submit" style="margin-top:1em">Guardar</button>
        </form>
    `);
    cont.querySelector("form").onsubmit = function(e) {
        e.preventDefault();
        let checks = Array.from(this.querySelectorAll("input[type=checkbox]"));
        mascotas.forEach(m=>{
            if(checks.some(c=>c.checked && +c.value===m.id)) m.dueno = id;
            else if(m.dueno===id) m.dueno = null;
        });
        cerrarModal();
        mostrarFichaDueno(id);
    };
    abrirModal(cont);
};

// ------------------ SECCIÓN MASCOTAS ---------------------
function renderMascotas() {
    let sec = secciones.mascotas;
    if (!sec) return;
    sec.innerHTML = `
        <h2>Gestión de Mascotas</h2>
        <button id="btn-agregar-mascota">Registrar mascota</button>
        <div id="mascotas-listado"></div>
    `;
    sec.querySelector("#btn-agregar-mascota").onclick = ()=> mostrarFormMascota();
    renderMascotasListado();
}
function renderMascotasListado() {
    const cont = document.getElementById("mascotas-listado");
    if (!cont) return;
    cont.innerHTML = "";
    mascotas.forEach(m => {
        let dueno = duenos.find(d=>d.id===m.dueno);
        let card = document.createElement("div");
        card.className = "card-mascota";
        card.innerHTML = `
            <div class="foto-mascota">${getMascotaEmoji(m.especie)}</div>
            <div class="info-mascota">
                <div><strong>${m.nombre}</strong> <span style="color:#555;">${m.edad} años</span></div>
                <small>Especie: ${m.especie || "-"}<br>
                Peso: ${m.peso ? m.peso+" kg" : "-"}<br>
                Nacimiento: ${m.nacimiento||"-"}</small>
                <div><b>Dueño:</b> ${dueno? dueno.nombre : "-"}</div>
                <div class="acciones">
                    <button onclick="abrirEditarMascota(${m.id})">Editar</button>
                    <button onclick="eliminarMascota(${m.id})">Eliminar</button>
                    <button onclick="verHistorialMascota(${m.id})">Historial</button>
                </div>
            </div>
        `;
        cont.appendChild(card);
    });
}
function mostrarFormMascota(id=null) {
    let m = id ? mascotas.find(m=>m.id===id) : {nombre:"",edad:"",especie:"",peso:"",nacimiento:"",dueno:""};
    let cont = crearModalContenido(`
        <h3>${id ? "Editar" : "Registrar"} Mascota</h3>
        <form id="form-mascota" style="flex-direction:column;max-width:340px">
            <label>Nombre<input type="text" name="nombre" required value="${m.nombre||""}"></label>
            <label>Edad<input type="number" name="edad" required min="0" value="${m.edad||""}"></label>
            <label>Especie<input type="text" name="especie" required value="${m.especie||""}"></label>
            <label>Peso (kg)<input type="text" name="peso" value="${m.peso||""}"></label>
            <label>Fecha de nacimiento<input type="date" name="nacimiento" value="${m.nacimiento||""}"></label>
            <label>Dueño
                <select name="dueno" required>
                    <option value="">Seleccionar dueño</option>
                    ${duenos.map(d=>`<option value="${d.id}" ${d.id==m.dueno?"selected":""}>${d.nombre} (${d.dni})</option>`).join("")}
                </select>
            </label>
            <button type="submit">${id ? "Guardar cambios" : "Registrar"}</button>
        </form>
    `);
    cont.querySelector("form").onsubmit = function(e) {
        e.preventDefault();
        let datos = Object.fromEntries(new FormData(this).entries());
        if(!datos.nombre.trim() || !datos.edad || !datos.especie.trim() || !datos.dueno) return;
        datos.edad = parseInt(datos.edad);
        datos.dueno = parseInt(datos.dueno);
        if(id) {
            Object.assign(m, datos);
        } else {
            datos.id = nextMascota++;
            datos.historial = [];
            datos.recetas = [];
            mascotas.push(datos);
        }
        cerrarModal();
        renderMascotas();
    };
    abrirModal(cont);
}
window.eliminarMascota = function(id) {
    if(confirm("¿Eliminar esta mascota?")) {
        mascotas = mascotas.filter(m=>m.id!==id);
        renderMascotas();
    }
};
window.abrirEditarMascota = function(id) { mostrarFormMascota(id); }
window.verHistorialMascota = function(id) {
    let m = mascotas.find(m=>m.id===id);
    if(!m) return;
    let recetasMascota = recetas.filter(r=>r.mascota===m.id);
    let historial = (m.historial||[]).map(ev=>`<li>${ev}</li>`).join("") || "<li>No hay eventos registrados.</li>";
    let recetasHtml = recetasMascota.length ? recetasMascota.map(r=>`
        <div class="historial-mascota">
            <b>Receta #${r.id}: ${formatearFecha(r.fecha)} - Veterinario: ${getVet(r.veterinario).nombre}</b>
            <ul class="receta-producto-list">
                ${r.productos.map(p=>`<li>${getProd(p.producto).nombre} - ${p.dosis} | ${p.indicaciones||""}</li>`).join("")}
            </ul>
        </div>
    `).join("") : "<div class='historial-mascota'>No hay recetas médicas para esta mascota.</div>";
    let cont = crearModalContenido(`
        <h3>Historial de ${m.nombre}</h3>
        <b>Eventos:</b>
        <ul>${historial}</ul>
        <b>Recetas médicas:</b>
        ${recetasHtml}
    `);
    abrirModal(cont);
};

// ------------------ SECCIÓN RECETAS ----------------------
function renderRecetas() {
    let sec = secciones.recetas;
    if (!sec) return;
    sec.innerHTML = `
        <h2>Recetas médicas</h2>
        <button id="btn-agregar-receta">Alta de Receta Médica</button>
        <div id="recetas-listado"></div>
    `;
    sec.querySelector("#btn-agregar-receta").onclick = ()=> mostrarFormReceta();
    renderRecetasListado();
}
function renderRecetasListado() {
    let cont = document.getElementById("recetas-listado");
    if (!cont) return;
    cont.innerHTML = "";
    recetas.slice().reverse().forEach(r => {
        let m = mascotas.find(m=>m.id===r.mascota);
        let d = duenos.find(d=>d.id===m.dueno);
        let vet = getVet(r.veterinario);
        cont.innerHTML += `
            <div class="receta-card">
                <div class="receta-header">
                    <div><b>Receta #${r.id}</b> - Mascota: <b>${m.nombre}</b> (Dueño: ${d.nombre})</div>
                    <span>${formatearFecha(r.fecha)}</span>
                </div>
                <div class="receta-detalle">
                    <b>Veterinario:</b> ${vet.nombre} (${vet.matricula})<br>
                    <b>Diagnóstico:</b> ${r.diagnostico}
                    <ul class="receta-producto-list">
                        ${r.productos.map(p=>`<li>${getProd(p.producto).nombre} - ${p.dosis} | ${p.indicaciones||""}</li>`).join("")}
                    </ul>
                </div>
                <button onclick="mostrarFormVentaDesdeReceta(${r.id})">Registrar venta</button>
            </div>
        `;
    });
}
function mostrarFormReceta() {
    let cont = crearModalContenido(`
        <h3>Generar Receta Médica</h3>
        <form id="form-receta" style="flex-direction:column;max-width:440px;">
            <label>Mascota
                <select name="mascota" required>
                    <option value="">Seleccionar mascota</option>
                    ${mascotas.map(m=>`<option value="${m.id}">${m.nombre} (${getDueno(m.dueno).nombre})</option>`).join("")}
                </select>
            </label>
            <label>Veterinario
                <select name="veterinario" required>
                    <option value="">Seleccionar veterinario</option>
                    ${veterinarios.map(v=>`<option value="${v.id}">${v.nombre} (${v.matricula})</option>`).join("")}
                </select>
            </label>
            <label>Diagnóstico<textarea name="diagnostico" required></textarea></label>
            <div id="receta-productos">
                <label>Medicamento/Producto
                    <select name="producto" required>
                        <option value="">Seleccionar producto</option>
                        ${productos.map(p=>`<option value="${p.id}">${p.nombre}</option>`).join("")}
                    </select>
                </label>
                <label>Dosis<input type="text" name="dosis" required></label>
                <label>Indicaciones<textarea name="indicaciones"></textarea></label>
            </div>
            <button type="button" id="btn-add-producto">+ Agregar otro producto</button>
            <button type="submit">Generar Receta</button>
        </form>
    `);
    cont.querySelector("#btn-add-producto").onclick = function() {
        let div = document.createElement("div");
        div.innerHTML = `
            <hr>
            <label>Medicamento/Producto
                <select name="producto" required>
                    <option value="">Seleccionar producto</option>
                    ${productos.map(p=>`<option value="${p.id}">${p.nombre}</option>`).join("")}
                </select>
            </label>
            <label>Dosis<input type="text" name="dosis" required></label>
            <label>Indicaciones<textarea name="indicaciones"></textarea></label>
        `;
        cont.querySelector("#receta-productos").appendChild(div);
    };
    cont.querySelector("form").onsubmit = function(e) {
        e.preventDefault();
        let f = new FormData(this);
        let mascota = +f.get("mascota");
        let veterinario = +f.get("veterinario");
        let diagnostico = f.get("diagnostico").trim();
        let prods = [];
        let prodElems = this.querySelectorAll("#receta-productos > div, #receta-productos");
        prodElems.forEach(div=>{
            let producto = +(div.querySelector("[name=producto]")?.value||"");
            let dosis = div.querySelector("[name=dosis]")?.value.trim()||"";
            let indicaciones = div.querySelector("[name=indicaciones]")?.value.trim()||"";
            if(producto && dosis) prods.push({producto, dosis, indicaciones});
        });
        if(!mascota || !veterinario || !diagnostico || prods.length==0) return;
        recetas.push({
            id: nextReceta++,
            mascota,
            veterinario,
            diagnostico,
            productos: prods,
            fecha: new Date().toISOString().slice(0,10)
        });
        cerrarModal();
        renderRecetas();
    };
    abrirModal(cont);
}

// ----------------- SECCIÓN VENTAS ------------------------
function renderVentas() {
    let sec = secciones.ventas;
    if (!sec) return;
    sec.innerHTML = `
        <h2>Registrar Venta de Producto</h2>
        <div>
            <button id="btn-agregar-venta">Registrar venta directa</button>
        </div>
        <div id="ventas-listado"></div>
    `;
    sec.querySelector("#btn-agregar-venta").onclick = ()=> mostrarFormVenta();
    renderVentasListado();
}
function renderVentasListado() {
    let cont = document.getElementById("ventas-listado");
    if (!cont) return;
    cont.innerHTML = "";
    ventas.slice().reverse().forEach(v => {
        let d = getDueno(v.dueno);
        let r = recetas.find(r=>r.id===v.receta);
        cont.innerHTML += `
            <div class="venta-card">
                <div class="venta-header">
                    <span>Venta #${v.id} - Dueño: <b>${d.nombre}</b></span>
                    <span>${formatearFecha(v.fecha)}</span>
                </div>
                <div class="venta-detalle">
                    <b>Productos vendidos:</b>
                    <ul class="venta-producto-list">
                        ${v.productos.map(p=>`<li>${getProd(p.producto).nombre} x ${p.cantidad} u. - $${getProd(p.producto).precio} c/u</li>`).join("")}
                    </ul>
                    <b>Total: </b> $${v.total}
                    <br><b>Receta asociada:</b> ${r ? "#"+r.id+" ("+getMascota(r.mascota).nombre+")" : "-"}
                </div>
            </div>
        `;
    });
}
function mostrarFormVentaDesdeReceta(recetaId) {
    let r = recetas.find(r=>r.id===recetaId);
    let m = mascotas.find(m=>m.id===r.mascota);
    let d = duenos.find(d=>d.id===m.dueno);
    let cont = crearModalContenido(`
        <h3>Venta asociada a receta #${r.id} (${m.nombre})</h3>
        <form id="form-venta" style="flex-direction:column;max-width:440px;">
            <label>Dueño
                <input type="text" value="${d.nombre}" readonly>
            </label>
            <label>Mascota
                <input type="text" value="${m.nombre}" readonly>
            </label>
            <b>Productos recetados:</b>
            <div id="venta-productos-list">
                ${r.productos.map((p,i)=>`
                    <div>
                        <label>${getProd(p.producto).nombre}
                            <input type="number" name="cantidad${i}" min="1" max="${getProd(p.producto).stock}" value="1" required>
                            <span style="font-size:.9em;color:#666;">Stock: ${getProd(p.producto).stock}</span>
                        </label>
                    </div>
                `).join("")}
            </div>
            <button type="submit">Registrar venta</button>
        </form>
    `);
    cont.querySelector("form").onsubmit = function(e) {
        e.preventDefault();
        let productosVendidos = [];
        let total = 0;
        r.productos.forEach((p,i)=>{
            let cantidad = +this["cantidad"+i].value;
            if(cantidad>0 && cantidad <= getProd(p.producto).stock) {
                productosVendidos.push({producto: p.producto, cantidad});
                total += cantidad * getProd(p.producto).precio;
            }
        });
        if(productosVendidos.length==0) return;
        productosVendidos.forEach(pv=>{
            let prod = getProd(pv.producto);
            prod.stock -= pv.cantidad;
        });
        ventas.push({
            id: nextVenta++,
            dueno: d.id,
            receta: r.id,
            productos: productosVendidos,
            fecha: new Date().toISOString().slice(0,10),
            total
        });
        cerrarModal();
        renderVentas();
        renderProductos();
    };
    abrirModal(cont);
}
function mostrarFormVenta() {
    let cont = crearModalContenido(`
        <h3>Venta directa asociada a receta</h3>
        <form id="form-venta" style="flex-direction:column;max-width:440px;">
            <label>Receta
                <select name="receta" required>
                    <option value="">Seleccionar receta</option>
                    ${recetas.map(r=>{
                        let m = getMascota(r.mascota);
                        let d = getDueno(m.dueno);
                        return `<option value="${r.id}">#${r.id} - ${m.nombre} (${d.nombre})</option>`;
                    }).join("")}
                </select>
            </label>
            <div id="venta-productos-list"></div>
            <button type="submit" disabled>Registrar venta</button>
        </form>
    `);
    let recetaSelect = cont.querySelector("select[name=receta]");
    recetaSelect.onchange = function() {
        let rid = +this.value;
        let r = recetas.find(r=>r.id===rid);
        let div = cont.querySelector("#venta-productos-list");
        if(!r) { div.innerHTML=""; cont.querySelector("button[type=submit]").disabled = true; return; }
        div.innerHTML = "<b>Productos recetados:</b><br>" + r.productos.map((p,i)=>`
            <div>
                <label>${getProd(p.producto).nombre}
                    <input type="number" name="cantidad${i}" min="1" max="${getProd(p.producto).stock}" value="1" required>
                    <span style="font-size:.9em;color:#666;">Stock: ${getProd(p.producto).stock}</span>
                </label>
            </div>
        `).join("");
        cont.querySelector("button[type=submit]").disabled = false;
    };
    cont.querySelector("form").onsubmit = function(e) {
        e.preventDefault();
        let rid = +this.receta.value;
        let r = recetas.find(r=>r.id===rid);
        let m = mascotas.find(m=>m.id===r.mascota);
        let d = duenos.find(d=>d.id===m.dueno);
        let productosVendidos = [];
        let total = 0;
        r.productos.forEach((p,i)=>{
            let cantidad = +this["cantidad"+i].value;
            if(cantidad>0 && cantidad <= getProd(p.producto).stock) {
                productosVendidos.push({producto: p.producto, cantidad});
                total += cantidad * getProd(p.producto).precio;
            }
        });
        if(productosVendidos.length==0) return;
        productosVendidos.forEach(pv=>{
            let prod = getProd(pv.producto);
            prod.stock -= pv.cantidad;
        });
        ventas.push({
            id: nextVenta++,
            dueno: d.id,
            receta: r.id,
            productos: productosVendidos,
            fecha: new Date().toISOString().slice(0,10),
            total
        });
        cerrarModal();
        renderVentas();
        renderProductos();
    };
    abrirModal(cont);
}

// --------------- SECCIÓN PRODUCTOS -----------------------
function renderProductos() {
    let sec = secciones.productos;
    if (!sec) return;
    sec.innerHTML = `
        <h2>Gestión de Productos</h2>
        <form id="form-producto">
            <input type="text" placeholder="Nombre" required name="nombre">
            <input type="number" placeholder="Stock" min="0" required name="stock">
            <input type="number" placeholder="Precio" min="1" required name="precio">
            <input type="date" placeholder="Vencimiento" required name="vencimiento">
            <button type="submit">Agregar producto</button>
        </form>
        <div class="buscador-productos">
            <input type="text" id="buscar-producto" placeholder="Buscar producto">
            <button id="filtrar-productos">Filtrar</button>
        </div>
        <table>
            <thead>
                <tr>
                    <th>Producto</th>
                    <th>Stock</th>
                    <th>Precio</th>
                    <th>Vencido</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody id="tabla-productos"></tbody>
        </table>
    `;
    sec.querySelector("#form-producto").onsubmit = function(e) {
        e.preventDefault();
        let nombre = this.nombre.value.trim();
        let stock = +this.stock.value;
        let precio = +this.precio.value;
        let vencimiento = this.vencimiento.value;
        if(!nombre || !vencimiento || !precio) return;
        productos.push({id: nextProducto++, nombre, stock, precio, vencimiento});
        this.reset();
        renderProductos();
    };
    sec.querySelector("#buscar-producto").addEventListener("input", renderProductosListado);
    sec.querySelector("#filtrar-productos").addEventListener("click", renderProductosListado);
    renderProductosListado();
}
function renderProductosListado() {
    let body = document.getElementById("tabla-productos");
    if (!body) return;
    let buscar = document.getElementById("buscar-producto").value.trim().toLowerCase();
    body.innerHTML = "";
    productos
        .filter(p => p.nombre.toLowerCase().includes(buscar))
        .forEach(p => {
            let vencido = vencidoProducto(p);
            let stockBajo = p.stock < 2;
            let tr = document.createElement("tr");
            if(vencido) tr.classList.add("vencido");
            if(stockBajo) tr.classList.add("stock-bajo");
            tr.innerHTML = `
                <td>${p.nombre}</td>
                <td>${p.stock} ${p.stock===1?"unidad":"unidades"}</td>
                <td>$${p.precio}</td>
                <td class="${vencido?'vencido':''}">${vencido?"Sí":"No"}</td>
                <td>
                    <button onclick="abrirEditarProducto(${p.id})">Editar</button>
                    <button onclick="eliminarProducto(${p.id})">Eliminar</button>
                </td>
            `;
            body.appendChild(tr);
        });
}
window.eliminarProducto = function(id) {
    if(confirm("¿Eliminar este producto?"))
        productos = productos.filter(p=>p.id!==id);
    renderProductos();
};
window.abrirEditarProducto = function(id) {
    let p = productos.find(p=>p.id===id);
    if(!p) return;
    let cont = crearModalContenido(`
        <h3>Editar Producto</h3>
        <form id="form-editar-producto" style="flex-direction:column;max-width:340px;">
            <label>Nombre<input type="text" name="nombre" required value="${p.nombre}"></label>
            <label>Stock<input type="number" name="stock" min="0" required value="${p.stock}"></label>
            <label>Precio<input type="number" name="precio" min="1" required value="${p.precio}"></label>
            <label>Vencimiento<input type="date" name="vencimiento" required value="${p.vencimiento}"></label>
            <button type="submit">Guardar cambios</button>
        </form>
    `);
    cont.querySelector("form").onsubmit = function(e) {
        e.preventDefault();
        p.nombre = this.nombre.value.trim();
        p.stock = +this.stock.value;
        p.precio = +this.precio.value;
        p.vencimiento = this.vencimiento.value;
        cerrarModal();
        renderProductos();
    };
    abrirModal(cont);
};
function vencidoProducto(p) {
    if(!p.vencimiento) return false;
    return new Date(p.vencimiento) < new Date();
}

// --------------- SECCIÓN USUARIO/DASHBOARD -----------------
function renderUsuario() {
    secciones.usuario.innerHTML = `
        <div class="usuario-card">
            <span class="icon-user usuario-grande"></span>
            <div>
                <h2>Usuario Veterinario</h2>
                <p>¡Bienvenido a tu sistema!</p>
                <ul>
                    <li><b>Total dueños:</b> ${duenos.length}</li>
                    <li><b>Total mascotas:</b> ${mascotas.length}</li>
                    <li><b>Total productos:</b> ${productos.length}</li>
                    <li><b>Recetas:</b> ${recetas.length}</li>
                    <li><b>Ventas:</b> ${ventas.length}</li>
                </ul>
            </div>
        </div>
    `;
}

// -------------------- MODALES Y UTILIDADES --------------------
function abrirModal(htmlNode) {
    let modal = document.getElementById("modal-general");
    let content = document.getElementById("modal-general-content");
    content.innerHTML = "";
    content.appendChild(htmlNode);
    modal.classList.add("activo");
    let span = document.createElement("span");
    span.className = "cerrar-modal";
    span.innerHTML = "&times;";
    span.onclick = cerrarModal;
    content.appendChild(span);
}
function cerrarModal() {
    document.getElementById("modal-general").classList.remove("activo");
}
window.onclick = function(e) {
    if(e.target.classList && e.target.classList.contains("modal"))
        cerrarModal();
};
function crearModalContenido(html) {
    let div = document.createElement("div");
    div.innerHTML = html;
    return div;
}
function addDays(dias) {
    let d = new Date();
    d.setDate(d.getDate()+dias);
    return d.toISOString().slice(0,10);
}
function getMascotaEmoji(especie) {
    especie = especie.toLowerCase();
    if(especie.includes("gato")) return "🐱";
    if(especie.includes("perro")) return "🐶";
    if(especie.includes("conejo")) return "🐰";
    if(especie.includes("ave") || especie.includes("pájaro")) return "🐦";
    if(especie.includes("pez")) return "🐟";
    return "🐾";
}
function getAvatarDueno(tipo, grande=false) {
    const size = grande ? 92 : 48;
    if(tipo==2) return `<img src="https://api.dicebear.com/8.x/open-peeps/svg?seed=Tom&backgroundColor=b7e6a2" width="${size}" height="${size}" alt="avatar" style="border-radius:50%">`;
    if(tipo==3) return `<img src="https://api.dicebear.com/8.x/adventurer/svg?seed=Alex&backgroundColor=b7e6a2" width="${size}" height="${size}" alt="avatar" style="border-radius:50%">`;
    return `<img src="https://api.dicebear.com/8.x/icons/svg?seed=User&backgroundColor=b7e6a2" width="${size}" height="${size}" alt="avatar" style="border-radius:50%">`;
}
function getProd(id) { return productos.find(p=>p.id===id);}
function getDueno(id) { return duenos.find(d=>d.id===id);}
function getMascota(id) { return mascotas.find(m=>m.id===id);}
function getVet(id) { return veterinarios.find(v=>v.id===id);}
function formatearFecha(f) {
    if(!f) return "-";
    let d = new Date(f);
    if(isNaN(d.getTime())) return f;
    return d.toLocaleDateString();
}

// ----------- INICIALIZACIÓN SEGURA: DOMContentLoaded --------
document.addEventListener("DOMContentLoaded", () => {
    renderDuenos();
    renderMascotas();
    renderRecetas();
    renderVentas();
    renderProductos();
    renderUsuario();
    mostrarSeccion("duenos"); // Puedes cambiar a "mascotas" si prefieres
});