
import { Wallet, DollarSign, TrendingUp, CircleCheck, Users } from "lucide-react";
import { Card } from "@/components/ui-components/Card";

interface StatsCardsProps {
  totalInvested: number;
  totalProfitLoss: number;
  totalOpenTrades: number;
  totalClosedTrades: number;
  uniqueTraders: string[];
}

export const StatsCards = ({ 
  totalInvested, 
  totalProfitLoss, 
  totalOpenTrades, 
  totalClosedTrades,
  uniqueTraders 
}: StatsCardsProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card glass>
        <div className="pt-6 p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground">Total Currently Invested</p>
              <h3 className="text-2xl font-semibold mt-1">{formatCurrency(totalInvested)}</h3>
            </div>
            <div className="bg-primary/10 p-2 rounded-full">
              <Wallet className="h-5 w-5 text-primary" />
            </div>
          </div>
        </div>
      </Card>
      
      <Card glass>
        <div className="pt-6 p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground">Total Profit/Loss</p>
              <h3 className={`text-2xl font-semibold mt-1 ${totalProfitLoss > 0 ? 'text-success' : totalProfitLoss < 0 ? 'text-destructive' : ''}`}>
                {formatCurrency(totalProfitLoss)}
              </h3>
            </div>
            <div className={`p-2 rounded-full ${totalProfitLoss > 0 ? 'bg-success/10' : totalProfitLoss < 0 ? 'bg-destructive/10' : 'bg-muted/10'}`}>
              <DollarSign className={`h-5 w-5 ${totalProfitLoss > 0 ? 'text-success' : totalProfitLoss < 0 ? 'text-destructive' : 'text-muted-foreground'}`} />
            </div>
          </div>
        </div>
      </Card>
      
      <Card glass>
        <div className="pt-6 p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground">ROI</p>
              <h3 className={`text-2xl font-semibold mt-1 ${totalProfitLoss > 0 ? 'text-success' : totalProfitLoss < 0 ? 'text-destructive' : ''}`}>
                {totalInvested > 0 ? (totalProfitLoss / totalInvested * 100).toFixed(2) : "0.00"}%
              </h3>
            </div>
            <div className={`p-2 rounded-full ${totalProfitLoss > 0 ? 'bg-success/10' : totalProfitLoss < 0 ? 'bg-destructive/10' : 'bg-muted/10'}`}>
              <TrendingUp className={`h-5 w-5 ${totalProfitLoss > 0 ? 'text-success' : totalProfitLoss < 0 ? 'text-destructive' : 'text-muted-foreground'}`} />
            </div>
          </div>
        </div>
      </Card>
      
      <Card glass>
        <div className="pt-6 p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground">Active Trades</p>
              <h3 className="text-2xl font-semibold mt-1">{totalOpenTrades}</h3>
              <p className="text-xs text-muted-foreground mt-1">
                {totalOpenTrades + totalClosedTrades > 0 ? 
                  `${Math.round(totalOpenTrades / (totalOpenTrades + totalClosedTrades) * 100)}% of all trades` :
                  "No trades yet"}
              </p>
            </div>
            <div className="bg-primary/10 p-2 rounded-full">
              <CircleCheck className="h-5 w-5 text-primary" />
            </div>
          </div>
        </div>
      </Card>
      
      <Card glass>
        <div className="pt-6 p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground">Traders</p>
              <h3 className="text-2xl font-semibold mt-1">{uniqueTraders.length}</h3>
            </div>
            <div className="bg-primary/10 p-2 rounded-full">
              <Users className="h-5 w-5 text-primary" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
