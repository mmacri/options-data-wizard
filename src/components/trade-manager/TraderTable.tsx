
import { Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui-components/Card";

interface TraderStats {
  name: string;
  tradeCount: number;
  openTrades: number;
  profitLoss: number;
  invested: number;
}

interface TraderTableProps {
  traderStats: TraderStats[];
  onExportTraderData: (trader: string) => void;
}

export const TraderTable = ({ traderStats, onExportTraderData }: TraderTableProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <Card glass>
      <CardHeader>
        <CardTitle>Trader Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-auto rounded-md border">
          <table className="w-full caption-bottom text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="h-12 px-4 text-left align-middle font-medium">Trader</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Total Trades</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Open Trades</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Invested</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Profit/Loss</th>
                <th className="h-12 px-4 text-left align-middle font-medium">ROI</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {traderStats.map((trader, index) => (
                <tr 
                  key={trader.name} 
                  className={cn(
                    "border-b transition-colors hover:bg-muted/50", 
                    index % 2 === 0 ? "bg-white dark:bg-card" : "bg-muted/20"
                  )}
                >
                  <td className="p-4 align-middle font-medium">{trader.name}</td>
                  <td className="p-4 align-middle">{trader.tradeCount}</td>
                  <td className="p-4 align-middle">{trader.openTrades}</td>
                  <td className="p-4 align-middle">{formatCurrency(trader.invested)}</td>
                  <td className={cn(
                    "p-4 align-middle font-medium",
                    trader.profitLoss > 0 ? "text-success" : trader.profitLoss < 0 ? "text-destructive" : ""
                  )}>
                    {formatCurrency(trader.profitLoss)}
                  </td>
                  <td className={cn(
                    "p-4 align-middle font-medium",
                    trader.profitLoss > 0 ? "text-success" : trader.profitLoss < 0 ? "text-destructive" : ""
                  )}>
                    {trader.invested > 0 ? (trader.profitLoss / trader.invested * 100).toFixed(2) : "0.00"}%
                  </td>
                  <td className="p-4 align-middle">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onExportTraderData(trader.name)}
                        className="inline-flex items-center justify-center rounded-md text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background h-8 px-3 bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Export
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
