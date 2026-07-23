import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";

const bgColors = ["bg-emerald-700", "bg-indigo-700", "bg-rose-700", "bg-amber-700"];

function PromoCarousel({ products }) {
  const [index, setIndex] = useState(0);
  const { addToCart } = useContext(CartContext);

  const slides = products.slice(0, 4); // max 4, as requested

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) return null;

  function prev() {
    setIndex((i) => (i - 1 + slides.length) % slides.length);
  }

  function next() {
    setIndex((i) => (i + 1) % slides.length);
  }

  const product = slides[index];
  const bg = bgColors[index % bgColors.length];

  return (
    <div className={`relative ${bg} transition-colors duration-500 overflow-hidden`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center min-h-[380px]">
        <div className="w-full md:w-1/2 text-white py-14 z-10 text-center flex flex-col items-center">
          <p className="text-xs font-semibold tracking-widest mb-4 uppercase">Summer 2026</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            {product.title}
          </h2>
          <p className="text-white/80 mb-6 max-w-sm text-sm">
            {product.description || "A piece worth adding to your everyday rotation."}
          </p>
          <div className="flex flex-col items-center gap-3">
            <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
            <button
              onClick={() => addToCart(product)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded text-sm font-semibold tracking-wide transition"
            >
              ADD TO CART
            </button>
          </div>
        </div>
        <div className="hidden md:block absolute right-0 top-0 h-full w-1/2">
          <img
            src={product.image}
            alt={product.title}
            className="h-full w-full object-cover object-center"
          />
        </div>
      </div>

      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/20 hover:bg-black/35 text-white flex items-center justify-center z-20 transition"
        aria-label="Previous"
      >
        <span className="text-7xl font-light leading-none -translate-x-px">‹</span>
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/20 hover:bg-black/35 text-white flex items-center justify-center z-20 transition"
        aria-label="Next"
      >
        <span className="text-7xl font-light leading-none translate-x-px">›</span>
      </button>

      <div className="absolute bottom-6 left-6 flex gap-1.5 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-1 rounded-full transition-all ${
              i === index ? "w-10 bg-white" : "w-4 bg-white/40"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default PromoCarousel;