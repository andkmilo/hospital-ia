import React, { useState } from 'react';
import './App.css';

// --- COMPONENTE 1: Header (Simplicidad y Marca) ---
const Header = () => (
  <header style={{ textAlign: 'center', padding: '20px', backgroundColor: '#2c3e50', color: 'white' }}>
    <h1>🏥 Hospital IA Lab</h1>
    <p>Agente Inteligente de Análisis Médico</p>
  </header>
);

// --- COMPONENTE 2: Analizador (La Magia) ---
const OrderAnalyzer = ({ apiUrl }) => {
  const [nombre, setNombre] = useState('');
  const [imagen, setImagen] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);

const handleFileChange = (e) => {
    // 1. Validar que exista el archivo
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        // Obtenemos el base64 limpio
        setImagen(reader.result.split(',')[1]);
      };
      
      // 2. Leemos el archivo real
      reader.readAsDataURL(file);
    } else {
      console.log("No se seleccionó ningún archivo o el evento es inválido");
    }
  };

  const enviarAAWS = async () => {
    setCargando(true);
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nombre, image_data: imagen })
      });
      const data = await response.json();
      setResultado(data);
    } catch (e) {
      alert("Error en la conexión con AWS");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="analyzer-card" style={{ padding: '20px', maxWidth: '500px', margin: 'auto' }}>
      <input 
        type="text" 
        placeholder="Nombre del Paciente" 
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        style={{ width: '100%', marginBottom: '10px' }}
      />
      <input type="file" onChange={handleFileChange} style={{ marginBottom: '20px' }} />
      
      <button 
        onClick={enviarAAWS} 
        disabled={cargando || !imagen}
        style={{ width: '100%', padding: '10px', backgroundColor: '#3498db', color: 'white', border: 'none' }}
      >
        {cargando ? "Analizando..." : "Procesar con IA"}
      </button>

      {resultado && (
        <div style={{ marginTop: '20px', background: '#ecf0f1', padding: '15px', borderRadius: '8px' }}>
          <h4>Resultado del Análisis:</h4>
          <p>{resultado.analisis}</p>
          <audio controls src={resultado.audio_url} style={{ width: '100%' }} autoPlay />
        </div>
      )}
    </div>
  );
};

// --- COMPONENTE PRINCIPAL (App) ---
function App() {
  // AQUÍ PEGAS LA URL DE TU SAM DEPLOY
  const API_URL = "https://4by9yh26ge.execute-api.us-east-1.amazonaws.com/Prod/analizar";

  return (
    <div className="App">
      <Header />
      <main style={{ marginTop: '30px' }}>
        <OrderAnalyzer apiUrl={API_URL} />
      </main>
    </div>
  );
}

export default App;
