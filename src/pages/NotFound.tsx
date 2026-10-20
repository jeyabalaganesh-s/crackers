
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Home,
  Search,
  Sparkles,
} from "lucide-react";
import { useEffect } from "react";


export default function NotFound() {

    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    
  return (
    <>

      <main className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-[#fffaf2] px-5 py-16">
        {/* Decorative background */}
        <div className="pointer-events-none absolute -left-24 top-10 h-64 w-64 rounded-full border-[35px] border-[#4a1018]/5" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full border-[40px] border-[#f8c54d]/20" />

        <div className="relative mx-auto w-full max-w-2xl text-center">
          {/* Illustration */}
          <div className="relative mx-auto mb-8 flex h-44 w-44 items-center justify-center rounded-full bg-[#4a1018] shadow-xl shadow-[#4a1018]/20">
            <span className="text-7xl" role="img" aria-label="Fireworks">
              🎆
            </span>

            <span className="absolute -right-2 top-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#f8c54d] text-[#4a1018]">
              <Sparkles size={25} />
            </span>

            <span className="absolute -bottom-2 -left-3 flex h-11 w-11 items-center justify-center rounded-full border-4 border-[#fffaf2] bg-white text-[#4a1018]">
              <Search size={20} />
            </span>
          </div>

          <p className="text-sm font-extrabold uppercase tracking-[0.3em] text-[#a36d1c]">
            Raja Agencies · Sivakasi
          </p>

          <h1 className="mt-5 text-7xl font-black tracking-tight text-[#4a1018] sm:text-9xl">
            404
          </h1>

          <h2 className="mt-3 text-2xl font-black sm:text-3xl">
            Oops! This page has fizzled out.
          </h2>

          <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-gray-600">
            Looks like this page couldn't be found. It may have moved, or the
            link might be incorrect. Let's get you back to the celebration!
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#4a1018] px-6 py-4 font-bold text-white transition hover:bg-[#641722]"
            >
              <Home size={18} />
              Back to Home
            </Link>

            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#e7d9c7] bg-white px-6 py-4 font-bold text-[#4a1018] transition hover:border-[#4a1018]"
            >
              Explore Products
              <ArrowRight size={18} />
            </Link>
          </div>

          <Link
            to="/"
            className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#4a1018]"
          >
            <ArrowLeft size={15} />
            Return to the previous experience
          </Link>
        </div>
      </main>

    </>
  );
}
