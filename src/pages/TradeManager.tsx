
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui-components/Card";
import { DataTable, Trade, OptionType, calculateROI } from "@/components/ui-components/DataTable";
import { TradeModal } from "@/components/ui-components/TradeModal";
import { Plus, DollarSign, ChartBar, CircleCheck, Wallet, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import useLocalStorage from "@/hooks/useLocalStorage";
import { importTradesCSV, exportTradesCSV } from "@/utils/csvUtils";

// Mock data with new option types and financial information
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
    notes: "Closed for profit after earnings announcement",
    totalInvested: 5750,
    roi: 43.48
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
    notes: "Closed for loss after market rally",
    totalInvested: 5250,
    roi: -40.00
  },
  {
    id: "3",
    tradeId: "T1003",
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

// Mock data for the Trade Summary tab
const mockSummaryData: any[] = [
  {
    id: "101",
    summaryId: "S1001",
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

// Mock data for Open Positions
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

// Mock data for Performance Metrics
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
  
  const { toast } = useToast();
  
  // Financial summary calculations
  const totalInvested = trades
    .filter(trade => trade.status === "Open")
    .reduce((total, trade) => total + (trade.totalInvested || 0), 0);
    
  const totalProfitLoss = trades.reduce((total, trade) => total + trade.profitLoss, 0);
  
  const totalOpenTrades = trades.filter(trade => trade.status === "Open").length;
  const totalClosedTrades = trades.filter(trade => trade.status === "Closed").length;
  
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
    // Make sure ROI is calculated correctly
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
          // For summary, we'd typically not add individual trades
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
          // Convert to open position format
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
          // For metrics, we'd typically not add individual trades
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
  
  // Export data as CSV
  const handleExportCSV = () => {
    try {
      const csvData = exportTradesCSV(trades);
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      // Create download link and trigger click
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'trades_export.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export successful",
        description: "Trades have been exported to CSV."
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
  
  // Import data from CSV text
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
      
      const importedTrades = importTradesCSV(csvImportText);
      setTrades([...trades, ...importedTrades]);
      
      toast({
        title: "Import successful",
        description: `${importedTrades.length} trades have been imported.`
      });
      
      setIsImportModalOpen(false);
      setCsvImportText("");
    } catch (err) {
      console.error('Import error:', err);
      toast({
        title: "Import failed",
        description: "There was an error importing your data. Please check the CSV format.",
        variant: "destructive"
      });
    }
  };
  
  // Get current data based on active tab
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
  
  // Format currency
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
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background h-10 px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/90"
          >
            Import CSV
          </button>
          
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background h-10 px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/90"
          >
            Export CSV
          </button>
          
          <button
            onClick={handleAddNewTrade}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Trade
          </button>
        </div>
      </div>
      
      {/* Financial Summary Cards */}
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
      </div>
      
      {/* Tabs */}
      <div className="mb-8">
        <div className="flex space-x-2 border-b">
          <button
            className={`tab-button ${activeTab === "details" ? "data-[state=active]" : ""}`}
            onClick={() => setActiveTab("details")}
          >
            Trade Details
          </button>
          <button
            className={`tab-button ${activeTab === "summary" ? "data-[state=active]" : ""}`}
            onClick={() => setActiveTab("summary")}
          >
            Trade Summary
          </button>
          <button
            className={`tab-button ${activeTab === "positions" ? "data-[state=active]" : ""}`}
            onClick={() => setActiveTab("positions")}
          >
            Open Positions
          </button>
          <button
            className={`tab-button ${activeTab === "metrics" ? "data-[state=active]" : ""}`}
            onClick={() => setActiveTab("metrics")}
          >
            Performance Metrics
          </button>
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="animate-fade-in">
        <Card glass>
          <CardHeader>
            <CardTitle>
              {activeTab === "details" && "Trade Details"}
              {activeTab === "summary" && "Trade Summary"}
              {activeTab === "positions" && "Open Positions"}
              {activeTab === "metrics" && "Performance Metrics"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable 
              data={getCurrentData()}
              onView={handleViewTrade}
              onEdit={handleEditTrade}
              onDelete={handleDeleteTrade}
            />
          </CardContent>
        </Card>
      </div>
      
      {/* Trade Details Modal */}
      <TradeModal 
        trade={selectedTrade}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTrade}
        isEditMode={isEditMode}
      />
      
      {/* CSV Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md bg-card rounded-lg shadow-lg p-6 animate-fade-in">
            <h3 className="text-lg font-medium mb-4">Import Trades from CSV</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Paste your CSV data below. The first row should contain headers matching the required fields.
            </p>
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
