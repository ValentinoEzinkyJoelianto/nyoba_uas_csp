import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchMyPosts = async (userId) => {
    // Only fetch posts by this user (RLS will also enforce this)
    let { data } = await supabase.from('posts').select('*').eq('user_id', userId);
    setPosts(data);
  };

  // Protect Route
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) router.push('/login');
      else fetchMyPosts(session.user.id);
    };
    getSession();
  }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    let imageUrl = null;

    // 1. Upload Image (Session 14)
    if (image) {
      const fileExt = image.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('post-images')
        .upload(fileName, image);

      if (uploadError) {
        alert('Upload Error: ' + uploadError.message);
        setLoading(false);
        return;
      }

      // Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('post-images')
        .getPublicUrl(fileName);
      imageUrl = publicUrl;
    }

    // 2. Insert to Database (Session 12)
    const { error } = await supabase
      .from('posts')
      .insert([{ title, content, user_id: user.id, image_url: imageUrl, user_email: user.email }]);

    if (error) alert(error.message);
    else {
      alert('Success!');
      setTitle(''); setContent(''); setImage(null);
      fetchMyPosts(user.id);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if(!confirm("Are you sure?")) return;
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (!error) setPosts(posts.filter(p => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">User Dashboard</h1>
        
        {/* Form Create */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">Create New Post</h2>
          <form onSubmit={handleCreatePost} className="space-y-4">
            <input 
              type="text" placeholder="Title" required
              className="w-full border p-2 rounded"
              value={title} onChange={e => setTitle(e.target.value)}
            />
            <textarea 
              placeholder="Content" required rows="4"
              className="w-full border p-2 rounded"
              value={content} onChange={e => setContent(e.target.value)}
            />
            <div className="flex items-center justify-between">        
                <input 
                  id="fileInput"
                  type="file" 
                  accept="image/*"
                  className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  onChange={e => setImage(e.target.files[0])}
                />
                <button disabled={loading} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition">
                  {loading ? 'Posting...' : 'Publish Post'}
                </button>
            </div>
          </form>
        </div>

        {/* List My Posts */}
        <h2 className="text-xl font-semibold mb-4">My Posts</h2>
        <div className="grid gap-4">
          {posts.map(post => (
            <div key={post.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
              <div>
                <h3 className="font-bold">{post.title}</h3>
                <p className="text-gray-500 text-sm">{new Date(post.created_at).toLocaleDateString()}</p>
              </div>
              <button onClick={() => handleDelete(post.id)} className="text-red-500 hover:text-red-700">Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}