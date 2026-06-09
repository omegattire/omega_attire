# Omega Attire – Supabase Setup & Deployment Guide

---

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign up free.
2. Click **New Project** → give it a name like `omega-attire`.
3. Choose a region close to India (e.g., **ap-south-1 – Mumbai**).
4. Save your **database password** securely.

---

## 2. Create the Reviews Table

Go to **Table Editor → New Table** and create a table called `reviews` with these columns:

| Column       | Type        | Notes                        |
|--------------|-------------|------------------------------|
| id           | int8 (PK)   | Auto-increment               |
| name         | text        | Customer name                |
| city         | text        | Customer city                |
| rating       | int2        | 1–5                          |
| product      | text        | Product type                 |
| text         | text        | Review body                  |
| images       | text[]      | Array of image URLs          |
| approved     | bool        | Default: false               |
| verified     | bool        | Default: false               |
| created_at   | timestamptz | Default: now()               |

Or run this SQL in the **SQL Editor**:

```sql
create table reviews (
  id bigint generated always as identity primary key,
  name text not null,
  city text not null,
  rating smallint not null check (rating between 1 and 5),
  product text not null,
  text text not null,
  images text[] default '{}',
  approved boolean default false,
  verified boolean default false,
  created_at timestamptz default now()
);

-- Allow public to insert reviews (submit form)
create policy "Anyone can submit a review"
  on reviews for insert
  to anon
  with check (true);

-- Only approved reviews visible to public
create policy "Public sees approved reviews"
  on reviews for select
  to anon
  using (approved = true);

-- Enable Row Level Security
alter table reviews enable row level security;
```

---

## 3. Create Supabase Storage Bucket

1. Go to **Storage → New Bucket**.
2. Name it: `review-images`
3. Set it as **Public** (so images are viewable).
4. Add this policy for uploads:

```sql
create policy "Anyone can upload review images"
  on storage.objects for insert
  to anon
  with check (bucket_id = 'review-images');
```

---

## 4. Connect to Your Website

1. Go to **Settings → API** in your Supabase project.
2. Copy:
   - **Project URL** (e.g. `https://abcdefg.supabase.co`)
   - **anon/public key**

3. Open `app.js` and replace these lines at the top:

```js
const SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';
```

With your actual values:

```js
const SUPABASE_URL = 'https://abcdefg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

---

## 5. Update Admin Password

In `admin.html`, find and replace the demo password:

```js
if (pw === 'omega@admin2025') {
```

Change to your own secure password. In production, use Supabase Auth instead:

```js
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'admin@omegaattire.in',
  password: pw
});
```

---

## 6. Image Upload Integration

To upload images to Supabase Storage, update `app.js` `submitToSupabase()`:

```js
async function submitToSupabase(data, files) {
  const imageUrls = [];

  // Upload each image
  for (const file of files) {
    const filename = `${Date.now()}-${file.name}`;
    const { data: uploadData, error } = await supabase.storage
      .from('review-images')
      .upload(filename, file);
    if (!error) {
      const { data: urlData } = supabase.storage
        .from('review-images')
        .getPublicUrl(filename);
      imageUrls.push(urlData.publicUrl);
    }
  }

  // Submit review with image URLs
  const { error: insertError } = await supabase
    .from('reviews')
    .insert([{ ...data, images: imageUrls }]);

  if (insertError) throw insertError;
}
```

---

## 7. Deployment Options

### Option A – Netlify (Recommended, Free)
1. Create a free account at [netlify.com](https://netlify.com)
2. Drag and drop your project folder into the Netlify dashboard
3. Your site is live instantly with a URL like `omega-attire.netlify.app`
4. Add a custom domain (e.g. `reviews.omegaattire.in`) in Domain Settings

### Option B – Vercel (Free)
1. Push your files to a GitHub repository
2. Go to [vercel.com](https://vercel.com) and import the repo
3. Deploy — done!

### Option C – GitHub Pages (Free)
1. Create a GitHub repo
2. Push all files
3. Go to Settings → Pages → Deploy from `main` branch
4. Live at `yourusername.github.io/omega-attire`

---

## 8. Custom Domain Setup

If you have a domain like `omegaattire.in`:
1. Add a CNAME record: `reviews → your-netlify-site.netlify.app`
2. Or an A record pointing to Vercel/Netlify IPs
3. Enable HTTPS (automatic on Netlify/Vercel)

---

## 9. WhatsApp & Instagram Links

Update these in all HTML files:

```html
<!-- WhatsApp -->
<a href="https://wa.me/91XXXXXXXXXX">  ← Replace with your number

<!-- Instagram -->
<a href="https://instagram.com/YOUR_HANDLE">
```

---

## 10. SEO Checklist

- [ ] Update `og:image` with a real image URL
- [ ] Update `og:url` with your domain
- [ ] Add Google Analytics / Search Console
- [ ] Submit sitemap.xml to Google
- [ ] Update `aggregateRating` in schema with real numbers

---

## File Structure

```
omega-attire/
├── index.html      ← Homepage
├── reviews.html    ← All reviews page
├── gallery.html    ← Photo gallery
├── admin.html      ← Admin dashboard
├── style.css       ← All styles
├── app.js          ← All JavaScript + Supabase logic
└── SETUP_GUIDE.md  ← This file
```

---

## Support

For any issues, WhatsApp: +91 XXXXXXXXXX  
Instagram: @omegaattire

---

*Made with ❤️ for Omega Attire – India*
