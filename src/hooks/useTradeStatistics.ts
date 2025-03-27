
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
  
  // Calculate maximum drawdown (simplified version)
  let maxDrawdown = 0;
  let peak = 0;
  
  // Sort trades by date for proper drawdown calculation
  const sortedTrades = [...trades]
    .filter(trade => trade.exitDate) // Only consider closed trades
    .sort((a, b) => new Date(a.exitDate!).getTime() - new Date(b.exitDate!).getTime());
  
  let runningPnL = 0;
  
  for (const trade of sortedTrades) {
    runningPnL += trade.profitLoss;
    
    // Update peak if we have a new maximum
    if (runningPnL > peak) {
      peak = runningPnL;
    }
    
    // Calculate current drawdown
    const currentDrawdown = peak > 0 ? ((peak - runningPnL) / peak) * 100 : 0;
    
    // Update max drawdown if current drawdown is larger
    if (currentDrawdown > maxDrawdown) {
      maxDrawdown = currentDrawdown;
    }
  }
  
  // Calculate winning/losing streaks
  let currentWinStreak = 0;
  let currentLoseStreak = 0;
  let maxWinStreak = 0;
  let maxLoseStreak = 0;
  
  for (const trade of sortedTrades) {
    if (trade.profitLoss > 0) {
      // Reset lose streak
      currentLoseStreak = 0;
      // Increment win streak
      currentWinStreak++;
      // Update max win streak
      if (currentWinStreak > maxWinStreak) {
        maxWinStreak = currentWinStreak;
      }
    } else if (trade.profitLoss < 0) {
      // Reset win streak
      currentWinStreak = 0;
      // Increment lose streak
      currentLoseStreak++;
      // Update max lose streak
      if (currentLoseStreak > maxLoseStreak) {
        maxLoseStreak = currentLoseStreak;
      }
    }
  }
  
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
    unprofitableTrades,
    maxDrawdown,
    maxWinStreak,
    maxLoseStreak
  };
};
