
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Clock3,
  Flame,
  Package,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
  Phone,

} from "lucide-react";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const heroImages = [
  {
    src: "/shiva-fireworks-banner.jpeg",
    alt: "Shiva Fire Works - Sivakasi",
  },
  {
    src: "/shiva-fireworks-banner-2.jpeg",
    alt: "Shiva Fire Works - Festive Fireworks Collection",
  },
];


const categories = [
  {
    name: "Sparklers",
    tamil: "கம்பி மத்தாப்பு",
    description: "Bright moments for everyone",
    icon: "✨",
    style: "from-amber-300 to-yellow-100",
    accent: "text-amber-800",
    count: "Explore sparklers",
  },
  {
    name: "Flower Pots",
    tamil: "பூந்தொட்டி",
    description: "Beautiful fountains of light",
    icon: "🌋",
    style: "from-orange-200 to-rose-100",
    accent: "text-red-800",
    count: "Explore flower pots",
  },
  {
    name: "Rockets",
    tamil: "ராகெட்டுகள்",
    description: "Bring excitement to the sky",
    icon: "🚀",
    style: "from-violet-200 to-indigo-100",
    accent: "text-indigo-800",
    count: "Explore rockets",
  },
  {
    name: "Gift Boxes",
    tamil: "கிப்ட் பாக்ஸ்",
    description: "Festive collections for families",
    icon: "🎁",
    style: "from-red-200 to-orange-100",
    accent: "text-red-800",
    count: "Explore gift boxes",
  },
];

const featuredProducts = [
  {
    name: "Color Sparklers",
    tamil: "கலர் மத்தாப்பு",
    size: "10 pieces / pack",
    price: "Ask for price",
    icon: "✨",
    badge: "POPULAR",
    style: "from-amber-100 to-yellow-50",
  },
  {
    name: "Flower Pot Special",
    tamil: "ஸ்பெஷல் பூந்தொட்டி",
    size: "Pack details on enquiry",
    price: "Ask for price",
    icon: "🌋",
    badge: "FESTIVE PICK",
    style: "from-rose-100 to-orange-50",
  },
  {
    name: "Sky Rockets",
    tamil: "ஸ்கை ராக்கெட்ஸ்",
    size: "Pack details on enquiry",
    price: "Ask for price",
    icon: "🚀",
    badge: "FESTIVE FAVOURITE",
    style: "from-indigo-100 to-violet-50",
  },
  {
    name: "Family Gift Box",
    tamil: "குடும்ப கிப்ட் பாக்ஸ்",
    size: "Multiple varieties",
    price: "Ask for price",
    icon: "🎁",
    badge: "GIFT COLLECTION",
    style: "from-red-100 to-amber-50",
  },
];

const benefits = [
  {
    icon: BadgeCheck,
    title: "Quality-Focused Selection",
    description: "Explore products from our catalogue.",
  },
  {
    icon: Package,
    title: "Convenient Ordering",
    description: "Send your product enquiry online.",
  },
  {
    icon: Clock3,
    title: "Personal Confirmation",
    description: "Our team contacts you to confirm details.",
  },
];

export default function Home() {

  const [currentSlide, setCurrentSlide] = useState(0);

   // Automatically change images every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((current) => (current + 1) % heroImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const previousSlide = () => {
    setCurrentSlide(
      (current) => (current - 1 + heroImages.length) % heroImages.length
    );
  };

  const nextSlide = () => {
    setCurrentSlide((current) => (current + 1) % heroImages.length);
  };
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    
  return (
    <div className="min-h-screen overflow-hidden bg-[#fffdf8] font-sans text-stone-900">

      <main>

           {/* HERO CAROUSEL */}
      <section className="group relative w-full overflow-hidden bg-red-700">
        {/* Images */}
        {heroImages.map((image, index) => (
          <img
            key={image.src}
            src={image.src}
            alt={image.alt}
            fetchPriority={index === 0 ? "high" : "auto"}
            className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-700 ${
              currentSlide === index
                ? "relative opacity-100"
                : "opacity-0"
            }`}
          />
        ))}

        {/* Previous button */}
        <button
          type="button"
          onClick={previousSlide}
          aria-label="Previous banner"
          className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white opacity-100 transition hover:bg-black/75 sm:left-5 sm:p-3"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Next button */}
        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next banner"
          className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white opacity-100 transition hover:bg-black/75 sm:right-5 sm:p-3"
        >
          <ChevronRight size={24} />
        </button>

        {/* Slide indicators */}
        <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-2 sm:bottom-5">
          {heroImages.map((image, index) => (
            <button
              key={image.src}
              type="button"
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to banner ${index + 1}`}
              aria-current={currentSlide === index ? "true" : undefined}
              className={`h-2.5 rounded-full transition-all ${
                currentSlide === index
                  ? "w-8 bg-white"
                  : "w-2.5 bg-white/60 hover:bg-white"
              }`}
            />
          ))}
        </div>
      </section>
        {/* HERO */}
        <section className="relative isolate overflow-hidden bg-[#300d19] text-white">
    
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_75%_45%,rgba(181,75,45,0.45),transparent_42%),linear-gradient(110deg,#300d19,#45121f_55%,#1d111c)]" />

          <div className="absolute inset-0 -z-10 opacity-20 [background-image:radial-gradient(#f7b843_1px,transparent_1px)] [background-size:24px_24px]" />

          <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-12 lg:py-24">
            <div>
              <div className="inline-flex items-center gap-2 border border-amber-300/30 bg-white/5 px-3 py-2 text-[10px] font-bold tracking-[2px] text-amber-200 sm:text-xs">
                <Sparkles size={15} />
                CELEBRATE EVERY MOMENT
              </div>

              <h1 className="mt-7 max-w-2xl text-5xl font-black leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
                LIGHT UP
                <br />
                YOUR{" "}
                <span className="text-yellow-300">FESTIVE</span>
                <br />
                MOMENTS.
              </h1>

              <p className="mt-5 text-sm font-semibold text-amber-200 sm:text-base">
                உங்கள் கொண்டாட்டம், எங்கள் மகிழ்ச்சி!
              </p>

              <p className="mt-4 max-w-lg text-sm leading-7 text-rose-100/80 sm:text-base">
                Discover the Shiva Fire Works catalogue and explore a range of
                festive fireworks for your celebrations. Browse products,
                submit an enquiry, and let our team help you with your order.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-3 bg-yellow-300 px-5 py-4 text-xs font-extrabold tracking-wider text-stone-950 transition hover:-translate-y-1 hover:bg-yellow-200"
                >
                  EXPLORE PRODUCTS
                  <ArrowRight size={17} />
                </Link>

                <a
                  href="#about"
                  className="inline-flex items-center gap-3 border border-white/30 px-5 py-4 text-xs font-bold tracking-wider text-white transition hover:bg-white/10"
                >
                  DISCOVER SHIVA FIRE WORKS
                </a>
              </div>

              <div className="mt-7 flex items-start gap-2 text-xs leading-5 text-rose-100/80">
                <ShieldCheck
                  size={17}
                  className="mt-0.5 shrink-0 text-yellow-300"
                />
                <span>
                  Celebrate responsibly. Follow all applicable fireworks
                  safety and legal requirements.
                </span>
              </div>
            </div>

            {/* CSS-created hero artwork */}
            <div className="relative mx-auto flex min-h-[330px] w-full max-w-md items-center justify-center sm:min-h-[420px]">
              <div className="absolute h-64 w-64 rounded-full border border-amber-300/30 sm:h-80 sm:w-80" />
              <div className="absolute h-72 w-48 rotate-45 rounded-[50%] border border-amber-300/20 sm:h-96 sm:w-64" />

              <Sparkles
                className="absolute right-[12%] top-[8%] animate-pulse text-yellow-300"
                size={65}
              />
              <Star
                className="absolute left-[9%] top-[28%] text-orange-300"
                size={43}
              />
              <Sparkles
                className="absolute bottom-[20%] right-[7%] text-orange-300"
                size={43}
              />
              <Star
                className="absolute bottom-[12%] left-[18%] text-yellow-200"
                size={27}
              />

              <div className="relative z-10 w-52 -rotate-3 drop-shadow-2xl transition duration-500 hover:rotate-0 sm:w-60">
                <div className="h-7 bg-gradient-to-r from-yellow-300 via-orange-400 to-red-700 [clip-path:polygon(10%_0,100%_0,88%_100%,0_100%)]" />

                <div className="flex min-h-60 flex-col items-center justify-center border-4 border-yellow-400 bg-[radial-gradient(circle_at_center,#ffb43c,#df4c27_45%,#671321)] px-4 py-6 text-center text-yellow-50 shadow-inner sm:min-h-72">
                  <span className="text-xs font-bold tracking-[5px]">
                    SHIVA FIRE WORKS
                  </span>

                  <div className="my-4 grid h-24 w-24 place-items-center rounded-full border border-yellow-200/70 bg-red-950/20">
                    <Sparkles
                      size={57}
                      className="text-yellow-200"
                      strokeWidth={1.2}
                    />
                  </div>

                  <span className="font-black tracking-[3px] sm:text-lg">
                    FESTIVE
                  </span>
                  <span className="mt-1 font-black tracking-[2px] sm:text-lg">
                    COLLECTION
                  </span>

                  <span className="mt-4 border-t border-yellow-200/40 pt-3 text-[8px] tracking-[3px]">
                    SIVAKASI · TAMIL NADU
                  </span>
                </div>

                <div className="h-2 bg-yellow-400" />
              </div>

              <div className="absolute bottom-1 right-0 bg-yellow-300 px-4 py-3 text-center text-stone-950 shadow-lg sm:bottom-4">
                <p className="text-[9px] font-bold tracking-[2px]">
                  FESTIVE
                </p>
                <p className="text-sm font-black tracking-wider">
                  CELEBRATIONS
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 bg-black/10">
            <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-5 py-5 sm:px-8 md:grid-cols-4 lg:px-12">
              {[
                ["01", "Browse the catalogue"],
                ["02", "Choose your products"],
                ["03", "Submit an enquiry"],
                ["04", "Confirm with our team"],
              ].map(([number, label]) => (
                <div key={number} className="flex items-center gap-3">
                  <span className="text-xl font-black text-yellow-300">
                    {number}
                  </span>
                  <span className="text-xs font-semibold text-rose-100/90">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BENEFITS */}
        <section className="border-b border-stone-200 bg-white">
          <div className="mx-auto grid max-w-7xl gap-5 px-5 py-8 sm:px-8 md:grid-cols-3 lg:px-12">
            {benefits.map(({ icon: Icon, title, description }, index) => (
              <div
                key={title}
                className={`flex items-center gap-4 ${
                  index !== 0 ? "md:border-l md:border-stone-200 md:pl-6" : ""
                }`}
              >
                <div className="grid h-12 w-12 shrink-0 place-items-center bg-amber-100 text-red-900">
                  <Icon size={22} />
                </div>

                <div>
                  <h2 className="text-sm font-extrabold">{title}</h2>
                  <p className="mt-1 text-xs leading-5 text-stone-500">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CATEGORIES */}
        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-[10px] font-extrabold tracking-[3px] text-amber-800">
                FIND YOUR FAVOURITES
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                EXPLORE OUR{" "}
                <span className="text-red-800">COLLECTION</span>
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-stone-500">
                Explore product categories and discover options for your
                festive celebrations.
              </p>
            </div>

            <Link
              to="/products"
              className="inline-flex items-center gap-2 self-start border-b border-amber-700 pb-2 text-xs font-extrabold text-red-900 hover:text-red-600 sm:self-auto"
            >
              VIEW ALL PRODUCTS
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category, index) => (
              <Link
                to="/products"
                key={category.name}
                className={`group relative min-h-56 overflow-hidden bg-gradient-to-br ${category.style} p-6 transition duration-300 hover:-translate-y-1 hover:shadow-xl`}
              >
                <div className="flex items-start justify-between">
                  <span className="text-5xl transition duration-300 group-hover:scale-110">
                    {category.icon}
                  </span>

                  <span className="grid h-9 w-9 place-items-center rounded-full border border-black/10 bg-white/50 transition group-hover:bg-white">
                    <ArrowRight size={17} />
                  </span>
                </div>

                <div className="absolute bottom-6 left-6 right-6">
                  <p className={`text-xs font-bold ${category.accent}`}>
                    {category.tamil}
                  </p>

                  <h3 className="mt-1 text-2xl font-black tracking-tight text-stone-900">
                    {category.name}
                  </h3>

                  <p className="mt-2 text-xs text-stone-700">
                    {category.description}
                  </p>

                  <div className="mt-4 flex items-center gap-2 text-[10px] font-extrabold tracking-wider text-stone-900">
                    {category.count.toUpperCase()}
                    <ArrowRight size={13} />
                  </div>
                </div>

                <span className="absolute right-4 top-20 text-8xl font-black text-black/[0.04]">
                  {index + 1}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* FEATURED PRODUCTS */}
        <section className="bg-[#f6f2ea]">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-[10px] font-extrabold tracking-[3px] text-amber-800">
                  DISCOVER THE CATALOGUE
                </p>
                <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                  FESTIVE{" "}
                  <span className="text-red-800">FAVOURITES</span>
                </h2>
                <p className="mt-3 text-sm leading-6 text-stone-500">
                  Browse popular product types and enquire about current
                  availability and pricing.
                </p>
              </div>

              <Link
                to="/products"
                className="inline-flex items-center gap-2 self-start border-b border-amber-700 pb-2 text-xs font-extrabold text-red-900 hover:text-red-600 sm:self-auto"
              >
                EXPLORE CATALOGUE
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
              {featuredProducts.map((product) => (
                <article
                  key={product.name}
                  className="group overflow-hidden border border-stone-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div
                    className={`relative grid h-40 place-items-center bg-gradient-to-br ${product.style} sm:h-52`}
                  >
                    <span className="absolute left-3 top-3 bg-stone-900 px-2 py-1.5 text-[8px] font-extrabold tracking-wider text-white sm:text-[9px]">
                      {product.badge}
                    </span>

                    <span className="text-6xl transition duration-300 group-hover:scale-110 sm:text-8xl">
                      {product.icon}
                    </span>

                    <Sparkles
                      size={23}
                      className="absolute bottom-4 right-4 text-amber-700/50"
                    />
                  </div>

                  <div className="p-3 sm:p-5">
                    <p className="text-[10px] font-semibold text-amber-800">
                      {product.tamil}
                    </p>

                    <h3 className="mt-1 text-base font-black sm:text-lg">
                      {product.name}
                    </h3>

                    <p className="mt-2 min-h-8 text-[10px] leading-4 text-stone-500 sm:text-xs">
                      {product.size}
                    </p>

                    <div className="mt-3 border-t border-stone-100 pt-3">
                      <p className="text-xs font-extrabold text-red-900 sm:text-sm">
                        {product.price}
                      </p>

                      <Link
                        to="/products"
                        className="mt-4 flex items-center justify-between gap-2 border border-amber-800/30 px-3 py-3 text-[9px] font-extrabold tracking-wider text-red-900 transition hover:bg-amber-100 sm:text-[10px]"
                      >
                        VIEW DETAILS
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <p className="mt-6 text-xs leading-6 text-stone-500">
              Product illustrations are placeholders. Replace them with the
              client's actual product photographs, verified pack sizes and
              current prices before launch.
            </p>
          </div>
        </section>

        {/* ORDER PROCESS */}
        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[10px] font-extrabold tracking-[3px] text-amber-800">
              SIMPLE AND CONVENIENT
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              HOW TO <span className="text-red-800">ORDER</span>
            </h2>

            <p className="mt-4 text-sm leading-7 text-stone-500">
              Submit your product selection online. Our team will contact you
              to confirm the enquiry and explain the next steps.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                number: "01",
                icon: Package,
                title: "Browse Products",
                text: "Explore the catalogue and available product details.",
              },
              {
                number: "02",
                icon: CheckCircle2,
                title: "Select Items",
                text: "Choose the products and quantities you want to enquire about.",
              },
              {
                number: "03",
                icon: Phone,
                title: "Send Enquiry",
                text: "Enter your contact details and submit your request.",
              },
              {
                number: "04",
                icon: ShieldCheck,
                title: "Confirm Details",
                text: "The owner will contact you to discuss availability, terms and payment.",
              },
            ].map(({ number, icon: Icon, title, text }) => (
              <div
                key={number}
                className="border border-stone-200 bg-white p-6 transition hover:border-amber-400 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black text-amber-700/40">
                    {number}
                  </span>

                  <span className="grid h-12 w-12 place-items-center bg-amber-100 text-red-900">
                    <Icon size={22} />
                  </span>
                </div>

                <h3 className="mt-5 text-lg font-black">{title}</h3>

                <p className="mt-3 text-sm leading-6 text-stone-500">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ENQUIRY BANNER */}
        <section
          id="enquiry"
          className="relative isolate mx-auto mb-16 max-w-[1400px] overflow-hidden bg-[#300d19] px-6 py-12 text-white sm:mx-6 sm:px-10 lg:mx-12 lg:mb-20 lg:flex lg:items-center lg:justify-between lg:gap-10 lg:px-14 lg:py-16"
        >
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_90%_10%,rgba(181,75,45,0.5),transparent_40%)]" />

          <div className="max-w-2xl">
            <p className="text-[10px] font-extrabold tracking-[3px] text-yellow-300">
              LET'S MAKE IT FESTIVE
            </p>

            <h2 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">
              READY TO EXPLORE
              <br />
              THE <span className="text-yellow-300">COLLECTION?</span>
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-7 text-rose-100/80">
              Visit the product catalogue, select the items you are interested
              in, and send your enquiry to Shiva Fire Works.
            </p>
          </div>

          <Link
            to="/products"
            className="mt-8 inline-flex items-center gap-3 self-start bg-yellow-300 px-5 py-4 text-xs font-extrabold tracking-wider text-stone-950 transition hover:-translate-y-1 hover:bg-yellow-200 lg:mt-0"
          >
            BROWSE CATALOGUE
            <ArrowRight size={17} />
          </Link>
        </section>

        {/* ABOUT */}
        <section
          id="about"
          className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-16 sm:px-8 lg:grid-cols-[0.75fr_1.25fr] lg:px-12 lg:pb-24"
        >
          <div className="mx-auto flex min-h-64 w-full max-w-xs rotate-[-2deg] flex-col items-center justify-center bg-yellow-300 p-8 text-center shadow-[10px_10px_0_#eee0c4]">
            <Sparkles size={43} className="mb-4 text-red-900" />
            <span className="text-3xl font-black tracking-wider">
              SHIVA
            </span>
            <span className="text-2xl font-black tracking-[4px]">
              FIRE WORKS
            </span>
            <span className="mt-4 text-[10px] font-bold tracking-[3px] text-red-900">
              SIVAKASI
            </span>
          </div>

          <div>
            <p className="text-[10px] font-extrabold tracking-[3px] text-amber-800">
              ABOUT SHIVA FIRE WORKS
            </p>

            <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight sm:text-4xl">
              YOUR FESTIVE
              <br />
              SHOPPING, <span className="text-red-800">SIMPLIFIED.</span>
            </h2>

            <p className="mt-5 text-sm leading-7 text-stone-600">
              Shiva Fire Works provides an online catalogue experience for
              customers looking to explore fireworks from Sivakasi. Browse
              product categories, select items, and send your enquiry from
              the comfort of your home.
            </p>

            <p className="mt-3 text-sm leading-7 text-stone-600">
              Once your enquiry is received, the team can discuss product
              availability, pricing, and any applicable purchase or delivery
              requirements before confirming an order.
            </p>

            <div className="mt-6 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-800">
                <ShieldCheck size={18} className="text-amber-700" />
                Responsible celebrations
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-stone-800">
                <Truck size={18} className="text-amber-700" />
                Confirm delivery eligibility
              </div>
            </div>

            <Link
              to="/products"
              className="mt-7 inline-flex items-center gap-3 bg-[#2a1019] px-5 py-4 text-xs font-extrabold tracking-wider text-white transition hover:bg-red-900"
            >
              EXPLORE PRODUCTS
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        {/* SAFETY STRIP */}
        <section className="border-t border-amber-200 bg-amber-50">
          <div className="mx-auto flex max-w-7xl items-start gap-4 px-5 py-7 sm:px-8 lg:px-12">
            <div className="grid h-11 w-11 shrink-0 place-items-center bg-amber-200 text-red-900">
              <Flame size={22} />
            </div>

            <div>
              <h2 className="text-sm font-black">
                Celebrate Safely and Responsibly
              </h2>
              <p className="mt-2 text-xs leading-6 text-stone-600">
                Follow the instructions supplied with each product. Purchase
                and use fireworks only where legally permitted, observe local
                restrictions, and keep children away from ignition activities.
                Product availability and fulfilment are subject to applicable
                laws and licensing conditions.
              </p>
            </div>
          </div>
        </section>
      </main>


    </div>
  );
}
