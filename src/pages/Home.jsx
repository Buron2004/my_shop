import HeroCarousel from "../components/HeroCarousel";
import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { getMyProducts, getPosts } from "../api/myBackendApi";
import EditorsPick from "../components/EditorsPick";
import PromoCarousel from "../components/PromoCarousel";
import NeuralUniverseBanner from "../components/NeuralUniverseBanner";

const CATEGORIES = ["All", "Men", "Women", "Kids", "Accessories"];

function Home() {
  const [products, setProducts] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get("search") || "";
  const activeCategory = searchParams.get("category") || "All";
  const featuredProducts = products.filter((p) => p.featured);

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getMyProducts();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  useEffect(() => {
    async function loadPosts() {
      try {
        const data = await getPosts();
        const featuredPosts = data.filter((p) => p.featured);
        setPosts(featuredPosts.slice(0, 3));
      } catch (err) {
        console.error("Failed to load posts:", err.message);
      }
    }
    loadPosts();
  }, []);

  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg border overflow-hidden">
            <div className="aspect-square bg-gray-100 animate-pulse" />
            <div className="p-4 space-y-2">
              <div className="h-3 bg-gray-200 rounded w-1/3 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  function handleCategoryClick(cat) {
    const params = {};
    if (searchTerm) params.search = searchTerm;
    if (cat !== "All") params.category = cat;
    setSearchParams(params);
  }

  let filteredProducts = products;
  if (searchTerm) {
    filteredProducts = filteredProducts.filter((p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  if (activeCategory !== "All") {
    filteredProducts = filteredProducts.filter((p) => p.category === activeCategory);
  }

  return (
    <div>
      {!searchTerm && <HeroCarousel />}

      {!searchTerm && <EditorsPick />}

      {!searchTerm && (
        <div className="max-w-7xl mx-auto px-6 flex justify-center gap-2 flex-wrap pt-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${activeCategory === cat
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {!searchTerm && activeCategory === "All" && featuredProducts.length > 0 && (
        <div className="mb-12 mt-8">
          <div className="text-center mb-8">
            <p className="text-sm text-gray-400 uppercase tracking-wide mb-1">Featured Products</p>
            <h2 className="text-2xl font-bold text-gray-900">BESTSELLER PRODUCTS</h2>
            <p className="text-sm text-gray-400 mt-1">Problems trying to resolve the conflict between</p>
          </div>
          <div className="grid grid-cols-2 px-12 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-12">
        {searchTerm && (
          <p className="text-gray-600 mb-6">
            {filteredProducts.length} result{filteredProducts.length !== 1 && "s"} for
            "<span className="font-medium text-gray-900">{searchTerm}</span>"
          </p>
        )}

        {!searchTerm && featuredProducts.length > 0 && (
          <>
            <PromoCarousel products={featuredProducts} />
            <NeuralUniverseBanner />
          </>
        )}

        {filteredProducts.length === 0 ? (
          <EmptyState title="No products found" message="Try a different search or category" />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>

      {!searchTerm && posts.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 py-12 border-t">
          <div className="text-center mb-8">
            <p className="text-sm text-gray-400 uppercase tracking-wide mb-1">Practice Advice</p>
            <h2 className="text-2xl font-bold text-gray-900">Featured Posts</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link
                key={post._id}
                to={`/blog/${post._id}`}
                className="block border rounded-lg overflow-hidden hover:shadow-lg transition"
              >
                {post.image && (
                  <img src={post.image} alt={post.title} className="w-full h-40 object-cover" />
                )}
                <div className="p-4">
                  <h3 className="font-semibold mb-2">{post.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-3">{post.excerpt}</p>
                  <span className="text-sm text-green-700 font-medium">Learn More →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;