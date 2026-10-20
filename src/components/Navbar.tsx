
import { Link, NavLink } from "react-router-dom";
import { ArrowRight, ShoppingCart } from "lucide-react";


export default function Navbar() {

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex shrink-0 items-center border-r border-white/10 px-4 py-5 text-[10px] font-bold tracking-wider transition sm:px-6 ${
      isActive
        ? "text-yellow-300"
        : "text-white hover:text-yellow-300"
    }`;

  return (
    <nav className="sticky top-0 z-40 bg-[#1d1c1d] text-white shadow-lg">
      <div className="flex items-center justify-between px-2 sm:px-6 lg:px-[6%]">
        <div className="flex min-w-0 flex-1 items-center overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <NavLink to="/" end className={linkClass}>
            HOME
          </NavLink>

          <NavLink to="/about" className={linkClass}>
            ABOUT
          </NavLink>
     
          <NavLink to="/products" className={linkClass}>
            PRODUCTS
          </NavLink>

          <NavLink to="/enquiry" className={linkClass}>
            ENQUIRY
          </NavLink>

          <NavLink to="/contact" className={linkClass}>
            CONTACT
          </NavLink>

        </div>

        <Link
          to="/cart"
          className="ml-2 hidden shrink-0 items-center gap-2 border border-yellow-400/40 px-3 py-3 text-xs font-bold text-yellow-300 transition hover:bg-yellow-400 hover:text-black sm:flex"
        >
          <ShoppingCart size={17} />
          MY CART
          <ArrowRight size={14} />
        </Link>
      </div>
    </nav>
  );
}
