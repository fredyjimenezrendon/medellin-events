# MedEvents - Event Management System

A modern event management system built with Next.js, React, TypeScript, and Redis. Allows admin users to create, edit, and delete events, while public users can view and filter events.

## Features

- **Public Event Viewing**: Browse all upcoming events with filtering by tags
- **Admin Dashboard**: Secure admin panel for managing events
- **Event CRUD**: Create, read, update, and delete events
- **Tag-based Filtering**: Filter events by tags
- **Date Management**: Events are sorted by date
- **Session-based Authentication**: Secure admin login using iron-session
- **Redis Database**: Fast, scalable data storage with Upstash

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Redis (Upstash)
- **Authentication**: iron-session with bcrypt
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Upstash Redis account (free tier available)

### Setup

1. **Clone and install dependencies**:
   ```bash
   npm install
   ```

2. **Set up Upstash Redis**:
   - Go to [Upstash Console](https://console.upstash.com/)
   - Create a new Redis database
   - Copy the REST URL and Token

3. **Configure environment variables**:
   - Copy `.env.example` to `.env.local`
   - Update with your Upstash credentials:
     ```
     UPSTASH_REDIS_REST_URL=your_redis_url
     UPSTASH_REDIS_REST_TOKEN=your_redis_token
     ```
   - The default admin credentials are:
     - Username: `admin`
     - Password: `admin123`

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   - Public events page: [http://localhost:3000](http://localhost:3000)
   - Admin dashboard: [http://localhost:3000/admin](http://localhost:3000/admin)

## Deployment to Vercel

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/fredyjimenezrendon/medellin-events)

### Manual Deployment

1. **Push your code to GitHub**

2. **Import to Vercel**:
   - Go to [Vercel](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

3. **Configure Environment Variables**:
   Add these in Vercel project settings:
   ```
   UPSTASH_REDIS_REST_URL=your_redis_url
   UPSTASH_REDIS_REST_TOKEN=your_redis_token
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD_HASH_BASE64=JDJhJDEwJEh0L2w2ckxIcGlDNzhBSHlNYnZZVGVQVTRKeGFuUkVaWk14TVRhN1pjdEs0YVNGOXI2cC9T
   SESSION_SECRET=your_random_secret_key_min_32_chars
   ```

4. **Deploy**: Click "Deploy" and wait for the build to complete

### Upstash Integration (Recommended)

For better integration with Vercel:
1. In your Vercel project, go to "Storage"
2. Create a new Upstash Redis database directly from Vercel
3. Environment variables will be automatically configured

## Changing Admin Password

To generate a new password hash (base64 encoded to avoid shell escaping issues):

```bash
node -e "const bcrypt = require('bcryptjs'); const hash = bcrypt.hashSync('your_new_password', 10); console.log(Buffer.from(hash).toString('base64'));"
```

Update the `ADMIN_PASSWORD_HASH_BASE64` in your `.env.local` or Vercel environment variables with the output.

## Project Structure

```
medevents/
├── app/
│   ├── api/
│   │   ├── auth/          # Authentication endpoints
│   │   ├── events/        # Event CRUD endpoints
│   │   └── tags/          # Tag listing endpoint
│   ├── admin/             # Admin dashboard page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Public events page
│   └── globals.css        # Global styles
├── lib/
│   ├── redis.ts           # Redis client configuration
│   ├── session.ts         # Session management
│   └── events.ts          # Event service layer
├── types/
│   └── event.ts           # TypeScript type definitions
└── README.md
```

## API Endpoints

### Public Endpoints
- `GET /api/events` - Get all events
- `GET /api/events?tag=tagname` - Filter events by tag
- `GET /api/events/[id]` - Get a specific event
- `GET /api/tags` - Get all available tags

### Protected Endpoints (Admin only)
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `GET /api/auth/check` - Check auth status
- `POST /api/events` - Create new event
- `PUT /api/events/[id]` - Update event
- `DELETE /api/events/[id]` - Delete event

## Event Data Model

```typescript
{
  id: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}
```

## License

MIT
