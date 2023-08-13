
const listaAlumnos = [];
let clasesTomadas = 0;
let btnCargarAlumno = document.getElementById("cargarAlumno");
let btnCalcularPago = document.getElementById("calcularPago");
let btnListarAlfabetica = document.getElementById("listarAlfabetica");
let tablaAlumnos = document.getElementById("tablaAlumnos");
let pagoProfesor = document.getElementById("pagoProfesor");
let listaAlumnosAlfabetica = document.getElementById("listaAlumnosAlfabetica");
let clasesDictadas
let idAlumno = 0;
let idCheckbox = 0;
let resultadoSueldo = 0;

class Alumno {
	constructor(idAlumno, nombreAlumno, apellidoAlumno, tipoDePase, clasesTomadas) {
		this.idAlumno = idAlumno;
		this.nombreAlumno = nombreAlumno;
		this.apellidoAlumno = apellidoAlumno;
		this.tipoDePase = tipoDePase;
		this.clasesTomadas = clasesTomadas;
	}
}

function crearAlumno() {
	clasesDictadas = document.getElementById("clasesDictadas").valueAsNumber;
	console.log(clasesDictadas, " clases dictadas en el mes");
	if (clasesDictadas > 0) {
		idAlumno++;
		let nombreAlumno = document.getElementById("nombreAlumno").value;
		let apellidoAlumno = document.getElementById("apellidoAlumno").value;
		let tipoDePase = Number(
			document.querySelector("input[name=tipoDePase]:checked").value
		);
		let alumno = new Alumno(
			idAlumno,
			nombreAlumno,
			apellidoAlumno,
			tipoDePase,
			clasesTomadas,
		);
		listaAlumnos.push(alumno);
		document.getElementById("nombreAlumno").value = "";
		document.getElementById("apellidoAlumno").value = "";
		mostrarAlumno();
		console.log(listaAlumnos);
	}else {alert("Por favor, ingrese un número válido en clases dictadas")};
}

function tomarAsistencia (id) {
	const buscado = listaAlumnos.find(alumno => alumno.idAlumno === id)
	console.log(buscado.nombreAlumno, " es el alumno buscado")
	const checkboxes = document.querySelectorAll(`input[type="checkbox"]`);
	for (let i = 0; i < checkboxes.length; i++) {
		if (checkboxes[i].checked) {
			buscado.clasesTomadas++;
		}
	}
	mostrarAlumno(); 
	console.log(buscado.nombreAlumno + " tomó " + buscado.clasesTomadas, "clases, y su id es: " + buscado.idAlumno); 
};

const mostrarAlumno = () => {
	tablaAlumnos.innerHTML = "";
	localStorage.setItem("alumnos", JSON.stringify(listaAlumnos));
	
	listaAlumnos.forEach((alumno, index) => {
		tablaAlumnos.innerHTML += `
			<div>
				<h4>Alumno ${index + 1}</h4>
				<span>${alumno.nombreAlumno} ${alumno.apellidoAlumno} </span>
				<button onclick="eliminarAlumno(${index})">Eliminar Alumno</button>
				<p>Selecciona las clases a las que asistió</p>			
			</div>`;
		for (let i = 0; i <clasesDictadas; i++) {
			idCheckbox++;
			const asistenciaCheckbox = document.createElement('input');
			asistenciaCheckbox.type = 'checkbox';
			asistenciaCheckbox.id = `asistencia-${idCheckbox}`;
			asistenciaCheckbox.value = 1;
			const etiquetaCheckbox = document.createElement('label');
			etiquetaCheckbox.textContent = `Clase ${i + 1}`;
			tablaAlumnos.appendChild(etiquetaCheckbox);
			etiquetaCheckbox.appendChild(asistenciaCheckbox);
		};
		tablaAlumnos.innerHTML += `
			<button onclick="tomarAsistencia(${alumno.idAlumno})">Pasar Asistencia</button>`
		
		if (alumno.clasesTomadas > 1) {
			tablaAlumnos.innerHTML += `
				<p>${alumno.nombreAlumno} asistió a ${alumno.clasesTomadas} clases</p>`;
		}else if(alumno.clasesTomadas == 1) {
				tablaAlumnos.innerHTML += `
					<p>${alumno.nombreAlumno} asistió a ${alumno.clasesTomadas} clase</p>`;
			} else {
				tablaAlumnos.innerHTML += `
					<p>${alumno.nombreAlumno} aún no asistió a clases</p>`;
			}
	});
};
	
const eliminarAlumno = (index) => {
	listaAlumnos.splice(index, 1);
	mostrarAlumno();
	console.log(listaAlumnos);
};
const calcularPago = () => {
	resultadoSueldo = 0;
	listaAlumnos.forEach((alum) => {
		switch(alum.tipoDePase) {
			case 5600:
				plataXalumno = (alum.tipoDePase / 8) * alum.clasesTomadas;
				break;
				case 3000:
					plataXalumno = (alum.tipoDePase / 4) * alum.clasesTomadas;
					break;
					default:
						plataXalumno = alum.tipoDePase * alum.clasesTomadas;
						break;
		}
		console.log(plataXalumno, " pesos por alumno");
		resultadoSueldo += plataXalumno;
	});
	console.log(resultadoSueldo, "total recaudado");
	mostrarSueldo();
}

const mostrarSueldo = () => {
	pagoProfesor.innerHTML = `
	<h2>Al profesor le corresponden $${resultadoSueldo} pesos</h2>
	`
}
const mostrarListaAlumnos = () => {
	const alumnosAlfabetica = JSON.parse(localStorage.getItem("alumnos"));
	alumnosAlfabetica.sort((a,b) => {
		if (a.nombreAlumno > b.nombreAlumno) {
			return 1;
		}
		if (a.nombreAlumno < b.nombreAlumno) {
			return -1;
		}
		return 0;
	});
	console.log(alumnosAlfabetica);
	listaAlumnosAlfabetica.innerHTML = "";
	listaAlumnosAlfabetica.innerHTML +=`
	<h5>Listado de Alumnos</h5>`;

	alumnosAlfabetica.forEach((alumno) => {
		
		listaAlumnosAlfabetica.innerHTML +=`
		
		<li style="">
		${alumno.nombreAlumno}
		</li>
		`;
	});	
}

btnCargarAlumno.addEventListener("click", crearAlumno);
btnCalcularPago.addEventListener("click", calcularPago);
btnListarAlfabetica.addEventListener("click", mostrarListaAlumnos);

// recorrer cada elemento del array listaAlumnos con el forEach
// tomar la propiedad tipoDePase y verificar si el valor es 800, 3000 o 5600
// si es 800 multiplicar por el valor de clasesTomadas y ubicarlo en la variable plataXalumno.
// si es 3000 dividir por 4 y multiplicar por el valor de clasesTomadas y ubicarlo en la variable plataXalumno.
// si es 5600 dividir por 8 y multiplicar por el valor de clasesTomadas y ubicarlo en la variable plataXalumno.
// definir una variable que va a contener la suma de la plataXalumno
