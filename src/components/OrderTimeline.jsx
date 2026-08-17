const STEPS = ['pending', 'processing', 'shipped', 'delivered'];

function OrderTimeline({ status }) {
  if (status === 'cancelled' || status === 'returned') {
    return (
      <div className="text-sm text-red-600 font-medium">
        This order was {status}.
      </div>
    );
  }

  const currentIndex = STEPS.indexOf(status);

  return (
    <div className="flex items-center">
      {STEPS.map((step, i) => (
        <div key={step} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                i <= currentIndex ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-400'
              }`}
            >
              {i <= currentIndex ? '✓' : i + 1}
            </div>
            <span className="text-xs text-gray-500 mt-1 capitalize">{step}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`flex-1 h-0.5 mx-2 ${i < currentIndex ? 'bg-green-600' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

export default OrderTimeline;