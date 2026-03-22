import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle,
  Edit2,
  Loader2,
  Package,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import React, { useState } from "react";
import { toast } from "sonner";
import type { Product } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAddProduct,
  useAllOrders,
  useDeleteProduct,
  useIsAdmin,
  useListProducts,
  useUpdateOrderStatus,
} from "../hooks/useQueries";

const CATEGORIES = [
  "Women's Fashion",
  "Men's Fashion",
  "Electronics",
  "Home & Living",
  "Beauty",
  "Shoes",
  "Groceries",
];
const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];

const EMPTY_PRODUCT = {
  name: "",
  description: "",
  category: "Electronics",
  price: "",
  discountedPrice: "",
  discountPercent: "",
  stockCount: "",
  rating: "4.0",
  imageUrl: "",
};

export default function AdminPage() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: products, isLoading: productsLoading } = useListProducts();
  const { data: orders, isLoading: ordersLoading } = useAllOrders();
  const { mutateAsync: addProduct, isPending: addPending } = useAddProduct();
  const { mutateAsync: deleteProduct, isPending: deletePending } =
    useDeleteProduct();
  const { mutateAsync: updateOrderStatus } = useUpdateOrderStatus();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newProduct, setNewProduct] = useState(EMPTY_PRODUCT);

  if (!identity) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-card p-10">
          <h2 className="text-xl font-bold mb-4">Admin Access Required</h2>
          <Button
            className="gradient-primary border-0 rounded-full"
            onClick={login}
            disabled={loginStatus === "logging-in"}
            data-ocid="admin.login_button"
          >
            Login
          </Button>
        </div>
      </main>
    );
  }

  if (adminLoading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-card p-10">
          <h2 className="text-xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">
            You don't have admin privileges.
          </p>
        </div>
      </main>
    );
  }

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price) {
      toast.error("Name and price are required");
      return;
    }
    const product: Product = {
      id: BigInt(0),
      name: newProduct.name,
      description: newProduct.description,
      category: newProduct.category,
      price: BigInt(Math.round(Number.parseFloat(newProduct.price) || 0)),
      discountedPrice: BigInt(
        Math.round(
          Number.parseFloat(newProduct.discountedPrice || newProduct.price) ||
            0,
        ),
      ),
      discountPercent: BigInt(
        Math.round(Number.parseFloat(newProduct.discountPercent || "0") || 0),
      ),
      stockCount: BigInt(
        Math.round(Number.parseFloat(newProduct.stockCount || "10") || 10),
      ),
      rating: newProduct.rating,
      imageUrl:
        newProduct.imageUrl ||
        `https://picsum.photos/seed/${encodeURIComponent(newProduct.name)}/400/400`,
    };
    try {
      await addProduct(product);
      setNewProduct(EMPTY_PRODUCT);
      setShowAddDialog(false);
      toast.success("Product added successfully!");
    } catch {
      toast.error("Failed to add product");
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deleteProduct(id);
      toast.success("Product deleted");
    } catch {
      toast.error("Failed to delete product");
    }
  };

  const handleStatusChange = async (orderId: bigint, status: string) => {
    try {
      await updateOrderStatus({ orderId, status });
      toast.success("Order status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  return (
    <main className="min-h-screen bg-background" data-ocid="admin.page">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-extrabold gradient-text">Admin Panel</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle className="h-4 w-4 text-success" />
            Admin Access
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            {
              label: "Total Products",
              value: products?.length ?? 0,
              icon: Package,
              color: "from-pink-500 to-purple-500",
            },
            {
              label: "Total Orders",
              value: orders?.length ?? 0,
              icon: ShoppingBag,
              color: "from-blue-500 to-cyan-500",
            },
            {
              label: "Pending Orders",
              value: orders?.filter((o) => o.status === "pending").length ?? 0,
              icon: Loader2,
              color: "from-orange-400 to-yellow-400",
            },
            {
              label: "Delivered",
              value:
                orders?.filter((o) => o.status === "delivered").length ?? 0,
              icon: CheckCircle,
              color: "from-green-500 to-emerald-500",
            },
          ].map(({ label, value, icon: Icon, color }) => (
            <div
              key={label}
              className="bg-white rounded-2xl shadow-card p-4 flex items-center gap-3"
            >
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}
              >
                <Icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-extrabold">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            </div>
          ))}
        </div>

        <Tabs defaultValue="products" data-ocid="admin.tab">
          <TabsList className="mb-4 bg-white shadow-card rounded-xl p-1">
            <TabsTrigger value="products" data-ocid="admin.products_tab">
              Products
            </TabsTrigger>
            <TabsTrigger value="orders" data-ocid="admin.orders_tab">
              Orders
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products">
            <div className="bg-white rounded-2xl shadow-card overflow-hidden">
              <div className="p-4 border-b flex items-center justify-between">
                <h2 className="font-bold">All Products</h2>
                <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      className="gradient-primary border-0 rounded-full"
                      data-ocid="admin.add_product_button"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent
                    className="max-w-lg"
                    data-ocid="admin.add_product_dialog"
                  >
                    <DialogHeader>
                      <DialogTitle>Add New Product</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3 py-2">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Name *</Label>
                          <Input
                            value={newProduct.name}
                            onChange={(e) =>
                              setNewProduct((p) => ({
                                ...p,
                                name: e.target.value,
                              }))
                            }
                            placeholder="Product name"
                            className="mt-1"
                            data-ocid="admin.product_name_input"
                          />
                        </div>
                        <div>
                          <Label>Category</Label>
                          <Select
                            value={newProduct.category}
                            onValueChange={(v) =>
                              setNewProduct((p) => ({ ...p, category: v }))
                            }
                          >
                            <SelectTrigger
                              className="mt-1"
                              data-ocid="admin.product_category_select"
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {CATEGORIES.map((c) => (
                                <SelectItem key={c} value={c}>
                                  {c}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={newProduct.description}
                          onChange={(e) =>
                            setNewProduct((p) => ({
                              ...p,
                              description: e.target.value,
                            }))
                          }
                          placeholder="Product description"
                          className="mt-1"
                          data-ocid="admin.product_desc_textarea"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <Label>Price (₹) *</Label>
                          <Input
                            type="number"
                            value={newProduct.price}
                            onChange={(e) =>
                              setNewProduct((p) => ({
                                ...p,
                                price: e.target.value,
                              }))
                            }
                            placeholder="999"
                            className="mt-1"
                            data-ocid="admin.product_price_input"
                          />
                        </div>
                        <div>
                          <Label>Sale Price (₹)</Label>
                          <Input
                            type="number"
                            value={newProduct.discountedPrice}
                            onChange={(e) =>
                              setNewProduct((p) => ({
                                ...p,
                                discountedPrice: e.target.value,
                              }))
                            }
                            placeholder="799"
                            className="mt-1"
                            data-ocid="admin.product_sale_price_input"
                          />
                        </div>
                        <div>
                          <Label>Discount %</Label>
                          <Input
                            type="number"
                            value={newProduct.discountPercent}
                            onChange={(e) =>
                              setNewProduct((p) => ({
                                ...p,
                                discountPercent: e.target.value,
                              }))
                            }
                            placeholder="20"
                            className="mt-1"
                            data-ocid="admin.product_discount_input"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Stock</Label>
                          <Input
                            type="number"
                            value={newProduct.stockCount}
                            onChange={(e) =>
                              setNewProduct((p) => ({
                                ...p,
                                stockCount: e.target.value,
                              }))
                            }
                            placeholder="100"
                            className="mt-1"
                            data-ocid="admin.product_stock_input"
                          />
                        </div>
                        <div>
                          <Label>Rating</Label>
                          <Input
                            value={newProduct.rating}
                            onChange={(e) =>
                              setNewProduct((p) => ({
                                ...p,
                                rating: e.target.value,
                              }))
                            }
                            placeholder="4.2"
                            className="mt-1"
                            data-ocid="admin.product_rating_input"
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Image URL</Label>
                        <Input
                          value={newProduct.imageUrl}
                          onChange={(e) =>
                            setNewProduct((p) => ({
                              ...p,
                              imageUrl: e.target.value,
                            }))
                          }
                          placeholder="https://... (optional)"
                          className="mt-1"
                          data-ocid="admin.product_image_input"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setShowAddDialog(false)}
                        data-ocid="admin.cancel_button"
                      >
                        Cancel
                      </Button>
                      <Button
                        className="gradient-primary border-0"
                        onClick={handleAddProduct}
                        disabled={addPending}
                        data-ocid="admin.confirm_add_button"
                      >
                        {addPending ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : null}
                        Add Product
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {productsLoading ? (
                <div
                  className="p-6 text-center"
                  data-ocid="admin.products_loading_state"
                >
                  <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table data-ocid="admin.products_table">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Sale Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(products ?? []).map((p, i) => (
                        <TableRow
                          key={p.id.toString()}
                          data-ocid={`admin.product_row.${i + 1}`}
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <img
                                src={
                                  p.imageUrl ||
                                  `https://picsum.photos/seed/${encodeURIComponent(p.name)}/60/60`
                                }
                                alt={p.name}
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                              <span className="font-medium text-sm max-w-40 truncate">
                                {p.name}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {p.category}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            ₹{Number(p.price).toLocaleString()}
                          </TableCell>
                          <TableCell className="text-warning font-medium">
                            ₹{Number(p.discountedPrice).toLocaleString()}
                          </TableCell>
                          <TableCell>{Number(p.stockCount)}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:bg-destructive/10 h-8 w-8"
                              onClick={() => handleDelete(p.id)}
                              disabled={deletePending}
                              data-ocid={`admin.delete_button.${i + 1}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <div className="bg-white rounded-2xl shadow-card overflow-hidden">
              <div className="p-4 border-b">
                <h2 className="font-bold">All Orders</h2>
              </div>
              {ordersLoading ? (
                <div
                  className="p-6 text-center"
                  data-ocid="admin.orders_loading_state"
                >
                  <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table data-ocid="admin.orders_table">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Buyer</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(orders ?? []).map((order, i) => (
                        <TableRow
                          key={order.id.toString()}
                          data-ocid={`admin.order_row.${i + 1}`}
                        >
                          <TableCell className="font-medium">
                            #{order.id.toString()}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground max-w-28 truncate">
                            {order.buyerId.toString().substring(0, 12)}...
                          </TableCell>
                          <TableCell className="font-bold">
                            ₹{Number(order.totalAmount).toLocaleString()}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(
                              Number(order.createdAt) / 1_000_000,
                            ).toLocaleDateString("en-IN")}
                          </TableCell>
                          <TableCell>
                            <Select
                              value={order.status}
                              onValueChange={(v) =>
                                handleStatusChange(order.id, v)
                              }
                            >
                              <SelectTrigger
                                className="h-8 w-32 text-xs"
                                data-ocid={`admin.order_status_select.${i + 1}`}
                              >
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {ORDER_STATUSES.map((s) => (
                                  <SelectItem
                                    key={s}
                                    value={s}
                                    className="text-xs capitalize"
                                  >
                                    {s}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
