# Swamy Jewellery — Full Dynamic Setup Guide

## Architecture Overview

```
┌──────────────────┐         ┌──────────────────┐
│   Customer App   │         │    Admin App     │
│   (my-app)       │◄────────│  (admin-app)     │
│   Port 3000      │  reads  │   Port 3001      │
│   Public access  │         │   Auth required  │
└────────┬─────────┘         └────────┬─────────┘
         │                            │
         │     ┌──────────────┐       │
         └────►│   Supabase   │◄──────┘
               │  (Free Tier) │
               │  • Database  │
               │  • Auth      │
               │  • Storage   │
               │  • Realtime  │
               └──────────────┘
```

- **Customer app** (`my-app/`): Public-facing Next.js site, reads data from Supabase in real-time
- **Admin app** (`admin-app/`): Separate, protected dashboard for managing products, categories, collections, and schemes

---

## Step 1: Create a Supabase Project (FREE)

1. Go to [https://supabase.com](https://supabase.com) and sign up (free)
2. Click **New Project**
3. Choose an organization, give it a name (e.g., `swamy-jewellery`)
4. Set a **database password** (save this!)
5. Choose the **closest region** (e.g., Mumbai — ap-south-1)
6. Click **Create new project** and wait ~2 minutes

## Step 2: Run the Database Schema

1. In your Supabase Dashboard, go to **SQL Editor** (left sidebar)
2. Click **New Query**
3. Copy the entire contents of `my-app/supabase-schema.sql`
4. Paste it into the SQL Editor
5. Click **Run** (or Ctrl+Enter)
6. You should see "Success. No rows returned" — this means all tables, policies, and seed data were created

## Step 3: Create a Storage Bucket

1. In Supabase Dashboard, go to **Storage** (left sidebar)
2. Click **New Bucket**
3. Name it exactly: `product-images`
4. Toggle **Public bucket** to ON
5. Click **Create Bucket**
6. Click on the bucket → **Policies** tab → **Add Policy**
7. Choose **For full customization**:
   - Policy name: `Public read access`
   - Allowed operations: **SELECT**
   - Target roles: leave blank (applies to all)
   - USING expression: `true`
   - Click **Save**
8. Add another policy:
   - Policy name: `Auth upload`
   - Allowed operations: **INSERT**
   - Target roles: `authenticated`
   - WITH CHECK expression: `true`
   - Click **Save**
9. Add another policy:
   - Policy name: `Auth delete`
   - Allowed operations: **DELETE**
   - Target roles: `authenticated`
   - USING expression: `true`
   - Click **Save**

## Step 4: Get Your API Keys

1. In Supabase Dashboard, go to **Settings** → **API**
2. Copy these two values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")

## Step 5: Configure Environment Variables

### Customer App (`my-app/`)

Create `my-app/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Admin App (`admin-app/`)

Create `admin-app/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

> Both apps use the SAME Supabase project and the SAME keys.

## Step 6: Create an Admin User

1. In Supabase Dashboard, go to **Authentication** → **Users**
2. Click **Add User** → **Create new user**
3. Enter your email and a strong password
4. Toggle **Auto Confirm User** to ON
5. Click **Create User**

This email/password is what you'll use to log into the admin dashboard.

## Step 7: Run Both Apps

### Terminal 1 — Customer App (Port 3000)

```bash
cd my-app
npm install
npm run dev
```

### Terminal 2 — Admin App (Port 3001)

```bash
cd admin-app
npm install
npm run dev -- -p 3001
```

### Access:

| App | URL | Purpose |
|-----|-----|---------|
| Customer Site | http://localhost:3000 | Public-facing website |
| Admin Dashboard | http://localhost:3001 | Content management |

---

## How It Works

### Admin Flow
1. Log into admin dashboard → manage products, categories, collections, schemes
2. Upload images (stored in Supabase Storage)
3. Toggle products as published/draft
4. Changes saved to Supabase PostgreSQL database

### Customer Flow
1. Customer site loads data from Supabase
2. **Realtime subscriptions** auto-update the UI when admin makes changes
3. Fallback: if Supabase isn't configured, hardcoded data is shown (graceful degradation)

### Data Tables

| Table | Purpose | Admin Actions |
|-------|---------|---------------|
| `categories` | Product categories (Necklaces, Bangles, etc.) | Create, Edit, Delete |
| `products` | All products with details | Full CRUD + Publish/Draft |
| `product_images` | Multiple images per product | Upload, Set Primary, Delete |
| `product_specs` | Specification key-value pairs | Add, Edit, Remove |
| `collections` | Homepage collection cards | Full CRUD with image |
| `schemes` | Savings scheme details | Full CRUD with benefits list |

### Security (Row Level Security)

- **Public users** (customer site) can only **read published** items
- **Authenticated users** (admin) can perform **all operations**
- Storage policies enforce the same: public read, auth-only write

---

## Deploying for Free

### Customer App → [Vercel](https://vercel.com) (Free)

1. Push `my-app/` to a GitHub repo
2. Go to Vercel → Import project → select repo
3. Set root directory to `my-app`
4. Add environment variables (same as `.env.local`)
5. Deploy!

### Admin App → [Vercel](https://vercel.com) (Free, separate project)

1. Push `admin-app/` (can be same repo)
2. Go to Vercel → Import project
3. Set root directory to `admin-app`
4. Add environment variables
5. Deploy!

> **Tip**: Use a custom domain or Vercel subdomain for admin (e.g., `admin.swamyjewellery.com`)

### Free Tier Limits

| Service | Free Tier |
|---------|-----------|
| Supabase | 500MB database, 1GB storage, 2GB bandwidth, 50k auth users |
| Vercel | 100GB bandwidth, unlimited deploys, serverless functions |

---

## Troubleshooting

### "No products showing on customer site"
- Check that `.env.local` has correct Supabase URL and key
- Run the SQL schema in Supabase SQL Editor
- Ensure products are **published** (not draft) in admin

### "Can't upload images in admin"
- Make sure the `product-images` storage bucket exists
- Check storage policies allow authenticated INSERT
- Verify bucket is set to **Public**

### "Admin login not working"
- Create a user in Supabase Auth → Users → Add User
- Make sure "Auto Confirm User" is toggled ON
- Check the email/password match exactly

### "Realtime not updating"
- Supabase Realtime is enabled by default for all tables
- Check browser console for WebSocket connection errors
- Ensure `NEXT_PUBLIC_SUPABASE_URL` is correct
