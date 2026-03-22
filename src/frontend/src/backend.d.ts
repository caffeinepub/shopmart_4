import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface OrderItem {
    productId: bigint;
    quantity: bigint;
    unitPrice: bigint;
}
export interface OrderRecord {
    id: bigint;
    status: string;
    deliveryAddress: string;
    createdAt: bigint;
    totalAmount: bigint;
    buyerId: Principal;
    items: Array<OrderItem>;
}
export interface UserProfile {
    name: string;
}
export interface Product {
    id: bigint;
    name: string;
    description: string;
    discountPercent: bigint;
    stockCount: bigint;
    imageUrl: string;
    category: string;
    rating: string;
    price: bigint;
    discountedPrice: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addProduct(product: Product): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteProduct(id: bigint): Promise<void>;
    filterByCategory(category: string): Promise<Array<Product>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getOrder(orderId: bigint): Promise<OrderRecord>;
    getOrderItems(orderId: bigint): Promise<Array<OrderItem>>;
    getProduct(id: bigint): Promise<Product>;
    getProductById(productId: bigint): Promise<Product>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listAllOrders(): Promise<Array<OrderRecord>>;
    listMyOrders(): Promise<Array<OrderRecord>>;
    listProducts(): Promise<Array<Product>>;
    placeOrder(items: Array<OrderItem>, deliveryAddress: string): Promise<bigint>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchProducts(keyword: string): Promise<Array<Product>>;
    updateOrderStatus(orderId: bigint, newStatus: string): Promise<void>;
    updateProduct(id: bigint, updatedProduct: Product): Promise<void>;
}
