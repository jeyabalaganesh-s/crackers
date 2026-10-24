import { Link } from "react-router-dom";
import { Phone } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white">
{/* Announcement bar */}
<div className="flex flex-col items-center justify-center gap-1 bg-yellow-400 px-4 py-2 text-center text-xs font-bold text-stone-900 sm:flex-row sm:gap-5">
  <span>
    சிவா ஃபயர் வொர்க்ஸ் — சிவகாசியின் நம்பகமான பட்டாசு நிறுவனம்
  </span>

  <span className="text-red-800">
    Celebrate brighter. Celebrate responsibly.
  </span>
</div>

      {/* Brand and contact */}
      <div className="flex min-h-24 items-center justify-between gap-3 px-4 py-4 sm:px-8 lg:px-[7%]">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3">
          {/* Logo */}
<div className="flex h-[70px] w-[72px] shrink-0 flex-col items-center justify-center bg-yellow-400 text-black sm:h-[76px] sm:w-[78px]">
  {/* Crown */}
  <span className="mb-0.5 text-[13px] leading-none">
    ♛
  </span>

  {/* SHIVA */}
  <span className="text-[18px] font-black leading-[18px] tracking-tight sm:text-[20px] sm:leading-[20px]">
    SHIVA
  </span>

  {/* FIRE WORKS */}
  <span className="mt-0.5 text-[8px] font-extrabold leading-[9px] tracking-wide sm:text-[9px] sm:leading-[10px]">
    FIRE WORKS
  </span>

  {/* Bottom line */}
  <span className="mt-1 h-[3px] w-10 bg-red-600 sm:w-11" />
</div>
          {/* Brand Name */}
          <div>
            <h1 className="text-lg font-black tracking-wide text-stone-900 sm:text-2xl">
              SHIVA{" "}
              <span className="text-yellow-400">
                FIRE WORKS
              </span>
            </h1>

            <p className="mt-1 text-[8px] font-bold tracking-wider text-stone-500 sm:text-[10px] sm:tracking-[2px]">
              THE SIVAKASI FIREWORKS STORE
            </p>
          </div>
        </Link>

        {/* Contact */}
        <a
          href="tel:+918438349372"
          className="flex items-center gap-3 text-stone-900"
        >
          <span className="grid h-10 w-10 place-items-center rounded-full bg-amber-100 text-red-800 sm:h-12 sm:w-12">
            <Phone size={19} />
          </span>

          <span className="hidden flex-col gap-1 sm:flex">
            <span className="text-[10px] font-bold tracking-widest text-stone-500">
              CALL FOR ENQUIRIES
            </span>

            <span className="text-sm font-bold">
              +91 84383 49372
            </span>
          </span>
        </a>
      </div>
    </header>
  );
}