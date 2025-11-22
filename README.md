# TinyLink - Professional URL Shortener

A modern, full-stack URL shortener built with Next.js 15, Tailwind CSS, and Prisma (PostgreSQL).

## 🚀 Features

- **Create Short Links**: Generate short, memorable links with optional custom codes.
- **Smart Redirects**: Fast 302 redirects that track click analytics.
- **Analytics Dashboard**: View total clicks, last clicked time, and manage your links.
- **Detailed Stats**: Dedicated stats page for each link with rich visualization.
- **Premium UI**: Glassmorphism design with dark mode and responsive layout.
- **Robust Validation**: Secure input handling and duplicate code protection.

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + Custom Glassmorphism
- **Database**: PostgreSQL (via Neon/Supabase)
- **ORM**: Prisma
- **Language**: TypeScript

## 🏃‍♂️ Getting Started

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd tinylink
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Copy `.env.example` to `.env` and add your database URL:
   ```bash
   cp .env.example .env
   ```

4. **Initialize Database**
   ```bash
   npx prisma migrate dev
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the app.

## 🧪 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/links` | Create a new short link |
| `GET` | `/api/links` | List all links |
| `GET` | `/api/links/:code` | Get stats for a specific link |
| `DELETE` | `/api/links/:code` | Delete a link |
| `GET` | `/healthz` | Health check endpoint |

## 📝 License

MIT
