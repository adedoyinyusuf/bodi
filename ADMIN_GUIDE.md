# Admin Dashboard Guide

## Overview

The Bodi admin dashboard provides a comprehensive interface for managing products, viewing contact messages, and monitoring site statistics. The dashboard is password-protected and accessible at `/admin`.

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

### Troubleshooting Login Issues

If you can't log in:
- Make sure you're using the correct password (`admin123` by default)
- Clear your browser cache and cookies
- Try in an incognito/private window
- Verify you're accessing `/admin/login` (not just `/admin`)

### Changing Your Password

To change the admin password:

1. Set the `NEXT_PUBLIC_ADMIN_PASSWORD` environment variable in your Vercel project settings
2. Go to **Settings → Environment Variables** in Vercel
3. Add `NEXT_PUBLIC_ADMIN_PASSWORD` with your new password
4. Redeploy the application
5. Log in with the new password

**Important:** The password is stored in plaintext in the environment variable. For production use, consider implementing Supabase Auth with admin roles for better security.

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

System status indicators show the connection status of your database and APIs.

### 2. Products Management

#### View All Products

- Access via `Products` in the sidebar
- Search products by name or category
- View product details: name, category, price, stock status, creation date

#### Add New Product

1. Click "Add Product" on the Products page or Dashboard
2. Fill in the product form:
   - **Title**: Product name
   - **Short Description**: Brief overview (shown in listings)
   - **Detailed Description**: Complete product information
   - **Price**: Product price (numerical value)
   - **Category**: Select from predefined categories
   - **Images**: Add up to 5 product images (URLs)
   - **Stock Status**: Toggle whether the product is in stock

3. Click "Create Product" to save

**Image Guidelines:**
- Use URLs to images (e.g., from Unsplash, your image hosting service)
- Supported formats: JPEG, PNG, WebP
- Recommended dimensions: 800x600px or higher
- Maximum 5 images per product

#### Edit Products

1. Go to Products page
2. Click the edit icon (pencil) next to a product
3. Modify any fields
4. Save changes

#### Delete Products

1. Go to Products page
2. Click the delete icon (trash) next to a product
3. Confirm deletion in the modal
4. Product will be removed from the catalog

### 3. Messages Management

#### View Contact Messages

1. Access via `Messages` in the sidebar
2. Browse all contact form submissions in the left panel
3. Click a message to view full details

#### Message Details Include

- Sender's name and email
- Phone number (if provided)
- Full message content
- Submission timestamp

#### Respond to Messages

From a message's detail view:
- **Reply via Email**: Click to compose an email response
- **WhatsApp**: Send a message via WhatsApp (if phone number is available)
- **Delete**: Remove the message

#### Message Retention

Messages are stored indefinitely. Consider implementing automated cleanup for old messages if needed.

## Categories

Available product categories:
- Audio
- Displays
- Wearables
- Accessories
- Peripherals
- Storage

Add new categories by updating the product form component.

## System Status

The Settings page displays:
- **Security**: Current session status and password management instructions
- **Database**: Supabase connection status and required environment variables
- **System Info**: Environment, dashboard version, and last update date

## Environment Variables

Required for the admin dashboard:

```env
# Supabase (required)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Admin Password (optional, defaults to 'admin123')
NEXT_PUBLIC_ADMIN_PASSWORD=your_secure_password
```

## API Endpoints

The admin dashboard uses these API endpoints:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/admin/stats` | GET | Fetch dashboard statistics |
| `/api/admin/products` | GET | List all products |
| `/api/admin/products` | POST | Create new product |
| `/api/admin/products/[id]` | DELETE | Delete product |
| `/api/admin/messages` | GET | List all messages |
| `/api/admin/messages/[id]` | DELETE | Delete message |

## Best Practices

1. **Backup Your Data**: Regularly backup your Supabase database
2. **Change Default Password**: Update `NEXT_PUBLIC_ADMIN_PASSWORD` immediately
3. **Use HTTPS**: Always access the admin dashboard over HTTPS
4. **Monitor Messages**: Regularly check contact messages and respond promptly
5. **Keep Inventory Updated**: Update product stock status when inventory changes
6. **Use Descriptive Titles**: Create clear, informative product titles for better SEO
7. **High-Quality Images**: Use professional product images for better conversions
8. **Proofread Content**: Review descriptions for typos and accuracy

## Troubleshooting

### Can't Access Admin Dashboard

1. Verify `NEXT_PUBLIC_ADMIN_PASSWORD` is set correctly
2. Clear your browser cache and session storage
3. Try accessing in an incognito/private window
4. Check that Supabase credentials are correct

### Products Not Showing

1. Verify Supabase connection in Settings
2. Check that `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
3. Ensure products table exists in your database
4. Check browser console for API errors

### Images Not Loading

1. Verify image URLs are publicly accessible
2. Check URL format is complete (include https://)
3. Ensure images meet size and format requirements
4. Try a different image URL to test

### Database Connection Issues

1. Verify Supabase URL and keys in environment variables
2. Check that your Supabase project is active
3. Verify network connectivity
4. Check Supabase dashboard for any service issues

## Future Enhancements

Consider implementing:
- User roles and permissions (Admin, Editor, Viewer)
- Product analytics and insights
- Bulk product imports/exports
- Scheduled product publishing
- Message email notifications
- Product review moderation
- Analytics dashboard with charts
- Export data functionality

## Support

For issues or questions about the admin dashboard, refer to:
- Supabase Documentation: https://supabase.com/docs
- Next.js Documentation: https://nextjs.org/docs
- Project Repository: Check your GitHub repository
