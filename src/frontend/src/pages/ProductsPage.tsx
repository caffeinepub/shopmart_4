import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { motion } from "motion/react";
import type React from "react";
import { useState } from "react";
import ProductCard from "../components/ProductCard";
import ProductSkeleton from "../components/ProductSkeleton";
import {
  useFilterByCategory,
  useListProducts,
  useSearchProducts,
} from "../hooks/useQueries";

const CATEGORIES = [
  "All",
  "Women's Fashion",
  "Men's Fashion",
  "Electronics",
  "Home & Living",
  "Beauty",
  "Shoes",
];
const SKELETON_KEYS = [
  "s1",
  "s2",
  "s3",
  "s4",
  "s5",
  "s6",
  "s7",
  "s8",
  "s9",
  "s10",
  "s11",
  "s12",
];

export default function ProductsPage() {
  const searchParams = useSearch({ from: "/products" }) as {
    q?: string;
    category?: string;
  };
  const navigate = useNavigate();
  const [localSearch, setLocalSearch] = useState(searchParams.q || "");
  const [activeCategory, setActiveCategory] = useState(
    searchParams.category || "All",
  );

  const isSearching = !!localSearch.trim();
  const { data: searchResults, isLoading: searchLoading } = useSearchProducts(
    localSearch.trim(),
  );
  const { data: categoryProducts, isLoading: catLoading } =
    useFilterByCategory(activeCategory);
  const { data: allProducts, isLoading: allLoading } = useListProducts();

  const isLoading = isSearching ? searchLoading : catLoading || allLoading;

  const products = isSearching
    ? (searchResults ?? [])
    : activeCategory === "All"
      ? (allProducts ?? [])
      : (categoryProducts ?? []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/products", search: { q: localSearch } });
  };

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setLocalSearch("");
    navigate({ to: "/products", search: { category: cat } });
  };

  return (
    <main className="min-h-screen bg-background" data-ocid="products.page">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-card p-4 mb-6">
          <form onSubmit={handleSearch} className="flex gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-10 rounded-full"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                data-ocid="products.search_input"
              />
            </div>
            <Button
              type="submit"
              className="rounded-full gradient-primary border-0"
              data-ocid="products.search_button"
            >
              <Search className="h-4 w-4" />
            </Button>
          </form>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
                  activeCategory === cat
                    ? "gradient-primary border-transparent text-white shadow-md"
                    : "border-border bg-white text-muted-foreground hover:border-primary/40 hover:text-primary"
                }`}
                data-ocid="products.filter.tab"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">
            {isSearching ? (
              <>
                Results for{" "}
                <span className="gradient-text">"{localSearch}"</span>
              </>
            ) : activeCategory === "All" ? (
              "All Products"
            ) : (
              activeCategory
            )}
          </h1>
          <span className="text-sm text-muted-foreground">
            {products.length} products
          </span>
        </div>

        {isLoading ? (
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            data-ocid="products.loading_state"
          >
            {SKELETON_KEYS.map((k) => (
              <ProductSkeleton key={k} />
            ))}
          </div>
        ) : products.length > 0 ? (
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {products.map((p, i) => (
              <ProductCard key={p.id.toString()} product={p} index={i} />
            ))}
          </motion.div>
        ) : (
          <div
            className="text-center py-20 bg-white rounded-2xl"
            data-ocid="products.empty_state"
          >
            <p className="text-4xl mb-3">🔍</p>
            <p className="font-semibold text-lg">No products found</p>
            <p className="text-muted-foreground text-sm mt-1">
              Try a different search or category
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
