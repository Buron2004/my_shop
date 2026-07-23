import { Link } from "react-router-dom";
import menImage from "../assets/men category.svg";
import womenImage from "../assets/women category.svg";
import accessoriesImage from "../assets/accessory catergory.svg";
import kidsImage from "../assets/kids category.svg";

function EditorsPick() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Editor's Pick</h2>
        <p className="text-sm text-gray-400">Shop our most-loved categories</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4 md:h-[520px]">
        {/* Men — tall, spans both rows */}
        <Link
          to="/?category=Men"
          className="relative rounded overflow-hidden group md:row-span-2 h-64 md:h-auto"
        >
          <img
            src={menImage}
            alt="Men"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <span className="absolute bottom-4 left-4 bg-white px-4 py-2 text-sm font-semibold tracking-wide uppercase">
            Men
          </span>
        </Link>

        {/* Women — tall, spans both rows */}
        <Link
          to="/?category=Women"
          className="relative rounded overflow-hidden group md:row-span-2 h-64 md:h-auto"
        >
          <img
            src={womenImage}
            alt="Women"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <span className="absolute bottom-4 left-4 bg-white px-4 py-2 text-sm font-semibold tracking-wide uppercase">
            Women
          </span>
        </Link>

        {/* Accessories — top-right */}
        <Link
          to="/?category=Accessories"
          className="relative rounded overflow-hidden group h-32 md:h-auto"
        >
          <img
            src={accessoriesImage}
            alt="Accessories"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <span className="absolute bottom-4 left-4 bg-white px-4 py-2 text-sm font-semibold tracking-wide uppercase">
            Accessories
          </span>
        </Link>

        {/* Kids — bottom-right */}
        <Link
          to="/?category=Kids"
          className="relative rounded overflow-hidden group h-32 md:h-auto"
        >
          <img
            src={kidsImage}
            alt="Kids"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <span className="absolute bottom-4 left-4 bg-white px-4 py-2 text-sm font-semibold tracking-wide uppercase">
            Kids
          </span>
        </Link>
      </div>
    </div>
  );
}

export default EditorsPick;