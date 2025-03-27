
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
      unprofitableTrades
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

  return {
    uniqueTraders,
    traderStats,
    getTraderPerformanceOverTime
  };
};
