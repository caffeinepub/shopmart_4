import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ChevronDown,
  Heart,
  LogOut,
  Package,
  Search,
  Settings,
  ShoppingCart,
  User,
} from "lucide-react";
import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useIsAdmin, useUserProfile } from "../hooks/useQueries";

const CATEGORIES = [
  "Women's Fashion",
  "Men's Fashion",
  "Electronics",
  "Home & Living",
  "Beauty",
  "Shoes",
];

export default function Header() {
  const { totalItems } = useCart();
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === "logging-in";
  const { data: isAdmin } = useIsAdmin();
  const { data: userProfile } = useUserProfile();

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        if (error.message === "User is already authenticated") {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate({ to: "/products", search: { q: searchQuery } });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 shrink-0"
          data-ocid="nav.link"
        >
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="font-extrabold text-xl gradient-text">ShopMart</span>
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 flex gap-2 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              data-ocid="header.search_input"
              placeholder="Search for products, brands and more..."
              className="pl-10 rounded-full border-2 border-primary/20 focus:border-primary/60"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            type="submit"
            className="rounded-full gradient-primary border-0 px-6"
            data-ocid="header.search_button"
          >
            Search
          </Button>
        </form>

        {/* Right actions */}
        <div className="flex items-center gap-3 shrink-0">
          {/* User */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1"
                  data-ocid="header.user_button"
                >
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium max-w-24 truncate">
                    {userProfile?.name || "Account"}
                  </span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" data-ocid="header.dropdown_menu">
                <DropdownMenuItem asChild>
                  <Link to="/orders" data-ocid="nav.orders_link">
                    <Package className="mr-2 h-4 w-4" /> My Orders
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin" data-ocid="nav.admin_link">
                      <Settings className="mr-2 h-4 w-4" /> Admin Panel
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={handleAuth}
                  data-ocid="header.logout_button"
                >
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={handleAuth}
              disabled={isLoggingIn}
              size="sm"
              className="gradient-primary border-0 rounded-full"
              data-ocid="header.login_button"
            >
              {isLoggingIn ? "Logging in..." : "Login"}
            </Button>
          )}

          {/* Favorites */}
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            data-ocid="header.favorites_button"
          >
            <Heart className="h-5 w-5" />
          </Button>

          {/* Cart */}
          <Link to="/cart" data-ocid="nav.cart_link">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs gradient-primary border-0">
                  {totalItems}
                </Badge>
              )}
            </Button>
          </Link>
        </div>
      </div>

      {/* Category ribbon */}
      <nav className="category-ribbon" data-ocid="nav.category_ribbon">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center overflow-x-auto scrollbar-hide">
            {CATEGORIES.map((cat, i) => (
              <React.Fragment key={cat}>
                {i > 0 && <span className="text-white/40 text-xs px-1">|</span>}
                <Link
                  to="/products"
                  search={{ category: cat }}
                  className="text-white/90 hover:text-white text-xs font-medium py-2 px-3 whitespace-nowrap transition-colors"
                  data-ocid="nav.category_link"
                >
                  {cat}
                </Link>
              </React.Fragment>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
