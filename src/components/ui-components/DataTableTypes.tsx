
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
