# Memento Mori

A Progressive Web App built with Next.js 14 to remind you of life's brevity.

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- next-pwa for Progressive Web App capabilities

## PWA Configuration

This app is configured as a Progressive Web App with:
- Service Worker for offline functionality
- Web App Manifest
- Installable on mobile and desktop devices

### Icons

The app uses placeholder icons (`icon.svg`). For production, replace with proper PNG icons:
- `public/icon-192x192.png` - 192x192px icon
- `public/icon-512x512.png` - 512x512px icon

You can generate icons from the SVG using online tools or image editors.

## Deploy on Vercel

This project is optimized for deployment on Vercel's free tier.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/memento-mori)
