
import { useEffect, useState } from "react";
import { Trade } from "@/components/ui-components/DataTableTypes";

export const useTradersData = (trades: Trade[]) => {
  // Get unique trader names
  const uniqueTraders = Array.from(new Set(trades.map(trade => trade.traderName || "Unknown")));
  
  // Calculate trader statistics
  const traderStats = uniqueTraders.map(trader => {
    const traderTrades = trades.filter(trade => trade.traderName === trader);
    const openTradeCount = traderTrades.filter(trade => trade.status === "Open").length;
    const closedTradeCount = traderTrades.filter(trade => trade.status === "Closed").length;
    const pendingTradeCount = traderTrades.filter(trade => trade.status === "Pending").length;
    
    const profitLoss = traderTrades.reduce((sum, trade) => sum + trade.profitLoss, 0);
    const invested = traderTrades
      .filter(trade => trade.status === "Open")
      .reduce((sum, trade) => sum + (trade.totalInvested || 0), 0);
    
    // Calculate ROI
    const roi = invested > 0 ? (profitLoss / invested) * 100 : 0;
    
    // Calculate win/loss ratio
    const profitableTrades = traderTrades.filter(trade => trade.profitLoss > 0).length;
    const unprofitableTrades = traderTrades.filter(trade => trade.profitLoss < 0).length;
    const winLossRatio = unprofitableTrades > 0 ? profitableTrades / unprofitableTrades : profitableTrades;
    
    // Calculate average profit per trade
    const averageProfitPerTrade = traderTrades.length > 0 ? profitLoss / traderTrades.length : 0;
    
    // Calculate consistency (standard deviation of returns)
    let consistency = 0;
    if (traderTrades.length > 1) {
      const returns = traderTrades.map(trade => 
        trade.totalInvested ? (trade.profitLoss / trade.totalInvested) * 100 : 0
      );
      const meanReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
      const squaredDiffs = returns.map(ret => Math.pow(ret - meanReturn, 2));
      const variance = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / returns.length;
      consistency = Math.sqrt(variance);
    }
    
    // Calculate drawdown for this trader
    let maxDrawdown = 0;
    let peak = 0;
    
    const sortedTrades = [...traderTrades]
      .filter(trade => trade.exitDate)
      .sort((a, b) => new Date(a.exitDate!).getTime() - new Date(b.exitDate!).getTime());
    
    let runningPnL = 0;
    
    for (const trade of sortedTrades) {
      runningPnL += trade.profitLoss;
      
      if (runningPnL > peak) {
        peak = runningPnL;
      }
      
      const currentDrawdown = peak > 0 ? ((peak - runningPnL) / peak) * 100 : 0;
      
      if (currentDrawdown > maxDrawdown) {
        maxDrawdown = currentDrawdown;
      }
    }
    
    return {
      name: trader,
      tradeCount: traderTrades.length,
      openTrades: openTradeCount,
      closedTrades: closedTradeCount,
      pendingTrades: pendingTradeCount,
      profitLoss,
      invested,
      roi,
      winLossRatio,
      averageProfitPerTrade,
      profitableTrades,
      unprofitableTrades,
      consistency,
      maxDrawdown
    };
  });

  // Get trader performance over time
  const getTraderPerformanceOverTime = (traderName: string, timeframe: "7days" | "30days" | "90days" | "all" = "all") => {
    const traderTrades = trades.filter(trade => trade.traderName === traderName);
    
    let filteredTrades = [...traderTrades];
    const now = new Date();
    
    if (timeframe !== "all") {
      let daysAgo;
      if (timeframe === "7days") daysAgo = 7;
      else if (timeframe === "30days") daysAgo = 30;
      else if (timeframe === "90days") daysAgo = 90;
      
      const cutoffDate = new Date(now);
      cutoffDate.setDate(cutoffDate.getDate() - daysAgo!);
      
      filteredTrades = traderTrades.filter(trade => new Date(trade.entryDate) >= cutoffDate);
    }
    
    // Sort by date
    filteredTrades.sort((a, b) => new Date(a.entryDate).getTime() - new Date(b.entryDate).getTime());
    
    // Create cumulative P/L data
    let cumulativePL = 0;
    const performanceData = filteredTrades.map(trade => {
      cumulativePL += trade.profitLoss;
      return {
        date: trade.entryDate,
        profitLoss: cumulativePL
      };
    });
    
    return performanceData;
  };

  // Calculate performance by option type
  const getPerformanceByOptionType = (traderName?: string) => {
    const relevantTrades = traderName 
      ? trades.filter(trade => trade.traderName === traderName)
      : trades;
    
    const optionTypes = Array.from(new Set(relevantTrades.map(trade => trade.optionType)));
    
    return optionTypes.map(optionType => {
      const optionTypeTrades = relevantTrades.filter(trade => trade.optionType === optionType);
      const profitLoss = optionTypeTrades.reduce((sum, trade) => sum + trade.profitLoss, 0);
      const count = optionTypeTrades.length;
      const winCount = optionTypeTrades.filter(trade => trade.profitLoss > 0).length;
      const lossCount = optionTypeTrades.filter(trade => trade.profitLoss < 0).length;
      const winRate = count > 0 ? (winCount / count) * 100 : 0;
      
      return {
        optionType,
        profitLoss,
        count,
        winCount,
        lossCount,
        winRate
      };
    });
  };

  return {
    uniqueTraders,
    traderStats,
    getTraderPerformanceOverTime,
    getPerformanceByOptionType
  };
};
