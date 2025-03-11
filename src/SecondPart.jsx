
import { useState } from 'react';

export default function SecondPart({ onComplete }) {
  const [respuestas, setRespuestas] = useState({});
  const [errors, setErrors] = useState({});

  const frases = [
    {
      id: 1,
      fraseA: "Irrespetar la propiedad",
      fraseB: "Sentir inquietud"
    },
    {
      id: 2,
      fraseA: "Ser irresponsable",
      fraseB: "Ser desconsiderado hacia cualquier persona"
    },
    {
      id: 3,
      fraseA: "Cae en contradicciones al pensar",
      fraseB: "Sentir intolerancia"
    },
    {
      id: 4,
      fraseA: "Ser violento",
      fraseB: "Actuar con cobardía"
    },
    {
      id: 5,
      fraseA: "Sentirse presumido",
      fraseB: "Generar divisiones y discordia entre los seres humanos"
    },
    {
      id: 6,
      fraseA: "Ser cruel",
      fraseB: "Sentir ira"
    },
    {
      id: 7,
      fraseA: "Pensar con confusión",
      fraseB: "Tener odio en el corazón"
    },
    {
      id: 8,
      fraseA: "Decir blasfemias",
      fraseB: "Ser escandaloso"
    },
    {
      id: 9,
      fraseA: "Crear desigualdades entre los seres humanos",
      fraseB: "Apasionarse por una idea"
    },
    {
      id: 10,
      fraseA: "Sentirse inconstante",
      fraseB: "Crear rivalidad hacia otros"
    },
    {
      id: 11,
      fraseA: "Pensamientos irracionales",
      fraseB: "Traicionar a un desconocido"
    },
    {
      id: 12,
      fraseA: "Ostentar las riquezas materiales",
      fraseB: "Sentirse infeliz"
    },
    {
      id: 13,
      fraseA: "Entorpecer la cooperación entre los seres humanos",
      fraseB: "La maldad"
    },
    {
      id: 14,
      fraseA: "Odiar a cualquier ser de la naturaleza",
      fraseB: "Hacerse distinciones entre las personas"
    },
    {
      id: 15,
      fraseA: "Sentirse intranquilo",
      fraseB: "Ser infiel"
    },
    {
      id: 16,
      fraseA: "Tener la mente dispersa",
      fraseB: "Mostrar apatía al pensar"
    },
    {
      id: 17,
      fraseA: "La injusticia",
      fraseB: "Sentirse angustiado"
    },
    {
      id: 18,
      fraseA: "Vengarse de los que odian a todo el mundo",
      fraseB: "Vengarse del que hace daño a un familiar"
    },
    {
      id: 19,
      fraseA: "Usar abusivamente el poder",
      fraseB: "Distraerse"
    },
    {
      id: 20,
      fraseA: "Ser desagradecido con los que ayudan",
      fraseB: "Ser egoísta con todos"
    },
    {
      id: 21,
      fraseA: "Cualquier forma de irrespeto",
      fraseB: "Odiar"
    }
  ];

  const opciones = [
    { valor: "3-0", textoA: "3", textoB: "0" },
    { valor: "2-1", textoA: "2", textoB: "1" },
    { valor: "1-2", textoA: "1", textoB: "2" },
    { valor: "0-3", textoA: "0", textoB: "3" }
  ];

  const handleRespuesta = (fraseId, opcion) => {
    setRespuestas({
      ...respuestas,
      [fraseId]: opcion
    });
    
    // Clear error for this question
    if (errors[fraseId]) {
      const newErrors = {...errors};
      delete newErrors[fraseId];
      setErrors(newErrors);
    }
  };

  const validarYEnviar = () => {
    // Check if all questions are answered
    const newErrors = {};
    frases.forEach(frase => {
      if (!respuestas[frase.id]) {
        newErrors[frase.id] = "Debe seleccionar una opción";
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Calculate results
    const resultados = {
      puntajeA: 0,
      puntajeB: 0,
    };

    Object.entries(respuestas).forEach(([fraseId, valor]) => {
      const [puntosA, puntosB] = valor.split("-").map(Number);
      resultados.puntajeA += puntosA;
      resultados.puntajeB += puntosB;
    });

    onComplete(resultados);
  };

  const esParteDosCompleta = () => {
    return Object.keys(respuestas).length === frases.length;
  };

  return (
    <div className="second-part">
      <h2>Segunda Parte del Test</h2>
      
      <div className="instrucciones">
        <h3>Instrucciones:</h3>
        <p>Por favor marque cero, uno, dos o tres puntos en las casillas para la frase más inaceptable, según su juicio.</p>
        <p>El puntaje más alto será para la frase que indique lo peor.</p>
        <p>Las únicas opciones de respuesta son: 3-0, 0-3, 2-1, 1-2</p>
        <p><strong>Siempre la suma de puntos de las dos casillas debe ser 3</strong></p>
      </div>
      
      {frases.map(frase => (
        <div key={frase.id} className="frase-item">
          <div className="frase-numero">{frase.id}.</div>
          <div className="frase-contenido">
            <div className="frase-texto frase-a">{frase.fraseA}</div>
            
            <div className="frase-opciones">
              {opciones.map(opcion => (
                <label 
                  key={opcion.valor} 
                  className={`opcion-segunda-parte ${respuestas[frase.id] === opcion.valor ? 'seleccionada' : ''}`}
                >
                  <input
                    type="radio"
                    name={`frase-${frase.id}`}
                    checked={respuestas[frase.id] === opcion.valor}
                    onChange={() => handleRespuesta(frase.id, opcion.valor)}
                  />
                  <div className="opcion-valores">
                    <span>{opcion.textoA}</span>
                    <span>{opcion.textoB}</span>
                  </div>
                </label>
              ))}
            </div>
            
            <div className="frase-texto frase-b">{frase.fraseB}</div>
          </div>
          {errors[frase.id] && <div className="error-mensaje">{errors[frase.id]}</div>}
        </div>
      ))}
      
      <button 
        className="btn-calcular" 
        onClick={validarYEnviar}
        disabled={!esParteDosCompleta()}
      >
        Enviar y ver resultados
      </button>
      
      {!esParteDosCompleta() && (
        <p className="aviso">Debe responder todas las frases para continuar.</p>
      )}
    </div>
  );
}
