
import { Trade } from "@/components/ui-components/DataTableTypes";

export const useTradeStatistics = (trades: Trade[]) => {
  // Calculate total invested across all open trades
  const totalInvested = trades
    .filter(trade => trade.status === "Open")
    .reduce((total, trade) => total + (trade.totalInvested || 0), 0);
    
  // Calculate total profit/loss across all trades
  const totalProfitLoss = trades.reduce((total, trade) => total + trade.profitLoss, 0);
  
  // Count open and closed trades
  const totalOpenTrades = trades.filter(trade => trade.status === "Open").length;
  const totalClosedTrades = trades.filter(trade => trade.status === "Closed").length;
  
  return {
    totalInvested,
    totalProfitLoss,
    totalOpenTrades,
    totalClosedTrades
  };
};
