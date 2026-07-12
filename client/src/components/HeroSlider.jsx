import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const SLIDES = [
  {
    title: "সেরা দামে সেরা প্রোডাক্ট",
    subtitle: "Fashion, Electronics, Home & আরও অনেক কিছু এক জায়গায়",
    cta: "Shop Now",
    to: "/products",
    bg: "from-primary-700 to-primary-500",
  },
  {
    title: "নতুন Collection এসেছে",
    subtitle: "সীমিত সময়ের জন্য বিশেষ ছাড়ে কিনুন প্রিয় প্রোডাক্ট",
    cta: "Explore Now",
    to: "/products",
    bg: "from-indigo-700 to-indigo-500",
  },
  {
    title: "ক্যাশ অন ডেলিভারি সুবিধা",
    subtitle: "সারা বাংলাদেশে হাতে পেয়ে টাকা দিন, নিশ্চিন্তে কেনাকাটা করুন",
    cta: "Order Now",
    to: "/products",
    bg: "from-emerald-700 to-emerald-500",
  },
];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[index];

  return (
    <section className={`bg-gradient-to-r ${slide.bg} text-white relative overflow-hidden transition-colors`}>
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">{slide.title}</h1>
        <p className="text-white/90 mb-6">{slide.subtitle}</p>
        <Link to={slide.to} className="bg-white text-gray-900 px-6 py-2.5 rounded-lg font-semibold inline-block">
          {slide.cta}
        </Link>
      </div>

      <div className="flex justify-center gap-2 pb-4">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Slide ${i + 1}`}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              i === index ? "bg-white w-6" : "bg-white/40"
            }`}
          />
        ))}
      </div>

      <button
        onClick={() => setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length)}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center"
      >
        ‹
      </button>
      <button
        onClick={() => setIndex((i) => (i + 1) % SLIDES.length)}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center"
      >
        ›
      </button>
    </section>
  );
}
