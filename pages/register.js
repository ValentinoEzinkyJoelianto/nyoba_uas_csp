// pages/register.js
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import Link from 'next/link';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault(); // Supaya bisa tekan Enter
    
    // Validasi input kosong
    if (!email || !password) {
      alert("Email dan Password harus diisi!");
      return;
    }

    setLoading(true);
    
    // Logic Register Supabase
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        emailRedirectTo: window.location.origin, 
      }
    });

    if (error) {
      console.error("Register Error:", error);
      alert("Gagal Register: " + error.message);
    } else if (data.user && data.session) {
      alert("Register Berhasil! Langsung masuk...");
      router.push('/dashboard');
    } else {
      alert('Register Berhasil! Cek email kamu (inbox/spam) untuk verifikasi.');
      // Opsional: Lempar ke halaman login setelah sukses
      router.push('/login');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex justify-center items-center h-[calc(100vh-64px)]">
        <form onSubmit={handleRegister} className="bg-white p-8 rounded-lg shadow-md w-96">
          <h1 className="text-2xl mb-6 text-center font-bold text-gray-800">Buat Akun Baru</h1>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              className="w-full border p-2 rounded focus:ring-2 focus:ring-green-500 outline-none"
              type="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              className="w-full border p-2 rounded focus:ring-2 focus:ring-green-500 outline-none"
              type="password"
              placeholder="******"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            disabled={loading} 
            type="submit" 
            className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 transition font-semibold"
          >
            {loading ? 'Mendaftarkan...' : 'Daftar Sekarang'}
          </button>

          {/* Link ke Login */}
          <div className="mt-4 text-center text-sm">
            Sudah punya akun?{' '}
            <Link href="/login" className="text-blue-600 hover:underline">
              Login di sini
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}