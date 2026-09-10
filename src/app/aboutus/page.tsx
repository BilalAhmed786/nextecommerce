'use client';

import Link from 'next/link';
import {
  FaArrowRight,
  FaBullseye,
  FaCheckCircle,
  FaHeart,
  FaLeaf,
  FaLightbulb,
  FaQuoteLeft,
  FaShieldAlt,
  FaShoppingBag,
  FaStar,
  FaUsers,
} from 'react-icons/fa';

export default function AboutUsPage() {
  const values = [
    {
      icon: <FaHeart />,
      title: 'Customer First',
      description:
        'Every decision we make starts with creating a better experience for our customers.',
    },
    {
      icon: <FaStar />,
      title: 'Quality Without Compromise',
      description:
        'We carefully select products and focus on quality that customers can trust.',
    },
    {
      icon: <FaLightbulb />,
      title: 'Always Improving',
      description:
        'We continuously improve our products, service, and technology to stay ahead.',
    },
    {
      icon: <FaShieldAlt />,
      title: 'Trust & Transparency',
      description:
        'We believe great businesses are built through honesty, reliability, and trust.',
    },
  ];

  const highlights = [
    'Carefully selected products',
    'Simple and secure shopping',
    'Reliable customer support',
    'Fast and convenient ordering',
  ];

  return (
    <main className="min-h-screen z-10 overflow-hidden bg-[#f7f7f5] text-gray-900 mt-20 lg:mt-14 md:mt-20">

      {/* Hero */}
      <section className="relative z-10 overflow-hidden bg-[#080808] text-white">
        <div className="absolute z-10 -left-32 -top-32 h-96 w-96 rounded-full bg-amber-500/20 blur-[100px]" />
        <div className="absolute z-10 -bottom-40 right-0 h-[450px] w-[450px] rounded-full bg-amber-500/10 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-10 lg:py-32">
          <div className="max-w-4xl">

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
              <FaShoppingBag />
              About Our Store
            </div>

            <h1 className="text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              We are building a better
              <span className="block text-amber-400">
                way to shop.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-7 text-gray-400 sm:text-lg">
              We believe online shopping should be simple, enjoyable, reliable,
              and built around the people who use it. Our goal is to bring
              quality products and a premium shopping experience together in
              one place.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-3 rounded-xl bg-amber-500 px-6 py-3.5 text-sm font-black text-black transition hover:bg-amber-400"
              >
                Explore Our Store
                <FaArrowRight />
              </Link>

              <Link
                href="/contactus"
                className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Get In Touch
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:items-center">

          <div>
            <p className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-amber-600">
              Who We Are
            </p>

            <h2 className="text-4xl font-black tracking-tight text-gray-950 sm:text-5xl">
              More than a store.
              <span className="block text-gray-400">
                A shopping experience.
              </span>
            </h2>

            <p className="mt-6 leading-7 text-gray-500">
              Our store was created with a simple idea: customers deserve a
              shopping experience that feels effortless from discovery to
              delivery.
            </p>

            <p className="mt-4 leading-7 text-gray-500">
              We combine carefully selected products, modern technology, and
              customer-focused service to create an online store that people
              can return to with confidence.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {highlights.map((highlight) => (
                <div
                  key={highlight}
                  className="flex items-center gap-3 text-sm font-semibold text-gray-800"
                >
                  <FaCheckCircle className="shrink-0 text-amber-500" />
                  {highlight}
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-5 rounded-[2.5rem] bg-amber-500/10 blur-2xl" />

            <div className="relative overflow-hidden rounded-[2rem] bg-[#0a0a0a] p-8 text-white shadow-2xl sm:p-10">
              <FaQuoteLeft className="text-4xl text-amber-500/40" />

              <p className="mt-8 text-2xl font-bold leading-relaxed sm:text-3xl">
                “Great commerce is not just about selling products. It is
                about creating trust, convenience, and experiences people
                remember.”
              </p>

              <div className="mt-8 h-px bg-white/10" />

              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-500 text-black">
                  <FaUsers />
                </div>

                <div>
                  <p className="font-bold">Our Philosophy</p>
                  <p className="text-sm text-gray-500">
                    Customer-focused by design
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Vision & Mission */}
      <section className="relative overflow-hidden bg-[#0a0a0a] py-20 text-white sm:py-24">
        <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-amber-500/10 blur-[100px]" />

        <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">

          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-400">
              What Drives Us
            </p>

            <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              Our Vision & Mission
            </h2>

            <p className="mt-5 leading-7 text-gray-500">
              We are focused on building something meaningful for our
              customers and our future.
            </p>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-2">

            {/* Vision */}
            <div className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 transition hover:border-amber-500/30 hover:bg-white/[0.06] sm:p-10">
              <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-amber-500/10 blur-3xl transition group-hover:bg-amber-500/20" />

              <div className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500 text-2xl text-black">
                  <FaBullseye />
                </div>

                <p className="mt-8 text-xs font-black uppercase tracking-[0.2em] text-amber-400">
                  Our Vision
                </p>

                <h3 className="mt-3 text-3xl font-black">
                  Redefining everyday shopping.
                </h3>

                <p className="mt-5 leading-7 text-gray-400">
                  Our vision is to become a trusted destination where people
                  can discover quality products, shop confidently, and enjoy a
                  seamless digital experience from start to finish.
                </p>
              </div>
            </div>

            {/* Mission */}
            <div className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 transition hover:border-amber-500/30 hover:bg-white/[0.06] sm:p-10">
              <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-amber-500/10 blur-3xl transition group-hover:bg-amber-500/20" />

              <div className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl text-black">
                  <FaLightbulb />
                </div>

                <p className="mt-8 text-xs font-black uppercase tracking-[0.2em] text-amber-400">
                  Our Mission
                </p>

                <h3 className="mt-3 text-3xl font-black">
                  Making shopping simple.
                </h3>

                <p className="mt-5 leading-7 text-gray-400">
                  Our mission is to provide customers with quality products,
                  transparent service, secure technology, and a convenient
                  shopping journey that exceeds expectations.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10 lg:py-28">

        <div className="max-w-2xl">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-600">
            What We Stand For
          </p>

          <h2 className="mt-3 text-4xl font-black tracking-tight text-gray-950 sm:text-5xl">
            Built on values that matter.
          </h2>

          <p className="mt-5 leading-7 text-gray-500">
            Every part of our business is guided by a few principles that
            shape how we build, serve, and grow.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => (
            <div
              key={value.title}
              className="group rounded-3xl border border-gray-200 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-amber-300 hover:shadow-xl hover:shadow-amber-500/5"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-950 text-lg text-amber-400 transition group-hover:bg-amber-500 group-hover:text-black">
                {value.icon}
              </div>

              <h3 className="mt-6 text-lg font-black text-gray-950">
                {value.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Sustainability / Future */}
      <section className="mx-auto max-w-7xl px-6 pb-20 sm:px-8 lg:px-10 lg:pb-28">
        <div className="relative overflow-hidden rounded-[2rem] bg-amber-500 px-7 py-12 sm:px-12 sm:py-14">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/20 blur-3xl" />

          <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="max-w-2xl">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-xl text-amber-400">
                <FaLeaf />
              </div>

              <h2 className="text-3xl font-black tracking-tight text-black sm:text-4xl">
                Looking toward the future.
              </h2>

              <p className="mt-4 leading-7 text-black/70">
                We are continuously improving the way we operate, the
                technology we use, and the experience we deliver. Our goal is
                to grow responsibly while creating lasting value for our
                customers.
              </p>
            </div>

            <Link
              href="/shop"
              className="inline-flex w-fit items-center gap-3 rounded-xl bg-black px-6 py-3.5 text-sm font-black text-white transition hover:bg-gray-900"
            >
              Start Shopping
              <FaArrowRight className="text-amber-400" />
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-gray-200 bg-white px-6 py-20 text-center sm:px-8">
        <div className="mx-auto max-w-2xl">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-600">
            Join Our Journey
          </p>

          <h2 className="mt-3 text-4xl font-black tracking-tight text-gray-950 sm:text-5xl">
            Your next great find is waiting.
          </h2>

          <p className="mt-5 leading-7 text-gray-500">
            Discover products selected with quality, convenience, and your
            experience in mind.
          </p>

          <Link
            href="/shop"
            className="mt-8 inline-flex items-center gap-3 rounded-xl bg-black px-7 py-4 text-sm font-black text-white transition hover:bg-amber-500 hover:text-black"
          >
            Explore Products
            <FaArrowRight />
          </Link>
        </div>
      </section>

    </main>
  );
}