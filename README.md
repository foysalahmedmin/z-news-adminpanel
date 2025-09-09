# Z-News Admin Panel

A modern, feature-rich admin panel for managing news articles, categories, users, and content for the Z-News platform. Built with React, TypeScript, and modern web technologies.

## 🚀 Features

### 📊 Dashboard

- Comprehensive analytics and statistics
- Real-time data visualization with charts
- Quick access to key metrics and insights

### 📰 News Management

- **Article Management**: Create, edit, and manage news articles
- **Rich Text Editor**: Powered by BlockNote for advanced content editing
- **Media Support**: Upload and manage images, videos, and files
- **SEO Optimization**: Built-in SEO fields for better search visibility
- **Status Management**: Draft, pending, published, and archived states
- **Content Layouts**: Multiple layout options (default, standard, featured, minimal)
- **YouTube Integration**: Embed YouTube videos directly in articles
<!-- - **Bulk Operations**: Mass update, delete, and restore articles -->

### 🏷️ Category Management

- Hierarchical category structure
- Category icons and thumbnails
- Featured category support
- Status management (active/inactive)
- Drag-and-drop ordering

### 👥 User Management

- Role-based access control (Super Admin, Admin, Editor, Author, Contributor, Subscriber, User)
- User profile management
- Status tracking (in-progress, blocked)
- Email verification system

### 💬 Engagement Features

- **Comments System**: Manage user comments and interactions
- **Reactions**: Track user reactions to content
- **Real-time Notifications**: Live notification system with Socket.io integration
- **Live Updates**: Real-time data synchronization across all connected clients

### 🔧 Advanced Features

- **Real-time Updates**: Socket.io integration for live updates
- **File Management**: Upload and manage various file types
- **Search & Filtering**: Advanced search and filtering capabilities
- **Data Tables**: Sortable, searchable, and paginated data tables
- **Responsive Design**: Mobile-first, fully responsive interface
- **Dark/Light Theme**: Theme switching capability
- **Internationalization**: Multi-language support ready

## 🛠️ Technology Stack

### Core Framework

- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server

### Styling & UI

- **Tailwind CSS 4** - Utility-first CSS framework
- **Custom Component Library** - **Most components are custom-built** with minimal third-party dependencies
- **Lucide React** - Icon library (only major UI dependency)

### State Management

- **Redux Toolkit** - Predictable state management
- **React Query (TanStack Query)** - Server state management and caching

### Routing & Navigation

- **React Router 7** - Client-side routing
- **Custom AppRoute Class** - Dynamic route generation with role-based access control

### Form Management

- **React Hook Form** - Performant forms with easy validation
- **Zod** - TypeScript-first schema validation
- **Hookform Resolvers** - Validation integration

### Rich Text Editing

- **BlockNote** - Modern block-based editor
- **Mantine Integration** - Enhanced editor components

### Data Visualization

- **Recharts** - Charts and data visualization

### Additional Libraries

- **Axios** - HTTP client for API requests
- **Socket.io Client** - Real-time communication
- **React Toastify** - Toast notifications
- **Date-fns** - Date manipulation utilities
- **Class Variance Authority** - Component variant management
- **Embla Carousel** - Touch-friendly carousel component

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── (auth)/         # Authentication components
│   ├── (common)/       # Common page components
│   ├── (user)/         # User-specific components
│   ├── appliers/       # State appliers and providers
│   ├── cards/          # Card components
│   ├── modals/         # Modal dialogs
│   ├── partials/       # Layout partials (Header, Sidebar, etc.)
│   ├── sections/       # Page sections
│   ├── ui/             # Base UI components
│   └── wrappers/       # Component wrappers
├── config/             # Configuration files
│   ├── constants/      # App constants
│   ├── endpoints/      # API endpoints
│   ├── env/           # Environment variables
│   ├── project/       # Project metadata
│   ├── seo/           # SEO configuration
│   ├── settings/      # App settings
│   └── urls/          # URL configuration
├── hooks/              # Custom React hooks
│   ├── observers/     # Intersection and mutation observers
│   ├── states/        # State management hooks
│   ├── ui/            # UI-related hooks
│   └── utils/         # Utility hooks
├── layouts/            # Page layouts
├── pages/              # Page components
│   ├── (auth)/        # Authentication pages
│   ├── (common)/      # Common pages
│   ├── (partial)/     # Partial pages (Error, 404, etc.)
│   └── (user)/        # User-specific pages
├── redux/              # Redux store and slices
├── services/           # API service functions
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## 🎯 Custom Architecture & Key Features

### Custom-Built Components

This project emphasizes **custom-built components** with minimal third-party dependencies. Most UI components, including data tables, forms, modals, and layout components, are built from scratch to ensure:

- **Performance optimization** tailored to specific use cases
- **Consistent design system** across the application
- **Full control** over component behavior and styling
- **Reduced bundle size** by avoiding unnecessary third-party code

### Major Third-Party Packages

The project uses only essential third-party packages:

- **React 19** - Core framework
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling framework
- **Redux Toolkit** - State management
- **React Query** - Server state management
- **React Hook Form + Zod** - Form handling and validation
- **BlockNote** - Rich text editor
- **Axios** - HTTP client
- **Socket.io Client** - Real-time communication
- **Recharts** - Data visualization
- **Lucide React** - Icon library

### AppRoute Class

The **AppRoute class** is a custom routing solution that provides:

- **Dynamic route generation** based on user roles and permissions
- **Role-based access control** for different user types
- **Nested routing structure** with automatic layout application
- **Menu integration** with route definitions
- **Type-safe routing** with TypeScript support

This custom routing system allows for flexible navigation management and ensures that users only see routes they have permission to access.

## ⚡ Real-time Features & Socket.io Integration

### Live Notification System

The admin panel features a comprehensive **real-time notification system** powered by Socket.io:

- **Instant Notifications**: Real-time alerts for new comments, reactions, and system events
- **Live Data Updates**: Automatic synchronization of data across all connected clients
- **User Activity Tracking**: Real-time monitoring of user actions and system events
- **Notification Management**: Custom notification center with read/unread status
- **Broadcast System**: System-wide announcements and updates

### Socket.io Implementation

- **Bidirectional Communication**: Real-time data flow between client and server
- **Event-driven Architecture**: Custom event handlers for different notification types
- **Connection Management**: Automatic reconnection and connection state handling
- **Room-based Notifications**: Targeted notifications based on user roles and permissions
- **Performance Optimized**: Efficient event handling and minimal data transfer

### Real-time Features Include:

- **Live Dashboard Updates**: Statistics and metrics update in real-time
- **Collaborative Editing**: Multiple users can work on content simultaneously
- **Live Comment System**: Real-time comment updates and moderation
- **System Status Updates**: Live system health and performance monitoring
- **User Presence**: See which users are currently active
- **Live Chat Integration**: Real-time communication between admin users

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **pnpm** (recommended) or npm
- **Git**

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd z-news-adminpanel
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:

   ```env
   VITE_API_URL=https://your-api-url.com
   VITE_APP_URL=http://localhost:8080
   ```

4. **Start development server**

   ```bash
   pnpm dev
   # or
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:8080`

### Build for Production

```bash
pnpm build
# or
npm run build
```

### Preview Production Build

```bash
pnpm preview
# or
npm run preview
```

## 🔧 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix ESLint errors automatically

## 🎨 Custom UI Components

The project features a **comprehensive custom-built component library** with minimal third-party dependencies:

- **DataTable** - Advanced custom data table with sorting, filtering, and pagination
- **Form Controls** - Custom input, select, textarea, and other form elements
- **Modals** - Custom modal dialogs for various use cases
- **Cards** - Custom content cards and statistic cards
- **Charts** - Data visualization components (using Recharts)
- **Navigation** - Custom breadcrumbs, pagination, and navigation elements
- **Feedback** - Custom loading states, alerts, and notifications
- **Layout Components** - Custom header, sidebar, and layout wrappers
- **Utility Components** - Custom badges, buttons, dropdowns, and more

All components are built with **TypeScript**, **Tailwind CSS**, and follow consistent design patterns for optimal performance and maintainability.

## 🔐 Authentication & Authorization

The admin panel implements a robust role-based access control system:

- **Super Admin**: Full system access
- **Admin**: User and content management
- **Editor**: Content editing and publishing
- **Author**: Content creation and self-management
- **Contributor**: Limited content contribution
- **Subscriber**: Basic access
- **User**: Public user access

## 📡 API Integration

The application integrates with a RESTful API for:

- User authentication and management
- News article CRUD operations
- Category management
- File uploads and media management
- Comments and reactions
- Notifications and real-time updates

## 🎯 Key Features in Detail

### News Article Management

- **Rich Content Editor**: BlockNote-powered editor with advanced formatting
- **Media Handling**: Support for images, videos, and file uploads
- **SEO Tools**: Meta titles, descriptions, and keyword management
- **Publishing Workflow**: Draft → Pending → Published → Archived
- **Bulk Operations**: Mass actions for efficiency

### User Experience

- **Responsive Design**: Works seamlessly on all device sizes
- **Real-time Updates**: Live notifications, data synchronization, and instant updates via Socket.io
- **Intuitive Navigation**: Clean, organized interface with custom routing
- **Live Collaboration**: Real-time collaborative features for team workflows
- **Accessibility**: Built with accessibility best practices

### Performance

- **Code Splitting**: Optimized bundle loading
- **Caching**: Intelligent data caching with React Query
- **Lazy Loading**: Components loaded on demand
- **Optimized Images**: Efficient image handling and optimization

<!-- ## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request -->

<!-- ## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. -->

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Contact the development team
- Check the documentation

<!-- ## 🔄 Version History

- **v1.0.0** - Initial release with core features
- **v0.0.0** - Development version -->

---
