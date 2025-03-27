
# Data Models

This document describes the data models used in the application.

## Trade

The core data model for representing a trading transaction:

```typescript
interface Trade {
  id: string;              // Unique identifier (UUID)
  tradeId: string;         // User-facing trade identifier (e.g., T1001)
  traderName: string;      // Name of the trader who made the trade
  underlyingSymbol: string; // Stock/asset symbol (e.g., AAPL)
  optionType: "call" | "put"; // Type of option
  entryDate: string;       // Date when the trade was entered (YYYY-MM-DD)
  exitDate?: string;       // Date when the trade was exited (optional)
  entryPrice: number;      // Price per contract at entry
  exitPrice?: number;      // Price per contract at exit (optional)
  quantity: number;        // Number of contracts
  totalPremium: number;    // Total premium paid (entryPrice * quantity)
  profitLoss: number;      // Total profit or loss on the trade
  status: "Open" | "Closed" | "Pending"; // Current status of the trade
  notes?: string;          // Optional notes about the trade
  totalInvested: number;   // Total amount invested
  roi: number;             // Return on Investment (percentage)
}
```

## User Settings

Stores user preferences and application configuration:

```typescript
interface UserSettings {
  appearance: {
    theme: "light" | "dark" | "system";
    compactMode: boolean;
    showWelcomeScreen: boolean;
  };
  trading: {
    defaultTrader: string;
    defaultSymbol: string;
    defaultQuantity: number;
    defaultOptionType: "call" | "put";
  };
  calculation: {
    roiMethod: "simple" | "annualized" | "withFees";
    includeFees: boolean;
    defaultFeeAmount: number;
    usePercentageInstead: boolean;
  };
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  widgets: WidgetSettings[];
  exportSettings: {
    defaultFormat: "csv" | "excel" | "pdf" | "json";
    includeMetadata: boolean;
    includeCharts: boolean;
    includeSummary: boolean;
  };
}

interface WidgetSettings {
  id: string;
  title: string;
  enabled: boolean;
  position: number;
}
```
