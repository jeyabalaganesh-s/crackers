import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Contact from "./pages/Contact";
import About from "./pages/About";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import ProtectedAdminRoute from "./components/admin/ProtectedAdminRoute";


function StoreLayout() {
  return (
    <>
      <Header />
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================================================= */}
        {/* ADMIN LOGIN */}
        {/* ================================================= */}

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />


        {/* ================================================= */}
        {/* PROTECTED ADMIN AREA */}
        {/* ================================================= */}

        <Route element={<ProtectedAdminRoute />}>

          <Route
            path="/admin"
            element={<AdminLayout />}
          >
            {/* /admin */}
            <Route
              index
              element={<AdminDashboard />}
            />

            {/* /admin/dashboard */}
            <Route
              path="dashboard"
              element={<AdminDashboard />}
            />

            {/* /admin/products */}
            <Route
              path="products"
              element={<AdminProducts />}
            />

            {/* /admin/orders */}
            <Route
              path="orders"
              element={<AdminOrders />}
            />
          </Route>

        </Route>


        {/* ================================================= */}
        {/* CUSTOMER WEBSITE */}
        {/* ================================================= */}

        <Route
          path="/*"
          element={<StoreLayout />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;