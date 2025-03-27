
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
import { DateFilter } from "@/components/ui-components/DateFilter";
import { TraderFilter } from "@/components/ui-components/TraderFilter";
import { DateRange } from "react-day-picker";
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
  UserCircle,
  TrendingUp,
  ArrowDown,
  BarChart as BarChartIcon,
  Award
} from "lucide-react";
import { DataTable } from "@/components/ui-components/DataTable";
import { cn } from "@/lib/utils";
import { useTradeStatistics } from "@/hooks/useTradeStatistics";
import { useTradersData } from "@/hooks/useTradersData";

export default function Reporting() {
  const [trades, setTrades] = useLocalStorage<Trade[]>("trades", []);
  const [activeTab, setActiveTab] = useState("performance");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [traderFilter, setTraderFilter] = useState<string>("all");
  const [selectedTrader, setSelectedTrader] = useState<string>("all");
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("all");
  const [selectedSymbol, setSelectedSymbol] = useState<string>("all");
  const { toast } = useToast();
  
  const uniqueTraders = getUniqueTraders(trades);
  const uniqueSymbols = Array.from(new Set(trades.map(trade => trade.underlyingSymbol)));
  
  // Filter trades based on selections
  const filteredTrades = trades.filter(trade => {
    const matchesTrader = traderFilter === "all" || trade.traderName === traderFilter;
    const matchesSymbol = selectedSymbol === "all" || trade.underlyingSymbol === selectedSymbol;
    
    let matchesDateRange = true;
    if (dateRange?.from) {
      const tradeDate = new Date(trade.entryDate);
      matchesDateRange = tradeDate >= dateRange.from;
      
      if (dateRange.to) {
        matchesDateRange = matchesDateRange && tradeDate <= dateRange.to;
      }
    }
    
    return matchesTrader && matchesSymbol && matchesDateRange;
  });
  
  // Use enhanced statistics hooks
  const stats = useTradeStatistics(filteredTrades);
  const { traderStats, getTraderPerformanceOverTime, getPerformanceByOptionType } = useTradersData(filteredTrades);
  
  // Get performance data based on selections
  const performanceData = selectedTrader !== "all" 
    ? getTraderPerformanceOverTime(selectedTrader, selectedTimeframe as any)
    : undefined;
  
  const optionTypePerformance = selectedTrader !== "all"
    ? getPerformanceByOptionType(selectedTrader)
    : getPerformanceByOptionType();
  
  // Data for performance by trader
  const traderPerformance = () => {
    return traderStats.map(trader => ({
      name: trader.name,
      value: trader.profitLoss
    }));
  };
  
  // Data for trades by status
  const tradesByStatus = () => {
    return [
      { name: "Open", value: stats.totalOpenTrades, color: "hsl(var(--success))" },
      { name: "Closed", value: stats.totalClosedTrades, color: "hsl(var(--destructive))" },
      { name: "Pending", value: stats.totalPendingTrades, color: "hsl(var(--warning))" }
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
        <TraderFilter
          traderFilter={traderFilter}
          setTraderFilter={setTraderFilter}
          uniqueTraders={uniqueTraders}
        />
        
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
        
        <DateFilter
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />
      </div>
      
      {/* Enhanced Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card glass>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Profit/Loss</p>
                <h3 className={cn(
                  "text-2xl font-semibold mt-1",
                  stats.totalProfitLoss > 0 ? "text-success" : 
                  stats.totalProfitLoss < 0 ? "text-destructive" : ""
                )}>
                  {formatCurrency(stats.totalProfitLoss)}
                </h3>
              </div>
              <div className={cn(
                "p-2 rounded-full",
                stats.totalProfitLoss > 0 ? "bg-success/10" : 
                stats.totalProfitLoss < 0 ? "bg-destructive/10" : "bg-muted/10"
              )}>
                <BarChart3 className={cn(
                  "h-5 w-5",
                  stats.totalProfitLoss > 0 ? "text-success" : 
                  stats.totalProfitLoss < 0 ? "text-destructive" : "text-muted-foreground"
                )} />
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
                  stats.roi > 0 ? "text-success" : 
                  stats.roi < 0 ? "text-destructive" : ""
                )}>
                  {stats.roi.toFixed(2)}%
                </h3>
              </div>
              <div className={cn(
                "p-2 rounded-full",
                stats.roi > 0 ? "bg-success/10" : 
                stats.roi < 0 ? "bg-destructive/10" : "bg-muted/10"
              )}>
                <TrendingUp className={cn(
                  "h-5 w-5",
                  stats.roi > 0 ? "text-success" : 
                  stats.roi < 0 ? "text-destructive" : "text-muted-foreground"
                )} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card glass>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Win/Loss Ratio</p>
                <h3 className="text-2xl font-semibold mt-1">
                  {stats.winLossRatio.toFixed(2)}
                </h3>
              </div>
              <div className="bg-primary/10 p-2 rounded-full">
                <Award className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card glass>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Max Drawdown</p>
                <h3 className="text-2xl font-semibold mt-1 text-destructive">
                  {stats.maxDrawdown.toFixed(2)}%
                </h3>
              </div>
              <div className="bg-destructive/10 p-2 rounded-full">
                <ArrowDown className="h-5 w-5 text-destructive" />
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
            value="advanced" 
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none h-10 px-4"
          >
            <BarChartIcon className="h-4 w-4 mr-2" />
            Advanced Metrics
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
                data={optionTypePerformance} 
                xKey="optionType" 
                yKey="profitLoss"
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
        
        <TabsContent value="advanced" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card glass>
              <CardHeader>
                <CardTitle>Trader Metrics Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 font-medium">Trader</th>
                        <th className="text-right py-2 font-medium">Win Rate</th>
                        <th className="text-right py-2 font-medium">Avg Profit</th>
                        <th className="text-right py-2 font-medium">Max Drawdown</th>
                        <th className="text-right py-2 font-medium">Consistency</th>
                      </tr>
                    </thead>
                    <tbody>
                      {traderStats.map(trader => (
                        <tr key={trader.name} className="border-b border-border/40">
                          <td className="py-2 font-medium">{trader.name}</td>
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
                          <td className="text-right py-2 text-destructive">
                            {trader.maxDrawdown.toFixed(1)}%
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
            
            <Card glass>
              <CardHeader>
                <CardTitle>Streaks and Patterns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Maximum Win Streak</h3>
                    <div className="flex items-center">
                      <div className="bg-success/10 p-1.5 rounded">
                        <TrendingUp className="h-4 w-4 text-success" />
                      </div>
                      <div className="ml-2">
                        <span className="text-xl font-medium text-success">{stats.maxWinStreak}</span>
                        <span className="text-xs text-muted-foreground ml-1">consecutive wins</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Maximum Loss Streak</h3>
                    <div className="flex items-center">
                      <div className="bg-destructive/10 p-1.5 rounded">
                        <ArrowDown className="h-4 w-4 text-destructive" />
                      </div>
                      <div className="ml-2">
                        <span className="text-xl font-medium text-destructive">{stats.maxLoseStreak}</span>
                        <span className="text-xs text-muted-foreground ml-1">consecutive losses</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t border-border/40">
                    <h3 className="text-sm font-medium mb-2">Profitable vs Unprofitable Trades</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-success/5 p-3 rounded">
                        <div className="text-center">
                          <span className="text-xl font-medium text-success">{stats.profitableTrades}</span>
                          <p className="text-xs text-muted-foreground">Profitable</p>
                        </div>
                      </div>
                      <div className="bg-destructive/5 p-3 rounded">
                        <div className="text-center">
                          <span className="text-xl font-medium text-destructive">{stats.unprofitableTrades}</span>
                          <p className="text-xs text-muted-foreground">Unprofitable</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
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
