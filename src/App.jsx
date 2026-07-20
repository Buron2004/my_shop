import Header from "./components/Header";
import ProductCard from "./components/ProductCard";
import Footer from "./components/Footer";
import Counter from "./components/Counter";
import TodoList from "./components/TodoList";
import ProductGrid from "./components/ProductGrid";
//import { CartProvider } from "./context/CartContext";
import './App.css';

function App() {
  return (
    //<CartProvider>
      <div className="min-h-screen flex flex-col bg-gray-50">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Featured Products */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Featured Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <ProductCard name="Sneakers" price={59.99} />
              <ProductCard name="Backpack" price={39.99} />
            </div>
          </section>

          {/* Interactive Examples */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Interactive Examples</h2>
            <div className="space-y-6">
              <Counter />
              <TodoList />
            </div>
          </section>

          {/* Fetched Products */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Fetched Products</h2>
            <ProductGrid />
          </section>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    //</CartProvider>
  );
}

export default App;
