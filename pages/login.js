// pages/login.js
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import Link from 'next/link'; // Jangan lupa import Link

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        alert("Gagal Login: " + error.message);
    } else {
        // Sukses login
        router.push('/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex justify-center items-center h-[calc(100vh-64px)]">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md w-96">
          <h1 className="text-2xl mb-6 text-center font-bold text-gray-800">Login</h1>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              type="email"
              placeholder="Email Anda"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            disabled={loading} 
            type="submit" 
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition font-semibold"
          >
            {loading ? 'Memuat...' : 'Masuk'}
          </button>

          {/* Link ke Register */}
          <div className="mt-4 text-center text-sm">
            Belum punya akun?{' '}
            <Link href="/register" className="text-green-600 hover:underline">
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}