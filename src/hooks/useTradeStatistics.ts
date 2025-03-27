
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
  const totalPendingTrades = trades.filter(trade => trade.status === "Pending").length;
  
  // Calculate ROI
  const roi = totalInvested > 0 ? (totalProfitLoss / totalInvested) * 100 : 0;
  
  // Calculate win/loss ratio
  const profitableTrades = trades.filter(trade => trade.profitLoss > 0).length;
  const unprofitableTrades = trades.filter(trade => trade.profitLoss < 0).length;
  const winLossRatio = unprofitableTrades > 0 ? profitableTrades / unprofitableTrades : profitableTrades;
  
  // Calculate average profit per trade
  const averageProfitPerTrade = trades.length > 0 ? totalProfitLoss / trades.length : 0;
  
  return {
    totalInvested,
    totalProfitLoss,
    totalOpenTrades,
    totalClosedTrades,
    totalPendingTrades,
    roi,
    winLossRatio,
    averageProfitPerTrade,
    profitableTrades,
    unprofitableTrades
  };
};
