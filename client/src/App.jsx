import { api } from './api/client';
import { useState, useEffect } from 'react';

function App() {
  const [status, setStatus] = useState('Chargement...');

  useEffect(() => {
    // Tester la connexion au backend
    fetch('http://localhost:5000/api/health')
      .then(res => res.json())
      .then(data => setStatus(`✅ Backend OK: ${data.status}`))
      .catch(() => setStatus('❌ Backend non trouvé - démarre le serveur!'));
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-blue-500">
      <div className="text-center text-white">
        <h1 className="text-4xl font-bold mb-4">🎨 Moodboard Atelier</h1>
        <p className="text-lg">{status}</p>
      </div>
    </div>
  );
}

export default App;