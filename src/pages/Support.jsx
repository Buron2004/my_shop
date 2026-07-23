import { useState } from "react";

function Support() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    // No backend endpoint yet — just acknowledges the submission for now.
    // Could be wired to a real email service or support-ticket API later.
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="max-w-md mx-auto p-6 text-center">
        <h2 className="text-xl font-bold mb-2">Message sent 🎉</h2>
        <p className="text-gray-600">We'll get back to you as soon as we can.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-xl font-bold mb-2">Contact Support</h2>
      <p className="text-gray-600 mb-6">
        Have a question about an order or product? Send us a message.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          required
          placeholder="Your name"
          className="border p-2 w-full"
        />
        <input
          required
          type="email"
          placeholder="Your email"
          className="border p-2 w-full"
        />
        <textarea
          required
          placeholder="How can we help?"
          rows={4}
          className="border p-2 w-full"
        />
        <button
          type="submit"
          className="bg-black text-white w-full py-2 rounded"
        >
          Send Message
        </button>
      </form>

      <div className="mt-6 pt-6 border-t text-sm text-gray-500">
        <p>Or reach us directly:</p>
        <p>support@myshop.com</p>
      </div>
    </div>
  );
}

export default Support;