/*import { useState, useEffect } from "react";

function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
      {products.map((product) => (
        <div key={product.id} style={{ border: "1px solid #ccc", padding: "10px" }}>
          <h3>{product.title}</h3>
          <p>${product.price}</p>
          <img src={product.image} alt={product.title} style={{ width: "100px" }} />
        </div>
      ))}
    </div>
  );
}

export default ProductGrid;*/
