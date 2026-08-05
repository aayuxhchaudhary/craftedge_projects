import { useState } from 'react';
import axios from 'axios';

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const endpoint = isLogin ? '/auth/login' : '/auth/register';
    const payload = isLogin
      ? { email: formData.email, password: formData.password }
      : { name: formData.name, email: formData.email, password: formData.password };

    try {
      const response = await axios.post(`http://localhost:8090${endpoint}`, payload);
      if (typeof response.data === 'string') {
        setMessage(response.data);
      } else {
        setMessage('Registration Successful');
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Connection failed. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 font-sans selection:bg-white selection:text-black">
      <div className="w-full max-w-sm bg-black border border-zinc-800 rounded-none p-8 shadow-2xl">
        <div className="mb-8 text-left">
          <h2 className="text-2xl font-bold tracking-tight text-white mb-1 uppercase">
            {isLogin ? 'Sign In' : 'Register'}
          </h2>
          <p className="text-xs text-zinc-500 tracking-wide uppercase">
            {isLogin ? 'Enter credentials' : 'Create an account'}
          </p>
        </div>

        {message && (
          <div className="mb-6 p-3 text-xs border border-zinc-700 bg-zinc-900 text-zinc-200 uppercase tracking-wide">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-zinc-400 mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-black border border-zinc-800 rounded-none text-sm text-white focus:outline-none focus:border-white transition-colors"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-zinc-400 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2.5 bg-black border border-zinc-800 rounded-none text-sm text-white focus:outline-none focus:border-white transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-zinc-400 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2.5 bg-black border border-zinc-800 rounded-none text-sm text-white focus:outline-none focus:border-white transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-white hover:bg-zinc-200 text-black text-xs font-bold uppercase tracking-widest transition-colors disabled:opacity-50 mt-4"
          >
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Register'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-zinc-900 text-xs text-zinc-500 uppercase tracking-wider flex justify-between items-center">
          <span>{isLogin ? 'Need an account?' : 'Have an account?'}</span>
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage('');
            }}
            className="text-white hover:underline font-bold"
          >
            {isLogin ? 'Register' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
}
