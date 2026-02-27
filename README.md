<<<<<<< HEAD
# 📚 Library SaaS Platform

A modern, high-performance SaaS platform for managing library seats, members, and bookings. Built with **Next.js 15**, **TypeScript**, and **Supabase**, this platform provides a seamless experience for library administrators and members.

---

## 🚀 Features

### 🔐 Authentication & Security
- **Secure Auth**: Powered by Supabase Auth (Email/Password).
- **Protected Routes**: Middleware-based route protection for the dashboard.
- **RLS**: Row-Level Security implemented at the database level.
- **JWT Session Management**: Persistent and secure user sessions.

### 🪑 Seat Management
- **Real-time Status**: Monitor seat availability (Available, Occupied, Maintenance).
- **Bulk Operations**: Efficiently manage library layout and seat configurations.
- **Notes & Metadata**: Attach specific instructions or details to each seat.

### 👥 Member Management
- **Member Profiles**: Track personal details, contact info, and joining history.
- **Membership Tiers**: Support for Basic, Premium, and Corporate levels.
- **Search & Filter**: Quickly find members in a growing database.

### 📅 Booking System
- **Seat Reservations**: Prevent double-bookings with smart scheduling.
- **Time Slots**: Manage durations and specific time ranges for each booking.
- **Historical Tracking**: Keep a log of all past and upcoming reservations.

---

## 🛠 Tech Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | [Next.js 15+](https://nextjs.org/) (App Router) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Database** | [Supabase](https://supabase.com/) (PostgreSQL) |
| **Auth** | [Supabase Auth](https://supabase.com/auth) |
| **Styling** | [Tailwind CSS 4.0](https://tailwindcss.com/) |
| **Icons** | [React Icons](https://react-icons.github.io/react-icons/) |
| **Notifications** | [React Toastify](https://fkhadra.github.io/react-toastify/) |

---

## 📂 Project Structure

```text
library-saas/
├── src/
│   ├── app/                           # Next.js App Router
│   │   ├── (auth)/                    # Auth route group (login, register)
│   │   ├── dashboard/                 # Admin Dashboard
│   │   │   ├── seats/                 # Seat management pages
│   │   │   ├── members/               # Member management pages
│   │   │   └── bookings/              # Booking management pages
│   │   ├── globals.css                # Tailwind & Global styles
│   │   └── page.tsx                   # Landing page
│   ├── components/
│   │   ├── ui/                        # Reusable UI components (Button, Input, etc.)
│   │   └── forms/                     # Specialized form components
│   ├── context/                       # React Context providers (Auth, Theme)
│   ├── lib/                           # Core utilities & Supabase client
│   ├── hooks/                         # Custom React hooks
│   └── types/                         # Global TypeScript definitions
├── public/                            # Static assets
├── supabase-schema.sql                # SQL initialization script
└── next.config.ts                     # Next.js configuration
```

---

## ⚡ Getting Started

### 1. Prerequisites
- Node.js 20+
- npm / pnpm / bun
- A Supabase Project

### 2. Installation
```bash
git clone <your-repo-url>
cd library-saas
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 4. Database Setup
Copy the contents of `supabase-schema.sql` and run them in the **SQL Editor** of your Supabase Dashboard.

### 5. Run Development Server
```bash
npm run dev
```
Visit `http://localhost:3000` to see the application in action.

---




