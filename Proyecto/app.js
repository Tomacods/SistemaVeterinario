// --- Estado en memoria ---
let duenos = [
    { id: 1, nombre: "Mora", dni: "12345678", nacimiento: "2000-03-09", correo: "mora@mail.com", telefono: "351123456", avatar: 1 },
    { id: 2, nombre: "Juan", dni: "87654321", nacimiento: "1998-04-25", correo: "juan@mail.com", telefono: "351999888", avatar: 2 }
];
let mascotas = [
    { id: 1, nombre: "Benja", edad: 5, especie: "Gato", peso: "5", nacimiento: "2019-03-10", dueno: 1, historial: ["Vacuna antirrábica 2023", "Desparasitación 2024"] },
    { id: 2, nombre: "Luna", edad: 2, especie: "Perro", peso: "15", nacimiento: "2022-01-12", dueno: 2, historial: ["Baño y corte 2024"] }
];
let productos = [
    { id: 1, nombre: "Mercepton Injetável 20 Ml", stock: 10, vencimiento: addDays(-30) },
    { id: 2, nombre: "Diuravet - Riverfarma", stock: 0, vencimiento: addDays(90) },
    { id: 3, nombre: "CORTISOL (Prednisolona)", stock: 5, vencimiento: addDays(-5) },
    { id: 4, nombre: "Antibiótico Ampicilina Oral", stock: 1, vencimiento: addDays(-1) }
];
let nextDueno = 3, nextMascota = 3, nextProducto = 5;

// --- Navegación ---
const navBtns = {
    duenos: document.getElementById("nav-duenos"),
    mascotas: document.getElementById("nav-mascotas"),
    productos: document.getElementById("nav-productos"),
    usuario: document.getElementById("nav-usuario"),
};
const secciones = {
    duenos: document.getElementById("seccion-duenos"),
    mascotas: document.getElementById("seccion-mascotas"),
    productos: document.getElementById("seccion-productos"),
    usuario: document.getElementById("seccion-usuario"),
};
function mostrarSeccion(nombre) {
    Object.values(secciones).forEach(sec => sec.classList.remove("activa"));
    Object.values(navBtns).forEach(btn => btn.classList.remove("active"));
    secciones[nombre].classList.add("activa");
    navBtns[nombre].classList.add("active");
    if(nombre === "mascotas") actualizarMascotas();
    if(nombre === "productos") actualizarProductos();
    if(nombre === "duenos") vistaListaDuenos();
}
navBtns.duenos.addEventListener("click", ()=> mostrarSeccion("duenos"));
navBtns.mascotas.addEventListener("click", ()=> mostrarSeccion("mascotas"));
navBtns.productos.addEventListener("click", ()=> mostrarSeccion("productos"));
navBtns.usuario.addEventListener("click", ()=> mostrarSeccion("usuario"));
mostrarSeccion("mascotas");

// --- Dueños ---
function vistaListaDuenos() {
    document.getElementById("vista-lista-duenos").style.display = "";
    document.getElementById("vista-ficha-dueno").style.display = "none";
    document.getElementById("vista-form-dueno").style.display = "none";
    renderListaDuenos();
}
function renderListaDuenos() {
    let cont = document.getElementById("listado-duenos");
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
document.getElementById("btn-agregar-dueno").onclick = () => mostrarFormDueno();

window.eliminarDueno = function(id) {
    if(mascotas.some(m=>m.dueno===id)) {
        alert("No puedes eliminar un dueño con mascotas a cargo.");
        return;
    }
    duenos = duenos.filter(d=>d.id!==id);
    renderListaDuenos();
};

// Ficha de dueño
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
        <span class="flecha-volver" title="Volver" onclick="vistaListaDuenos()">&#8592;</span>
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

// Alta/edición de dueño
function mostrarFormDueno(id=null) {
    let d = id ? duenos.find(dd=>dd.id===id) : {nombre:"",dni:"",nacimiento:"",correo:"",telefono:"",avatar:1};
    document.getElementById("vista-lista-duenos").style.display = "none";
    document.getElementById("vista-ficha-dueno").style.display = "none";
    document.getElementById("vista-form-dueno").style.display = "";
    let cont = document.getElementById("vista-form-dueno");
    cont.innerHTML = `
        <span class="flecha-volver" title="Volver" onclick="${id?'mostrarFichaDueno('+id+')':'vistaListaDuenos()'}">&#8592;</span>
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
        vistaListaDuenos();
    };
}

// Modal modificar mascotas de dueño
window.abrirModalMascotasDueno = function(id) {
    let d = duenos.find(dd=>dd.id===id);
    if(!d) return;
    let cont = document.getElementById("contenedor-mascotas-dueno");
    let todasMascotas = mascotas.map(m=>`
        <label style="display:flex;align-items:center;gap:.7em;margin-bottom:.3em;">
            <input type="checkbox" value="${m.id}" ${m.dueno==id?"checked":""}>
            ${m.nombre} (${m.especie})
        </label>
    `).join("") || "<p>No hay mascotas registradas.</p>";
    cont.innerHTML = `
        <form id="form-mod-mascotas">
            ${todasMascotas}
            <button type="submit" style="margin-top:1em">Guardar</button>
        </form>
    `;
    document.getElementById("form-mod-mascotas").onsubmit = function(e) {
        e.preventDefault();
        let checks = Array.from(this.querySelectorAll("input[type=checkbox]"));
        mascotas.forEach(m=>{
            if(checks.some(c=>c.checked && +c.value===m.id)) m.dueno = id;
            else if(m.dueno===id) m.dueno = null;
        });
        cerrarModal("modal-mascotas-dueno");
        mostrarFichaDueno(id);
    };
    abrirModal("modal-mascotas-dueno");
};

// --- Mascotas ---
function actualizarMascotas() {
    let cont = document.getElementById("mascotas-listado");
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
                    <button onclick="verHistorial(${m.id})">Historial</button>
                </div>
            </div>
        `;
        cont.appendChild(card);
    });
    // actualizar select en mascotas
    let sel = document.querySelector("#form-mascota select[name=dueno]");
    if(sel) {
        sel.innerHTML = `<option value="">Dueño</option>`;
        duenos.forEach(d => {
            sel.innerHTML += `<option value="${d.id}">${d.nombre} (${d.dni})</option>`;
        });
    }
}
document.getElementById("form-mascota").onsubmit = function(e) {
    e.preventDefault();
    let nombre = this.nombre.value.trim();
    let edad = +this.edad.value;
    let especie = this.especie.value.trim();
    let peso = this.peso.value.trim();
    let nacimiento = this.nacimiento.value;
    let dueno = +this.dueno.value;
    if(!nombre || !edad || !especie || !dueno) return;
    mascotas.push({id: nextMascota++, nombre, edad, especie, peso, nacimiento, dueno, historial:[]});
    this.reset();
    actualizarMascotas();
};
window.eliminarMascota = function(id) {
    if(confirm("¿Eliminar esta mascota?")) {
        mascotas = mascotas.filter(m=>m.id!==id);
        actualizarMascotas();
    }
};
window.abrirEditarMascota = function(id) {
    let m = mascotas.find(m=>m.id===id);
    if(!m) return;
    let modal = document.getElementById("modal-mascota");
    let form = document.getElementById("form-editar-mascota");
    form.innerHTML = `
        <input type="text" name="nombre" value="${m.nombre}" required>
        <input type="number" name="edad" value="${m.edad}" min="0" required>
        <input type="text" name="especie" value="${m.especie}" required>
        <input type="text" name="peso" value="${m.peso||""}">
        <input type="date" name="nacimiento" value="${m.nacimiento||""}">
        <select name="dueno" required>
            ${duenos.map(d=>`<option value="${d.id}" ${d.id===m.dueno?"selected":""}>${d.nombre} (${d.dni})</option>`).join("")}
        </select>
        <button type="submit">Guardar cambios</button>
    `;
    form.onsubmit = function(e) {
        e.preventDefault();
        m.nombre = this.nombre.value.trim();
        m.edad = +this.edad.value;
        m.especie = this.especie.value.trim();
        m.peso = this.peso.value.trim();
        m.nacimiento = this.nacimiento.value;
        m.dueno = +this.dueno.value;
        cerrarModal("modal-mascota");
        actualizarMascotas();
    };
    abrirModal("modal-mascota");
};
window.verHistorial = function(id) {
    let m = mascotas.find(m=>m.id===id);
    if(!m) return;
    let div = document.getElementById("historial-mascota");
    div.innerHTML = `<b>${m.nombre} - Historial</b><ul>${
        (m.historial && m.historial.length) ? 
            m.historial.map(ev=>`<li>${ev}</li>`).join("") : "<li>No hay eventos registrados.</li>"
    }</ul>
    <form id="form-add-historial">
        <input type="text" name="evento" placeholder="Nuevo evento..." required>
        <button type="submit">Agregar</button>
    </form>`;
    document.getElementById("form-add-historial").onsubmit = function(e) {
        e.preventDefault();
        if(this.evento.value.trim()) {
            m.historial = m.historial || [];
            m.historial.push(this.evento.value.trim());
            verHistorial(id);
        }
    };
    abrirModal("modal-historial");
};

// --- Productos ---
function actualizarProductos() {
    let body = document.getElementById("tabla-productos");
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
                <td class="${vencido?'vencido':''}">${vencido?"Sí":"No"}</td>
                <td>
                    <button onclick="abrirEditarProducto(${p.id})">Editar</button>
                    <button onclick="eliminarProducto(${p.id})">Eliminar</button>
                </td>
            `;
            body.appendChild(tr);
        });
}
document.getElementById("form-producto").onsubmit = function(e) {
    e.preventDefault();
    let nombre = this.nombre.value.trim();
    let stock = +this.stock.value;
    let vencimiento = this.vencimiento.value;
    if(!nombre || !vencimiento) return;
    productos.push({id: nextProducto++, nombre, stock, vencimiento});
    this.reset();
    actualizarProductos();
};
document.getElementById("buscar-producto").addEventListener("input", actualizarProductos);
document.getElementById("filtrar-productos").addEventListener("click", actualizarProductos);

window.eliminarProducto = function(id) {
    if(confirm("¿Eliminar este producto?"))
        productos = productos.filter(p=>p.id!==id);
    actualizarProductos();
};
window.abrirEditarProducto = function(id) {
    let p = productos.find(p=>p.id===id);
    if(!p) return;
    let modal = document.getElementById("modal-producto");
    let form = document.getElementById("form-editar-producto");
    form.innerHTML = `
        <input type="text" name="nombre" value="${p.nombre}" required>
        <input type="number" name="stock" value="${p.stock}" min="0" required>
        <input type="date" name="vencimiento" value="${p.vencimiento}" required>
        <button type="submit">Guardar cambios</button>
    `;
    form.onsubmit = function(e) {
        e.preventDefault();
        p.nombre = this.nombre.value.trim();
        p.stock = +this.stock.value;
        p.vencimiento = this.vencimiento.value;
        cerrarModal("modal-producto");
        actualizarProductos();
    };
    abrirModal("modal-producto");
};
function vencidoProducto(p) {
    if(!p.vencimiento) return false;
    return new Date(p.vencimiento) < new Date();
}

// --- Modales ---
function abrirModal(id) {
    document.getElementById(id).classList.add("activo");
}
function cerrarModal(id) {
    document.getElementById(id).classList.remove("activo");
}
document.querySelectorAll(".cerrar-modal").forEach(span=>{
    span.onclick = ()=> cerrarModal(span.getAttribute("data-modal"));
});
window.onclick = function(e) {
    if(e.target.classList && e.target.classList.contains("modal"))
        e.target.classList.remove("activo");
}

// --- Utilidades ---
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
    // SVG avatar cartoon style (3 variantes)
    const size = grande ? 92 : 48;
    if(tipo==2) return `<img src="https://api.dicebear.com/8.x/open-peeps/svg?seed=Tom&backgroundColor=b7e6a2" width="${size}" height="${size}" alt="avatar" style="border-radius:50%">`;
    if(tipo==3) return `<img src="https://api.dicebear.com/8.x/adventurer/svg?seed=Alex&backgroundColor=b7e6a2" width="${size}" height="${size}" alt="avatar" style="border-radius:50%">`;
    // Default tipo 1 - hombre genérico
    return `<img src="https://api.dicebear.com/8.x/icons/svg?seed=User&backgroundColor=b7e6a2" width="${size}" height="${size}" alt="avatar" style="border-radius:50%">`;
}

// --- Inicialización ---
vistaListaDuenos();
actualizarMascotas();
actualizarProductos();