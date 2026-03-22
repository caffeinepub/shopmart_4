import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Int "mo:core/Int";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Authorization system state and methods
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Type
  public type UserProfile = {
    name : Text;
  };

  type Product = {
    id : Nat;
    name : Text;
    description : Text;
    price : Nat;
    discountedPrice : Nat;
    discountPercent : Nat;
    imageUrl : Text;
    category : Text;
    rating : Text;
    stockCount : Nat;
  };

  type OrderItem = {
    productId : Nat;
    quantity : Nat;
    unitPrice : Nat;
  };

  type OrderRecord = {
    id : Nat;
    buyerId : Principal;
    items : [OrderItem];
    totalAmount : Nat;
    deliveryAddress : Text;
    status : Text; // "Pending", "Confirmed", "Delivered"
    createdAt : Int;
  };

  module Product {
    public func compareByName(a : Product, b : Product) : Order.Order {
      Text.compare(a.name, b.name);
    };
  };

  module OrderRecord {
    public func compareByCreatedAt(a : OrderRecord, b : OrderRecord) : Order.Order {
      Int.compare(a.createdAt, b.createdAt);
    };

    public func compareByTotalAmount(a : OrderRecord, b : OrderRecord) : Order.Order {
      Nat.compare(a.totalAmount, b.totalAmount);
    };
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let products = Map.empty<Nat, Product>();
  let orders = Map.empty<Nat, OrderRecord>();
  var nextProductId = 1;
  var nextOrderId = 1;

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Product Management (Admin Only)
  public shared ({ caller }) func addProduct(product : Product) : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };
    let id = nextProductId;
    let newProduct : Product = {
      product with
      id;
    };
    products.add(id, newProduct);
    nextProductId += 1;
    id;
  };

  public shared ({ caller }) func updateProduct(id : Nat, updatedProduct : Product) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };
    let existingProduct = products.get(id);
    switch (existingProduct) {
      case (null) {
        Runtime.trap("Product not found");
      };
      case (?product) {
        let newProduct : Product = {
          updatedProduct with
          id;
        };
        products.add(id, newProduct);
      };
    };
  };

  public shared ({ caller }) func deleteProduct(id : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };
    if (not products.containsKey(id)) {
      Runtime.trap("Product not found");
    };
    products.remove(id);
  };

  // Product Queries (Public Access)
  public query func getProduct(id : Nat) : async Product {
    switch (products.get(id)) {
      case (null) {
        Runtime.trap("Product not found");
      };
      case (?product) { product };
    };
  };

  public query func listProducts() : async [Product] {
    products.values().toArray();
  };

  public query func searchProducts(keyword : Text) : async [Product] {
    products.values().toArray().filter(
      func(p) { p.name.contains(#text keyword) or p.description.contains(#text keyword) }
    );
  };

  public query func filterByCategory(category : Text) : async [Product] {
    products.values().toArray().filter(
      func(p) { p.category == category }
    );
  };

  public query func getProductById(productId : Nat) : async Product {
    switch (products.get(productId)) {
      case (null) {
        Runtime.trap("Product not found");
      };
      case (?product) { product };
    };
  };

  // Order Management (User Access)
  public shared ({ caller }) func placeOrder(items : [OrderItem], deliveryAddress : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can place orders");
    };
    if (items.isEmpty()) {
      Runtime.trap("Order must contain at least one item");
    };

    // Validate products exist
    for (item in items.values()) {
      if (not products.containsKey(item.productId)) {
        Runtime.trap("Product with ID " # item.productId.toText() # " not found");
      };
    };

    let totalAmount = items.foldLeft(0, func(acc, item) { acc + (item.quantity * item.unitPrice) });

    let id = nextOrderId;
    let newOrder : OrderRecord = {
      id;
      buyerId = caller;
      items;
      totalAmount;
      deliveryAddress;
      status = "Pending";
      createdAt = Time.now();
    };
    orders.add(id, newOrder);
    nextOrderId += 1;
    id;
  };

  public query ({ caller }) func listMyOrders() : async [OrderRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their orders");
    };
    orders.values().toArray().filter(
      func(o) { o.buyerId == caller }
    );
  };

  public query ({ caller }) func getOrder(orderId : Nat) : async OrderRecord {
    switch (orders.get(orderId)) {
      case (null) {
        Runtime.trap("Order not found");
      };
      case (?order) {
        if (caller != order.buyerId and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own orders");
        };
        order;
      };
    };
  };

  public query ({ caller }) func getOrderItems(orderId : Nat) : async [OrderItem] {
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        if (caller != order.buyerId and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own orders");
        };
        order.items;
      };
    };
  };

  // Order Management (Admin Only)
  public shared ({ caller }) func updateOrderStatus(orderId : Nat, newStatus : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };
    let existingOrder = orders.get(orderId);
    switch (existingOrder) {
      case (null) {
        Runtime.trap("Order not found");
      };
      case (?order) {
        let updatedOrder : OrderRecord = {
          order with
          status = newStatus;
        };
        orders.add(orderId, updatedOrder);
      };
    };
  };

  public query ({ caller }) func listAllOrders() : async [OrderRecord] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };
    orders.values().toArray();
  };
};
