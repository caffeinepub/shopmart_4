import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useParams } from "@tanstack/react-router";
import {
  Package,
  RotateCcw,
  Shield,
  ShoppingCart,
  Star,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import React, { useState } from "react";
import { toast } from "sonner";
import { useCart } from "../context/CartContext";
import { useGetProduct } from "../hooks/useQueries";

export default function ProductDetailPage() {
  const { id } = useParams({ from: "/product/$id" });
  const productId = BigInt(id);
  const { data: product, isLoading, isError } = useGetProduct(productId);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (isLoading) {
    return (
      <main
        className="min-h-screen bg-background"
        data-ocid="product_detail.loading_state"
      >
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <Skeleton className="aspect-square rounded-2xl" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (isError || !product) {
    return (
      <main
        className="min-h-screen bg-background flex items-center justify-center"
        data-ocid="product_detail.error_state"
      >
        <div className="text-center">
          <p className="text-4xl mb-3">😕</p>
          <p className="font-semibold">Product not found</p>
          <Link to="/products">
            <Button className="mt-4 gradient-primary border-0">
              Browse Products
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  const imageUrl =
    product.imageUrl ||
    `https://picsum.photos/seed/${encodeURIComponent(product.name)}/600/600`;
  const rating = Number.parseFloat(product.rating) || 4.2;
  const price = Number(product.price);
  const discountedPrice = Number(product.discountedPrice);
  const discountPercent = Number(product.discountPercent);
  const stock = Number(product.stockCount);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        productId: product.id.toString(),
        name: product.name,
        price: discountedPrice,
        imageUrl,
        category: product.category,
      });
    }
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <main
      className="min-h-screen bg-background"
      data-ocid="product_detail.page"
    >
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <Link to="/" className="text-muted-foreground hover:text-primary">
            Home
          </Link>
          <span className="text-muted-foreground">/</span>
          <Link
            to="/products"
            search={{ category: product.category }}
            className="text-muted-foreground hover:text-primary"
          >
            {product.category}
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-foreground font-medium truncate max-w-64">
            {product.name}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="rounded-2xl overflow-hidden bg-white shadow-card aspect-square">
              <img
                src={imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {discountPercent > 0 && (
              <Badge className="absolute top-4 left-4 bg-warning text-white border-0 text-sm font-bold px-3 py-1">
                {discountPercent}% OFF
              </Badge>
            )}
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-4"
          >
            <div>
              <Badge variant="outline" className="mb-2 text-xs">
                {product.category}
              </Badge>
              <h1 className="text-2xl font-bold">{product.name}</h1>
            </div>

            <div className="flex items-center gap-2">
              <span className="bg-success text-white text-sm font-bold px-2 py-0.5 rounded flex items-center gap-1">
                {rating.toFixed(1)} <Star className="h-3 w-3 fill-white" />
              </span>
              <span className="text-sm text-muted-foreground">
                4.5k ratings
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold">
                ₹{discountedPrice.toLocaleString()}
              </span>
              {price > discountedPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  ₹{price.toLocaleString()}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="text-lg font-bold text-warning">
                  {discountPercent}% off
                </span>
              )}
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              {stock > 0 ? (
                <span className="text-sm text-success font-medium">
                  In Stock ({stock} available)
                </span>
              ) : (
                <span className="text-sm text-destructive font-medium">
                  Out of Stock
                </span>
              )}
            </div>

            {stock > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">Qty:</span>
                <div className="flex items-center border rounded-full overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 hover:bg-muted transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 font-medium">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                    className="px-3 py-1 hover:bg-muted transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-2">
              <Button
                className="flex-1 gradient-primary border-0 rounded-full"
                onClick={handleAddToCart}
                disabled={stock === 0}
                data-ocid="product_detail.add_cart_button"
              >
                <ShoppingCart className="h-4 w-4 mr-2" /> Add to Cart
              </Button>
              <Link to="/cart" className="flex-1">
                <Button
                  className="w-full bg-warning hover:bg-warning/90 text-white border-0 rounded-full"
                  onClick={handleAddToCart}
                  disabled={stock === 0}
                  data-ocid="product_detail.buy_now_button"
                >
                  <Zap className="h-4 w-4 mr-2" /> Buy Now
                </Button>
              </Link>
            </div>

            <div className="flex gap-4 pt-4 border-t">
              {[
                { icon: Shield, text: "Secure Payment" },
                { icon: RotateCcw, text: "Easy Returns" },
                { icon: Package, text: "Fast Delivery" },
              ].map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-1 text-xs text-muted-foreground"
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
