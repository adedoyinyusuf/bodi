# Wearables - Premium Smart Wearables Platform

A sophisticated, elegantly designed product showcase platform built with Next.js, Vercel Storage (Vercel Postgres & Vercel Blob), and Tailwind CSS. Experience refined smart wearables through immersive galleries, authentic engagement, and seamless connectivity.

## Features

### 🎨 Product Display
- **Curated Gallery**: 3-column responsive grid showcasing handpicked smart wearables
- **Immersive Galleries**: Image galleries revealing products from every angle
- **Refined Experience**: Elegant transitions and polished interactions throughout

### 💬 Authentic Engagement
- **Likes & Comments**: Express appreciation with real-time engagement metrics
- **Community Feedback**: Share thoughts and read insights from discerning viewers
- **Social Connection**: Seamless sharing through direct links and native APIs

### 🔄 Elevated Experience
- **Visionary Homepage**: Bold hero with curated product showcase
- **About Wearables**: Refined narrative of mission, values, and vision
- **Direct Connection**: Multi-channel communication with OPay payment integration & WhatsApp connectivity
- **Seamless Navigation**: Elegant interface for effortless discovery

### 🔐 Enterprise-Grade Foundation
- **Vercel Storage**: 100% free Vercel Postgres relational database & Vercel Blob CDN file storage
- **Zero Configuration Costs**: Run everything within your Vercel Dashboard

## Tech Stack

- **Frontend**: Next.js 16 with React 19
- **Styling**: Tailwind CSS v4 with custom design tokens
- **Database**: Vercel Postgres (PostgreSQL)
- **File Storage**: Vercel Blob Storage
- **Icons**: Lucide React
- **Images**: Next.js Image component for optimization
- **API**: Next.js API Routes

## Setup Instructions

### 1. Environment Variables

Environment variables are auto-configured by Vercel when attaching Vercel Postgres and Blob:

```
POSTGRES_URL=your_vercel_postgres_connection_string
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
NEXT_PUBLIC_ADMIN_PASSWORD=admin123
```

### 2. Database Setup

The database schema is defined in `schema.sql`. Run `schema.sql` in the Vercel Postgres Query Editor to initialize:
- All required tables (`products`, `orders`, `order_items`, `product_comments`, `product_likes`, `messages`)
- Initial seed product data

### 3. Install Dependencies

```bash
pnpm install
```

### 4. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.
