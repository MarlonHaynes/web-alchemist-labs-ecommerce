# Web Alchemist Labs Ecommerce

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://webalchemistlabs-ecommerce.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth_%26_Firestore-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Checkout-635BFF?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com/)

A full-stack ecommerce storefront built as a production-style portfolio project. Customers browse the catalog, check out with Stripe, and track orders. Admins manage products, revenue, and fulfillment from a dedicated dashboard backed by Firebase.

---

## Live Demo

**[https://webalchemistlabs-ecommerce.vercel.app/](https://webalchemistlabs-ecommerce.vercel.app/)**

No signup required. Use the credentials below to explore every role immediately.

| Role | Email | Password |
|------|-------|----------|
| **Customer** | `user1234@gmail.com` | `happyfamily` |
| **Admin** | `webalchemistlabs@gmail.com` | `happy123` |

> Admin access also requires the signed-in email to be listed in `NEXT_PUBLIC_ADMIN_EMAILS` on the deployed environment.

---

## System Flow & Screenshots

End-to-end flow from catalog data in Firestore through Stripe checkout to admin order fulfillment.

### Firestore Data Model

Products, orders, and users live in Cloud Firestore. The catalog supports categories, pricing, stock, and image URLs.

![Firebase Firestore — products collection](./system%20flow/Firebase%20Database.jpg)

### Stripe Checkout

Authenticated customers are redirected to Stripe Checkout (CAD) with line items from the cart.

![Stripe hosted checkout](./system%20flow/Checkout%20form.jpg)

### Order Confirmation

After successful payment, the app records the order in Firestore and shows a confirmation summary.

![Payment successful — order confirmed](./system%20flow/Order%20Success.jpg)

### Admin Dashboard

Overview of products, orders, revenue, inventory, recent activity, and low-stock alerts.

![Admin overview dashboard](./system%20flow/Admin%20Dashboard.jpg)

### Product Management

Full CRUD for the Firestore product catalog — add, edit, and delete with stock tracking.

![Manage catalog products](./system%20flow/Product%20Management.jpg)

### Order Management

List all customer orders with payment status, fulfillment state, and revenue KPIs.

![Manage customer orders](./system%20flow/Order%20Management%20System.jpg)

### Order Detail (Admin)

Inspect line items, customer shipping details, and update order status.

![Admin order detail view](./system%20flow/Order%20Detail%20page.jpg)

---

## Key Features

### Storefront
- Product catalog with filtering and product detail pages
- Shopping cart with persistent session state
- Featured products on the home page
- Responsive layout with shared navigation and footer

### Customer Accounts
- Email/password registration and login (Firebase Auth)
- Protected dashboard with order history and order detail views
- Checkout flow with shipping information and Stripe Checkout (CAD)

### Admin
- Role-based admin access (configured via environment variable)
- Dashboard with recent orders, revenue, and inventory stats
- CRUD for products (add, edit, delete)
- Order list, order detail, and status updates

### Integrations
- **Firebase** — Authentication and Firestore for users, products, and orders
- **Stripe** — Hosted Checkout sessions via a Next.js API route
- **Zapier** (optional) — Webhook for order confirmation emails

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 |
| UI | React 19, React Router 6 |
| Language | TypeScript |
| Backend / Data | Firebase Auth, Firestore |
| Payments | Stripe Checkout |
| Deployment | Vercel (with SPA rewrites) |

The app uses Next.js for the build, API routes, and deployment, while client-side routing is handled by React Router inside a dynamically loaded client bundle (`ClientApp`).

---

## Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm (included with Node.js)
- A Firebase project with Authentication and Firestore enabled
- A Stripe account (test keys are fine for local development)

### 1. Clone and Install

```bash
git clone https://github.com/MarlonHaynes/web-alchemist-labs-ecommerce.git
cd web-alchemist-labs-ecommerce
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the project root (this file is gitignored):

```env
# Firebase (client — all NEXT_PUBLIC_*)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Admin access (comma-separated emails)
NEXT_PUBLIC_ADMIN_EMAILS=you@example.com

# Stripe
STRIPE_SECRET_KEY=sk_test_...

# Optional: override checkout API URL (defaults to /api/create-checkout-session)
# NEXT_PUBLIC_CHECKOUT_URL=

# Optional: Zapier order confirmation webhook
# NEXT_PUBLIC_ZAPIER_ORDER_WEBHOOK_URL=
```

Legacy `VITE_*` variable names are also supported via `next.config.mjs` for backward compatibility.

### 3. Firebase Setup

1. Create a Firebase project in the Firebase Console.
2. Enable **Email/Password** sign-in under Authentication.
3. Create a **Firestore** database (start in test mode for development, then tighten rules before production).
4. Copy your web app config into the `NEXT_PUBLIC_FIREBASE_*` variables above.

| Collection | Purpose |
|------------|---------|
| `products` | Store catalog (falls back to local mock data if empty) |
| `orders` | Completed orders after Stripe checkout |
| `users` | User profiles and roles (`admin` / `customer`) |

To seed sample products, use `src/firebase/seedProducts.ts` or add products through the admin UI at `/admin/products/new` after logging in as an admin.

### 4. Stripe Setup

1. Copy your **Secret key** from the Stripe Dashboard into `STRIPE_SECRET_KEY`.
2. For local testing, use test mode keys (`sk_test_...`).
3. Checkout redirects to `/order-success?session_id={CHECKOUT_SESSION_ID}` on success and `/checkout` on cancel.

Payments are processed in **CAD**.

### 5. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The Stripe checkout API route runs at `/api/create-checkout-session`.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Run the production server locally |
| `npm run lint` | Run ESLint |

---

## Project Structure

```
ecommerce/
├── pages/
│   ├── _app.tsx
│   ├── index.tsx
│   └── api/
│       └── create-checkout-session.ts
├── src/
│   ├── ClientApp.tsx
│   ├── App.tsx
│   ├── routes/
│   ├── pages/
│   ├── admin/
│   ├── components/
│   ├── context/
│   ├── services/
│   ├── firebase/
│   ├── data/
│   └── styles/
├── system flow/
├── public/
├── next.config.mjs
└── vercel.json
```

---

## API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/create-checkout-session` | Creates a Stripe Checkout session from cart line items |

---

## App Routes

| Path | Access | Description |
|------|--------|-------------|
| `/` | Public | Home |
| `/products` | Public | Product listing |
| `/products/:id` | Public | Product detail |
| `/cart` | Public | Shopping cart |
| `/login`, `/register` | Public | Authentication |
| `/dashboard` | Authenticated | Account and orders |
| `/dashboard/orders/:id` | Authenticated | Order detail |
| `/checkout` | Authenticated | Checkout |
| `/order-success` | Public | Post-payment confirmation |
| `/admin` | Admin | Admin dashboard |
| `/admin/products` | Admin | Manage products |
| `/admin/products/new` | Admin | Add product |
| `/admin/products/edit/:id` | Admin | Edit product |
| `/admin/orders` | Admin | All orders |
| `/admin/orders/:id` | Admin | Order detail |

Admin access is granted when the signed-in user's email appears in `NEXT_PUBLIC_ADMIN_EMAILS` (comma-separated, case-insensitive).

---

## Checkout Flow

1. User adds items to the cart and proceeds to `/checkout` while signed in.
2. Checkout data is stored locally, then the app calls `POST /api/create-checkout-session`.
3. User is redirected to Stripe Checkout.
4. On success, Stripe returns to `/order-success` with a `session_id`.
5. The app creates an order in Firestore (if not already present for that session) and clears the cart.
6. If configured, a Zapier webhook is triggered for order confirmation email.

---

## Deployment

The project is configured for Vercel:

1. Push the repository to GitHub (or connect your Git provider).
2. Import the project in Vercel.
3. Add all environment variables from `.env.local` in the Vercel project settings (including `STRIPE_SECRET_KEY` for the API route).
4. Deploy.

`vercel.json` rewrites all paths to `/` so React Router can handle client-side navigation on refresh and deep links.

---

## Contact

Available for full-time and contract opportunities.
📧 [marlon.haynes.dev@gmail.com](mailto:marlon.haynes.dev@gmail.com)

---

## License

Personal portfolio project — not licensed for reuse or redistribution.

© 2026 Marlon Haynes. All rights reserved.

---

<div align="center">

Built by Marlon Haynes • Web Alchemist Labs

</div>