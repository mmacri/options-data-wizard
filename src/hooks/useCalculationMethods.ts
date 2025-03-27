
import { useEffect, useState } from 'react';
import { Trade } from '@/components/ui-components/DataTableTypes';
import useLocalStorage from '@/hooks/useLocalStorage';

type CalculationMethod = 'simple' | 'compound' | 'weighted';

export type CalculationOptions = {
  roiMethod: CalculationMethod;
  pnlMethod: CalculationMethod;
  includeFees: boolean;
  includeTaxes: boolean;
  defaultRiskFreeRate: number;
};

const DEFAULT_CALCULATION_OPTIONS: CalculationOptions = {
  roiMethod: 'simple',
  pnlMethod: 'simple',
  includeFees: true,
  includeTaxes: false,
  defaultRiskFreeRate: 4.0,
};

export function useCalculationMethods() {
  const [settings] = useLocalStorage('userSettings', {
    calculations: DEFAULT_CALCULATION_OPTIONS
  });
  
  const [options, setOptions] = useState<CalculationOptions>(
    settings.calculations || DEFAULT_CALCULATION_OPTIONS
  );
  
  useEffect(() => {
    if (settings.calculations) {
      setOptions(settings.calculations);
    }
  }, [settings.calculations]);

  // Calculate ROI based on selected method
  const calculateROI = (trade: Trade): number => {
    const { profitLoss, totalInvested, entryPrice, quantity, entryDate, exitDate } = trade;
    const investment = totalInvested || (entryPrice * quantity);
    
    if (investment <= 0) return 0;
    
    switch (options.roiMethod) {
      case 'compound':
        // Compound ROI accounts for the time period
        if (!exitDate || !entryDate) return (profitLoss / investment) * 100;
        
        const entryDateObj = new Date(entryDate);
        const exitDateObj = new Date(exitDate);
        const daysHeld = Math.max(1, Math.floor((exitDateObj.getTime() - entryDateObj.getTime()) / (1000 * 60 * 60 * 24)));
        const annualFactor = 365 / daysHeld;
        
        // Annualized ROI = (1 + ROI)^(365/days) - 1
        return (Math.pow(1 + (profitLoss / investment), annualFactor) - 1) * 100;
        
      case 'weighted':
        // Time-weighted ROI - simplified version
        if (!exitDate || !entryDate) return (profitLoss / investment) * 100;
        
        const entryTime = new Date(entryDate).getTime();
        const exitTime = new Date(exitDate).getTime();
        const holdingPeriod = Math.max(1, (exitTime - entryTime) / (1000 * 60 * 60 * 24));
        
        // Adjust for time in position (shorter = better)
        return ((profitLoss / investment) * 100) * (30 / holdingPeriod);
        
      case 'simple':
      default:
        // Simple ROI = (Profit / Investment) * 100
        return (profitLoss / investment) * 100;
    }
  };

  // Calculate P/L based on selected method
  const calculateProfitLoss = (
    entryPrice: number, 
    exitPrice: number | undefined, 
    quantity: number,
    fees: number = 0,
    taxRate: number = 0
  ): number => {
    if (!exitPrice) return 0;
    
    let profitLoss = (exitPrice - entryPrice) * quantity;
    
    // Deduct fees if enabled
    if (options.includeFees && fees > 0) {
      profitLoss -= fees;
    }
    
    // Apply tax if enabled and there's a profit
    if (options.includeTaxes && taxRate > 0 && profitLoss > 0) {
      profitLoss *= (1 - taxRate / 100);
    }
    
    return profitLoss;
  };

  // Calculate risk-adjusted return (Sharpe ratio)
  const calculateRiskAdjustedReturn = (
    trades: Trade[],
    riskFreeRate: number = options.defaultRiskFreeRate
  ): number => {
    if (trades.length < 2) return 0;
    
    // Convert to decimal (e.g., 4% -> 0.04)
    const riskFreeRateDecimal = riskFreeRate / 100;
    
    // Calculate average ROI across trades
    const returns = trades.map(trade => calculateROI(trade) / 100); // Convert % to decimal
    const averageReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
    
    // Calculate standard deviation (volatility)
    const squaredDiffs = returns.map(ret => Math.pow(ret - averageReturn, 2));
    const variance = squaredDiffs.reduce((sum, sq) => sum + sq, 0) / returns.length;
    const standardDeviation = Math.sqrt(variance);
    
    // Sharpe Ratio = (Average Return - Risk Free Rate) / Standard Deviation
    if (standardDeviation === 0) return 0;
    return (averageReturn - riskFreeRateDecimal) / standardDeviation;
  };

  // Calculate maximum drawdown
  const calculateMaxDrawdown = (trades: Trade[]): number => {
    if (trades.length === 0) return 0;
    
    // Sort trades by date for proper drawdown calculation
    const sortedTrades = [...trades]
      .filter(trade => trade.exitDate)
      .sort((a, b) => new Date(a.exitDate!).getTime() - new Date(b.exitDate!).getTime());
    
    let peak = 0;
    let maxDrawdown = 0;
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
    
    return maxDrawdown;
  };

  return {
    options,
    calculateROI,
    calculateProfitLoss,
    calculateRiskAdjustedReturn,
    calculateMaxDrawdown
  };
}
