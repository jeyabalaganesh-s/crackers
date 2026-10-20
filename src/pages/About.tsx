
import {
  Award,
  BadgeCheck,
  HeartHandshake,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Users,
  ArrowRight,
  MessageCircle,
} from "lucide-react";

const values = [
  {
    icon: <BadgeCheck size={25} />,
    title: "Quality First",
    description:
      "We aim to help customers choose products based on clear information, availability, and their celebration needs.",
  },
  {
    icon: <HeartHandshake size={25} />,
    title: "Customer Care",
    description:
      "We value every enquiry and strive to make product selection and order discussions straightforward.",
  },
  {
    icon: <ShieldCheck size={25} />,
    title: "Safety Matters",
    description:
      "We encourage responsible use and compliance with applicable fireworks laws and safety instructions.",
  },
  {
    icon: <PackageCheck size={25} />,
    title: "Clear Ordering",
    description:
      "Customers can enquire about products, quantities, pricing, and order arrangements before confirming.",
  },
];

const steps = [
  {
    number: "01",
    title: "Explore Products",
    description:
      "Browse the catalogue to discover fireworks and celebration options.",
  },
  {
    number: "02",
    title: "Send an Enquiry",
    description:
      "Contact us to ask about current prices, stock, and order requirements.",
  },
  {
    number: "03",
    title: "Confirm the Details",
    description:
      "Discuss availability, payment arrangements, and permitted collection or delivery options.",
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-[#fffaf4] text-gray-900">

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#171717] px-5 py-20 text-white sm:py-28">
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-orange-500/15 blur-3xl" />
        <div className="absolute -bottom-24 left-1/4 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <p className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.25em] text-orange-400">
            <Sparkles size={17} />
            About Raja Agencies
          </p>

          <h1 className="max-w-4xl text-4xl font-black leading-tight sm:text-6xl">
            Bringing More Joy to
            <span className="block text-orange-400">
              Every Celebration.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-gray-300 sm:text-lg">
            Based in Sivakasi, Tamil Nadu, Raja Agencies is building a
            convenient way for customers to explore fireworks, ask questions,
            and enquire about products for their celebrations.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="/products"
              className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-6 py-3.5 font-bold text-white transition hover:bg-orange-700"
            >
              Explore Products <ArrowRight size={18} />
            </a>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-6 py-3.5 font-bold transition hover:bg-white/10"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="px-5 py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div className="relative">
            <div className="flex min-h-[340px] items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-orange-100 via-amber-50 to-orange-200 p-8 sm:min-h-[440px]">
              <div className="max-w-sm text-center">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-white text-orange-600 shadow-lg">
                  <Sparkles size={48} />
                </div>
                <p className="mt-6 text-3xl font-black text-gray-900">
                  Raja Agencies
                </p>
                <p className="mt-2 font-medium text-gray-600">
                  Your celebration, your way.
                </p>
                <p className="mt-5 text-sm text-gray-500">
                  Sivakasi, Tamil Nadu
                </p>
              </div>
            </div>
            <div className="absolute -bottom-5 -right-3 rounded-2xl bg-white p-4 shadow-lg sm:right-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                  <HeartHandshake size={23} />
                </div>
                <div>
                  <p className="font-extrabold">Customer focused</p>
                  <p className="text-xs text-gray-500">
                    Helpful product enquiries
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 lg:pt-0">
            <p className="font-bold uppercase tracking-[0.2em] text-orange-600">
              Who we are
            </p>
            <h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">
              A Simpler Way to Plan Your Celebrations
            </h2>

            <div className="mt-6 space-y-4 text-base leading-8 text-gray-600">
              <p>
                Celebrations bring families and communities together. At Raja
                Agencies, our goal is to make exploring fireworks and asking
                about products a simple, convenient experience.
              </p>
              <p>
                Through our online catalogue, customers can browse available
                categories, identify products of interest, and contact us to
                discuss pricing and quantities.
              </p>
              <p>
                We believe that good service starts with clear communication.
                We aim to help customers understand their options before they
                make an order enquiry.
              </p>
            </div>

            <div className="mt-8 flex items-start gap-4 rounded-2xl border border-orange-100 bg-white p-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                <Award size={25} />
              </div>
              <div>
                <h3 className="font-extrabold">Our commitment</h3>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Honest communication, clear enquiry steps, and a focus on
                  responsible celebrations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white px-5 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-bold uppercase tracking-[0.2em] text-orange-600">
              What matters to us
            </p>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              The Values Behind Our Service
            </h2>
            <p className="mt-4 leading-7 text-gray-600">
              We want every interaction with Raja Agencies to feel clear,
              helpful, and responsible.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div
                key={value.title}
                className="group rounded-2xl border border-gray-100 bg-[#fffaf4] p-6 transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-700 transition group-hover:bg-orange-600 group-hover:text-white">
                  {value.icon}
                </div>
                <h3 className="mt-5 text-lg font-extrabold">{value.title}</h3>
                <p className="mt-3 text-sm leading-7 text-gray-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-5 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="font-bold uppercase tracking-[0.2em] text-orange-600">
              How it works
            </p>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              From Browsing to Enquiry
            </h2>
            <p className="mt-4 leading-7 text-gray-600">
              Our website helps you get started. Final product availability
              and order arrangements must be confirmed with our team.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.number}
                className="rounded-2xl border border-orange-100 bg-white p-7"
              >
                <p className="text-4xl font-black text-orange-200">
                  {step.number}
                </p>
                <h3 className="mt-5 text-xl font-extrabold">{step.title}</h3>
                <p className="mt-3 leading-7 text-gray-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Responsible celebrations */}
      <section className="px-5 pb-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 rounded-3xl bg-[#171717] p-7 text-white sm:p-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 font-bold text-orange-400">
              <Users size={20} />
              Celebrate responsibly
            </div>
            <h2 className="mt-3 text-2xl font-black sm:text-3xl">
              Safety Is Part of Every Celebration
            </h2>
            <p className="mt-4 leading-7 text-gray-300">
              Follow product instructions, keep a safe distance, supervise
              children, and comply with local laws and restrictions. Purchase
              and use only permitted products through lawful channels.
            </p>
          </div>

          <a
            href="/contact"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-4 font-bold transition hover:bg-orange-700"
          >
            <MessageCircle size={19} />
            Talk to Our Team
          </a>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-5 pb-16 sm:pb-20">
        <div className="mx-auto max-w-7xl rounded-3xl bg-orange-100 px-6 py-12 text-center sm:px-12 sm:py-16">
          <h2 className="text-3xl font-black sm:text-4xl">
            Let's Make Your Celebration Special
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-700">
            Explore our catalogue or contact Raja Agencies to enquire about
            products, prices, and availability.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href="/products"
              className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-6 py-3.5 font-bold text-white transition hover:bg-orange-700"
            >
              Browse Products <ArrowRight size={18} />
            </a>
            <a
              href="/contact"
              className="rounded-xl border border-orange-300 bg-white px-6 py-3.5 font-bold transition hover:bg-orange-50"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
