import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

function CopyButton({ text, label }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition"
      aria-label={`Copy ${label || 'text'}`}
    >
      {copied ? (
        <>
          <Check size={12} className="text-green-600" />
          <span className="text-green-600">Copied</span>
        </>
      ) : (
        <Copy size={12} />
      )}
    </button>
  );
}

export default CopyButton;