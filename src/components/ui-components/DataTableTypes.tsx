
export type OptionType = "Call" | "Put" | "Bull Call Spread" | "Bear Put Spread" | "Covered Call" | "Iron Condor" | "Butterfly";

export type Trade = {
  id: string;
  tradeId: string;
  underlyingSymbol: string;
  optionType: OptionType;
  entryDate: string;
  entryPrice: number;
  exitDate?: string;
  exitPrice?: number;
  quantity: number;
  totalPremium: number;
  profitLoss: number;
  status: "Open" | "Closed" | "Pending";
  notes?: string;
  totalInvested?: number;
  roi?: number;
  traderName?: string;
};

// Helper function to calculate ROI
export const calculateROI = (profitLoss: number, totalInvested: number): number => {
  if (!totalInvested || totalInvested === 0) return 0;
  return (profitLoss / totalInvested) * 100;
};

// Helper to format currency values
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
};

// Helper to get unique trader names from trade data
export const getUniqueTraders = (trades: Trade[]): string[] => {
  return Array.from(new Set(trades.map(trade => trade.traderName || "Unknown")));
};

// Helper to calculate summary metrics
export const calculateSummaryMetrics = (trades: Trade[]) => {
  const totalInvested = trades
    .filter(trade => trade.status === "Open")
    .reduce((sum, trade) => sum + (trade.totalInvested || 0), 0);
    
  const totalProfitLoss = trades.reduce((sum, trade) => sum + trade.profitLoss, 0);
  
  const openTrades = trades.filter(trade => trade.status === "Open").length;
  const closedTrades = trades.filter(trade => trade.status === "Closed").length;
  const pendingTrades = trades.filter(trade => trade.status === "Pending").length;
  
  return {
    totalInvested,
    totalProfitLoss,
    openTrades,
    closedTrades,
    pendingTrades,
    roi: totalInvested > 0 ? (totalProfitLoss / totalInvested * 100) : 0
  };
};

// Helper to calculate trader statistics
export const calculateTraderStats = (trades: Trade[]) => {
  const uniqueTraders = getUniqueTraders(trades);
  
  return uniqueTraders.map(trader => {
    const traderTrades = trades.filter(trade => trade.traderName === trader);
    const openTradeCount = traderTrades.filter(trade => trade.status === "Open").length;
    const profitLoss = traderTrades.reduce((sum, trade) => sum + trade.profitLoss, 0);
    const invested = traderTrades
      .filter(trade => trade.status === "Open")
      .reduce((sum, trade) => sum + (trade.totalInvested || 0), 0);
      
    return {
      name: trader,
      tradeCount: traderTrades.length,
      openTrades: openTradeCount,
      profitLoss,
      invested,
      roi: invested > 0 ? (profitLoss / invested * 100) : 0
    };
  });
};
