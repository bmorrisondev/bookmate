# BookMate: Simplified Scheduling Demo

## 🚀 Project Overview

BookMate is a modern scheduling application built to demonstrate the power of authentication and user management using Clerk. This demo project showcases how to create a seamless, user-friendly scheduling experience with robust authentication.

## ✨ Features

- 🔐 Secure authentication with Clerk
- 📅 Easy scheduling interface
- 🌍 Time zone intelligent booking
- 🔗 Google Calendar synchronization (demo)

## 🛠 Technologies Used

- Next.js 15
- Clerk Authentication
- Tailwind CSS
- TypeScript
- Lucide React Icons

## 🚦 Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm, yarn, or pnpm
- A Clerk account

### Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/bookmate
   cd bookmate
   ```

2. **Set Up Clerk Authentication**
   - [Sign up for a free Clerk account](https://clerk.com/sign-up)
   - Create a new application in the Clerk dashboard
   - Copy your Clerk publishable and secret keys

3. **Configure Environment Variables**
   Create a `.env.local` file in the project root:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
   CLERK_SECRET_KEY=your_secret_key
   ```

4. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

5. **Run the Development Server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Open the Application**
   Navigate to `http://localhost:3000` in your browser

## 🎓 Educational Resources

### Authentication Learning
- [Clerk Authentication Docs](https://clerk.com/docs)
- [Next.js Authentication Guide](https://nextjs.org/docs/app/building-your-application/authentication)

### Related Tutorials
- [Building Secure Web Applications](https://www.youtube.com/playlist?list=PLAuthTechnologies)
- [Full-Stack Authentication Patterns](https://egghead.io/courses/authentication-patterns)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! 
Feel free to check [issues page](https://github.com/your-username/bookmate/issues).

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🎉 Acknowledgments

- [Clerk](https://clerk.com) for providing amazing authentication services
- [Next.js](https://nextjs.org) for the incredible framework
- Open-source community for continuous inspiration

---

**Disclaimer**: This is a demo application built for educational purposes. Not intended for production use.
