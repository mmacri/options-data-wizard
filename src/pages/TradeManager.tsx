import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui-components/Card";
import { DataTable, Trade, OptionType, calculateROI } from "@/components/ui-components/DataTable";
import { TradeModal } from "@/components/ui-components/TradeModal";
import { Plus, DollarSign, ChartBar, CircleCheck, Wallet, TrendingUp, Users, Download, Upload, UserCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import useLocalStorage from "@/hooks/useLocalStorage";
import { importTradesCSV, exportTradesCSV } from "@/utils/csvUtils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mockTrades: Trade[] = [
  {
    id: "1",
    tradeId: "T1001",
    traderName: "John Smith",
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
    notes: "Closed for profit after earnings announcement",
    totalInvested: 5750,
    roi: 43.48
  },
  {
    id: "2",
    tradeId: "T1002",
    traderName: "Sarah Johnson",
    underlyingSymbol: "TSLA",
    optionType: "Put",
    entryDate: "2023-02-01",
    entryPrice: 10.50,
    quantity: 5,
    totalPremium: 5250,
    profitLoss: -2100,
    status: "Closed",
    notes: "Closed for loss after market rally",
    totalInvested: 5250,
    roi: -40.00
  },
  {
    id: "3",
    tradeId: "T1003",
    traderName: "John Smith",
    underlyingSymbol: "MSFT",
    optionType: "Bull Call Spread",
    entryDate: "2023-03-10",
    entryPrice: 3.25,
    quantity: 15,
    totalPremium: 4875,
    profitLoss: 1200,
    status: "Open",
    notes: "Holding through next earnings",
    totalInvested: 4875,
    roi: 24.62
  },
  {
    id: "4",
    tradeId: "T1004",
    traderName: "Sarah Johnson",
    underlyingSymbol: "AMD",
    optionType: "Bear Put Spread",
    entryDate: "2023-03-15",
    entryPrice: 2.10,
    quantity: 20,
    totalPremium: 4200,
    profitLoss: 800,
    status: "Open",
    notes: "Expecting pullback after recent run",
    totalInvested: 4200,
    roi: 19.05
  },
  {
    id: "5",
    tradeId: "T1005",
    traderName: "Mike Williams",
    underlyingSymbol: "NVDA",
    optionType: "Covered Call",
    entryDate: "2023-03-20",
    entryPrice: 15.75,
    quantity: 3,
    totalPremium: 4725,
    profitLoss: 0,
    status: "Pending",
    notes: "Waiting for confirmation before adding to position",
    totalInvested: 4725,
    roi: 0
  },
  {
    id: "6",
    tradeId: "T1006",
    traderName: "Mike Williams",
    underlyingSymbol: "SPY",
    optionType: "Iron Condor",
    entryDate: "2023-04-05",
    entryPrice: 4.50,
    quantity: 10,
    totalPremium: 4500,
    profitLoss: 1800,
    status: "Open",
    notes: "Market neutral strategy",
    totalInvested: 4500,
    roi: 40.00
  },
  {
    id: "7",
    tradeId: "T1007",
    traderName: "John Smith",
    underlyingSymbol: "AMZN",
    optionType: "Butterfly",
    entryDate: "2023-04-10",
    entryPrice: 2.25,
    quantity: 20,
    totalPremium: 4500,
    profitLoss: -600,
    status: "Closed",
    notes: "Closed early after unexpected move",
    totalInvested: 4500,
    roi: -13.33
  }
];

const mockSummaryData: any[] = [
  {
    id: "101",
    summaryId: "S1001",
    traderName: "John Smith",
    underlyingSymbol: "AAPL",
    totalTrades: 5,
    totalProfitLoss: 3500,
    averageProfitLoss: 700,
    winningTrades: 4,
    losingTrades: 1,
    winRate: 80,
    notes: "Consistent performer"
  },
  {
    id: "102",
    summaryId: "S1002",
    traderName: "Sarah Johnson",
    underlyingSymbol: "TSLA",
    totalTrades: 8,
    totalProfitLoss: -1200,
    averageProfitLoss: -150,
    winningTrades: 3,
    losingTrades: 5,
    winRate: 37.5,
    notes: "Highly volatile"
  },
  {
    id: "103",
    summaryId: "S1003",
    traderName: "John Smith",
    underlyingSymbol: "MSFT",
    totalTrades: 4,
    totalProfitLoss: 2100,
    averageProfitLoss: 525,
    winningTrades: 3,
    losingTrades: 1,
    winRate: 75,
    notes: "Reliable returns"
  }
];

const mockOpenPositions: any[] = [
  {
    id: "201",
    positionId: "P1001",
    tradeId: "T1003",
    underlyingSymbol: "MSFT",
    optionType: "Bull Call Spread",
    entryDate: "2023-03-10",
    entryPrice: 3.25,
    currentPrice: 3.85,
    quantity: 15,
    totalPremium: 4875,
    status: "Open",
    notes: "In profit, monitoring for exit"
  },
  {
    id: "202",
    positionId: "P1002",
    tradeId: "T1004",
    underlyingSymbol: "AMD",
    optionType: "Bear Put Spread",
    entryDate: "2023-03-15",
    entryPrice: 2.10,
    currentPrice: 2.45,
    quantity: 20,
    totalPremium: 4200,
    status: "Open",
    notes: "Approaching target"
  },
  {
    id: "203",
    positionId: "P1003",
    tradeId: "T1006",
    underlyingSymbol: "SPY",
    optionType: "Iron Condor",
    entryDate: "2023-04-05",
    entryPrice: 4.50,
    currentPrice: 5.25,
    quantity: 10,
    totalPremium: 4500,
    status: "Open",
    notes: "Holding within expected range"
  }
];

const mockPerformanceMetrics: any[] = [
  {
    id: "301",
    metricId: "M1001",
    date: "2023-03-31",
    totalTrades: 15,
    totalProfit: 8500,
    totalLoss: 3200,
    netProfit: 5300,
    averageProfit: 566.67,
    averageLoss: 640,
    winRate: 70,
    notes: "Q1 Performance"
  },
  {
    id: "302",
    metricId: "M1002",
    date: "2023-02-28",
    totalTrades: 12,
    totalProfit: 6200,
    totalLoss: 2800,
    netProfit: 3400,
    averageProfit: 516.67,
    averageLoss: 700,
    winRate: 66.67,
    notes: "February Performance"
  },
  {
    id: "303",
    metricId: "M1003",
    date: "2023-01-31",
    totalTrades: 10,
    totalProfit: 4800,
    totalLoss: 1600,
    netProfit: 3200,
    averageProfit: 480,
    averageLoss: 533.33,
    winRate: 75,
    notes: "January Performance"
  }
];

export default function TradeManager() {
  const [activeTab, setActiveTab] = useState("details");
  const [trades, setTrades] = useLocalStorage<Trade[]>("trades", mockTrades);
  const [summaryData, setSummaryData] = useLocalStorage<any[]>("tradeSummary", mockSummaryData);
  const [openPositions, setOpenPositions] = useLocalStorage<any[]>("openPositions", mockOpenPositions);
  const [performanceMetrics, setPerformanceMetrics] = useLocalStorage<any[]>("performanceMetrics", mockPerformanceMetrics);
  
  const [selectedTrade, setSelectedTrade] = useState<Trade | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAddingTrade, setIsAddingTrade] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [csvImportText, setCsvImportText] = useState("");
  const [selectedTraderImport, setSelectedTraderImport] = useState<string | null>(null);
  
  const { toast } = useToast();
  
  const uniqueTraders = Array.from(new Set(trades.map(trade => trade.traderName || "Unknown")));
  
  const totalInvested = trades
    .filter(trade => trade.status === "Open")
    .reduce((total, trade) => total + (trade.totalInvested || 0), 0);
    
  const totalProfitLoss = trades.reduce((total, trade) => total + trade.profitLoss, 0);
  
  const totalOpenTrades = trades.filter(trade => trade.status === "Open").length;
  const totalClosedTrades = trades.filter(trade => trade.status === "Closed").length;
  
  const traderStats = uniqueTraders.map(trader => {
    const traderTrades = trades.filter(trade => trade.traderName === trader);
    const openTradeCount = traderTrades.filter(trade => trade.status === "Open").length;
    const profitLoss = traderTrades.reduce((sum, trade) => sum + trade.profitLoss, 0);
    const invested = traderTrades
      .filter(trade => trade.status === "Open")
      .reduce((sum, trade) => sum + (trade.totalInvested || 0), 0);
      
    return {
      name: trader,
      tradeCount: traderTrades.length,
      openTrades: openTradeCount,
      profitLoss,
      invested
    };
  });
  
  const handleViewTrade = (trade: Trade) => {
    setSelectedTrade(trade);
    setIsEditMode(false);
    setIsAddingTrade(false);
    setIsModalOpen(true);
  };
  
  const handleEditTrade = (trade: Trade) => {
    setSelectedTrade(trade);
    setIsEditMode(true);
    setIsAddingTrade(false);
    setIsModalOpen(true);
  };
  
  const handleDeleteTrade = (trade: Trade) => {
    let updatedData;
    
    switch (activeTab) {
      case "details":
        updatedData = trades.filter(t => t.id !== trade.id);
        setTrades(updatedData);
        break;
      case "summary":
        updatedData = summaryData.filter(t => t.id !== trade.id);
        setSummaryData(updatedData);
        break;
      case "positions":
        updatedData = openPositions.filter(t => t.id !== trade.id);
        setOpenPositions(updatedData);
        break;
      case "metrics":
        updatedData = performanceMetrics.filter(t => t.id !== trade.id);
        setPerformanceMetrics(updatedData);
        break;
    }
    
    toast({
      title: "Trade deleted",
      description: `Trade ${trade.tradeId} has been deleted.`
    });
  };
  
  const handleSaveTrade = (updatedTrade: Trade) => {
    const calculatedROI = calculateROI(
      updatedTrade.profitLoss,
      updatedTrade.totalInvested || updatedTrade.entryPrice * updatedTrade.quantity
    );
    
    const finalTrade = {
      ...updatedTrade,
      roi: calculatedROI
    };
    
    let updatedData;
    
    if (isAddingTrade) {
      switch (activeTab) {
        case "details":
          updatedData = [...trades, finalTrade];
          setTrades(updatedData);
          break;
        case "summary":
          toast({
            title: "Not applicable",
            description: "Cannot add individual trades to the summary tab.",
            variant: "destructive"
          });
          setIsModalOpen(false);
          return;
        case "positions":
          if (finalTrade.status !== "Open") {
            toast({
              title: "Invalid status",
              description: "Only trades with 'Open' status can be added to positions.",
              variant: "destructive"
            });
            setIsModalOpen(false);
            return;
          }
          const newPosition = {
            id: crypto.randomUUID(),
            positionId: `P${Math.floor(Math.random() * 10000)}`,
            tradeId: finalTrade.tradeId,
            underlyingSymbol: finalTrade.underlyingSymbol,
            optionType: finalTrade.optionType,
            entryDate: finalTrade.entryDate,
            entryPrice: finalTrade.entryPrice,
            currentPrice: finalTrade.entryPrice,
            quantity: finalTrade.quantity,
            totalPremium: finalTrade.totalPremium,
            status: "Open",
            notes: finalTrade.notes
          };
          updatedData = [...openPositions, newPosition];
          setOpenPositions(updatedData);
          break;
        case "metrics":
          toast({
            title: "Not applicable",
            description: "Cannot add individual trades to the metrics tab.",
            variant: "destructive"
          });
          setIsModalOpen(false);
          return;
      }
      
      toast({
        title: "Trade added",
        description: `New trade ${finalTrade.tradeId} has been added.`
      });
    } else {
      switch (activeTab) {
        case "details":
          updatedData = trades.map(trade => 
            trade.id === finalTrade.id ? finalTrade : trade
          );
          setTrades(updatedData);
          break;
        case "summary":
          updatedData = summaryData.map(item => 
            item.id === finalTrade.id ? finalTrade : item
          );
          setSummaryData(updatedData);
          break;
        case "positions":
          updatedData = openPositions.map(position => 
            position.id === finalTrade.id ? finalTrade : position
          );
          setOpenPositions(updatedData);
          break;
        case "metrics":
          updatedData = performanceMetrics.map(metric => 
            metric.id === finalTrade.id ? finalTrade : metric
          );
          setPerformanceMetrics(updatedData);
          break;
      }
      
      toast({
        title: "Trade updated",
        description: `Trade ${finalTrade.tradeId} has been updated.`
      });
    }
    
    setIsModalOpen(false);
  };
  
  const handleAddNewTrade = () => {
    setSelectedTrade(undefined);
    setIsEditMode(true);
    setIsAddingTrade(true);
    setIsModalOpen(true);
  };
  
  const handleExportCSV = (traderName?: string) => {
    try {
      const csvData = exportTradesCSV(trades, traderName);
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.setAttribute('href', url);
      const filename = traderName ? 
        `${traderName.replace(/\s+/g, '_')}_trades_export.csv` : 
        'trades_export.csv';
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export successful",
        description: traderName ? 
          `${traderName}'s trades have been exported to CSV.` : 
          "Trades have been exported to CSV."
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
  
  const handleImportCSV = () => {
    try {
      if (!csvImportText.trim()) {
        toast({
          title: "Import failed",
          description: "No CSV data provided.",
          variant: "destructive"
        });
        return;
      }
      
      const importedTrades = importTradesCSV(csvImportText, selectedTraderImport || undefined);
      setTrades([...trades, ...importedTrades]);
      
      toast({
        title: "Import successful",
        description: `${importedTrades.length} trades have been imported.`
      });
      
      setIsImportModalOpen(false);
      setCsvImportText("");
      setSelectedTraderImport(null);
    } catch (err) {
      console.error('Import error:', err);
      toast({
        title: "Import failed",
        description: "There was an error importing your data. Please check the CSV format.",
        variant: "destructive"
      });
    }
  };
  
  const getCurrentData = () => {
    switch (activeTab) {
      case "details":
        return trades;
      case "summary":
        return summaryData;
      case "positions":
        return openPositions;
      case "metrics":
        return performanceMetrics;
      default:
        return trades;
    }
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };
  
  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-light">Trade Manager</h1>
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background h-10 px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/90">
                <Upload className="mr-2 h-4 w-4" />
                Import
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsImportModalOpen(true)}>
                Import All Trades
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Import for Trader</DropdownMenuLabel>
              {uniqueTraders.map(trader => (
                <DropdownMenuItem 
                  key={`import-${trader}`}
                  onClick={() => {
                    setSelectedTraderImport(trader);
                    setIsImportModalOpen(true);
                  }}
                >
                  {trader}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background h-10 px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/90">
                <Download className="mr-2 h-4 w-4" />
                Export
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExportCSV()}>
                Export All Trades
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Export by Trader</DropdownMenuLabel>
              {uniqueTraders.map(trader => (
                <DropdownMenuItem 
                  key={`export-${trader}`}
                  onClick={() => handleExportCSV(trader)}
                >
                  {trader}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <button
            onClick={handleAddNewTrade}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Trade
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card glass>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Total Currently Invested</p>
                <h3 className="text-2xl font-semibold mt-1">{formatCurrency(totalInvested)}</h3>
              </div>
              <div className="bg-primary/10 p-2 rounded-full">
                <Wallet className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card glass>
          <CardContent className="pt-6">
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
          </CardContent>
        </Card>
        
        <Card glass>
          <CardContent className="pt-6">
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
          </CardContent>
        </Card>
        
        <Card glass>
          <CardContent className="pt-6">
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
          </CardContent>
        </Card>
        
        <Card glass>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Traders</p>
                <h3 className="text-2xl font-semibold mt-1">{uniqueTraders.length}</h3>
              </div>
              <div className="bg-primary/10 p-2 rounded-full">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="details" className="mb-8" onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0">
          <TabsTrigger 
            value="details" 
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none h-10 px-4"
          >
            Trade Details
          </TabsTrigger>
          <TabsTrigger 
            value="summary" 
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none h-10 px-4"
          >
            Trade Summary
          </TabsTrigger>
          <TabsTrigger 
            value="positions" 
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none h-10 px-4"
          >
            Open Positions
          </TabsTrigger>
          <TabsTrigger 
            value="metrics" 
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none h-10 px-4"
          >
            Performance Metrics
          </TabsTrigger>
          <TabsTrigger 
            value="traders" 
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none h-10 px-4"
          >
            Traders
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="mt-4">
          <Card glass>
            <CardHeader>
              <CardTitle>Trade Details</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable 
                data={trades}
                onView={handleViewTrade}
                onEdit={handleEditTrade}
                onDelete={handleDeleteTrade}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="summary" className="mt-4">
          <Card glass>
            <CardHeader>
              <CardTitle>Trade Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable 
                data={summaryData}
                onView={handleViewTrade}
                onEdit={handleEditTrade}
                onDelete={handleDeleteTrade}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="positions" className="mt-4">
          <Card glass>
            <CardHeader>
              <CardTitle>Open Positions</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable 
                data={openPositions}
                onView={handleViewTrade}
                onEdit={handleEditTrade}
                onDelete={handleDeleteTrade}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="metrics" className="mt-4">
          <Card glass>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable 
                data={performanceMetrics}
                onView={handleViewTrade}
                onEdit={handleEditTrade}
                onDelete={handleDeleteTrade}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="traders" className="mt-4">
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
                              onClick={() => handleExportCSV(trader.name)}
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
        </TabsContent>
      </Tabs>
      
      <TradeModal 
        trade={selectedTrade}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTrade}
        isEditMode={isEditMode}
      />
      
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md bg-card rounded-lg shadow-lg p-6 animate-fade-in">
            <h3 className="text-lg font-medium mb-4">
              {selectedTraderImport ? `Import Trades for ${selectedTraderImport}` : "Import Trades from CSV"}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Paste your CSV data below. The first row should contain headers matching the required fields.
              {selectedTraderImport && ` All imported trades will be assigned to ${selectedTraderImport}.`}
            </p>
            {selectedTraderImport && (
              <div className="flex items-center mb-4 p-2 bg-primary/10 rounded-md">
                <UserCircle className="h-5 w-5 mr-2 text-primary" />
                <span>Importing for: <strong>{selectedTraderImport}</strong></span>
                <button 
                  className="ml-auto text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => setSelectedTraderImport(null)}
                >
                  Clear
                </button>
              </div>
            )}
            <textarea
              value={csvImportText}
              onChange={(e) => setCsvImportText(e.target.value)}
              className="w-full h-40 p-3 border rounded-md mb-4 text-sm font-mono"
              placeholder="tradeId,underlyingSymbol,optionType,entryDate,entryPrice,..."
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setIsImportModalOpen(false);
                  setCsvImportText("");
                  setSelectedTraderImport(null);
                }}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background h-10 px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/90"
              >
                Cancel
              </button>
              <button
                onClick={handleImportCSV}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Import
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
