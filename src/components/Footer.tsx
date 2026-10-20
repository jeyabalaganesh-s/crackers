
import { Link } from "react-router-dom";
import { ArrowRight, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer id="contact" className="bg-[#171619] font-sans text-white">
      <div className="grid grid-cols-1 gap-10 px-6 py-12 sm:grid-cols-2 sm:px-10 lg:grid-cols-4 lg:gap-8 lg:px-[7%] lg:py-16">
        {/* Brand */}
        <div>
          <Link to="/" className="inline-flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center bg-yellow-400 text-2xl text-stone-900">
              ♛
            </span>
            <span className="text-xl font-black tracking-wide">
              SHIVA <span className="text-yellow-400">FIRE WORKS</span>
            </span>
          </Link>

          <p className="mt-5 max-w-sm text-sm leading-7 text-stone-400">
            Explore the festive catalogue from Shiva Fire Works, Sivakasi.
            Contact our team for product information and enquiries.
          </p>

          <div className="mt-5 flex items-center gap-2 text-[10px] font-bold tracking-widest text-yellow-300">
            <MapPin size={16} />
            SIVAKASI, TAMIL NADU
          </div>
        </div>

        {/* Contact */}
        <div>
          <h2 className="mb-6 text-lg font-semibold">Contact Us</h2>

          <p className="mb-3 text-[10px] font-bold tracking-widest text-yellow-300">
            PHONE
          </p>

          <a
            href="tel:+918438042315"
            className="mb-3 flex items-center gap-3 text-sm text-stone-300 transition hover:text-yellow-300"
          >
            <Phone size={16} />
            +91 84380 42315
          </a>



          <p className="mb-3 text-[10px] font-bold tracking-widest text-yellow-300">
            EMAIL
          </p>

          <a
            href="mailto:nareshdigitalnd@gmail.com"
            className="flex items-center gap-2 break-all text-sm text-stone-300 transition hover:text-yellow-300"
          >
            <Mail size={16} />
            nareshdigitalnd@gmail.com
          </a>
        </div>

        {/* Quick links */}
        <div>
          <h2 className="mb-6 text-lg font-semibold">Quick Links</h2>

          <div className="flex flex-col items-start gap-4 text-sm text-stone-400">
            <Link to="/" className="transition hover:text-yellow-300">
              Home
            </Link>
            <Link
              to="/#about"
              className="transition hover:text-yellow-300"
            >
              About Shiva Fire Works
            </Link>
            <Link
              to="/products"
              className="transition hover:text-yellow-300"
            >
              Fire Crackers Catalogue
            </Link>
            <Link
              to="/#enquiry"
              className="transition hover:text-yellow-300"
            >
              Enquiry Process
            </Link>
            <a
              href="#contact"
              className="transition hover:text-yellow-300"
            >
              Contact Us
            </a>
          </div>
        </div>

        {/* Showroom */}
        <div>
          <h2 className="mb-6 text-lg font-semibold">Our Showroom</h2>

          <MapPin size={25} className="mb-4 text-yellow-400" />

          <p className="text-sm leading-7 text-stone-400">
            Shiva Fire Works
            <br />
            M. Meenakshipuram
            <br />
            Near Kaliswari College
            <br />
            Sivakasi, Tamil Nadu
          </p>

          <a
            href="https://www.google.com/maps/search/?api=1&query=Shiva+Fire+Works+Crackers+Sivakasi"
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 border border-yellow-400/40 px-4 py-3 text-[10px] font-bold tracking-wider text-yellow-300 transition hover:bg-yellow-400 hover:text-black"
          >
            OPEN IN MAPS
            <ArrowRight size={14} />
          </a>
        </div>
      </div>

      {/* Legal information */}
      <div className="flex items-start gap-3 border-y border-yellow-400/60 bg-[#201e21] px-6 py-6 sm:px-10 lg:px-[7%]">
        <ShieldCheck size={22} className="mt-1 shrink-0 text-yellow-400" />
        <p className="text-xs leading-6 text-stone-300">
          Fireworks are regulated products. Sales, storage, delivery and
          transportation are subject to applicable laws, licensing conditions,
          age restrictions and local rules. Submitting an enquiry does not
          confirm an order or guarantee delivery. Always follow the product
          safety instructions.
        </p>
      </div>

      {/* Copyright */}
<div className="flex flex-col gap-3 px-6 py-5 text-[10px] text-stone-500 sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-[7%]">
  <p>
    © {new Date().getFullYear()} Shiva Fire Works. All rights reserved.
  </p>

  <p className="tracking-widest">
    MADE FOR CELEBRATIONS · SIVAKASI
  </p>

  <p>
    Crafted by{" "}
    <a
      href="https://jeyabalaganesh.site"
      target="_blank"
      rel="noreferrer"
      className="font-semibold text-yellow-400 transition hover:text-yellow-300"
    >
      Jeyabalaganesh
    </a>
  </p>
</div>
    </footer>
  );
}
