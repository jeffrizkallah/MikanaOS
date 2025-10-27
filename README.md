# MikanaOS - Catering Management System

A modern, full-stack web application for managing all operations of a catering business. Built with React, TypeScript, and modern UI libraries.

## Features

### Core Functionality
- **Role-Based Dashboard**: Three distinct views for Branch Managers, Head Office, and Admin/Regional Managers
- **Comprehensive Navigation**: 11 dedicated pages covering all business operations
- **Real-time Chat**: Internal communication with AI assistant framework
- **Data Import System**: Excel file upload and SharePoint integration for automated daily syncs
- **AI Insights**: Intelligent recommendations and predictions powered by AI
- **Sales Forecasting**: Advanced analytics and trend analysis
- **Inventory Management**: Real-time stock tracking across all locations
- **Order Management**: Weekly order system with Thursday/Saturday dispatch logic

### Pages
1. **Dashboard** - Role-based tabs with key metrics and insights
2. **Inventory** - Track stock levels across all locations
3. **Orders** - Manage weekly orders and dispatch schedules
4. **Suppliers** - Manage supplier relationships
5. **Branches** - Oversee 12 branches + 1 central kitchen
6. **Reports** - Generate and download business reports
7. **AI Insights** - AI-powered recommendations and alerts
8. **Data Import** - Upload Excel files or sync from SharePoint
9. **Forecasted Sales** - Sales predictions and trend analysis
10. **Analysis** - Comprehensive business analytics
11. **Chat** - Team communication with AI assistant

## Tech Stack

- **Framework**: React 18 + TypeScript + Vite
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: TailwindCSS
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Routing**: React Router v6
- **Charts**: Recharts
- **File Processing**: XLSX.js
- **File Upload**: React Dropzone

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## Usage

### Demo Login
The application includes a demo login system. Use any email address and select your role:
- **Branch Manager**: Manages 2-5 branches, places weekly orders
- **Head Office**: Central kitchen operations and production management
- **Admin/Regional Manager**: Complete system overview and analytics

### Data Import
The Data Import page supports:
- Manual Excel file upload (.xlsx, .xls, .csv)
- Automated SharePoint sync (configuration required)
- Seven data sources: Sales, Inventory, Manufacturing, Purchases, Recipes, Transfers, Waste

### SharePoint Integration
To set up automated daily sync:
1. Configure SharePoint API credentials
2. Set file paths for each data source
3. Configure sync schedule (default: daily at midnight)
4. Enable webhook notifications for real-time updates

## Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── Layout.tsx       # Main layout wrapper
│   └── Sidebar.tsx      # Navigation sidebar
├── pages/
│   ├── Dashboard.tsx    # Role-based dashboard
│   ├── Inventory.tsx
│   ├── Orders.tsx
│   ├── Suppliers.tsx
│   ├── Branches.tsx
│   ├── Reports.tsx
│   ├── AIInsights.tsx
│   ├── DataImport.tsx
│   ├── ForecastedSales.tsx
│   ├── Analysis.tsx
│   ├── Chat.tsx
│   └── Login.tsx
├── store/
│   └── authStore.ts     # Authentication state management
├── lib/
│   └── utils.ts         # Utility functions
├── App.tsx              # Main app with routing
└── main.tsx             # Entry point
```

## Features in Detail

### iOS-Inspired Design
- Smooth animations and transitions
- Clean, minimal interface
- Professional typography
- Responsive design
- Custom scrollbar styling

### Role-Based Access
- Automatic role detection and routing
- Personalized dashboard views
- Branch assignment for managers
- Centralized admin controls

### AI Integration Framework
- Chat interface with AI assistant placeholder
- AI Insights page with recommendations
- Sales forecasting and predictions
- Inventory optimization suggestions
- Ready for AI API integration

### Data Management
- Large file handling optimization
- Auto-refresh for latest data
- Real-time sync capabilities
- Multiple data source support
- Error handling and validation

## Business Logic

### Dispatch Schedule
- **Thursday Dispatch**: Order deadline Wednesday 6 PM
- **Saturday Dispatch**: Order deadline Friday 6 PM
- Automated notifications and reminders

### Branches
- 12 branch locations
- 1 central kitchen
- Branch managers oversee 2-5 branches each
- Centralized order fulfillment

## Future Enhancements

- [ ] Backend API integration
- [ ] Real-time WebSocket updates
- [ ] Advanced AI model integration
- [ ] Mobile app (React Native)
- [ ] Email notifications
- [ ] Advanced reporting and exports
- [ ] Multi-language support
- [ ] Dark mode toggle

## License

All Rights Reserved - MikanaOS v1.0
