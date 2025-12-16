import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import Link from 'next/link';

export default function Home({ posts }) {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200 py-16 px-4 text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Welcome to <span className="text-blue-600">NextBlog</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
          Temukan artikel menarik, tutorial koding, dan wawasan teknologi terbaru di sini.
        </p>
      </div>

      {/* Blog Grid */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(post => (
            <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
              
              {/* Image Section */}
              <div className="h-48 bg-gray-200 relative overflow-hidden">
                {post.image_url ? (
                  <img 
                    src={post.image_url} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-3 line-clamp-1 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h2>
                <p className="text-gray-500 mb-4 line-clamp-3 text-sm leading-relaxed">
                  {post.content}
                </p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xs text-gray-400 font-medium">
                    {new Date(post.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                  <Link href={`/posts/${post.id}`} className="text-blue-600 text-sm font-semibold hover:underline">
                    Baca Selengkapnya &rarr;
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps() {
  let { data: posts } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  return {
    props: {
      posts: posts || [],
    },
  };
}