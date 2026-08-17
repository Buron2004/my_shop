import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-1 text-sm text-gray-600 hover:text-black mb-4"
    >
      <ArrowLeft size={14} /> Back
    </button>
  );
}

export default BackButton;