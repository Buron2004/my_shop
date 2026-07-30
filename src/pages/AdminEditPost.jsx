import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPostById, updatePost, uploadImage } from '../api/myBackendApi';
import { useAuth } from '../context/AuthContext';

function AdminEditPost() {
  const { id } = useParams();
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [currentImage, setCurrentImage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [featured, setFeatured] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadPost() {
      try {
        const data = await getPostById(id);
        setTitle(data.title);
        setExcerpt(data.excerpt);
        setContent(data.content);
        setCurrentImage(data.image || '');
        setFeatured(data.featured || false);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadPost();
  }, [id]);

  if (!isLoggedIn || user.role !== 'admin') {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600">You don't have permission to view this page.</p>
      </div>
    );
  }

  if (loading) return <p className="p-6">Loading post...</p>;

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      let imageUrl = currentImage;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      await updatePost(id, { title, excerpt, content, image: imageUrl, featured });
      navigate(`/blog/${id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Edit Post</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post title"
          className="border p-2 w-full"
        />

        <div>
          <label className="block text-sm text-gray-600 mb-1">Post image</label>
          {currentImage && !imagePreview && (
            <img src={currentImage} alt="Current" className="mb-2 h-32 object-contain" />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="border p-2 w-full text-sm"
          />
          {imagePreview && (
            <img src={imagePreview} alt="New preview" className="mt-2 h-32 object-contain" />
          )}
        </div>

        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Short excerpt (shown on cards)"
          rows={2}
          className="border p-2 w-full"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Full post content"
          rows={8}
          className="border p-2 w-full"
        />
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
          />
          Mark as Featured Post
        </label>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={saving}
          className="bg-black text-white w-full py-2 rounded disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}

export default AdminEditPost;