// CARGA EL CSV DESDE GITHUB RAW
async function cargarCSV() {
    const url = "https://raw.githubusercontent.com/Jorge/Graduaciones/main/datos.csv";

    const resp = await fetch(url);
    const texto = await resp.text();

    const lineas = texto.trim().split("\n");

    let registros = [];

    for (let i = 1; i < lineas.length; i++) {
        let fila = lineas[i].split(",");

        registros.push({
            matricula: fila[0],
            nombre: fila[1],
            fecha: fila[2],
            hora: fila[3],
            ubicacion: fila[4],
            pdf: fila[5]
        });
    }

    return registros;
}


// BUSCA POR MATRÍCULA (igual que Apps Script)
async function buscarDatos(matricula) {
    const datos = await cargarCSV();
    return datos.find(reg => reg.matricula === matricula) || null;
}


// FUNCIÓN PRINCIPAL (equivalente a doGet)
async function buscar() {
    const matricula = document.getElementById("mat").value.trim();

    if (!matricula) {
        alert("Escribe una matrícula");
        return;
    }

    const datos = await buscarDatos(matricula);

    if (!datos) {
        document.getElementById("contenido").innerHTML =
            "<p>Matrícula no encontrada ❌</p>";
        return;
    }

    document.getElementById("contenido").innerHTML = `
      <h3>URL personalizada</h3>
      <input class="url-box" 
             value="${location.href}?matricula=${datos.matricula}" 
             readonly>

      <div class="container">

        <div class="panel">
            <h4>Archivo PDF personalizado</h4>
            <p><b>Matrícula:</b> ${datos.matricula}</p>
            <iframe src="${datos.pdf}"></iframe>
            <p><a href="${datos.pdf}" target="_blank">Abrir PDF</a></p>
        </div>

        <div class="panel">
            <h4>Información adicional</h4>
            <p><b>Nombre:</b> ${datos.nombre}</p>
            <p><b>Fecha:</b> ${datos.fecha}</p>
            <p><b>Hora:</b> ${datos.hora}</p>
            <p><b>Ubicación:</b> ${datos.ubicacion}</p>
        </div>

      </div>
  `;
}
