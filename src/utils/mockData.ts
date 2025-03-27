
import { Trade } from "@/components/ui-components/DataTableTypes";

// Mock trades data
export const mockTrades: Trade[] = [
  {
    id: "1",
    tradeId: "T1001",
    traderName: "John Smith",
    underlyingSymbol: "AAPL",
    optionType: "Call",
    entryDate: "2023-01-15",
    entryPrice: 5.75,
    exitDate: "2023-02-10",
    exitPrice: 8.25,
    quantity: 10,
    totalPremium: 5750,
    profitLoss: 2500,
    status: "Closed",
    notes: "Closed for profit after earnings announcement",
    totalInvested: 5750,
    roi: 43.48
  },
  {
    id: "2",
    tradeId: "T1002",
    traderName: "Sarah Johnson",
    underlyingSymbol: "TSLA",
    optionType: "Put",
    entryDate: "2023-02-01",
    entryPrice: 10.50,
    quantity: 5,
    totalPremium: 5250,
    profitLoss: -2100,
    status: "Closed",
    notes: "Closed for loss after market rally",
    totalInvested: 5250,
    roi: -40.00
  },
  {
    id: "3",
    tradeId: "T1003",
    traderName: "John Smith",
    underlyingSymbol: "MSFT",
    optionType: "Bull Call Spread",
    entryDate: "2023-03-10",
    entryPrice: 3.25,
    quantity: 15,
    totalPremium: 4875,
    profitLoss: 1200,
    status: "Open",
    notes: "Holding through next earnings",
    totalInvested: 4875,
    roi: 24.62
  },
  {
    id: "4",
    tradeId: "T1004",
    traderName: "Sarah Johnson",
    underlyingSymbol: "AMD",
    optionType: "Bear Put Spread",
    entryDate: "2023-03-15",
    entryPrice: 2.10,
    quantity: 20,
    totalPremium: 4200,
    profitLoss: 800,
    status: "Open",
    notes: "Expecting pullback after recent run",
    totalInvested: 4200,
    roi: 19.05
  },
  {
    id: "5",
    tradeId: "T1005",
    traderName: "Mike Williams",
    underlyingSymbol: "NVDA",
    optionType: "Covered Call",
    entryDate: "2023-03-20",
    entryPrice: 15.75,
    quantity: 3,
    totalPremium: 4725,
    profitLoss: 0,
    status: "Pending",
    notes: "Waiting for confirmation before adding to position",
    totalInvested: 4725,
    roi: 0
  },
  {
    id: "6",
    tradeId: "T1006",
    traderName: "Mike Williams",
    underlyingSymbol: "SPY",
    optionType: "Iron Condor",
    entryDate: "2023-04-05",
    entryPrice: 4.50,
    quantity: 10,
    totalPremium: 4500,
    profitLoss: 1800,
    status: "Open",
    notes: "Market neutral strategy",
    totalInvested: 4500,
    roi: 40.00
  },
  {
    id: "7",
    tradeId: "T1007",
    traderName: "John Smith",
    underlyingSymbol: "AMZN",
    optionType: "Butterfly",
    entryDate: "2023-04-10",
    entryPrice: 2.25,
    quantity: 20,
    totalPremium: 4500,
    profitLoss: -600,
    status: "Closed",
    notes: "Closed early after unexpected move",
    totalInvested: 4500,
    roi: -13.33
  }
];

// Mock summary data
export const mockSummaryData: any[] = [
  {
    id: "101",
    summaryId: "S1001",
    traderName: "John Smith",
    underlyingSymbol: "AAPL",
    totalTrades: 5,
    totalProfitLoss: 3500,
    averageProfitLoss: 700,
    winningTrades: 4,
    losingTrades: 1,
    winRate: 80,
    notes: "Consistent performer"
  },
  {
    id: "102",
    summaryId: "S1002",
    traderName: "Sarah Johnson",
    underlyingSymbol: "TSLA",
    totalTrades: 8,
    totalProfitLoss: -1200,
    averageProfitLoss: -150,
    winningTrades: 3,
    losingTrades: 5,
    winRate: 37.5,
    notes: "Highly volatile"
  },
  {
    id: "103",
    summaryId: "S1003",
    traderName: "John Smith",
    underlyingSymbol: "MSFT",
    totalTrades: 4,
    totalProfitLoss: 2100,
    averageProfitLoss: 525,
    winningTrades: 3,
    losingTrades: 1,
    winRate: 75,
    notes: "Reliable returns"
  }
];

// Mock open positions data
export const mockOpenPositions: any[] = [
  {
    id: "201",
    positionId: "P1001",
    tradeId: "T1003",
    underlyingSymbol: "MSFT",
    optionType: "Bull Call Spread",
    entryDate: "2023-03-10",
    entryPrice: 3.25,
    currentPrice: 3.85,
    quantity: 15,
    totalPremium: 4875,
    status: "Open",
    notes: "In profit, monitoring for exit"
  },
  {
    id: "202",
    positionId: "P1002",
    tradeId: "T1004",
    underlyingSymbol: "AMD",
    optionType: "Bear Put Spread",
    entryDate: "2023-03-15",
    entryPrice: 2.10,
    currentPrice: 2.45,
    quantity: 20,
    totalPremium: 4200,
    status: "Open",
    notes: "Approaching target"
  },
  {
    id: "203",
    positionId: "P1003",
    tradeId: "T1006",
    underlyingSymbol: "SPY",
    optionType: "Iron Condor",
    entryDate: "2023-04-05",
    entryPrice: 4.50,
    currentPrice: 5.25,
    quantity: 10,
    totalPremium: 4500,
    status: "Open",
    notes: "Holding within expected range"
  }
];

// Mock performance metrics data
export const mockPerformanceMetrics: any[] = [
  {
    id: "301",
    metricId: "M1001",
    date: "2023-03-31",
    totalTrades: 15,
    totalProfit: 8500,
    totalLoss: 3200,
    netProfit: 5300,
    averageProfit: 566.67,
    averageLoss: 640,
    winRate: 70,
    notes: "Q1 Performance"
  },
  {
    id: "302",
    metricId: "M1002",
    date: "2023-02-28",
    totalTrades: 12,
    totalProfit: 6200,
    totalLoss: 2800,
    netProfit: 3400,
    averageProfit: 516.67,
    averageLoss: 700,
    winRate: 66.67,
    notes: "February Performance"
  },
  {
    id: "303",
    metricId: "M1003",
    date: "2023-01-31",
    totalTrades: 10,
    totalProfit: 4800,
    totalLoss: 1600,
    netProfit: 3200,
    averageProfit: 480,
    averageLoss: 533.33,
    winRate: 75,
    notes: "January Performance"
  }
];
