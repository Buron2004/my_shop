import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Replace these with your real local image imports:
import heroImage1 from "../assets/carousel-1.svg";
import heroImage2 from "../assets/carousel-2.jpg";
import heroImage3 from "../assets/carousel-3.jpg";

const slides = [
  {
    tag: "SUMMER 2026",
    title: "New Collection",
    subtitle: "We know how large objects will act, but things on a small scale.",
    buttonText: "Shop Now",
    link: "/",
    bg: "bg-cyan-500",
    image: heroImage1,
    imagePosition: "100% top",
  },
  {
    tag: "JUST IN",
    title: "Everyday Essentials",
    subtitle: "Quality pieces you'll reach for again and again.",
    buttonText: "Explore",
    link: "/",
    bg: "bg-indigo-500",
    image: heroImage2,
    imagePosition: "center top",
  },
  {
    tag: "LIMITED TIME",
    title: "Weekend Sale",
    subtitle: "Save on select items, while they last.",
    buttonText: "See Deals",
    link: "/",
    bg: "bg-rose-500",
    image: heroImage3,
    imagePosition: "center top",
  },
];

function HeroCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  function prev() {
    setIndex((i) => (i - 1 + slides.length) % slides.length);
  }

  function next() {
    setIndex((i) => (i + 1) % slides.length);
  }

  const slide = slides[index];

  return (
    <div className={`relative ${slide.bg} transition-colors duration-500 overflow-hidden`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center min-h-[460px]">
        <div className="w-full md:w-1/2 text-white py-16 z-10 text-center flex flex-col items-center">
          <p className="text-xs font-semibold tracking-widest mb-4 uppercase">{slide.tag}</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">{slide.title}</h1>
          <p className="text-white/90 mb-6 max-w-sm text-sm">{slide.subtitle}</p>
          <Link
            to={slide.link}
            className="inline-block bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded font-medium text-sm tracking-wide transition"
          >
            SHOP NOW
          </Link>
        </div>
        <div className="hidden md:block absolute right-0 top-0 h-full w-1/2">
          <img
            src={slide.image}
            alt={slide.title}
            className="h-full w-full object-cover object-top"
            style={{ objectPosition: slide.imagePosition }}
          />
        </div>
      </div>

      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-7xl z-20"
        aria-label="Previous slide"
      >
        ‹
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-7xl z-20"
        aria-label="Next slide"
      >
        ›
      </button>

      {/* Dash-style progress bar, bottom-left, matching reference */}
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

export default HeroCarousel;