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

## 🔮 Roadmap

- [ ] **Mobile App**: Dedicated mobile interface for members.
- [ ] **QR Code Integration**: Scan QR codes on seats for quick booking.
- [ ] **Email Notifications**: Automated reminders for booking expirations.
- [ ] **Analytics Dashboard**: Visual charts for occupancy and member growth.
- [ ] **Payment Integration**: Support for membership fee processing.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---
