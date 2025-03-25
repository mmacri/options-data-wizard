import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui-components/Card";
import { LineChart } from "@/components/charts/LineChart";
import { PieChart } from "@/components/charts/PieChart";
import { BarChart } from "@/components/charts/BarChart";
import { DataTable, Trade } from "@/components/ui-components/DataTable";
import { TradeModal } from "@/components/ui-components/TradeModal";
import { 
  FileText, 
  Download,
  Printer,
  Search,
  Calendar,
  Filter,
  UserCircle,
  ArrowDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { exportTradesCSV } from "@/utils/csvUtils";

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

const mockProfitLossHistory = [
  { date: "2023-01-01", profitLoss: 0 },
  { date: "2023-01-15", profitLoss: 500 },
  { date: "2023-01-31", profitLoss: 1200 },
  { date: "2023-02-15", profitLoss: 750 },
  { date: "2023-02-28", profitLoss: 2000 },
  { date: "2023-03-15", profitLoss: 1500 },
  { date: "2023-03-31", profitLoss: 2400 }
];

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

const getUnderlyingPerformance = (trades: Trade[]) => {
  const performanceBySymbol: Record<string, number> = {};
  
  trades.forEach(trade => {
    if (!performanceBySymbol[trade.underlyingSymbol]) {
      performanceBySymbol[trade.underlyingSymbol] = 0;
    }
    performanceBySymbol[trade.underlyingSymbol] += trade.profitLoss;
  });
  
  return Object.entries(performanceBySymbol).map(([name, value]) => ({
    name,
    value
  }));
};

export default function Reporting() {
  const [trades, setTrades] = useState<Trade[]>(mockTrades);
  const [filteredTrades, setFilteredTrades] = useState<Trade[]>(mockTrades);
  const [selectedTrade, setSelectedTrade] = useState<Trade | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [symbolFilter, setSymbolFilter] = useState<string>("");
  const [optionTypeFilter, setOptionTypeFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [traderFilter, setTraderFilter] = useState<string>("");
  
  const { toast } = useToast();
  
  const uniqueTraders = Array.from(new Set(trades.map(trade => trade.traderName || "Unknown")));
  
  const handleViewTrade = (trade: Trade) => {
    setSelectedTrade(trade);
    setIsModalOpen(true);
  };
  
  const handleEditTrade = (trade: Trade) => {
    setSelectedTrade(trade);
    setIsModalOpen(true);
  };
  
  const handleDeleteTrade = (trade: Trade) => {
    toast({
      title: "Action not available",
      description: "Delete is not available in the reporting view."
    });
  };
  
  const applyFilters = () => {
    let result = [...trades];
    
    if (startDate) {
      const start = new Date(startDate);
      result = result.filter(trade => new Date(trade.entryDate) >= start);
    }
    
    if (endDate) {
      const end = new Date(endDate);
      result = result.filter(trade => new Date(trade.entryDate) <= end);
    }
    
    if (symbolFilter) {
      result = result.filter(trade => 
        trade.underlyingSymbol.toLowerCase().includes(symbolFilter.toLowerCase())
      );
    }
    
    if (optionTypeFilter) {
      result = result.filter(trade => trade.optionType === optionTypeFilter);
    }
    
    if (statusFilter) {
      result = result.filter(trade => trade.status === statusFilter);
    }
    
    if (traderFilter) {
      result = result.filter(trade => trade.traderName === traderFilter);
    }
    
    setFilteredTrades(result);
    
    toast({
      title: "Filters applied",
      description: `Showing ${result.length} trades.`
    });
  };
  
  const resetFilters = () => {
    setStartDate("");
    setEndDate("");
    setSymbolFilter("");
    setOptionTypeFilter("");
    setStatusFilter("");
    setTraderFilter("");
    setFilteredTrades(trades);
    
    toast({
      title: "Filters reset",
      description: "Showing all trades."
    });
  };
  
  const exportToCSV = () => {
    try {
      const csvData = exportTradesCSV(filteredTrades, traderFilter || undefined);
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.setAttribute('href', url);
      const filename = traderFilter ? 
        `${traderFilter.replace(/\s+/g, '_')}_report.csv` : 
        'trades_report.csv';
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export complete",
        description: "Your report has been downloaded."
      });
    } catch (err) {
      console.error('Export error:', err);
      toast({
        title: "Export failed",
        description: "There was an error exporting your data.",
        variant: "destructive"
      });
    }
  };
  
  const printToPDF = () => {
    toast({
      title: "Print started",
      description: "Your report is being prepared for printing."
    });
    
    setTimeout(() => {
      toast({
        title: "Print ready",
        description: "Your report is ready to print."
      });
    }, 1500);
  };
  
  const totalTrades = filteredTrades.length;
  const profitableTrades = filteredTrades.filter(trade => trade.profitLoss > 0).length;
  const totalProfit = filteredTrades.reduce((sum, trade) => {
    if (trade.profitLoss > 0) return sum + trade.profitLoss;
    return sum;
  }, 0);
  const totalLoss = filteredTrades.reduce((sum, trade) => {
    if (trade.profitLoss < 0) return sum + Math.abs(trade.profitLoss);
    return sum;
  }, 0);
  const netProfit = filteredTrades.reduce((sum, trade) => sum + trade.profitLoss, 0);
  const winRate = totalTrades > 0 ? (profitableTrades / totalTrades) * 100 : 0;
  const avgProfit = totalTrades > 0 ? netProfit / totalTrades : 0;
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-light mb-8">Reporting</h1>
      
      <Card glass className="mb-8 animate-slide-up" style={{ animationDelay: "100ms" }}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Filter Options
          </CardTitle>
          <CardDescription>
            Select criteria to filter your trades report
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="startDate">
                  <Calendar className="h-4 w-4 inline-block mr-2" />
                  Start Date
                </label>
                <input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="endDate">
                  <Calendar className="h-4 w-4 inline-block mr-2" />
                  End Date
                </label>
                <input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="symbolFilter">
                  Underlying Symbol
                </label>
                <input
                  id="symbolFilter"
                  type="text"
                  placeholder="Enter symbol..."
                  value={symbolFilter}
                  onChange={(e) => setSymbolFilter(e.target.value)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="optionTypeFilter">
                  Option Type
                </label>
                <select
                  id="optionTypeFilter"
                  value={optionTypeFilter}
                  onChange={(e) => setOptionTypeFilter(e.target.value)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">All Types</option>
                  <option value="Call">Call</option>
                  <option value="Put">Put</option>
                  <option value="Bull Call Spread">Bull Call Spread</option>
                  <option value="Bear Put Spread">Bear Put Spread</option>
                  <option value="Covered Call">Covered Call</option>
                  <option value="Iron Condor">Iron Condor</option>
                  <option value="Butterfly">Butterfly</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="statusFilter">
                  Status
                </label>
                <select
                  id="statusFilter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">All Statuses</option>
                  <option value="Open">Open</option>
                  <option value="Closed">Closed</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="traderFilter">
                  <UserCircle className="h-4 w-4 inline-block mr-2" />
                  Trader
                </label>
                <select
                  id="traderFilter"
                  value={traderFilter}
                  onChange={(e) => setTraderFilter(e.target.value)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">All Traders</option>
                  {uniqueTraders.map(trader => (
                    <option key={trader} value={trader}>{trader}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={applyFilters}
                  className="flex-1 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Apply Filters
                </button>
                
                <button
                  onClick={resetFilters}
                  className="flex-1 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background h-10 px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card glass className="animate-slide-up" style={{ animationDelay: "200ms" }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-normal">Summary Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total Trades:</span>
              <span className="font-medium">{totalTrades}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Profitable Trades:</span>
              <span className="font-medium">{profitableTrades}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Win Rate:</span>
              <span className="font-medium">{winRate.toFixed(1)}%</span>
            </div>
          </CardContent>
        </Card>
        
        <Card glass className="animate-slide-up" style={{ animationDelay: "300ms" }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-normal">Profit Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total Profit:</span>
              <span className="font-medium text-success">{formatCurrency(totalProfit)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total Loss:</span>
              <span className="font-medium text-destructive">{formatCurrency(totalLoss)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Net Profit:</span>
              <span className={cn(
                "font-medium",
                netProfit > 0 ? "text-success" : netProfit < 0 ? "text-destructive" : ""
              )}>
                {formatCurrency(netProfit)}
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card glass className="animate-slide-up" style={{ animationDelay: "400ms" }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-normal">Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Avg. Profit per Trade:</span>
              <span className={cn(
                "font-medium",
                avgProfit > 0 ? "text-success" : avgProfit < 0 ? "text-destructive" : ""
              )}>
                {formatCurrency(avgProfit)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Profit Factor:</span>
              <span className="font-medium">
                {totalLoss > 0 ? (totalProfit / totalLoss).toFixed(2) : "∞"}
              </span>
            </div>
            <div className="mt-2">
              <div className="flex items-center justify-end space-x-2">
                <button
                  onClick={exportToCSV}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background h-9 px-3 bg-secondary text-secondary-foreground hover:bg-secondary/80"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </button>
                <button
                  onClick={printToPDF}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background h-9 px-3 bg-secondary text-secondary-foreground hover:bg-secondary/80"
                >
                  <Printer className="h-4 w-4 mr-1" />
                  Print
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <Card glass className="lg:col-span-2 animate-slide-up" style={{ animationDelay: "500ms" }}>
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
        
        <Card glass className="animate-slide-up" style={{ animationDelay: "600ms" }}>
          <CardHeader>
            <CardTitle>Trade Status</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <PieChart 
              data={getStatusDistribution(filteredTrades)}
            />
          </CardContent>
        </Card>
        
        <Card glass className="lg:col-span-3 animate-slide-up" style={{ animationDelay: "700ms" }}>
          <CardHeader>
            <CardTitle>Underlying Performance</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <BarChart 
              data={getUnderlyingPerformance(filteredTrades)} 
              xKey="name" 
              yKey="value"
            />
          </CardContent>
        </Card>
      </div>
      
      <Card glass className="animate-slide-up" style={{ animationDelay: "800ms" }}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Trade Report
          </CardTitle>
          <CardDescription>
            Showing {filteredTrades.length} trades based on filter criteria
            {traderFilter && <span className="ml-1 font-semibold">for {traderFilter}</span>}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable 
            data={filteredTrades}
            onView={handleViewTrade}
            onEdit={handleEditTrade}
            onDelete={handleDeleteTrade}
          />
        </CardContent>
      </Card>
      
      <TradeModal 
        trade={selectedTrade}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={() => {}}
        isEditMode={false}
      />
    </div>
  );
}

