import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPostById, deletePost } from '../api/myBackendApi';
import { useAuth } from '../context/AuthContext';
import BackButton from '../components/BackButton';

function BlogPost() {
  const { id } = useParams();
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await getPostById(id);
        setPost(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function handleDelete() {
    const confirmed = window.confirm(`Delete "${post.title}"? This can't be undone.`);
    if (!confirmed) return;

    setDeleting(true);
    try {
      await deletePost(id);
      navigate("/");
    } catch (err) {
      setError(err.message);
      setDeleting(false);
    }
  }

  if (loading) return <p className="p-6">Loading post...</p>;
  if (error) return <p className="p-6 text-red-600">Something went wrong: {error}</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <BackButton />
      {post.image && (
        <img src={post.image} alt={post.title} className="w-full h-64 object-cover rounded mb-6" />
      )}
      <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
      <p className="text-sm text-gray-400 mb-6">
        {new Date(post.createdAt).toLocaleDateString()}
      </p>
      <p className="text-gray-700 whitespace-pre-line leading-relaxed">{post.content}</p>

      {isLoggedIn && user.role === "admin" && (
        <div className="mt-6 pt-6 border-t flex gap-4">
          <Link to={`/admin/edit-post/${id}`} className="text-sm text-blue-600 hover:underline">
            Edit this post
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-sm text-red-600 hover:underline disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete this post"}
          </button>
        </div>
      )}
    </div>
  );
}

export default BlogPost;