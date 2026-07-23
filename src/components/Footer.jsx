import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-50 border-t mt-16">
      <div className="max-w-7xl mx-auto px-6 py-10 flex justify-between items-center border-b">
        <span className="text-xl font-bold text-gray-900">My Shop</span>
        <div className="flex items-center gap-4">
          <a href="#" aria-label="Facebook" className="text-gray-500 hover:text-green-600 transition">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12z" />
            </svg>
          </a>
          <a href="#" aria-label="Instagram" className="text-gray-500 hover:text-green-600 transition">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2c2.7 0 3.1 0 4.1.1 1 .1 1.7.2 2.3.5.6.2 1.1.6 1.6 1.1.5.5.8 1 1.1 1.6.2.6.4 1.3.5 2.3.1 1 .1 1.4.1 4.1s0 3.1-.1 4.1c-.1 1-.2 1.7-.5 2.3a4.6 4.6 0 0 1-1.1 1.6c-.5.5-1 .8-1.6 1.1-.6.2-1.3.4-2.3.5-1 .1-1.4.1-4.1.1s-3.1 0-4.1-.1c-1-.1-1.7-.2-2.3-.5a4.6 4.6 0 0 1-1.6-1.1 4.6 4.6 0 0 1-1.1-1.6c-.2-.6-.4-1.3-.5-2.3C2 15.1 2 14.7 2 12s0-3.1.1-4.1c.1-1 .2-1.7.5-2.3.2-.6.6-1.1 1.1-1.6.5-.5 1-.8 1.6-1.1.6-.2 1.3-.4 2.3-.5C8.9 2 9.3 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4zm5.2-8.4a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z" />
            </svg>
          </a>
          <a href="#" aria-label="Twitter" className="text-gray-500 hover:text-green-600 transition">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22 5.9c-.7.3-1.5.5-2.4.6a4.2 4.2 0 0 0 1.8-2.3c-.8.5-1.7.8-2.7 1a4.2 4.2 0 0 0-7.2 3.8A11.9 11.9 0 0 1 3 4.9a4.2 4.2 0 0 0 1.3 5.6c-.7 0-1.3-.2-1.9-.5v.1c0 2 1.4 3.7 3.3 4.1a4.2 4.2 0 0 1-1.9.1 4.2 4.2 0 0 0 3.9 2.9A8.5 8.5 0 0 1 1 18.6a12 12 0 0 0 6.5 1.9c7.8 0 12-6.4 12-12v-.5c.8-.6 1.5-1.4 2.1-2.2z" />
            </svg>
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-5 gap-8">
        <div>
          <h4 className="font-semibold text-gray-900 mb-4 text-sm">Company Info</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li><Link to="/support" className="hover:text-green-600 transition">About Us</Link></li>
            <li><a href="#" className="hover:text-green-600 transition">Careers</a></li>
            <li><a href="#" className="hover:text-green-600 transition">We are hiring</a></li>
            <li><Link to="/blog" className="hover:text-green-600 transition">Blog</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-4 text-sm">Legal</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li><a href="#" className="hover:text-green-600 transition">About Us</a></li>
            <li><a href="#" className="hover:text-green-600 transition">Careers</a></li>
            <li><a href="#" className="hover:text-green-600 transition">We are hiring</a></li>
            <li><a href="#" className="hover:text-green-600 transition">Blog</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-4 text-sm">Features</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li><a href="#" className="hover:text-green-600 transition">Business Marketing</a></li>
            <li><a href="#" className="hover:text-green-600 transition">User Analytic</a></li>
            <li><a href="#" className="hover:text-green-600 transition">Live Chat</a></li>
            <li><a href="#" className="hover:text-green-600 transition">Unlimited Support</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-4 text-sm">Resources</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li><a href="#" className="hover:text-green-600 transition">iOS &amp; Android</a></li>
            <li><a href="#" className="hover:text-green-600 transition">Watch a Demo</a></li>
            <li><a href="#" className="hover:text-green-600 transition">Customers</a></li>
            <li><a href="#" className="hover:text-green-600 transition">API</a></li>
          </ul>
        </div>

        <div className="col-span-2 md:col-span-1">
          <h4 className="font-semibold text-gray-900 mb-4 text-sm">Get In Touch</h4>
          <form className="flex">
            <input
              type="email"
              placeholder="Your Email"
              className="w-full border border-gray-300 rounded-l px-3 py-2 text-sm focus:outline-none"
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 rounded-r text-sm font-medium transition"
            >
              Subscribe
            </button>
          </form>
          <p className="text-xs text-gray-400 mt-2">Lorem ipsum dolor sit amet</p>
        </div>
      </div>

      <div className="border-t bg-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 text-xs text-gray-500">
          Made With Love By My Shop All Right Reserved
        </div>
      </div>
    </footer>
  );
}

export default Footer;