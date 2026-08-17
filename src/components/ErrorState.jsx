import { AlertTriangle } from 'lucide-react';

function ErrorState({ message, onRetry }) {
  return (
    <div className="py-16 flex flex-col items-center text-center px-6">
      <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-3">
        <AlertTriangle size={22} className="text-red-500" />
      </div>
      <p className="text-gray-700 font-medium text-sm">Something went wrong</p>
      <p className="text-gray-400 text-xs mt-1">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 text-sm text-green-700 font-medium hover:underline"
        >
          Try again
        </button>
      )}
    </div>
  );
}

export default ErrorState;