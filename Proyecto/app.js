// --- Estado en memoria ---
let duenos = [
    { id: 1, nombre: "Mora", dni: "12345678" },
    { id: 2, nombre: "Juan", dni: "87654321" }
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
    if(nombre === "duenos") actualizarDuenos();
}
navBtns.duenos.addEventListener("click", ()=> mostrarSeccion("duenos"));
navBtns.mascotas.addEventListener("click", ()=> mostrarSeccion("mascotas"));
navBtns.productos.addEventListener("click", ()=> mostrarSeccion("productos"));
navBtns.usuario.addEventListener("click", ()=> mostrarSeccion("usuario"));
mostrarSeccion("mascotas");

// --- Dueños ---
function actualizarDuenos() {
    let body = document.getElementById("tabla-duenos");
    body.innerHTML = "";
    duenos.forEach(d => {
        let masc = mascotas.filter(m=>m.dueno === d.id).map(m=>m.nombre).join(", ");
        let tr = document.createElement("tr");
        tr.innerHTML = `<td>${d.nombre}</td>
            <td>${d.dni}</td>
            <td>${masc || "-"}</td>
            <td>
                <button onclick="editarDueno(${d.id})">Editar</button>
                <button onclick="eliminarDueno(${d.id})">Eliminar</button>
            </td>`;
        body.appendChild(tr);
    });
    // actualizar select en mascotas
    let sel = document.querySelector("#form-mascota select[name=dueno]");
    sel.innerHTML = `<option value="">Dueño</option>`;
    duenos.forEach(d => {
        sel.innerHTML += `<option value="${d.id}">${d.nombre} (${d.dni})</option>`;
    });
}
document.getElementById("form-dueno").onsubmit = function(e) {
    e.preventDefault();
    let nombre = this.nombre.value.trim();
    let dni = this.dni.value.trim();
    if(!nombre || !dni) return;
    duenos.push({id: nextDueno++, nombre, dni});
    this.reset();
    actualizarDuenos();
};
window.editarDueno = function(id) {
    let d = duenos.find(d=>d.id===id);
    if(!d) return;
    let nombre = prompt("Editar nombre del dueño:", d.nombre);
    if(nombre) d.nombre = nombre;
    let dni = prompt("Editar DNI del dueño:", d.dni);
    if(dni) d.dni = dni;
    actualizarDuenos();
};
window.eliminarDueno = function(id) {
    if(mascotas.some(m=>m.dueno===id)) {
        alert("No puedes eliminar un dueño con mascotas a cargo.");
        return;
    }
    duenos = duenos.filter(d=>d.id!==id);
    actualizarDuenos();
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

// --- Inicialización ---
actualizarDuenos();
actualizarMascotas();
actualizarProductos();