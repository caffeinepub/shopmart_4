import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React from "react";
import { useCart } from "../context/CartContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalAmount } = useCart();
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();

  const deliveryFee = totalAmount > 500 ? 0 : 49;
  const finalAmount = totalAmount + deliveryFee;

  if (items.length === 0) {
    return (
      <main
        className="min-h-screen bg-background flex items-center justify-center"
        data-ocid="cart.page"
      >
        <div className="text-center py-20">
          <ShoppingBag className="h-20 w-20 mx-auto text-muted-foreground/40 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">
            Looks like you haven&apos;t added anything yet
          </p>
          <Link to="/products">
            <Button
              className="gradient-primary border-0 rounded-full px-8"
              data-ocid="cart.shop_button"
            >
              Start Shopping
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background" data-ocid="cart.page">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-extrabold mb-6">
          My Cart ({items.length} items)
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item, i) => (
                <motion.div
                  key={item.productId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-2xl shadow-card p-4 flex gap-4"
                  data-ocid={`cart.item.${i + 1}`}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-20 h-20 rounded-xl object-cover bg-gray-50"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.category}
                    </p>
                    <p className="text-lg font-bold text-foreground mt-1">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ₹{item.price.toLocaleString()} each
                    </p>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:bg-destructive/10 h-8 w-8"
                      onClick={() => removeFromCart(item.productId)}
                      data-ocid={`cart.delete_button.${i + 1}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center border rounded-full overflow-hidden">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity - 1)
                        }
                        className="px-2 py-1 hover:bg-muted transition-colors"
                        data-ocid={`cart.decrease_button.${i + 1}`}
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-3 text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1)
                        }
                        className="px-2 py-1 hover:bg-muted transition-colors"
                        data-ocid={`cart.increase_button.${i + 1}`}
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div
            className="bg-white rounded-2xl shadow-card p-6 h-fit"
            data-ocid="cart.summary_panel"
          >
            <h2 className="font-bold text-lg mb-4">Price Details</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Price ({items.length} items)
                </span>
                <span>₹{totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span
                  className={
                    deliveryFee === 0 ? "text-success font-medium" : ""
                  }
                >
                  {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-base">
                <span>Total Amount</span>
                <span>₹{finalAmount.toLocaleString()}</span>
              </div>
            </div>
            {deliveryFee > 0 && (
              <p className="text-xs text-success mt-2">
                Add ₹{500 - totalAmount} more for FREE delivery!
              </p>
            )}
            <Button
              className="w-full mt-4 gradient-primary border-0 rounded-full"
              onClick={() => navigate({ to: "/checkout" })}
              data-ocid="cart.checkout_button"
            >
              {identity ? "Proceed to Checkout" : "Login & Checkout"}{" "}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
