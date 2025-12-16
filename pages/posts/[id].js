import { supabase } from '../../lib/supabase';
import Navbar from '../../components/Navbar';
import Head from 'next/head';
import Link from 'next/link';

export default function PostDetail({ post }) {
  // Jika halaman dibuka tapi datanya tidak ketemu
  if (!post) return <div className="text-center py-20">Postingan tidak ditemukan.</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Head>
        <title>{post.title} - NextBlog</title>
      </Head>

      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-12">
        <article className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          
          {/* Gambar Utama (Hero Image) */}
          {post.image_url ? (
            <div className="w-full h-96 relative">
               <img 
                 src={post.image_url} 
                 alt={post.title}
                 className="w-full h-full object-cover"
               />
            </div>
          ) : (
             // Placeholder kalau tidak ada gambar
             <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400">
                No Image Available
             </div>
          )}

          {/* Konten Artikel */}
          <div className="p-8 md:p-12">
            {/* Tanggal */}
            <p className="text-gray-400 text-sm font-medium mb-4">
               {new Date(post.created_at).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
               })}
            </p>

            {/* Judul */}
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-8 leading-tight">
              {post.title}
            </h1>

            {/* Isi Artikel (Text) */}
            {/* whitespace-pre-wrap berguna agar Enter/Paragraf terbaca */}
            <div className="prose prose-lg text-gray-600 leading-relaxed whitespace-pre-wrap">
              {post.content}
            </div>

            <span className="text-xs text-blue-500 font-semibold mt-1">
              Oleh: {post.user_email ? post.user_email : 'Anonymous'}
            </span>
          </div>

        </article>

        {/* Tombol Kembali */}
        <div className="mt-8">
            <Link href="/" className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-2">
                ← Kembali ke Home
            </Link>
        </div>
      </main>
    </div>
  );
}

// Ini fungsi ajaib Next.js: Jalan di server sebelum halaman muncul
export async function getServerSideProps({ params }) {
  // Ambil ID dari URL (misal: posts/123 -> id = 123)
  const { id } = params;

  // Minta data ke Supabase cuma 1 biji (.single())
  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  // Kalau error atau post tidak ditemukan, return notFound (404)
  if (error || !post) {
    return {
      notFound: true,
    };
  }

  // Kirim data 'post' ke komponen di atas
  return {
    props: {
      post,
    },
  };
}