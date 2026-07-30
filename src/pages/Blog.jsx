import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getPosts } from "../api/myBackendApi";

function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadPosts() {
      try {
        const data = await getPosts();
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadPosts();
  }, []);

  if (loading) return <p className="p-6">Loading posts...</p>;
  if (error) return <p className="p-6 text-red-600">Something went wrong: {error}</p>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="text-center mb-10">
        <p className="text-sm text-gray-400 uppercase tracking-wide mb-1">Practice Advice</p>
        <h1 className="text-3xl font-bold text-gray-900">Our Blog</h1>
      </div>

      {posts.length === 0 ? (
        <p className="text-gray-500 py-12 text-center">No posts published yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post._id}
              to={`/blog/${post._id}`}
              className="block border rounded-lg overflow-hidden hover:shadow-lg transition"
            >
              {post.image && (
                <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
              )}
              <div className="p-4">
                <p className="text-xs text-gray-400 mb-1">
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
                <h3 className="font-semibold mb-2">{post.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-3">{post.excerpt}</p>
                <span className="text-sm text-green-700 font-medium">Learn More →</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Blog;