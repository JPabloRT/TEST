import { useState, useRef } from 'react';
import './App.css';
import SecondPart from './SecondPart';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function App() {
  const [datosUsuario, setDatosUsuario] = useState({
    nombre: '',
    edad: '',
    sexo: '',
    estudios: '',
    ocupacion: '',
    empresa: ''
  });
  const [mostrarTest, setMostrarTest] = useState(false);
  const [respuestas, setRespuestas] = useState({});
  const [resultados, setResultados] = useState({ A: 0, B: 0 });
  const [valoresMorales, setValoresMorales] = useState({
    "Teórico": 0,
    "Económico": 0,
    "Estético": 0,
    "Social": 0,
    "Político": 0,
    "Religioso": 0
  });
  const [mostrarResultado, setMostrarResultado] = useState(false);
  const [mostrarSegundaParte, setMostrarSegundaParte] = useState(false);
  const [resultadosSegundaParte, setResultadosSegundaParte] = useState({ puntajeA: 0, puntajeB: 0 });
  const [errors, setErrors] = useState({});

  const preguntas = [
    {
      id: 1,
      alternativaA: "Muestro dedicación a las personas que amo",
      alternativaB: "Actúo con perseverancia"
    },
    {
      id: 2,
      alternativaA: "Soy tolerante",
      alternativaB: "Prefiero actuar con ética"
    },
    {
      id: 3,
      alternativaA: "Al pensar, utilizo mi intuición o \"sexto sentido\"",
      alternativaB: "Me siento una persona digna"
    },
    {
      id: 4,
      alternativaA: "Logro buena concentración mental",
      alternativaB: "Perdono todas las ofensas de cualquier persona"
    },
    {
      id: 5,
      alternativaA: "Normalmente razono mucho",
      alternativaB: "Me destaco por el liderazgo en mis acciones"
    },
    {
      id: 6,
      alternativaA: "Pienso con integridad",
      alternativaB: "Me coloco objetivos y metas en mi vida personal"
    },
    {
      id: 7,
      alternativaA: "Soy una persona de iniciativa",
      alternativaB: "En mi trabajo normalmente soy curioso"
    },
    {
      id: 8,
      alternativaA: "Doy amor",
      alternativaB: "Para pensar hago síntesis de las distintas ideas"
    },
    {
      id: 9,
      alternativaA: "Me siento en calma",
      alternativaB: "Pienso con veracidad"
    }
  ];

  const opciones = [
    { valor: "3-0", textoA: "3", textoB: "0" },
    { valor: "2-1", textoA: "2", textoB: "1" },
    { valor: "1-2", textoA: "1", textoB: "2" },
    { valor: "0-3", textoA: "0", textoB: "3" }
  ];

  const calcularPuntos = (opcion) => {
    switch(opcion) {
      case "3-0": return { A: 3, B: 0 };
      case "2-1": return { A: 2, B: 1 };
      case "1-2": return { A: 1, B: 2 };
      case "0-3": return { A: 0, B: 3 };
      default: return { A: 0, B: 0 };
    }
  };

  const handleRespuesta = (preguntaId, opcion) => {
    const puntos = calcularPuntos(opcion);
    setRespuestas({
      ...respuestas,
      [preguntaId]: {
        opcion,
        puntos
      }
    });

    // Limpiar error para esta pregunta
    if (errors[preguntaId]) {
      const newErrors = { ...errors };
      delete newErrors[preguntaId];
      setErrors(newErrors);
    }
  };

  const calcularResultados = () => {
    // Verificar si todas las preguntas tienen respuestas
    const nuevosErrores = {};
    preguntas.forEach(pregunta => {
      if (!respuestas[pregunta.id]) {
        nuevosErrores[pregunta.id] = "Debes seleccionar una opción para esta pregunta";
      }
    });

    if (Object.keys(nuevosErrores).length > 0) {
      setErrors(nuevosErrores);
      return;
    }

    let puntajeA = 0;
    let puntajeB = 0;

    Object.values(respuestas).forEach(respuesta => {
      puntajeA += respuesta.puntos.A || 0;
      puntajeB += respuesta.puntos.B || 0;
    });

    // Calcular valores morales basados en respuestas
    const nuevoValores = {
      "Teórico": Math.round((puntajeA / (preguntas.length * 3)) * 100),
      "Económico": Math.round((puntajeB / (preguntas.length * 3)) * 100),
      "Estético": Math.round(((puntajeA + puntajeB) / 2) / (preguntas.length * 3) * 100),
      "Social": Math.round((puntajeB / (preguntas.length * 3)) * 100),
      "Político": Math.round((puntajeA / (preguntas.length * 3)) * 100),
      "Religioso": Math.round(((puntajeA + puntajeB) / 2) / (preguntas.length * 3) * 100)
    };

    setValoresMorales(nuevoValores);
    setResultados({ A: puntajeA, B: puntajeB });
    setMostrarSegundaParte(true);
  };

  const reiniciarTest = () => {
    setRespuestas({});
    setResultados({ A: 0, B: 0 });
    setResultadosSegundaParte({ puntajeA: 0, puntajeB: 0 });
    setMostrarResultado(false);
    setMostrarSegundaParte(false);
    setMostrarTest(false);
    setErrors({});
  };

  const handleDatosUsuarioChange = (e) => {
    const { name, value } = e.target;
    setDatosUsuario({
      ...datosUsuario,
      [name]: value
    });
  };

  const iniciarTest = () => {
    setMostrarTest(true);
  };

  const handleSegundaParteComplete = (resultados) => {
    setResultadosSegundaParte(resultados);
    setMostrarResultado(true);
  };

  const generarPDF = () => {
    const resultadosElement = document.querySelector('.resultados');

    html2canvas(resultadosElement).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const width = pdf.internal.pageSize.getWidth();
      const height = pdf.internal.pageSize.getHeight();

      // Agregar logo al PDF con mejor posicionamiento
      const img = new Image();
      img.src = '/Logo.png';
      
      // Centrar logo y ajustar tamaño para mejor apariencia
      const logoWidth = 50;
      const logoHeight = 25;
      pdf.addImage(img, 'PNG', width/2 - logoWidth/2, 15, logoWidth, logoHeight);
      
      // Ajustar posición del título después del logo
      pdf.setFontSize(16);
      pdf.text('Resultados de la Evaluación', width/2, 50, { align: 'center' });

      // Añadir datos personales al PDF (ajustados después del logo)
      pdf.setFontSize(12);
      pdf.text(`Nombre: ${datosUsuario.nombre}`, 20, 65);
      pdf.text(`Edad: ${datosUsuario.edad}`, 20, 75);
      pdf.text(`Sexo: ${datosUsuario.sexo.charAt(0).toUpperCase() + datosUsuario.sexo.slice(1)}`, 20, 85);

      // Añadir resultados (ajustados después del logo)
      pdf.text('Resultados Primera Parte:', 20, 105);
      pdf.text(`Perfil A: ${resultados.A} pts`, 30, 115);
      pdf.text(`Perfil B: ${resultados.B} pts`, 30, 125);

      pdf.text('Resultados Segunda Parte:', 20, 145);
      pdf.text(`Puntaje A: ${resultadosSegundaParte.puntajeA} pts`, 30, 155);
      pdf.text(`Puntaje B: ${resultadosSegundaParte.puntajeB} pts`, 30, 165);

      // Fecha y logo se mantienen sin la interpretación y valores

      // Fecha de la evaluación
      const fecha = new Date().toLocaleDateString();
      // Añadir línea divisoria antes de la fecha
      pdf.setDrawColor(200, 200, 200);
      pdf.line(30, height - 30, width - 30, height - 30);
      
      // Fecha de evaluación con mejor formato
      pdf.text(`Fecha de evaluación: ${fecha}`, width/2, height - 15, { align: 'center' });

      pdf.save(`Evaluacion_${datosUsuario.nombre || 'usuario'}.pdf`);
    });
  };

  // Verificar si todas las preguntas tienen respuestas
  const esTestCompleto = () => {
    return Object.keys(respuestas).length === preguntas.length;
  };

  return (
    <main className="test-container">
      <img src="/Logo.png" alt="Normalitec" className="logo" />
      <h1>Test de Opinión</h1>

      {!mostrarTest ? (
        <div className="datos-usuario-form">
          <h2>Datos Personales</h2>
          <div className="form-group">
            <label htmlFor="nombre">Nombre:</label>
            <input 
              type="text" 
              id="nombre" 
              name="nombre" 
              value={datosUsuario.nombre} 
              onChange={handleDatosUsuarioChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="edad">Edad:</label>
            <input 
              type="number" 
              id="edad" 
              name="edad" 
              value={datosUsuario.edad} 
              onChange={handleDatosUsuarioChange}
              min="1"
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="sexo">Sexo:</label>
            <select id="sexo" name="sexo" value={datosUsuario.sexo} onChange={handleDatosUsuarioChange}>
              <option value="">Seleccionar</option>
              <option value="masculino">Masculino</option>
              <option value="femenino">Femenino</option>
            </select>
          </div>


          <button className="btn-iniciar" onClick={iniciarTest}>
            Comenzar Test
          </button>
        </div>
      ) : !mostrarSegundaParte && !mostrarResultado ? (
        <>
          <div className="instrucciones">
            <h3>Primera Parte</h3>
            <p>Por favor marque cero, uno, dos o tres puntos en las casillas DEL CENTRO, según la importancia que usted le da a cada frase en su vida personal.</p>
            <p>Las únicas opciones de respuesta son: 3-0, 0-3, 2-1, 1-2</p>
            <p><strong>Siempre la suma de puntos de las dos casillas debe ser 3</strong></p>
          </div>

          {preguntas.map(pregunta => (
            <div key={pregunta.id} className="frase-item">
              <div className="frase-numero">{pregunta.id}.</div>
              <div className="frase-contenido">
                <div className="frase-texto frase-a">{pregunta.alternativaA}</div>

                <div className="frase-opciones">
                  {opciones.map(opcion => (
                    <label 
                      key={opcion.valor} 
                      className={`opcion-segunda-parte ${respuestas[pregunta.id]?.opcion === opcion.valor ? 'seleccionada' : ''}`}
                    >
                      <input
                        type="radio"
                        name={`pregunta-${pregunta.id}`}
                        checked={respuestas[pregunta.id]?.opcion === opcion.valor}
                        onChange={() => handleRespuesta(pregunta.id, opcion.valor)}
                      />
                      <div className="opcion-valores">
                        <span>{opcion.textoA}</span>
                        <span>{opcion.textoB}</span>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="frase-texto frase-b">{pregunta.alternativaB}</div>
              </div>
              {errors[pregunta.id] && (
                <div className="error-mensaje">{errors[pregunta.id]}</div>
              )}
            </div>
          ))}

          <button 
            className="btn-calcular" 
            onClick={calcularResultados}
            disabled={!esTestCompleto()}
          >
            Evaluar respuestas
          </button>
          {!esTestCompleto() && (
            <p className="aviso">Debe responder todas las preguntas para evaluar.</p>
          )}
        </>
      ) : mostrarSegundaParte && !mostrarResultado ? (
        <SecondPart onComplete={handleSegundaParteComplete} />
      ) : (
        <div className="resultados">
          <h2>Resultados de la Evaluación</h2>

          <div className="datos-personales">
            <h3>Datos Personales</h3>
            <div className="datos-grid">
              <div className="dato-item">
                <strong>Nombre:</strong> {datosUsuario.nombre}
              </div>
              <div className="dato-item">
                <strong>Edad:</strong> {datosUsuario.edad}
              </div>
              <div className="dato-item">
                <strong>Sexo:</strong> {datosUsuario.sexo}
              </div>
            </div>
          </div>
          <div className="graficos">
            <h3>Primera Parte</h3>
            <div className="barra-resultado">
              <div className="etiqueta">Perfil A</div>
              <div className="barra">
                <div 
                  className="relleno relleno-a"
                  style={{ width: `${(resultados.A / (preguntas.length * 3)) * 100}%` }}
                ></div>
              </div>
              <div className="puntuacion">{resultados.A} pts</div>
            </div>

            <div className="barra-resultado">
              <div className="etiqueta">Perfil B</div>
              <div className="barra">
                <div 
                  className="relleno relleno-b"
                  style={{ width: `${(resultados.B / (preguntas.length * 3)) * 100}%` }}
                ></div>
              </div>
              <div className="puntuacion">{resultados.B} pts</div>
            </div>

            <h3>Segunda Parte</h3>
            <div className="barra-resultado">
              <div className="etiqueta">Puntaje A</div>
              <div className="barra">
                <div 
                  className="relleno relleno-a"
                  style={{ width: `${(resultadosSegundaParte.puntajeA / 63) * 100}%` }}
                ></div>
              </div>
              <div className="puntuacion">{resultadosSegundaParte.puntajeA} pts</div>
            </div>

            <div className="barra-resultado">
              <div className="etiqueta">Puntaje B</div>
              <div className="barra">
                <div 
                  className="relleno relleno-b"
                  style={{ width: `${(resultadosSegundaParte.puntajeB / 63) * 100}%` }}
                ></div>
              </div>
              <div className="puntuacion">{resultadosSegundaParte.puntajeB} pts</div>
            </div>
          </div>

          {/* Interpretación eliminada */}

          <div className="btn-container">
            <button className="btn-descargar" onClick={generarPDF}>
              Descargar Resultados PDF
            </button>
          </div>

          <button className="btn-reiniciar" onClick={reiniciarTest}>
            Volver a realizar el test
          </button>
        </div>
      )}
    </main>
  );
}