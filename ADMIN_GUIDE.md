# Admin Dashboard Guide

## Overview

The Wearables admin dashboard provides a comprehensive interface for managing products, uploading product images to Vercel Blob, viewing contact messages, and monitoring site statistics. The dashboard is password-protected and accessible at `/admin`.

## Access & Security

### Default Login Credentials

- **URL**: Navigate to `https://yourdomain.com/admin/login`
- **Default Password**: `admin123`
- **Important**: Change this password immediately in production

### How to Log In

1. Go to `/admin/login`
2. Enter the admin password: `admin123`
3. Click "Access Dashboard"
4. You'll be authenticated and redirected to the admin dashboard
5. Your session persists in your browser

### Changing Your Password

To change the admin password:

1. Set the `NEXT_PUBLIC_ADMIN_PASSWORD` environment variable in your Vercel project settings
2. Go to **Settings → Environment Variables** in Vercel
3. Add `NEXT_PUBLIC_ADMIN_PASSWORD` with your new password
4. Redeploy the application

## Dashboard Features

### 1. Dashboard Overview

The main dashboard displays:
- **Total Products**: Count of all products in your catalog
- **Messages**: Number of contact form submissions
- **Total Likes**: Sum of all product likes
- **Total Comments**: Sum of all product comments

Quick access buttons:
- Add New Product
- Manage Products
- View Messages

### 2. Products Management

#### Add New Product with Image Uploads

1. Click "Add Product" on the Products page or Dashboard
2. Fill in the product form:
   - **Title**: Product name
   - **Short Description**: Brief overview
   - **Detailed Description**: Complete product information
   - **Price**: Product price
   - **Category**: Select from Wearables, Audio, Displays, Accessories, Peripherals, Storage
   - **Images**: Paste image URLs OR click **Upload** to upload images directly to Vercel Blob CDN.
   - **Stock Status**: Toggle whether the product is in stock

3. Click "Create Product" to save

### 3. Vercel Storage Configuration

Environment variables automatically provisioned by Vercel:
- `POSTGRES_URL` (Vercel Postgres database)
- `BLOB_READ_WRITE_TOKEN` (Vercel Blob object storage)
- `NEXT_PUBLIC_ADMIN_PASSWORD` (Admin access password)

## API Endpoints

The admin dashboard uses these API endpoints:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/admin/stats` | GET | Fetch dashboard statistics |
| `/api/admin/products` | GET | List all products |
| `/api/admin/products` | POST | Create new product |
| `/api/admin/products/[id]` | DELETE | Delete product |
| `/api/upload` | POST | Upload product images to Vercel Blob |
| `/api/admin/messages` | GET | List all messages |
| `/api/admin/messages/[id]` | DELETE | Delete message |
