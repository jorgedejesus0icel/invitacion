// CARGA CSV DESDE GITHUB RAW
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


// BUSCA EN CSV SEGÚN LA MATRÍCULA EN LA URL
async function cargarPagina() {
    const params = new URLSearchParams(window.location.search);
    const matricula = params.get("matricula");

    if (!matricula) {
        document.getElementById("contenido").innerHTML =
            "<h3>Error: falta el parámetro ?matricula=</h3>";
        return;
    }

    const datos = await buscarDatos(matricula);

    if (!datos) {
        document.getElementById("contenido").innerHTML =
            "<p>Matrícula no encontrada ❌</p>";
        return;
    }

    mostrarInformacion(datos);
}


// BUSCA LOS DATOS EN EL CSV
async function buscarDatos(matricula) {
    const registros = await cargarCSV();
    return registros.find(r => r.matricula === matricula) || null;
}


// MUESTRA DIRECTAMENTE LOS DOS PANELES
function mostrarInformacion(datos) {
    const urlPersonal = `${location.origin}${location.pathname}?matricula=${datos.matricula}`;

    document.getElementById("contenido").innerHTML = `
      <h3>URL personalizada</h3>
      <input class="url-box" value="${urlPersonal}" readonly>

      <div class="container">

        <div class="panel">
            <h4>Archivo PDF personalizado</h4>
            <p><b>Matrícula:</b> ${datos.matricula}</p>
            <iframe src="${datos.pdf}"></iframe>
            <p><a href="${datos.pdf}" target="_blank">Abrir PDF en nueva pestaña</a></p>
        </div>

        <div class="panel">
            <h4>Información adicional</h4>
            <p><b>Nombre:</b> ${datos.nombre}</p>
            <p><b>Fecha del evento:</b> ${datos.fecha}</p>
            <p><b>Hora:</b> ${datos.hora}</p>
            <p><b>Ubicación:</b> ${datos.ubicacion}</p>
        </div>

      </div>
    `;
}


// EJECUTAR AL ABRIR LA PÁGINA
cargarPagina();
