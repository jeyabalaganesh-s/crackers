
import { useEffect, useState, type FormEvent } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Send,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";


const WHATSAPP_NUMBER = "91XXXXXXXXXX"; // Replace with your WhatsApp number

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "Product enquiry",
    message: "",
  });

  const [error, setError] = useState("");
  
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!/^[0-9]{10}$/.test(form.phone.trim())) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    const message = [
      "Hello Raja Agencies!",
      "",
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      `Email: ${form.email || "Not provided"}`,
      `Subject: ${form.subject}`,
      "",
      `Message: ${form.message}`,
      "",
      "Please contact me regarding this enquiry.",
    ].join("\n");

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="min-h-screen bg-[#fffaf4] text-gray-900">


      {/* Hero */}
      <section className="relative overflow-hidden bg-[#171717] px-5 py-20 text-white sm:py-24">
        <div className="absolute -right-16 -top-20 h-72 w-72 rounded-full bg-orange-500/15 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-orange-400">
            We're here to help
          </p>
          <h1 className="max-w-3xl text-4xl font-black leading-tight sm:text-6xl">
            Let's Talk About Your{" "}
            <span className="text-orange-400">Celebrations.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-gray-300 sm:text-lg">
            Have questions about our products, bulk orders, pricing, or
            availability? Send us an enquiry and our team will get in touch.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello Raja Agencies! I have a product enquiry.")}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-5 py-3 font-bold text-white transition hover:bg-green-600"
            >
              <MessageCircle size={19} />
              Chat on WhatsApp
            </a>
            <a
              href="#contact-form"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3 font-bold transition hover:bg-white/10"
            >
              Send an enquiry <ArrowUpRight size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* Contact cards */}
      <section className="px-5 py-14 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10">
            <p className="font-bold uppercase tracking-widest text-orange-600">
              Get in touch
            </p>
            <h2 className="mt-2 text-3xl font-black sm:text-4xl">
              Contact Information
            </h2>
            <p className="mt-3 max-w-2xl leading-7 text-gray-600">
              Choose whichever contact method is most convenient for you.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <ContactCard
              icon={<Phone size={23} />}
              title="Call Us"
              description="Speak with our team directly."
              detail="Add your business phone"
              href="tel:+910000000000"
              linkText="Call now"
            />
            <ContactCard
              icon={<MessageCircle size={23} />}
              title="WhatsApp"
              description="Ask about products and bulk orders."
              detail="Quick enquiry support"
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              linkText="Message us"
            />
            <ContactCard
              icon={<Mail size={23} />}
              title="Email Us"
              description="Send us your questions."
              detail="Add your business email"
              href="mailto:yourbusiness@example.com"
              linkText="Send email"
            />
            <ContactCard
              icon={<MapPin size={23} />}
              title="Visit Us"
              description="Find our business location."
              detail="Sivakasi, Tamil Nadu"
              href="https://www.google.com/maps/search/?api=1&query=Raja+Agencies+Sivakasi"
              linkText="View map"
            />
          </div>
        </div>
      </section>

      {/* Form and business details */}
      <section className="px-5 pb-16">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div
            id="contact-form"
            className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm sm:p-9"
          >
            <p className="text-sm font-bold uppercase tracking-widest text-orange-600">
              Contact form
            </p>
            <h2 className="mt-2 text-3xl font-black">Send Us a Message</h2>
            <p className="mt-3 leading-7 text-gray-600">
              Fill in the details below. Your enquiry will open in WhatsApp so
              you can review and send it to us.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField label="Your name">
                  <input
                    required
                    maxLength={80}
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    placeholder="Enter your name"
                    className={inputClass}
                  />
                </FormField>

                <FormField label="Mobile number">
                  <input
                    required
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={form.phone}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        phone: e.target.value.replace(/\D/g, "").slice(0, 10),
                      })
                    }
                    placeholder="10-digit mobile number"
                    className={inputClass}
                  />
                </FormField>
              </div>

              <FormField label="Email address (optional)">
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  placeholder="you@example.com"
                  className={inputClass}
                />
              </FormField>

              <FormField label="What is your enquiry about?">
                <select
                  value={form.subject}
                  onChange={(e) =>
                    setForm({ ...form, subject: e.target.value })
                  }
                  className={inputClass}
                >
                  <option>Product enquiry</option>
                  <option>Price and availability</option>
                  <option>Bulk order enquiry</option>
                  <option>Order status</option>
                  <option>Business enquiry</option>
                  <option>Other</option>
                </select>
              </FormField>

              <FormField label="Your message">
                <textarea
                  required
                  minLength={5}
                  maxLength={1500}
                  rows={5}
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  placeholder="Tell us how we can help..."
                  className={`${inputClass} resize-y`}
                />
              </FormField>

              {error && (
                <p role="alert" className="text-sm font-medium text-red-600">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-4 font-bold text-white transition hover:bg-orange-700 sm:w-auto"
              >
                Send via WhatsApp <Send size={18} />
              </button>

              <p className="text-xs leading-5 text-gray-500">
                This form opens WhatsApp; it does not send or store your
                information on this website.
              </p>
            </form>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl bg-[#171717] p-7 text-white sm:p-9">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/15 text-orange-400">
                <Clock size={25} />
              </div>
              <h3 className="text-2xl font-black">Business Hours</h3>
              <p className="mt-3 leading-7 text-gray-300">
                Contact us to confirm current business hours and product
                availability before visiting.
              </p>
              <div className="mt-6 border-t border-white/10 pt-5">
                <p className="font-semibold">Raja Agencies</p>
                <p className="mt-1 text-sm text-gray-400">
                  Sivakasi, Tamil Nadu, India
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-orange-100 bg-orange-50 p-7 sm:p-9">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
                <ShieldCheck size={25} />
              </div>
              <h3 className="text-2xl font-black">Order Safely</h3>
              <p className="mt-3 leading-7 text-gray-700">
                Ask us about product availability, applicable restrictions,
                collection or delivery options, and order confirmation before
                making arrangements.
              </p>
              <p className="mt-4 text-sm leading-6 text-gray-600">
                Fireworks sales and transport are subject to applicable laws
                and safety requirements. An enquiry does not confirm an order.
              </p>
            </div>

            <a
              href="https://www.google.com/maps/search/?api=1&query=Raja+Agencies+Sivakasi"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-orange-300"
            >
              <div>
                <p className="font-bold">Find us in Sivakasi</p>
                <p className="mt-1 text-sm text-gray-500">
                  Open Google Maps to check the location
                </p>
              </div>
              <MapPin className="shrink-0 text-orange-600" />
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}

const inputClass =
  "mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-100";

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm font-semibold text-gray-800">
      {label}
      {children}
    </label>
  );
}

function ContactCard({
  icon,
  title,
  description,
  detail,
  href,
  linkText,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  detail: string;
  href: string;
  linkText: string;
}) {
  return (
    <div className="rounded-2xl border border-orange-100 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
        {icon}
      </div>
      <h3 className="mt-5 text-lg font-extrabold">{title}</h3>
      <p className="mt-2 min-h-12 text-sm leading-6 text-gray-600">
        {description}
      </p>
      <p className="mt-3 break-words text-sm font-semibold">{detail}</p>
      <a
        href={href}
        target={href.startsWith("https://") ? "_blank" : undefined}
        rel={href.startsWith("https://") ? "noreferrer" : undefined}
        className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-orange-600 hover:text-orange-800"
      >
        {linkText} <ArrowUpRight size={15} />
      </a>
    </div>
  );
}
