# 🚀 Owais Iqbal - Professional Portfolio

> A modern, fully-responsive portfolio showcasing AI/ML engineering expertise and full-stack development skills with a cyberpunk aesthetic.

## ✨ Overview

This portfolio represents a comprehensive showcase of professional experience, technical skills, and innovative projects in AI/ML engineering and full-stack development. Built with modern web technologies and featuring a unique cyberpunk design aesthetic.

## 🎯 Key Features

### 🏗️ **Modular Architecture**
- **11 major components** fully modularized with dedicated folder structures
- **45+ focused sub-components** with single responsibilities
- **Clean separation of concerns** for exceptional maintainability
- **Server-side rendering** optimized for SEO and performance

### 🎨 **Design & UX**
- **Cyberpunk aesthetic** with neon gradients and glass morphism
- **Fully responsive** design optimized for all devices
- **Smooth animations** and interactive hover effects
- **Dark theme** with professional color palette

### ⚡ **Performance & SEO**
- **Static Site Generation (SSG)** for optimal loading speeds
- **Server Components** for reduced JavaScript bundle size
- **SEO optimized** with proper meta tags and structured data
- **Progressive enhancement** - works without JavaScript

### 📧 **Interactive Features**
- **Functional contact form** with email integration via Resend
- **Smooth scroll navigation** with active section highlighting
- **Mobile-first responsive** design with optimized layouts
- **Toast notifications** for user feedback

## 🛠️ Tech Stack

### **Core Technologies**
- **Next.js 15** - React framework with App Router
- **React 18** - UI library with Server Components
- **TypeScript** - Type safety and developer experience
- **Tailwind CSS** - Utility-first CSS framework

### **UI & Components**
- **Lucide React** - Beautiful icon library
- **Radix UI** - Accessible component primitives
- **React Hook Form** - Form handling and validation

### **Data & State Management**
- **TanStack Query** - Server state management
- **Zod** - Schema validation
- **React Context** - Client state management

### **Backend Integration**
- **Next.js Server Actions** - Server-side form handling
- **Resend** - Email service integration
- **JSON data management** - Structured content storage

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   ├── not-found.tsx      # Custom 404 page
│   └── error.tsx          # Error boundary
├── components/            # Modular component architecture
│   ├── navigation/        # Navigation components
│   ├── hero/             # Hero section components
│   ├── about/            # About section components
│   ├── skills/           # Skills section components
│   ├── experience/       # Experience section components
│   ├── projects/         # Projects section components
│   ├── publications/     # Publications section components
│   ├── certifications/   # Certifications section components
│   ├── awards/           # Awards section components
│   ├── contact/          # Contact section components
│   ├── footer/           # Footer section components
│   └── ui/               # Reusable UI components
├── data/                 # JSON data files
├── lib/                  # Utility functions and actions
└── hooks/                # Custom React hooks
```

## 🚀 Getting Started

### Prerequisites
- **Node.js 18+** - [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- **Yarn** or **npm** - Package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd phantom-design-hub
   ```

2. **Install dependencies**
   ```bash
   yarn install
   # or
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Add your Resend API key for contact form functionality.

4. **Start development server**
   ```bash
   yarn dev
   # or
   npm run dev
   ```

5. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📧 Contact Form Setup

The portfolio includes a fully functional contact form. To enable email functionality:

1. Sign up for [Resend](https://resend.com)
2. Get your API key
3. Add to `.env.local`:
   ```
   RESEND_API_KEY=your_api_key_here
   ```

## TODO:
- [ ] Reorganize chat slices and reducers for clearer structure and maintainability 
