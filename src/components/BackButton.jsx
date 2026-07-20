import { useNavigate } from "react-router-dom";

function BackButton({ fallback = "/" }) {
  const navigate = useNavigate();

  function handleBack() {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate(fallback);
    }
  }

  return (
    <button
      onClick={handleBack}
      className="flex items-center gap-1 text-sm text-gray-600 hover:text-black mb-4"
    >
      ← Back
    </button>
  );
}

export default BackButton;