import { Link } from "react-router-dom";
import neuralImage from "../assets/neural-universe.svg";

function NeuralUniverseBanner() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      <img
        src={neuralImage}
        alt="Part of the Neural Universe"
        className="w-full h-80 md:h-full object-cover"
      />
      <div className="flex flex-col justify-center items-start px-10 py-16 md:px-20 text-left">
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Summer 2026</p>
        <h2 className="text-3xl font-bold text-gray-900 mb-4 leading-snug">
          Part of the Neural Universe
        </h2>
        <p className="text-sm text-gray-500 mb-6 max-w-xs leading-relaxed">
          We know how large objects will act, but things on a small scale.
        </p>
        <div className="flex gap-3">
          <Link
            to="/"
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded text-xs font-semibold tracking-wide transition"
          >
            BUY NOW
          </Link>
          <Link
            to="/"
            className="border border-green-600 text-green-600 hover:bg-green-50 px-5 py-2 rounded text-xs font-semibold tracking-wide transition"
          >
            READ MORE
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NeuralUniverseBanner;