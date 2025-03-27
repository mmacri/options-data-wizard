
# Trade Tracker Pro Documentation

## Overview
Trade Tracker Pro is a comprehensive web application for traders to track, analyze, and manage their trading activity. The application supports multiple traders, various trade types, and provides detailed analytics and reporting.

## Table of Contents
1. [Architecture](#architecture)
2. [Installation](#installation)
3. [Features](#features)
4. [Code Structure](#code-structure)
5. [Components](#components)
6. [Data Models](#data-models)
7. [Calculations](#calculations)
8. [Settings](#settings)
9. [Import/Export](#import-export)
10. [Troubleshooting](#troubleshooting)

## Architecture
Trade Tracker Pro is built using the following technologies:
- React (Frontend framework)
- TypeScript (Type-safe JavaScript)
- Tailwind CSS (Styling)
- shadcn/ui (UI components)
- React Router (Navigation)
- React Query (Data fetching)
- LocalStorage (Data persistence)

The application follows a component-based architecture with hooks for state management and business logic. Data is stored locally using the browser's localStorage API, with import/export capabilities for data backup and sharing.

## Installation
### From GitHub
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/trade-tracker-pro.git
   ```
2. Navigate to the project directory:
   ```bash
   cd trade-tracker-pro
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to http://localhost:5173

### Production Build
1. Generate a production build:
   ```bash
   npm run build
   ```
2. Preview the production build:
   ```bash
   npm run preview
   ```

## Features
The application includes the following key features:
- Multi-trader support
- Trade tracking and management
- Performance analytics
- Custom reporting
- Data import/export
- Settings customization
- Backup and restore
- Interactive dashboards

For detailed feature explanations, see the [Features Documentation](./features/README.md).
