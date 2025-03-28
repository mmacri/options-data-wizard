
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import useLocalStorage from "@/hooks/useLocalStorage";
import { exportTradesCSV } from "@/utils/csvUtils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trade, calculateROI } from "@/components/ui-components/DataTableTypes";
import { TradeModal } from "@/components/ui-components/TradeModal";
import { StatsCards } from "@/components/trade-manager/StatsCards";
import { ActionButtons } from "@/components/trade-manager/ActionButtons";
import { EnhancedImportModal } from "@/components/trade-manager/EnhancedImportModal";
import { TabContent } from "@/components/trade-manager/TabContent";
import { DateFilter } from "@/components/ui-components/DateFilter";
import { TraderFilter } from "@/components/ui-components/TraderFilter";
import { useTradersData } from "@/hooks/useTradersData";
import { useTradeStatistics } from "@/hooks/useTradeStatistics";
import { DateRange } from "react-day-picker";

// Mock data imports
import { mockTrades, mockSummaryData, mockOpenPositions, mockPerformanceMetrics } from "@/utils/mockData";

export default function TradeManager() {
  // State management
  const [activeTab, setActiveTab] = useState("details");
  const [trades, setTrades] = useLocalStorage<Trade[]>("trades", mockTrades);
  const [summaryData, setSummaryData] = useLocalStorage<any[]>("tradeSummary", mockSummaryData);
  const [openPositions, setOpenPositions] = useLocalStorage<any[]>("openPositions", mockOpenPositions);
  const [performanceMetrics, setPerformanceMetrics] = useLocalStorage<any[]>("performanceMetrics", mockPerformanceMetrics);
  
  // Trade modal state
  const [selectedTrade, setSelectedTrade] = useState<Trade | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAddingTrade, setIsAddingTrade] = useState(false);
  
  // Import modal state
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [traderFilter, setTraderFilter] = useState<string>("all");
  
  const { toast } = useToast();
  
  // Get trader data and statistics
  const { uniqueTraders, traderStats } = useTradersData(trades);
  
  // Filter trades based on date range and trader
  const filteredTrades = trades.filter(trade => {
    const matchesTrader = traderFilter === "all" || trade.traderName === traderFilter;
    let matchesDateRange = true;
    
    if (dateRange?.from) {
      const tradeDate = new Date(trade.entryDate);
      matchesDateRange = tradeDate >= dateRange.from;
      
      if (dateRange.to) {
        matchesDateRange = matchesDateRange && tradeDate <= dateRange.to;
      }
    }
    
    return matchesTrader && matchesDateRange;
  });
  
  // Apply the same filters to other data arrays
  const filteredSummaryData = summaryData.filter(item => {
    const matchesTrader = traderFilter === "all" || item.traderName === traderFilter;
    let matchesDateRange = true;
    
    if (dateRange?.from && item.entryDate) {
      const entryDate = new Date(item.entryDate);
      matchesDateRange = entryDate >= dateRange.from;
      
      if (dateRange.to) {
        matchesDateRange = matchesDateRange && entryDate <= dateRange.to;
      }
    }
    
    return matchesTrader && matchesDateRange;
  });
  
  const filteredOpenPositions = openPositions.filter(position => {
    const matchesTrader = traderFilter === "all" || position.traderName === traderFilter;
    let matchesDateRange = true;
    
    if (dateRange?.from && position.entryDate) {
      const entryDate = new Date(position.entryDate);
      matchesDateRange = entryDate >= dateRange.from;
      
      if (dateRange.to) {
        matchesDateRange = matchesDateRange && entryDate <= dateRange.to;
      }
    }
    
    return matchesTrader && matchesDateRange;
  });
  
  const filteredPerformanceMetrics = performanceMetrics.filter(metric => {
    const matchesTrader = traderFilter === "all" || metric.traderName === traderFilter;
    // Performance metrics typically don't have dates so we'll just filter by trader
    return matchesTrader;
  });
  
  const { totalInvested, totalProfitLoss, totalOpenTrades, totalClosedTrades } = useTradeStatistics(filteredTrades);
  
  // Handler functions
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
  
  const handleImportComplete = (newTrades: Trade[]) => {
    setTrades([...trades, ...newTrades]);
    setIsImportModalOpen(false);
  };
  
  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-light">Trade Manager</h1>
        
        <ActionButtons 
          uniqueTraders={uniqueTraders}
          onAddTrade={handleAddNewTrade}
          onImportOpen={() => setIsImportModalOpen(true)}
          onImportForTrader={(trader) => {
            // Use setTraderFilter instead of non-existent setSelectedTraderImport
            setTraderFilter(trader);
            setIsImportModalOpen(true);
          }}
          onExportAll={() => handleExportCSV()}
          onExportForTrader={(trader) => handleExportCSV(trader)}
        />
      </div>
      
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <DateFilter
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />
        <TraderFilter
          traderFilter={traderFilter}
          setTraderFilter={setTraderFilter}
          uniqueTraders={uniqueTraders}
        />
      </div>
      
      <StatsCards 
        totalInvested={totalInvested}
        totalProfitLoss={totalProfitLoss}
        totalOpenTrades={totalOpenTrades}
        totalClosedTrades={totalClosedTrades}
        uniqueTraders={uniqueTraders}
      />
      
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
        
        <TabContent 
          activeTab={activeTab}
          trades={filteredTrades}
          summaryData={filteredSummaryData}
          openPositions={filteredOpenPositions}
          performanceMetrics={filteredPerformanceMetrics}
          traderStats={traderStats}
          onViewTrade={handleViewTrade}
          onEditTrade={handleEditTrade}
          onDeleteTrade={handleDeleteTrade}
          onExportTraderData={handleExportCSV}
        />
      </Tabs>
      
      <TradeModal 
        trade={selectedTrade}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTrade}
        isEditMode={isEditMode}
      />
      
      <EnhancedImportModal 
        isOpen={isImportModalOpen}
        uniqueTraders={uniqueTraders}
        existingTrades={trades}
        onClose={() => setIsImportModalOpen(false)}
        onImportComplete={handleImportComplete}
      />
    </div>
  );
}
