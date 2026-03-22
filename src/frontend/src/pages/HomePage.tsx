import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import ProductSkeleton from "../components/ProductSkeleton";
import { useListProducts } from "../hooks/useQueries";

const HERO_SLIDES = [
  {
    image: "/assets/generated/hero-banner-1.dim_1200x400.jpg",
    title: "SUPER SALE",
  },
  {
    image: "/assets/generated/hero-banner-2.dim_1200x400.jpg",
    title: "NEW COLLECTION",
  },
  {
    image: "/assets/generated/hero-banner-3.dim_1200x400.jpg",
    title: "ELECTRONICS SALE",
  },
];

const CATEGORIES = [
  { label: "Women", emoji: "👗", cat: "Women's Fashion" },
  { label: "Men", emoji: "👔", cat: "Men's Fashion" },
  { label: "Electronics", emoji: "📱", cat: "Electronics" },
  { label: "Home", emoji: "🏠", cat: "Home & Living" },
  { label: "Beauty", emoji: "💄", cat: "Beauty" },
  { label: "Shoes", emoji: "👟", cat: "Shoes" },
  { label: "Groceries", emoji: "🛒", cat: "Groceries" },
  { label: "Mobiles", emoji: "📲", cat: "Electronics" },
];

const SKELETONS_8 = ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"];

export default function HomePage() {
  const [slide, setSlide] = useState(0);
  const { data: products, isLoading } = useListProducts();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(
      () => setSlide((s) => (s + 1) % HERO_SLIDES.length),
      4000,
    );
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () =>
    setSlide((s) => (s - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  const nextSlide = () => setSlide((s) => (s + 1) % HERO_SLIDES.length);

  const trendingProducts = products?.slice(0, 8) ?? [];

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Carousel */}
      <section className="max-w-7xl mx-auto px-4 py-4" data-ocid="hero.section">
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{ height: 360 }}
        >
          {HERO_SLIDES.map((s, i) => (
            <div
              key={s.title}
              className={`absolute inset-0 transition-opacity duration-700 ${i === slide ? "opacity-100" : "opacity-0"}`}
            >
              <img
                src={s.image}
                alt={s.title}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={prevSlide}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all"
            data-ocid="hero.prev_button"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all"
            data-ocid="hero.next_button"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {HERO_SLIDES.map((s, i) => (
              <button
                key={s.title}
                type="button"
                onClick={() => setSlide(i)}
                className={`rounded-full transition-all duration-300 ${i === slide ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/60"}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Category quick links */}
      <section
        className="max-w-7xl mx-auto px-4 py-6"
        data-ocid="categories.section"
      >
        <div className="bg-white rounded-2xl shadow-card p-6">
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to="/products"
                  search={{ category: cat.cat }}
                  className="flex flex-col items-center gap-2 group"
                  data-ocid={`categories.item.${i + 1}`}
                >
                  <div className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform">
                    {cat.emoji}
                  </div>
                  <span className="text-xs font-medium text-foreground text-center">
                    {cat.label}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Deals */}
      <section
        className="max-w-7xl mx-auto px-4 py-4"
        data-ocid="trending.section"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-extrabold gradient-text">
              Trending Deals
            </h2>
            <p className="text-sm text-muted-foreground">
              Handpicked deals just for you
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full border-primary/40 text-primary hover:bg-primary hover:text-white"
            onClick={() => navigate({ to: "/products" })}
            data-ocid="trending.view_all_button"
          >
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>

        {isLoading ? (
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            data-ocid="trending.loading_state"
          >
            {SKELETONS_8.map((k) => (
              <ProductSkeleton key={k} />
            ))}
          </div>
        ) : trendingProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trendingProducts.map((p, i) => (
              <ProductCard key={p.id.toString()} product={p} index={i} />
            ))}
          </div>
        ) : (
          <div
            className="text-center py-12 bg-white rounded-2xl"
            data-ocid="trending.empty_state"
          >
            <p className="text-muted-foreground">No products available yet</p>
          </div>
        )}
      </section>

      {/* Discovery Section */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="font-bold text-lg mb-4">New Arrivals</h3>
            <div className="flex gap-2 flex-wrap mb-4">
              {["Women", "Men", "Electronics"].map((t) => (
                <Link
                  key={t}
                  to="/products"
                  search={{
                    category:
                      t === "Women"
                        ? "Women's Fashion"
                        : t === "Men"
                          ? "Men's Fashion"
                          : "Electronics",
                  }}
                  className="px-4 py-1.5 rounded-full text-sm font-medium border-2 border-primary/30 text-primary hover:bg-primary hover:text-white transition-colors"
                >
                  {t}
                </Link>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {(products?.slice(0, 4) ?? []).map((p) => (
                <Link
                  key={p.id.toString()}
                  to="/product/$id"
                  params={{ id: p.id.toString() }}
                  className="flex gap-2 items-center hover:bg-gray-50 rounded-lg p-1 transition-colors"
                >
                  <img
                    src={
                      p.imageUrl || `https://picsum.photos/seed/${p.name}/80/80`
                    }
                    alt={p.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-medium truncate">{p.name}</p>
                    <p className="text-xs text-primary font-bold">
                      ₹{Number(p.discountedPrice).toLocaleString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="font-bold text-lg mb-4">Categories to Explore</h3>
            <div className="flex gap-2 flex-wrap">
              {[
                "Home & Living",
                "Beauty",
                "Shoes",
                "Electronics",
                "Women's Fashion",
                "Men's Fashion",
                "Groceries",
                "Mobiles",
                "Bags",
                "Watches",
              ].map((cat) => (
                <Link
                  key={cat}
                  to="/products"
                  search={{ category: cat }}
                  className="px-3 py-1.5 rounded-full text-xs font-medium bg-muted hover:bg-primary hover:text-white transition-colors text-muted-foreground"
                >
                  {cat}
                </Link>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="grid grid-cols-3 gap-3">
                {(products?.slice(4, 7) ?? []).map((p) => (
                  <Link
                    key={p.id.toString()}
                    to="/product/$id"
                    params={{ id: p.id.toString() }}
                    className="text-center group"
                  >
                    <img
                      src={
                        p.imageUrl ||
                        `https://picsum.photos/seed/${p.name}/100/100`
                      }
                      alt={p.name}
                      className="w-full aspect-square rounded-xl object-cover group-hover:opacity-90 transition-opacity"
                    />
                    <p className="text-xs font-medium mt-1 truncate">
                      {p.name}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
