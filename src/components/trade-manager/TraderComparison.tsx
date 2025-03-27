
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui-components/Card";
import { BarChart } from "@/components/charts/BarChart";
import { Award, TrendingUp, DollarSign, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface TraderStat {
  name: string;
  tradeCount: number;
  profitLoss: number;
  roi: number;
  winLossRatio: number;
  averageProfitPerTrade: number;
  consistency: number;
  maxDrawdown: number;
  profitableTrades: number;
  unprofitableTrades: number;
}

interface TraderComparisonProps {
  traderStats: TraderStat[];
}

export const TraderComparison = ({ traderStats }: TraderComparisonProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  // Prepare data for different metrics
  const roiData = traderStats.map(stat => ({
    name: stat.name,
    value: stat.roi
  }));

  const winLossData = traderStats.map(stat => ({
    name: stat.name,
    value: stat.winLossRatio
  }));

  const profitData = traderStats.map(stat => ({
    name: stat.name,
    value: stat.profitLoss
  }));

  const drawdownData = traderStats.map(stat => ({
    name: stat.name,
    value: stat.maxDrawdown
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ROI Comparison */}
        <Card glass>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-base">
              <TrendingUp className="h-4 w-4 mr-2" />
              Return on Investment (ROI)
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <BarChart 
              data={roiData} 
              xKey="name" 
              yKey="value"
              labelFormatter={(value) => `${value.toFixed(2)}%`}
              valueColor={(value) => value > 0 ? 'hsl(var(--success))' : 'hsl(var(--destructive))'}
            />
          </CardContent>
        </Card>

        {/* Win/Loss Ratio Comparison */}
        <Card glass>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-base">
              <Award className="h-4 w-4 mr-2" />
              Win/Loss Ratio
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <BarChart 
              data={winLossData} 
              xKey="name" 
              yKey="value"
              labelFormatter={(value) => value.toFixed(2)}
              valueColor={() => 'hsl(var(--primary))'}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profit Comparison */}
        <Card glass>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-base">
              <DollarSign className="h-4 w-4 mr-2" />
              Total Profit/Loss
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <BarChart 
              data={profitData} 
              xKey="name" 
              yKey="value"
              labelFormatter={(value) => formatCurrency(value)}
              valueColor={(value) => value > 0 ? 'hsl(var(--success))' : 'hsl(var(--destructive))'}
            />
          </CardContent>
        </Card>

        {/* Max Drawdown Comparison */}
        <Card glass>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-base">
              <ArrowDown className="h-4 w-4 mr-2" />
              Maximum Drawdown
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <BarChart 
              data={drawdownData} 
              xKey="name" 
              yKey="value"
              labelFormatter={(value) => `${value.toFixed(2)}%`}
              valueColor={() => 'hsl(var(--destructive))'}
            />
          </CardContent>
        </Card>
      </div>

      {/* Trader Metrics Table */}
      <Card glass>
        <CardHeader>
          <CardTitle>Trader Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium">Trader</th>
                  <th className="text-right py-2 font-medium">Trade Count</th>
                  <th className="text-right py-2 font-medium">Win Rate</th>
                  <th className="text-right py-2 font-medium">Avg Profit</th>
                  <th className="text-right py-2 font-medium">ROI</th>
                  <th className="text-right py-2 font-medium">Max Drawdown</th>
                  <th className="text-right py-2 font-medium">Consistency</th>
                </tr>
              </thead>
              <tbody>
                {traderStats.map(trader => (
                  <tr key={trader.name} className="border-b border-border/40">
                    <td className="py-2 font-medium">{trader.name}</td>
                    <td className="text-right py-2">{trader.tradeCount}</td>
                    <td className="text-right py-2">
                      {trader.tradeCount > 0 ? 
                        `${((trader.profitableTrades / trader.tradeCount) * 100).toFixed(1)}%` : 
                        '0.0%'}
                    </td>
                    <td className={cn(
                      "text-right py-2",
                      trader.averageProfitPerTrade > 0 ? "text-success" :
                      trader.averageProfitPerTrade < 0 ? "text-destructive" : ""
                    )}>
                      {formatCurrency(trader.averageProfitPerTrade)}
                    </td>
                    <td className={cn(
                      "text-right py-2",
                      trader.roi > 0 ? "text-success" :
                      trader.roi < 0 ? "text-destructive" : ""
                    )}>
                      {trader.roi.toFixed(2)}%
                    </td>
                    <td className="text-right py-2 text-destructive">
                      {trader.maxDrawdown.toFixed(2)}%
                    </td>
                    <td className="text-right py-2">
                      {trader.consistency.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
