import Link from 'next/link';
import { supabase } from '../lib/supabase';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    }
    checkUser();
    
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Area */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              NextBlog<span className="text-gray-800">Pro</span>
            </Link>
          </div>

          {/* Menu Area */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-gray-600 hover:text-blue-600 font-medium transition">
              Home
            </Link>
            
            {user ? (
              <>
                <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 font-medium transition">
                  Dashboard
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-semibold hover:bg-red-100 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link 
                href="/login" 
                className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-semibold shadow-md hover:bg-blue-700 hover:shadow-lg transition transform hover:-translate-y-0.5"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}