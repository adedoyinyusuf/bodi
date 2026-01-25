# Bodi - Extraordinary Electronics Unveiled

A sophisticated, elegantly designed product showcase platform built with Next.js, Supabase, and Tailwind CSS. Experience refined electronics through immersive galleries, authentic engagement, and seamless connectivity.

## Features

### 🎨 Product Display
- **Curated Gallery**: 3-column responsive grid showcasing handpicked electronics
- **Immersive Galleries**: Auto-cycling image galleries revealing products from every angle
- **Refined Experience**: Elegant transitions and polished interactions throughout

### 💬 Authentic Engagement
- **Likes System**: Express appreciation with real-time engagement metrics
- **Community Feedback**: Share thoughts and read insights from discerning viewers
- **Social Connection**: Seamless sharing through direct links and native APIs
- **Comprehensive View**: Modal experiences with detailed galleries and specifications

### 🔄 Elevated Experience
- **Visionary Homepage**: Bold hero with curated product showcase
- **About Bodi**: Refined narrative of mission, values, and vision
- **Direct Connection**: Multi-channel communication with WhatsApp integration
- **Seamless Navigation**: Elegant interface for effortless discovery

### 🔐 Enterprise-Grade Foundation
- **Supabase Integration**: Secure PostgreSQL with Row Level Security
- **Real-time Updates**: Instant synchronization of engagement metrics
- **OAuth Ready**: Prepare for sophisticated authentication flows
- **Trusted Storage**: All interactions protected and permanently preserved

## Tech Stack

- **Frontend**: Next.js 16 with React 19
- **Styling**: Tailwind CSS v4 with custom design tokens
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **Images**: Next.js Image component for optimization
- **API**: Next.js API Routes with server-side Supabase client

## Database Schema

### Tables

#### `products`
- `id`: UUID (primary key)
- `name`: Product name
- `description`: Short description
- `price`: Product price (numeric)
- `images`: Array of image URLs (JSONB)
- `details`: Extended product details
- `likes_count`: Total likes
- `comments_count`: Total comments
- `created_at`: Timestamp

#### `comments`
- `id`: UUID (primary key)
- `product_id`: FK to products
- `user_id`: User identifier
- `text`: Comment content
- `created_at`: Timestamp

#### `likes`
- `id`: UUID (primary key)
- `product_id`: FK to products
- `user_id`: User identifier
- `created_at`: Timestamp

#### `messages`
- `id`: UUID (primary key)
- `name`: Sender name
- `email`: Sender email
- `subject`: Message subject
- `message`: Message content
- `created_at`: Timestamp

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Database Setup

The database schema is initialized automatically via `scripts/01-init-database.sql`. This creates:
- All required tables
- Sample product data
- Row Level Security policies

### 3. Install Dependencies

```bash
npm install
# or
yarn install
```

### 4. Run Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## File Structure

```
├── app/
│   ├── layout.tsx              # Root layout with Navigation
│   ├── globals.css             # Global styles and design tokens
│   ├── page.tsx                # Landing page with gallery
│   ├── about/page.tsx          # About page
│   ├── contact/page.tsx        # Contact page with WhatsApp
│   └── api/
│       ├── messages/route.ts   # Message submission API
│       └── products/route.ts   # Products data API
├── components/
│   ├── navigation.tsx          # Top navigation bar
│   ├── footer.tsx              # Footer with links and contact
│   ├── product-card.tsx        # Product grid card
│   └── product-modal.tsx       # Detailed product view
├── lib/
│   ├── supabase.ts             # Supabase client singleton
│   └── services/
│       └── products.ts         # Product data services
└── scripts/
    └── 01-init-database.sql    # Database initialization
```

## Features in Detail

### Product Card Features
- Auto-cycling image gallery on hover
- Image counter showing current/total
- Like, comment, and share buttons
- Responsive layout adapting to screen size

### Product Modal Features
- Full-screen product details
- Large image gallery with navigation
- Thumbnail strip for quick image selection
- Comments section with add comment form
- Like and share actions
- Product details and description

### Contact Page
- Email contact form
- WhatsApp direct messaging integration
- Traditional contact methods (email, phone)
- Message history tracking in database

### Modern Minimalist Design
- Clean color palette (white, grays, accent colors)
- Consistent spacing and typography
- Smooth animations and transitions
- Accessible form inputs and buttons
- Mobile-first responsive design

## API Endpoints

### GET `/api/products`
Fetch all products with their details, likes, and comments counts.

### POST `/api/messages`
Submit contact form messages.

**Request body:**
```json
{
  "name": "string",
  "email": "string",
  "subject": "string",
  "message": "string"
}
```

### GET `/api/messages`
Retrieve all submitted contact messages.

## Customization

### WhatsApp Integration
Update the phone number in `/app/contact/page.tsx`:
```tsx
const whatsappLink = `https://wa.me/YOUR_PHONE_NUMBER?text=...`
```

### Contact Information
Update contact details in `/app/contact/page.tsx`:
- Email address
- Phone number
- Office location

### Design Tokens
Modify colors and spacing in `/app/globals.css`:
```css
:root {
  --primary: oklch(0.205 0 0);
  --background: oklch(1 0 0);
  /* ... more tokens */
}
```

## Performance Optimizations

- **Image Optimization**: Next.js Image component with lazy loading
- **Code Splitting**: Automatic route-based code splitting
- **Caching**: Browser caching with proper cache headers
- **Database Indexing**: Optimized queries on frequently accessed fields

## Security Features

- **Row Level Security (RLS)**: Database-level access control
- **Server-side API Routes**: Secure backend operations
- **Environment Variables**: Sensitive data never exposed to client
- **Input Validation**: Form validation on client and server

## Future Enhancements

- [ ] User authentication with Google/OAuth
- [ ] User profiles and saved favorites
- [ ] Product filtering and search
- [ ] Image upload functionality
- [ ] Admin dashboard for product management
- [ ] Email notifications for new comments
- [ ] Rating system for products
- [ ] Related products suggestions

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Other Platforms
Ensure your hosting supports:
- Node.js 18+
- Next.js 16
- Serverless functions

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues or questions, please check:
1. Supabase documentation: https://supabase.com/docs
2. Next.js documentation: https://nextjs.org/docs
3. Create an issue in the repository

---

Built with ❤️ using Next.js and Supabase
