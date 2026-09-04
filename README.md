# 1Fi SDE1 Assignment - Full-Stack Mutual Fund-Backed EMI Platform

A modern, production-grade full-stack web application showcasing smartphones with dynamic EMI plans backed by mutual funds. Built strictly following the requirements and design specifications of the **1Fi SDE1 Assignment**.

---


---

## 🚀 Key Features & Assignment Alignment

1. **Dynamic Product Catalog & Detail Pages (`/products/:slug`)**:
   - Unique URLs for each product (e.g. `/products/iphone-17-pro`, `/products/samsung-s26-ultra`, `/products/google-pixel-11-pro`).
   - Dynamic variant selector (Colors & Storage options) with synchronized high-res imagery, instant price recalculation, and stock validation.
2. **Mutual Fund-Backed EMI Engine**:
   - Displays monthly payment amounts, tenures (3, 6, 12, 24, 36, 48, 60 months), interest rates (0% and 10.5%), and guaranteed cashback info (`Additional cashback of ₹7,500` in green).
   - Interactive plan selection matching the exact reference UI from the assignment brief.
3. **Simulated Application & Order Creation Flow**:
   - 2-step simulated flow: Plan Review $\rightarrow$ Customer Details (Name, Phone, Email, PAN) $\rightarrow$ Order Creation $\rightarrow$ Confirmation screen with Order Reference ID.
   - Clearly labeled as simulated functionality without mock payment gateway or fake KYC overengineering.
4. **PostgreSQL Database & Clean Relational Architecture**:
   - Production-ready PostgreSQL database with Prisma ORM (tested locally and compatible with Neon/Supabase).
   - Zero hardcoded product or EMI data.
5. **Robust RESTful APIs with Zod Validation**:
   - Strict HTTP status codes (`200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`, `500 Server Error`).
   - Relational cross-checks ensuring selected EMI plans belong to the specified variant/product.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14+ (App Router, React 18), TypeScript, Tailwind CSS, Lucide Icons
- **Backend**: Next.js Route Handlers (Node.js runtime)
- **Validation**: Zod
- **Database & ORM**: PostgreSQL (Local / Neon Serverless Postgres / Supabase) with Prisma ORM
- **Deployment**: Vercel

---

## 📁 Project Structure

```
1fi/
├── prisma/
│   ├── schema.prisma             # PostgreSQL schema (Product, Variant, Image, EmiPlan, Order)
│   └── seed.ts                   # Seeds 3 flagship phones with multi-variants & exact EMI plans
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── products/
│   │   │   │   ├── route.ts              # GET /api/products
│   │   │   │   └── [slug]/
│   │   │   │       └── route.ts          # GET /api/products/[slug]
│   │   │   └── orders/
│   │   │       └── route.ts              # POST /api/orders (Zod validated, 201 Created)
│   │   ├── products/
│   │   │   └── [slug]/
│   │   │       └── page.tsx              # Server-rendered dynamic product detail page
│   │   ├── layout.tsx                    # Root layout with 1Fi header and footer
│   │   ├── page.tsx                      # Product catalog listing page
│   │   ├── loading.tsx                   # Shimmer loading skeleton
│   │   ├── error.tsx                     # Error boundary
│   │   ├── not-found.tsx                 # 404 page for missing products
│   │   └── globals.css                   # Tailwind tokens & brand styles
│   ├── components/
│   │   ├── Navbar.tsx                    # 1Fi branding header
│   │   ├── Footer.tsx                    # Compact footer with compliance notes
│   │   ├── ProductCard.tsx               # Catalog product card
│   │   └── ProductDetail/
│   │       ├── ImageGallery.tsx          # Dynamic variant image & finish switcher
│   │       ├── VariantSelector.tsx       # Color & storage selectors
│   │       ├── EmiPlanCard.tsx           # Exact assignment reference EMI card
│   │       ├── EmiPlanList.tsx           # EMI plan group & proceed action button
│   │       ├── ProductClientView.tsx     # State manager for variant & EMI selection
│   │       └── SimulatedCheckoutModal.tsx# 2-step simulated checkout modal
│   ├── lib/
│   │   ├── prisma.ts                     # PrismaClient singleton
│   │   ├── validations.ts                # Zod schema for order requests
│   │   └── utils.ts                      # INR currency & formatting helpers
│   └── types/
│       └── index.ts                      # Shared TypeScript data types
├── .env.example                          # Sample environment configuration
├── package.json
└── README.md
```

---

## 📊 Database Schema Design

```mermaid
erDiagram
    Product ||--o{ ProductVariant : "has"
    Product ||--o{ EmiPlan : "offers"
    ProductVariant ||--o{ VariantImage : "contains"
    ProductVariant ||--o{ EmiPlan : "calculates"
    EmiPlan ||--o{ Order : "applied to"

    Product {
        string id PK
        string slug UK
        string name
        string brand
        string description
        string badge
        int basePrice
        int baseMrp
        datetime createdAt
    }

    ProductVariant {
        string id PK
        string productId FK
        string name
        string color
        string colorHex
        string storage
        int price
        int mrp
        string sku UK
        int stock
        boolean isDefault
    }

    VariantImage {
        string id PK
        string variantId FK
        string url
        string alt
        boolean isPrimary
        int order
    }

    EmiPlan {
        string id PK
        string productId FK
        string variantId FK
        int monthlyAmount
        int tenureMonths
        float interestRate
        int cashbackAmount
        string mutualFundBacking
        boolean isPopular
    }

    Order {
        string id PK
        string emiPlanId FK
        string variantId FK
        string customerName
        string customerPhone
        string customerEmail
        string panNumber
        string status
        datetime createdAt
    }
```

---

## 💻 Local Setup & Run Instructions

### Prerequisites
- Node.js 18+ installed
- PostgreSQL 14+ installed (or a free cloud database on [Neon.tech](https://neon.tech) / [Supabase](https://supabase.com))

### 1. Clone & Install Dependencies
```bash
git clone <your-repo-url>
cd 1fi
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the project root:
```env
# PostgreSQL connection string
DATABASE_URL="postgresql://username:password@localhost:5432/onefi?schema=public"

# App Base URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Push Schema & Seed Database
```bash
# Push Prisma schema to PostgreSQL
npx prisma db push

# Seed the database with 3 products, multi-variants, and mutual fund EMI plans
npm run db:seed
```

### 4. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔌 API Documentation & Example Responses

### 1. `GET /api/products`
Retrieves all products with basic variant count, primary image, and starting monthly EMI.

**Request:**
```bash
curl -X GET http://localhost:3000/api/products
```

**Response (`200 OK`):**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": "cmtlbzezf000011o9n8jllfvg",
      "slug": "iphone-17-pro",
      "name": "iPhone 17 Pro",
      "brand": "Apple",
      "description": "Engineered from forged aerospace-grade titanium...",
      "badge": "NEW",
      "basePrice": 127400,
      "baseMrp": 134900,
      "variantsCount": 4,
      "primaryImage": "/products/iphone-17-pro/desert-titanium.jpg",
      "startingMonthlyEmi": 11242,
      "createdAt": "2026-09-03T09:36:55.707Z"
    }
  ]
}
```

---

### 2. `GET /api/products/[slug]`
Retrieves full details for a product by slug (or ID), including all variants, images, and applicable EMI plans.

**Request:**
```bash
curl -X GET http://localhost:3000/api/products/iphone-17-pro
```

**Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "id": "cmtlbzezf000011o9n8jllfvg",
    "slug": "iphone-17-pro",
    "name": "iPhone 17 Pro",
    "brand": "Apple",
    "description": "Engineered from forged aerospace-grade titanium...",
    "badge": "NEW",
    "basePrice": 127400,
    "baseMrp": 134900,
    "variants": [
      {
        "id": "cmtlbzezi000211o91f9jdwz2",
        "name": "iPhone 17 Pro 256GB - Desert Titanium",
        "color": "Desert Titanium",
        "colorHex": "#C9A98C",
        "storage": "256GB",
        "price": 127400,
        "mrp": 134900,
        "sku": "IPH-17P-256-DESERT",
        "stock": 25,
        "isDefault": true,
        "images": [
          {
            "id": "cmtlbzezj000411o9e7y77j94",
            "url": "/products/iphone-17-pro/desert-titanium.jpg",
            "alt": "iPhone 17 Pro 256GB - Desert Titanium view 1",
            "isPrimary": true
          }
        ],
        "emiPlans": [
          {
            "id": "cmtlbzezn000811o98jffs5g1",
            "monthlyAmount": 44967,
            "tenureMonths": 3,
            "interestRate": 0,
            "cashbackAmount": 7500,
            "mutualFundBacking": "EMI plans backed by mutual funds"
          },
          {
            "id": "cmtlbzezo000a11o9pv8657me",
            "monthlyAmount": 11242,
            "tenureMonths": 12,
            "interestRate": 0,
            "cashbackAmount": 7500,
            "mutualFundBacking": "EMI plans backed by mutual funds",
            "isPopular": true
          }
        ]
      }
    ]
  }
}
```

**Error Response (`404 Not Found`):**
```json
{
  "success": false,
  "error": "Product not found with slug or ID: non-existent-phone"
}
```

---

### 3. `POST /api/orders`
Creates a simulated order application. Includes Zod schema validation and relational cross-validation.

**Request:**
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "variantId": "cmtlbzezi000211o91f9jdwz2",
    "emiPlanId": "cmtlbzezo000a11o9pv8657me",
    "customerName": "Naman Sharma",
    "customerPhone": "9876543210",
    "customerEmail": "naman@example.com",
    "panNumber": "ABCDE1234F"
  }'
```

**Success Response (`201 Created`):**
```json
{
  "success": true,
  "message": "Order created successfully (Simulated Mutual Fund EMI Application)",
  "data": {
    "orderId": "cmtlc4p5c0001qy9726bcdevy",
    "status": "CONFIRMED",
    "productName": "iPhone 17 Pro (256GB - Desert Titanium)",
    "monthlyAmount": 11242,
    "tenureMonths": 12,
    "interestRate": 0,
    "cashbackAmount": 7500,
    "customerName": "Naman Sharma",
    "customerEmail": "naman@example.com",
    "createdAt": "2026-09-03T09:41:02.160Z"
  }
}
```

**Validation Error (`400 Bad Request`):**
```json
{
  "success": false,
  "error": "Validation error: Please enter a valid 10-digit Indian mobile number"
}
```

---

## ☁️ Deployment Guide (Vercel + Neon / Supabase)

1. **Database Setup**:
   - Create a free PostgreSQL database on [Neon.tech](https://neon.tech) or [Supabase](https://supabase.com).
   - Copy the connection string (with pooled connection mode for serverless).
2. **Push Schema & Seed Cloud Database**:
   ```bash
   DATABASE_URL="your-neon-or-supabase-url" npx prisma db push
   DATABASE_URL="your-neon-or-supabase-url" npm run db:seed
   ```
3. **Deploy to Vercel**:
   - Push this repository to GitHub.
   - Import into [Vercel](https://vercel.com).
   - Add environment variable `DATABASE_URL` with your cloud PostgreSQL connection string.
   - Click **Deploy**.

---

## 📹 Video Walkthrough Guidelines (2-5 Minutes)

When recording your submission video, cover the following 3 areas:
1. **Frontend Demo**:
   - Browse catalog (`/`) showing all 3 devices.
   - Navigate to `/products/iphone-17-pro` and showcase variant switching (storage & color changes updating price and images).
   - Show available EMI plans matching reference layout (0% interest, 10.5% interest, cashback).
   - Click "Proceed with selected plan", fill customer details in the modal, and submit.
   - Show instant application confirmation with generated Order ID.
2. **Backend Architecture**:
   - Show Next.js Route Handlers (`src/app/api/products`, `src/app/api/products/[slug]`, `src/app/api/orders`).
   - Highlight Zod validation and cross-entity relationship verification.
3. **Database**:
   - Show PostgreSQL tables (`Product`, `ProductVariant`, `EmiPlan`, `Order`) via Prisma Studio (`npx prisma studio`) or database GUI, demonstrating the newly created order record.
