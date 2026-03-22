# ShopMart

## Current State
New project. Only scaffolded backend stub and empty frontend exist.

## Requested Changes (Diff)

### Add
- E-commerce marketplace app like Meesho/Flipkart
- Product catalog with categories (Women's Fashion, Men's Fashion, Electronics, Home & Living, Beauty, Kids, Shoes)
- Product listings with name, price, discounted price, discount %, image, rating, category, description
- Shopping cart (add/remove/update quantity)
- Product search and category filter
- Admin panel: add/edit/delete products, view all orders
- Order placement (checkout flow: cart -> address -> confirm order)
- User orders history
- Authorization: buyer role (shop, cart, orders) and admin role (manage products + view orders)

### Modify
- N/A

### Remove
- N/A

## Implementation Plan
1. Backend: Products actor (CRUD, list by category, search). Orders actor (place order, list by user, list all for admin). Cart stored on frontend. Authorization with admin/buyer roles.
2. Frontend:
   - Home page: hero banner, category quick links, trending products grid
   - Product listing page with search + category filter
   - Product detail page
   - Cart sidebar/drawer
   - Checkout flow
   - My Orders page
   - Admin panel: product management + orders view
3. Sample products seeded across all categories
