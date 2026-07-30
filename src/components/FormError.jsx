function FormError({ message }) {
  if (!message) return null;

  return (
    <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded p-3">
      <span className="text-base leading-none">⚠️</span>
      <span>{message}</span>
    </div>
  );
}

export default FormError;