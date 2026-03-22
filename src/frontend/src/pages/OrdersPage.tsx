import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { CheckCircle, Clock, Package, Truck, XCircle } from "lucide-react";
import { motion } from "motion/react";
import type React from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useMyOrders } from "../hooks/useQueries";

const STATUS_CONFIG: Record<
  string,
  { icon: React.ReactNode; color: string; label: string }
> = {
  pending: {
    icon: <Clock className="h-4 w-4" />,
    color: "bg-warning/10 text-warning border-warning/30",
    label: "Pending",
  },
  confirmed: {
    icon: <CheckCircle className="h-4 w-4" />,
    color: "bg-blue-50 text-blue-600 border-blue-200",
    label: "Confirmed",
  },
  shipped: {
    icon: <Truck className="h-4 w-4" />,
    color: "bg-purple-50 text-purple-600 border-purple-200",
    label: "Shipped",
  },
  delivered: {
    icon: <CheckCircle className="h-4 w-4" />,
    color: "bg-success/10 text-success border-success/30",
    label: "Delivered",
  },
  cancelled: {
    icon: <XCircle className="h-4 w-4" />,
    color: "bg-destructive/10 text-destructive border-destructive/30",
    label: "Cancelled",
  },
};

export default function OrdersPage() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const { data: orders, isLoading } = useMyOrders();

  if (!identity) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-card p-10">
          <Package className="h-16 w-16 mx-auto text-muted-foreground/40 mb-4" />
          <h2 className="text-xl font-bold mb-2">Login to view orders</h2>
          <p className="text-muted-foreground mb-6">
            Please login to see your order history
          </p>
          <Button
            className="gradient-primary border-0 rounded-full px-8"
            onClick={login}
            disabled={loginStatus === "logging-in"}
            data-ocid="orders.login_button"
          >
            Login
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background" data-ocid="orders.page">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-extrabold mb-6">My Orders</h1>

        {isLoading ? (
          <div className="space-y-4" data-ocid="orders.loading_state">
            {["a", "b", "c"].map((k) => (
              <div key={k} className="bg-white rounded-2xl shadow-card p-6">
                <Skeleton className="h-6 w-1/4 mb-3" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            ))}
          </div>
        ) : !orders || orders.length === 0 ? (
          <div
            className="text-center py-20 bg-white rounded-2xl"
            data-ocid="orders.empty_state"
          >
            <Package className="h-20 w-20 mx-auto text-muted-foreground/30 mb-4" />
            <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
            <p className="text-muted-foreground mb-6">
              Start shopping to see your orders here
            </p>
            <Link to="/products">
              <Button className="gradient-primary border-0 rounded-full px-8">
                Shop Now
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, i) => {
              const statusKey = order.status.toLowerCase();
              const statusCfg =
                STATUS_CONFIG[statusKey] || STATUS_CONFIG.pending;
              const date = new Date(Number(order.createdAt) / 1_000_000);

              return (
                <motion.div
                  key={order.id.toString()}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-2xl shadow-card p-6"
                  data-ocid={`orders.item.${i + 1}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-bold">Order #{order.id.toString()}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {date.toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <Badge
                      className={`flex items-center gap-1 border ${statusCfg.color}`}
                    >
                      {statusCfg.icon} {statusCfg.label}
                    </Badge>
                  </div>

                  <div className="space-y-1 mb-3">
                    {order.items.map((item) => (
                      <p
                        key={`${order.id}-${item.productId}`}
                        className="text-sm text-muted-foreground"
                      >
                        Product #{item.productId.toString()} ×{" "}
                        {item.quantity.toString()} — ₹
                        {Number(item.unitPrice).toLocaleString()}
                      </p>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Delivery to
                      </p>
                      <p className="text-sm font-medium truncate max-w-xs">
                        {order.deliveryAddress.split("\n")[0]}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Total</p>
                      <p className="font-bold">
                        ₹{Number(order.totalAmount).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
