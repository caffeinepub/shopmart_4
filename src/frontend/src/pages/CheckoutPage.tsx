import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "@tanstack/react-router";
import { CheckCircle, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "../context/CartContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { usePlaceOrder } from "../hooks/useQueries";

export default function CheckoutPage() {
  const { items, totalAmount, clearCart } = useCart();
  const { identity, login, loginStatus } = useInternetIdentity();
  const { mutateAsync: placeOrder, isPending } = usePlaceOrder();
  const navigate = useNavigate();
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const deliveryFee = totalAmount > 500 ? 0 : 49;
  const finalAmount = totalAmount + deliveryFee;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone))
      e.phone = "Valid 10-digit phone required";
    if (!form.address.trim()) e.address = "Address is required";
    if (!form.city.trim()) e.city = "City is required";
    if (!form.pincode.trim() || !/^\d{6}$/.test(form.pincode))
      e.pincode = "Valid 6-digit pincode required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  if (!identity) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-card p-10">
          <h2 className="text-xl font-bold mb-4">Login to Continue</h2>
          <p className="text-muted-foreground mb-6">
            Please login to place your order
          </p>
          <Button
            className="gradient-primary border-0 rounded-full px-8"
            onClick={login}
            disabled={loginStatus === "logging-in"}
            data-ocid="checkout.login_button"
          >
            {loginStatus === "logging-in"
              ? "Logging in..."
              : "Login to Continue"}
          </Button>
        </div>
      </main>
    );
  }

  if (items.length === 0 && !orderPlaced) {
    navigate({ to: "/cart" });
    return null;
  }

  if (orderPlaced) {
    return (
      <main
        className="min-h-screen bg-background flex items-center justify-center"
        data-ocid="checkout.success_state"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center bg-white rounded-2xl shadow-card p-12 max-w-md"
        >
          <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
          <h2 className="text-2xl font-extrabold mb-2">Order Placed! 🎉</h2>
          <p className="text-muted-foreground mb-6">
            Your order has been confirmed and will be delivered soon.
          </p>
          <div className="flex gap-3 justify-center">
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => navigate({ to: "/orders" })}
            >
              My Orders
            </Button>
            <Button
              className="gradient-primary border-0 rounded-full"
              onClick={() => navigate({ to: "/" })}
            >
              Continue Shopping
            </Button>
          </div>
        </motion.div>
      </main>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const deliveryAddress = `${form.name}, ${form.phone}\n${form.address}, ${form.city} - ${form.pincode}`;
    const orderItems = items.map((item) => ({
      productId: BigInt(item.productId),
      quantity: BigInt(item.quantity),
      unitPrice: BigInt(item.price),
    }));

    try {
      await placeOrder({ items: orderItems, deliveryAddress });
      clearCart();
      setOrderPlaced(true);
    } catch {
      toast.error("Failed to place order. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-background" data-ocid="checkout.page">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-extrabold mb-6">Checkout</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white rounded-2xl shadow-card p-6">
            <h2 className="font-bold text-lg mb-4">Delivery Address</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    placeholder="Your full name"
                    className="mt-1"
                    data-ocid="checkout.name_input"
                  />
                  {errors.name && (
                    <p
                      className="text-xs text-destructive mt-1"
                      data-ocid="checkout.name_error"
                    >
                      {errors.name}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={form.phone}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, phone: e.target.value }))
                    }
                    placeholder="10-digit mobile number"
                    className="mt-1"
                    data-ocid="checkout.phone_input"
                  />
                  {errors.phone && (
                    <p
                      className="text-xs text-destructive mt-1"
                      data-ocid="checkout.phone_error"
                    >
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  value={form.address}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, address: e.target.value }))
                  }
                  placeholder="House no., street, area"
                  className="mt-1"
                  data-ocid="checkout.address_input"
                />
                {errors.address && (
                  <p
                    className="text-xs text-destructive mt-1"
                    data-ocid="checkout.address_error"
                  >
                    {errors.address}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={form.city}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, city: e.target.value }))
                    }
                    placeholder="City"
                    className="mt-1"
                    data-ocid="checkout.city_input"
                  />
                  {errors.city && (
                    <p
                      className="text-xs text-destructive mt-1"
                      data-ocid="checkout.city_error"
                    >
                      {errors.city}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input
                    id="pincode"
                    value={form.pincode}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, pincode: e.target.value }))
                    }
                    placeholder="6-digit pincode"
                    className="mt-1"
                    data-ocid="checkout.pincode_input"
                  />
                  {errors.pincode && (
                    <p
                      className="text-xs text-destructive mt-1"
                      data-ocid="checkout.pincode_error"
                    >
                      {errors.pincode}
                    </p>
                  )}
                </div>
              </div>
              <Button
                type="submit"
                className="w-full gradient-primary border-0 rounded-full py-6 text-base font-bold"
                disabled={isPending}
                data-ocid="checkout.place_order_button"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Placing
                    Order...
                  </>
                ) : (
                  `Place Order · ₹${finalAmount.toLocaleString()}`
                )}
              </Button>
            </form>
          </div>

          <div
            className="bg-white rounded-2xl shadow-card p-6 h-fit"
            data-ocid="checkout.summary_panel"
          >
            <h2 className="font-bold text-lg mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-3 items-center">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-bold">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
            <Separator className="my-3" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery</span>
                <span className={deliveryFee === 0 ? "text-success" : ""}>
                  {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>₹{finalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
