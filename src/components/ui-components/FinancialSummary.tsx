
import { cn } from "@/lib/utils";

interface FinancialSummaryProps {
  totalInvestedAcrossOpenTrades: number;
  totalProfitLoss: number;
}

export function FinancialSummary({ 
  totalInvestedAcrossOpenTrades, 
  totalProfitLoss 
}: FinancialSummaryProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-muted/30 p-4 rounded-md">
        <h3 className="text-sm font-medium mb-2">Total Currently Invested</h3>
        <p className="text-xl font-semibold">{formatCurrency(totalInvestedAcrossOpenTrades)}</p>
      </div>
      <div className={cn(
        "p-4 rounded-md",
        totalProfitLoss > 0 ? "bg-success/20" : totalProfitLoss < 0 ? "bg-destructive/20" : "bg-muted/30"
      )}>
        <h3 className="text-sm font-medium mb-2">Total Profit/Loss</h3>
        <p className={cn(
          "text-xl font-semibold",
          totalProfitLoss > 0 ? "text-success" : totalProfitLoss < 0 ? "text-destructive" : ""
        )}>
          {formatCurrency(totalProfitLoss)}
        </p>
      </div>
    </div>
  );
}
