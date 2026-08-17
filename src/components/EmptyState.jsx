function EmptyState({ icon: Icon, title, message, action }) {
  return (
    <div className="py-16 flex flex-col items-center text-center px-6">
      {Icon && (
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
          <Icon size={22} className="text-gray-400" />
        </div>
      )}
      <p className="text-gray-600 font-medium text-sm">{title}</p>
      {message && <p className="text-gray-400 text-xs mt-1">{message}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export default EmptyState;