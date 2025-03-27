
import { useEffect, useState } from "react";
import { Trade } from "@/components/ui-components/DataTableTypes";

export const useTradersData = (trades: Trade[]) => {
  // Get unique trader names
  const uniqueTraders = Array.from(new Set(trades.map(trade => trade.traderName || "Unknown")));
  
  // Calculate trader statistics
  const traderStats = uniqueTraders.map(trader => {
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
      invested
    };
  });

  return {
    uniqueTraders,
    traderStats
  };
};
