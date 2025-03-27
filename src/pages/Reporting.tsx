
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui-components/Card";
import { LineChart } from "@/components/charts/LineChart";
import { BarChart } from "@/components/charts/BarChart";
import { PieChart } from "@/components/charts/PieChart";
import { useToast } from "@/hooks/use-toast";
import useLocalStorage from "@/hooks/useLocalStorage";
import { 
  Trade, 
  formatCurrency, 
  getUniqueTraders, 
  calculateSummaryMetrics 
} from "@/components/ui-components/DataTableTypes";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { exportTradesCSV } from "@/utils/csvUtils";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  BarChart3, 
  Calendar, 
  Download, 
  FileText, 
  PieChart as PieChartIcon, 
  UserCircle 
} from "lucide-react";
import { DataTable } from "@/components/ui-components/DataTable";
import { cn } from "@/lib/utils";

export default function Reporting() {
  const [trades, setTrades] = useLocalStorage<Trade[]>("trades", []);
  const [activeTab, setActiveTab] = useState("performance");
  const [selectedTrader, setSelectedTrader] = useState<string>("all");
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("all");
  const [selectedSymbol, setSelectedSymbol] = useState<string>("all");
  const { toast } = useToast();
  
  const uniqueTraders = getUniqueTraders(trades);
  const uniqueSymbols = Array.from(new Set(trades.map(trade => trade.underlyingSymbol)));
  
  // Filter trades based on selections
  const filteredTrades = trades.filter(trade => {
    const matchesTrader = selectedTrader === "all" || trade.traderName === selectedTrader;
    const matchesSymbol = selectedSymbol === "all" || trade.underlyingSymbol === selectedSymbol;
    
    let matchesTimeframe = true;
    if (selectedTimeframe !== "all") {
      const tradeDate = new Date(trade.entryDate);
      const now = new Date();
      if (selectedTimeframe === "7days") {
        const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7));
        matchesTimeframe = tradeDate >= sevenDaysAgo;
      } else if (selectedTimeframe === "30days") {
        const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
        matchesTimeframe = tradeDate >= thirtyDaysAgo;
      } else if (selectedTimeframe === "90days") {
        const ninetyDaysAgo = new Date(now.setDate(now.getDate() - 90));
        matchesTimeframe = tradeDate >= ninetyDaysAgo;
      }
    }
    
    return matchesTrader && matchesSymbol && matchesTimeframe;
  });
  
  const summaryMetrics = calculateSummaryMetrics(filteredTrades);
  
  // Data for performance by option type
  const optionTypePerformance = () => {
    const optionTypes = Array.from(new Set(filteredTrades.map(trade => trade.optionType)));
    return optionTypes.map(type => {
      const typeTotal = filteredTrades
        .filter(trade => trade.optionType === type)
        .reduce((sum, trade) => sum + trade.profitLoss, 0);
      
      return {
        name: type,
        value: typeTotal
      };
    });
  };
  
  // Data for performance by trader
  const traderPerformance = () => {
    return uniqueTraders.map(trader => {
      const traderTotal = filteredTrades
        .filter(trade => trade.traderName === trader)
        .reduce((sum, trade) => sum + trade.profitLoss, 0);
      
      return {
        name: trader,
        value: traderTotal
      };
    });
  };
  
  // Data for trades by status
  const tradesByStatus = () => {
    const statusCounts = {
      Open: filteredTrades.filter(trade => trade.status === "Open").length,
      Closed: filteredTrades.filter(trade => trade.status === "Closed").length,
      Pending: filteredTrades.filter(trade => trade.status === "Pending").length
    };
    
    return [
      { name: "Open", value: statusCounts.Open, color: "hsl(var(--success))" },
      { name: "Closed", value: statusCounts.Closed, color: "hsl(var(--destructive))" },
      { name: "Pending", value: statusCounts.Pending, color: "hsl(var(--warning))" }
    ];
  };
  
  // Handle export to CSV
  const handleExportReport = () => {
    try {
      const csvData = exportTradesCSV(filteredTrades);
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      const filename = `trade_report_${selectedTrader !== "all" ? selectedTrader + "_" : ""}${new Date().toISOString().split('T')[0]}.csv`;
      
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Report exported",
        description: "Your trade report has been exported to CSV."
      });
    } catch (err) {
      console.error('Export error:', err);
      toast({
        title: "Export failed",
        description: "There was an error exporting your report.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-light">Reporting</h1>
        
        <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
          <button
            onClick={handleExportReport}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </button>
        </div>
      </div>
      
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div>
          <label className="text-sm font-medium mb-1 block">Trader</label>
          <Select
            value={selectedTrader}
            onValueChange={setSelectedTrader}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Trader" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Traders</SelectItem>
              {uniqueTraders.map(trader => (
                <SelectItem key={trader} value={trader}>{trader}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="text-sm font-medium mb-1 block">Symbol</label>
          <Select
            value={selectedSymbol}
            onValueChange={setSelectedSymbol}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Symbol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Symbols</SelectItem>
              {uniqueSymbols.map(symbol => (
                <SelectItem key={symbol} value={symbol}>{symbol}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="text-sm font-medium mb-1 block">Timeframe</label>
          <Select
            value={selectedTimeframe}
            onValueChange={setSelectedTimeframe}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card glass>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Profit/Loss</p>
                <h3 className={cn(
                  "text-2xl font-semibold mt-1",
                  summaryMetrics.totalProfitLoss > 0 ? "text-success" : 
                  summaryMetrics.totalProfitLoss < 0 ? "text-destructive" : ""
                )}>
                  {formatCurrency(summaryMetrics.totalProfitLoss)}
                </h3>
              </div>
              <div className={cn(
                "p-2 rounded-full",
                summaryMetrics.totalProfitLoss > 0 ? "bg-success/10" : 
                summaryMetrics.totalProfitLoss < 0 ? "bg-destructive/10" : "bg-muted/10"
              )}>
                <BarChart3 className={cn(
                  "h-5 w-5",
                  summaryMetrics.totalProfitLoss > 0 ? "text-success" : 
                  summaryMetrics.totalProfitLoss < 0 ? "text-destructive" : "text-muted-foreground"
                )} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card glass>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Trade Count</p>
                <h3 className="text-2xl font-semibold mt-1">
                  {filteredTrades.length}
                </h3>
              </div>
              <div className="bg-primary/10 p-2 rounded-full">
                <FileText className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card glass>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">ROI</p>
                <h3 className={cn(
                  "text-2xl font-semibold mt-1",
                  summaryMetrics.roi > 0 ? "text-success" : 
                  summaryMetrics.roi < 0 ? "text-destructive" : ""
                )}>
                  {summaryMetrics.roi.toFixed(2)}%
                </h3>
              </div>
              <div className={cn(
                "p-2 rounded-full",
                summaryMetrics.roi > 0 ? "bg-success/10" : 
                summaryMetrics.roi < 0 ? "bg-destructive/10" : "bg-muted/10"
              )}>
                <Calendar className={cn(
                  "h-5 w-5",
                  summaryMetrics.roi > 0 ? "text-success" : 
                  summaryMetrics.roi < 0 ? "text-destructive" : "text-muted-foreground"
                )} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="performance" className="mb-8" onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0">
          <TabsTrigger 
            value="performance" 
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none h-10 px-4"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Performance
          </TabsTrigger>
          <TabsTrigger 
            value="traders" 
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none h-10 px-4"
          >
            <UserCircle className="h-4 w-4 mr-2" />
            Traders
          </TabsTrigger>
          <TabsTrigger 
            value="status" 
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none h-10 px-4"
          >
            <PieChartIcon className="h-4 w-4 mr-2" />
            Trade Status
          </TabsTrigger>
          <TabsTrigger 
            value="data" 
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none h-10 px-4"
          >
            <FileText className="h-4 w-4 mr-2" />
            Raw Data
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="performance" className="mt-4">
          <Card glass>
            <CardHeader>
              <CardTitle>Performance by Option Type</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <BarChart 
                data={optionTypePerformance()} 
                xKey="name" 
                yKey="value"
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="traders" className="mt-4">
          <Card glass>
            <CardHeader>
              <CardTitle>Performance by Trader</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <BarChart 
                data={traderPerformance()} 
                xKey="name" 
                yKey="value"
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="status" className="mt-4">
          <Card glass>
            <CardHeader>
              <CardTitle>Trades by Status</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <PieChart 
                data={tradesByStatus()}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="data" className="mt-4">
          <Card glass>
            <CardHeader>
              <CardTitle>Trade Data</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable 
                data={filteredTrades}
                onView={() => {}}
                onEdit={() => {}}
                onDelete={() => {}}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
