
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui-components/Card";
import { LineChart } from "@/components/charts/LineChart";
import { PieChart } from "@/components/charts/PieChart";
import { BarChart } from "@/components/charts/BarChart";
import { DataTable, Trade } from "@/components/ui-components/DataTable";
import { TradeModal } from "@/components/ui-components/TradeModal";
import { ArrowUp, ArrowDown, DollarSign, FileText, AlertCircle, Award, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTradeStatistics } from "@/hooks/useTradeStatistics";
import { StatsCards } from "@/components/trade-manager/StatsCards";
import { useTradersData } from "@/hooks/useTradersData"; 

// Mock data for demonstration
const mockTrades: Trade[] = [
  {
    id: "1",
    tradeId: "T1001",
    traderName: "John Doe",
    underlyingSymbol: "AAPL",
    optionType: "Call",
    entryDate: "2023-01-15",
    entryPrice: 5.75,
    exitDate: "2023-02-10",
    exitPrice: 8.25,
    quantity: 10,
    totalPremium: 5750,
    totalInvested: 5750,
    profitLoss: 2500,
    status: "Closed",
    notes: "Closed for profit after earnings announcement"
  },
  {
    id: "2",
    tradeId: "T1002",
    traderName: "Jane Smith",
    underlyingSymbol: "TSLA",
    optionType: "Put",
    entryDate: "2023-02-01",
    entryPrice: 10.50,
    exitDate: "2023-02-15",
    exitPrice: 6.50,
    quantity: 5,
    totalPremium: 5250,
    totalInvested: 5250,
    profitLoss: -2100,
    status: "Closed",
    notes: "Closed for loss after market rally"
  },
  {
    id: "3",
    tradeId: "T1003",
    traderName: "John Doe",
    underlyingSymbol: "MSFT",
    optionType: "Call",
    entryDate: "2023-03-10",
    entryPrice: 3.25,
    quantity: 15,
    totalPremium: 4875,
    totalInvested: 4875,
    profitLoss: 1200,
    status: "Open",
    notes: "Holding through next earnings"
  },
  {
    id: "4",
    tradeId: "T1004",
    traderName: "Jane Smith",
    underlyingSymbol: "AMD",
    optionType: "Put",
    entryDate: "2023-03-15",
    entryPrice: 2.10,
    quantity: 20,
    totalPremium: 4200,
    totalInvested: 4200,
    profitLoss: 800,
    status: "Open",
    notes: "Expecting pullback after recent run"
  },
  {
    id: "5",
    tradeId: "T1005",
    traderName: "Alex Johnson",
    underlyingSymbol: "NVDA",
    optionType: "Call",
    entryDate: "2023-03-20",
    entryPrice: 15.75,
    quantity: 3,
    totalPremium: 4725,
    totalInvested: 4725,
    profitLoss: 0,
    status: "Pending",
    notes: "Waiting for confirmation before adding to position"
  }
];

// Historical profit/loss data for the line chart
const mockProfitLossHistory = [
  { date: "2023-01-01", profitLoss: 0 },
  { date: "2023-01-15", profitLoss: 500 },
  { date: "2023-01-31", profitLoss: 1200 },
  { date: "2023-02-15", profitLoss: 750 },
  { date: "2023-02-28", profitLoss: 2000 },
  { date: "2023-03-15", profitLoss: 1500 },
  { date: "2023-03-31", profitLoss: 2400 }
];

export default function Dashboard() {
  const [trades, setTrades] = useState<Trade[]>(mockTrades);
  const [selectedTrade, setSelectedTrade] = useState<Trade | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const { toast } = useToast();
  
  // Use the enhanced trade statistics
  const stats = useTradeStatistics(trades);
  const { uniqueTraders, traderStats } = useTradersData(trades);
  
  // Get status distribution for pie chart
  const getStatusDistribution = () => {
    return [
      { name: "Open", value: stats.totalOpenTrades, color: "hsl(var(--success))" },
      { name: "Closed", value: stats.totalClosedTrades, color: "hsl(var(--destructive))" },
      { name: "Pending", value: stats.totalPendingTrades, color: "hsl(var(--warning))" }
    ];
  };

  // Option type data for bar chart
  const getOptionTypeDistribution = () => {
    const result = [
      { name: "Call", value: 0 },
      { name: "Put", value: 0 }
    ];
    
    trades.forEach(trade => {
      if (trade.optionType === "Call") {
        result[0].value += trade.profitLoss;
      } else {
        result[1].value += trade.profitLoss;
      }
    });
    
    return result;
  };
  
  const recentTrades = [...trades].sort((a, b) => {
    return new Date(b.entryDate).getTime() - new Date(a.entryDate).getTime();
  }).slice(0, 5);
  
  const handleViewTrade = (trade: Trade) => {
    setSelectedTrade(trade);
    setIsEditMode(false);
    setIsModalOpen(true);
  };
  
  const handleEditTrade = (trade: Trade) => {
    setSelectedTrade(trade);
    setIsEditMode(true);
    setIsModalOpen(true);
  };
  
  const handleDeleteTrade = (trade: Trade) => {
    const updatedTrades = trades.filter(t => t.id !== trade.id);
    setTrades(updatedTrades);
    toast({
      title: "Trade deleted",
      description: `Trade ${trade.tradeId} has been deleted.`
    });
  };
  
  const handleSaveTrade = (updatedTrade: Trade) => {
    const updatedTrades = trades.map(trade => 
      trade.id === updatedTrade.id ? updatedTrade : trade
    );
    setTrades(updatedTrades);
    setIsModalOpen(false);
    toast({
      title: "Trade updated",
      description: `Trade ${updatedTrade.tradeId} has been updated.`
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-light mb-8">Dashboard</h1>
      
      {/* Enhanced Stats Cards */}
      <StatsCards 
        totalInvested={stats.totalInvested}
        totalProfitLoss={stats.totalProfitLoss}
        totalOpenTrades={stats.totalOpenTrades}
        totalClosedTrades={stats.totalClosedTrades}
        uniqueTraders={uniqueTraders}
      />
      
      {/* Additional Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <Card glass className="animate-slide-up" style={{ animationDelay: "600ms" }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-normal">ROI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <TrendingUp className="h-6 w-6 text-primary" />
              <span className={`text-xl font-light ${stats.roi > 0 ? 'text-success' : stats.roi < 0 ? 'text-destructive' : ''}`}>
                {stats.roi.toFixed(2)}%
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card glass className="animate-slide-up" style={{ animationDelay: "700ms" }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-normal">Win/Loss Ratio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Award className="h-6 w-6 text-primary" />
              <span className="text-xl font-light">
                {stats.winLossRatio.toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card glass className="animate-slide-up" style={{ animationDelay: "800ms" }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-normal">Avg. Profit/Trade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <DollarSign className="h-6 w-6 text-primary" />
              <span className={`text-xl font-light ${stats.averageProfitPerTrade > 0 ? 'text-success' : stats.averageProfitPerTrade < 0 ? 'text-destructive' : ''}`}>
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  maximumFractionDigits: 0
                }).format(stats.averageProfitPerTrade)}
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card glass className="animate-slide-up" style={{ animationDelay: "900ms" }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-normal">Max Drawdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <ArrowDown className="h-6 w-6 text-destructive" />
              <span className="text-xl font-light text-destructive">
                {stats.maxDrawdown.toFixed(2)}%
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card glass className="animate-slide-up" style={{ animationDelay: "1000ms" }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-normal">Max Win Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <TrendingUp className="h-6 w-6 text-success" />
              <span className="text-xl font-light text-success">
                {stats.maxWinStreak}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <Card glass className="lg:col-span-2 animate-slide-up" style={{ animationDelay: "600ms" }}>
          <CardHeader>
            <CardTitle>Cumulative Profit/Loss</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <LineChart 
              data={mockProfitLossHistory} 
              xKey="date" 
              yKey="profitLoss"
            />
          </CardContent>
        </Card>
        
        <Card glass className="animate-slide-up" style={{ animationDelay: "700ms" }}>
          <CardHeader>
            <CardTitle>Trade Status</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <PieChart 
              data={getStatusDistribution()}
            />
          </CardContent>
        </Card>
        
        <Card glass className="lg:col-span-3 animate-slide-up" style={{ animationDelay: "800ms" }}>
          <CardHeader>
            <CardTitle>Options Type Performance</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <BarChart 
              data={getOptionTypeDistribution()} 
              xKey="name" 
              yKey="value"
            />
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Trades Table */}
      <Card glass className="animate-slide-up" style={{ animationDelay: "900ms" }}>
        <CardHeader>
          <CardTitle>Recent Trades</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable 
            data={recentTrades}
            onView={handleViewTrade}
            onEdit={handleEditTrade}
            onDelete={handleDeleteTrade}
          />
        </CardContent>
      </Card>
      
      {/* Trade Details Modal */}
      <TradeModal 
        trade={selectedTrade}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTrade}
        isEditMode={isEditMode}
      />
    </div>
  );
}
