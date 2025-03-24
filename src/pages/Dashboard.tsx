
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui-components/Card";
import { LineChart } from "@/components/charts/LineChart";
import { PieChart } from "@/components/charts/PieChart";
import { BarChart } from "@/components/charts/BarChart";
import { DataTable, Trade } from "@/components/ui-components/DataTable";
import { TradeModal } from "@/components/ui-components/TradeModal";
import { ArrowUp, ArrowDown, DollarSign, FileText, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data for demonstration
const mockTrades: Trade[] = [
  {
    id: "1",
    tradeId: "T1001",
    underlyingSymbol: "AAPL",
    optionType: "Call",
    entryDate: "2023-01-15",
    entryPrice: 5.75,
    exitDate: "2023-02-10",
    exitPrice: 8.25,
    quantity: 10,
    totalPremium: 5750,
    profitLoss: 2500,
    status: "Closed",
    notes: "Closed for profit after earnings announcement"
  },
  {
    id: "2",
    tradeId: "T1002",
    underlyingSymbol: "TSLA",
    optionType: "Put",
    entryDate: "2023-02-01",
    entryPrice: 10.50,
    quantity: 5,
    totalPremium: 5250,
    profitLoss: -2100,
    status: "Closed",
    notes: "Closed for loss after market rally"
  },
  {
    id: "3",
    tradeId: "T1003",
    underlyingSymbol: "MSFT",
    optionType: "Call",
    entryDate: "2023-03-10",
    entryPrice: 3.25,
    quantity: 15,
    totalPremium: 4875,
    profitLoss: 1200,
    status: "Open",
    notes: "Holding through next earnings"
  },
  {
    id: "4",
    tradeId: "T1004",
    underlyingSymbol: "AMD",
    optionType: "Put",
    entryDate: "2023-03-15",
    entryPrice: 2.10,
    quantity: 20,
    totalPremium: 4200,
    profitLoss: 800,
    status: "Open",
    notes: "Expecting pullback after recent run"
  },
  {
    id: "5",
    tradeId: "T1005",
    underlyingSymbol: "NVDA",
    optionType: "Call",
    entryDate: "2023-03-20",
    entryPrice: 15.75,
    quantity: 3,
    totalPremium: 4725,
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

// Trade status data for pie chart
const getStatusDistribution = (trades: Trade[]) => {
  const statusCounts = {
    Open: 0,
    Closed: 0,
    Pending: 0
  };
  
  trades.forEach(trade => {
    statusCounts[trade.status]++;
  });
  
  return [
    { name: "Open", value: statusCounts.Open, color: "hsl(var(--success))" },
    { name: "Closed", value: statusCounts.Closed, color: "hsl(var(--destructive))" },
    { name: "Pending", value: statusCounts.Pending, color: "hsl(var(--warning))" }
  ];
};

// Option type data for bar chart
const getOptionTypeDistribution = (trades: Trade[]) => {
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

export default function Dashboard() {
  const [trades, setTrades] = useState<Trade[]>(mockTrades);
  const [selectedTrade, setSelectedTrade] = useState<Trade | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const { toast } = useToast();
  
  // Calculate summary metrics
  const totalTrades = trades.length;
  const totalProfitLoss = trades.reduce((sum, trade) => sum + trade.profitLoss, 0);
  const openTrades = trades.filter(trade => trade.status === "Open").length;
  const closedTrades = trades.filter(trade => trade.status === "Closed").length;
  const pendingTrades = trades.filter(trade => trade.status === "Pending").length;
  
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
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <Card glass className="animate-slide-up" style={{ animationDelay: "100ms" }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-normal">Total Trades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <FileText className="h-6 w-6 text-primary" />
              <span className="text-3xl font-light">{totalTrades}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card glass className="animate-slide-up" style={{ animationDelay: "200ms" }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-normal">Total P/L</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <DollarSign className="h-6 w-6 text-primary" />
              <span className={`text-3xl font-light ${totalProfitLoss > 0 ? 'text-success' : totalProfitLoss < 0 ? 'text-destructive' : ''}`}>
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  maximumFractionDigits: 0
                }).format(totalProfitLoss)}
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card glass className="animate-slide-up" style={{ animationDelay: "300ms" }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-normal">Open Trades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <ArrowUp className="h-6 w-6 text-success" />
              <div className="text-right">
                <span className="text-3xl font-light">{openTrades}</span>
                <span className="text-muted-foreground text-xs ml-1">
                  ({Math.round((openTrades / totalTrades) * 100)}%)
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card glass className="animate-slide-up" style={{ animationDelay: "400ms" }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-normal">Closed Trades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <ArrowDown className="h-6 w-6 text-destructive" />
              <div className="text-right">
                <span className="text-3xl font-light">{closedTrades}</span>
                <span className="text-muted-foreground text-xs ml-1">
                  ({Math.round((closedTrades / totalTrades) * 100)}%)
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card glass className="animate-slide-up" style={{ animationDelay: "500ms" }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-normal">Pending Trades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <AlertCircle className="h-6 w-6 text-warning" />
              <div className="text-right">
                <span className="text-3xl font-light">{pendingTrades}</span>
                <span className="text-muted-foreground text-xs ml-1">
                  ({Math.round((pendingTrades / totalTrades) * 100)}%)
                </span>
              </div>
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
              data={getStatusDistribution(trades)}
            />
          </CardContent>
        </Card>
        
        <Card glass className="lg:col-span-3 animate-slide-up" style={{ animationDelay: "800ms" }}>
          <CardHeader>
            <CardTitle>Options Type Performance</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <BarChart 
              data={getOptionTypeDistribution(trades)} 
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
