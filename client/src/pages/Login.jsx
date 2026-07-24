import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Simulation - on connectera plus tard
      localStorage.setItem('token', 'fake-token');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f0e8] p-4 relative overflow-hidden">
      
      {/* Texture de fond papier */}
      <div className="absolute inset-0 bg-[#f5f0e8] opacity-50 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
          opacity: 0.03
        }} />
      </div>

      {/* Punaises décoratives */}
      <div className="absolute top-8 left-8 w-4 h-4 rounded-full bg-[#d4836a] shadow-lg"></div>
      <div className="absolute top-8 right-8 w-4 h-4 rounded-full bg-[#b5c1b4] shadow-lg"></div>
      <div className="absolute bottom-8 left-8 w-4 h-4 rounded-full bg-[#c17a6b] shadow-lg"></div>
      <div className="absolute bottom-8 right-8 w-4 h-4 rounded-full bg-[#8b7a6b] shadow-lg"></div>

      <div className="relative z-10 w-full max-w-md">
        
        {/* Carte avec style papier collé */}
        <div className="bg-[#faf7f2] rounded-3xl shadow-[0_8px_32px_rgba(74,64,54,0.12)] p-8 border border-[#e8e0d6] relative">
          
          {/* Washi tape en haut */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#d4836a] opacity-80 rounded-sm rotate-1 shadow-sm"></div>
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-[#d4836a] opacity-60 rounded-sm -rotate-3 shadow-sm"></div>

          {/* Coin plié */}
          <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden">
            <div className="absolute top-0 right-0 w-0 h-0 border-t-[48px] border-r-[48px] border-t-transparent border-r-[#e8e0d6]"></div>
          </div>

          {/* Header avec style dessiné à la main */}
          <div className="text-center mb-8 mt-2">
            <div className="relative inline-block">
              <h1 className="text-4xl font-serif font-light text-[#4a4036] tracking-wide">
                🎨 Moodboard
              </h1>
              {/* Soulignement dessiné à la main */}
              <svg className="absolute -bottom-1 left-0 w-full h-2" viewBox="0 0 200 10">
                <path d="M0,5 Q25,0 50,5 Q75,10 100,5 Q125,0 150,5 Q175,10 200,5" 
                  stroke="#d4836a" strokeWidth="2" fill="none" opacity="0.5"/>
              </svg>
            </div>
            <p className="text-[#8b7a6b] mt-3 text-sm tracking-wide font-serif">
              ✦ entre dans ton atelier ✦
            </p>
          </div>

          {error && (
            <div className="bg-[#f5e8e0] border border-[#d4836a] text-[#4a4036] px-4 py-3 rounded-xl text-sm mb-4">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[#4a4036] text-sm font-serif tracking-wide mb-1.5">
                ✉️ email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[#f5f0e8] border border-[#e0d5c8] rounded-xl focus:ring-2 focus:ring-[#d4836a]/40 focus:border-[#d4836a] outline-none transition text-[#4a4036] placeholder:text-[#b5a89a]"
                placeholder="ton@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-[#4a4036] text-sm font-serif tracking-wide mb-1.5">
                🔑 mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#f5f0e8] border border-[#e0d5c8] rounded-xl focus:ring-2 focus:ring-[#d4836a]/40 focus:border-[#d4836a] outline-none transition text-[#4a4036] placeholder:text-[#b5a89a]"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#d4836a] text-white font-serif font-medium rounded-xl hover:bg-[#c17a6b] transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed text-sm tracking-wider"
            >
              {loading ? '✨ connexion...' : '✨ se connecter'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#8b7a6b] text-sm font-serif">
              pas encore de compte ?{' '}
              <Link to="/register" className="text-[#d4836a] hover:text-[#c17a6b] font-medium hover:underline decoration-[#d4836a]/30 underline-offset-4 transition">
                s'inscrire
              </Link>
            </p>
          </div>

          {/* Petit détail washi tape en bas */}
          <div className="absolute -bottom-2 left-1/4 w-12 h-3 bg-[#b5c1b4] opacity-60 rounded-sm rotate-2"></div>
          <div className="absolute -bottom-2 right-1/4 w-14 h-3 bg-[#c17a6b] opacity-50 rounded-sm -rotate-1"></div>
        </div>

        {/* Note de bas de page */}
        <p className="text-center text-[#8b7a6b] text-xs font-serif mt-6 opacity-60">
          ✦ atelier de création — prends ton temps ✦
        </p>
      </div>
    </div>
  );
}

export default Login;