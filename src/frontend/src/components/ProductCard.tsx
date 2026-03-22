import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ShoppingCart, Star } from "lucide-react";
import type React from "react";
import { toast } from "sonner";
import type { Product } from "../backend";
import { useCart } from "../context/CartContext";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addToCart } = useCart();

  const imageUrl =
    product.imageUrl ||
    `https://picsum.photos/seed/${encodeURIComponent(product.name)}/400/400`;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      productId: product.id.toString(),
      name: product.name,
      price: Number(product.discountedPrice),
      imageUrl,
      category: product.category,
    });
    toast.success(`${product.name} added to cart!`);
  };

  const discountPercent = Number(product.discountPercent);
  const price = Number(product.price);
  const discountedPrice = Number(product.discountedPrice);
  const rating = Number.parseFloat(product.rating) || 4.2;

  return (
    <Link
      to="/product/$id"
      params={{ id: product.id.toString() }}
      data-ocid={`product.item.${index + 1}`}
    >
      <div className="bg-white rounded-xl shadow-card hover:shadow-hover transition-all duration-200 overflow-hidden group cursor-pointer flex flex-col h-full">
        {/* Image */}
        <div className="relative overflow-hidden aspect-square bg-gray-50">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {discountPercent > 0 && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-warning text-white border-0 text-xs font-bold">
                {discountPercent}% OFF
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3 flex flex-col flex-1">
          {/* Rating */}
          <div className="flex items-center gap-1 mb-1">
            <span className="bg-success text-white text-xs font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
              {rating.toFixed(1)} <Star className="h-2.5 w-2.5 fill-white" />
            </span>
          </div>

          {/* Name */}
          <p className="text-sm font-medium text-foreground line-clamp-2 mb-2 flex-1">
            {product.name}
          </p>

          {/* Prices */}
          <div className="flex items-center gap-2 flex-wrap mb-3">
            <span className="text-base font-bold text-foreground">
              ₹{discountedPrice.toLocaleString()}
            </span>
            {price > discountedPrice && (
              <span className="text-xs text-muted-foreground line-through">
                ₹{price.toLocaleString()}
              </span>
            )}
            {discountPercent > 0 && (
              <span className="text-xs font-semibold text-warning">
                {discountPercent}% off
              </span>
            )}
          </div>

          {/* Add to cart */}
          <Button
            size="sm"
            className="w-full gradient-primary border-0 rounded-full text-xs"
            onClick={handleAddToCart}
            data-ocid={`product.add_button.${index + 1}`}
          >
            <ShoppingCart className="h-3 w-3 mr-1" />
            Add to Cart
          </Button>
        </div>
      </div>
    </Link>
  );
}
